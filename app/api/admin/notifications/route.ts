//@ts-nocheck
// app/api/admin/notifications/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ← Correct: use exported `auth()`
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';  // FIX 1: Import Prisma types

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    return "An unexpected error occurred.";
};

// ======================================================
// Zod Schemas for Validation
// ======================================================

const markAsReadSchema = z.object({
  action: z.literal("mark_all_read").optional(),
});

// ======================================================
// GET /api/admin/notifications - Fetch ActivityLogs as notifications
// ======================================================
export async function GET(request: Request) {
  try {
    // Use `auth()` from your config — this is the v5 App Router way
    const session = await getServerSession(authOptions);


    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized: No active session." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const showNewOnly = searchParams.get('newOnly') === 'true';

    const skip = (page - 1) * limit;

    const whereClause: Prisma.ActivityLogWhereInput = {};

    // Define notification criteria by role
    if (session.user.role === 'APPLICANT') {
      const applicationIds = (
        await prisma.application.findMany({
          where: { applicantId: session.user.id },
          select: { id: true },
        })
      ).map(app => app.id);

      whereClause.OR = [
        // APPLICANTS only see logs related to their user or their applications
        { entityId: session.user.id, entityType: 'User' },
        { entityId: { in: applicationIds }, entityType: 'Application' },
        { action: 'SYSTEM_ALERT' },
      ];
    } else if (['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role)) {
      // ADMINS see logs relevant to system activity
      whereClause.OR = [
        { action: 'NEW_USER_REGISTRATION', entityType: 'User' },
        { action: 'SYSTEM_ALERT' },
        {
          action: {
            in: [
              'ADMIN_CREATED_ADMIN',
              'ADMIN_DELETED_ADMIN',
              'USER_DELETED_BY_ADMIN',
              'APPLICATION_STATUS_UPDATED',
            ],
          },
          performedById: { not: session.user.id },
        },
        { entityType: 'Application' },
        { entityType: 'User', action: { in: ['USER_UPDATED_BY_ADMIN'] } },
      ];
    } else {
      return NextResponse.json(
        { message: 'No notification criteria defined for this user role.' },
        { status: 403 }
      );
    }

    // Get last viewed timestamp for filtering "new" notifications
    let lastViewedTimestamp: Date | null = null;
    const userId = session.user.id as string;

    // FIX 1: APPLICANT (User model) does NOT have lastViewedActivityTimestamp.
    // We treat all their matching logs as "new" unless this logic is changed.
    if (session.user.role === 'APPLICANT') {
        // lastViewedTimestamp remains null, effectively showing all notifications
        // unless you add this field to the User model in schema.prisma.
        lastViewedTimestamp = null;
    } else {
      // ADMIN model HAS lastViewedActivityTimestamp
      const admin = await prisma.admin.findUnique({
        where: { id: userId },
        select: { lastViewedActivityTimestamp: true, updatedAt: true },
      });
      // Admin's lastViewedActivityTimestamp might be null, use updatedAt as a fallback start point
      lastViewedTimestamp = admin?.lastViewedActivityTimestamp || admin?.updatedAt || null; 
    }

    // Filter "new" notifications
    // This only takes effect if the user is an Admin AND lastViewedTimestamp is set
    if (showNewOnly && lastViewedTimestamp) {
      whereClause.createdAt = { gt: lastViewedTimestamp };
    }

    // Fetch notifications + count
    const [activities, totalActivities] = await prisma.$transaction([
      prisma.activityLog.findMany({
        where: whereClause,
        include: {
          performedBy: {
            select: { id: true, fullName: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where: whereClause as Prisma.ActivityLogWhereInput }),
    ]);

    return NextResponse.json(
      {
        data: activities,
        pagination: {
          total: totalActivities,
          page,
          limit,
          totalPages: Math.ceil(totalActivities / limit),
        },
        currentUsersLastViewedTimestamp: lastViewedTimestamp,
      },
      { status: 200 }
    );
  } catch (error: unknown) { // FIX 4: Changed 'any' to 'unknown'
    const errorMessage = getErrorMessage(error);
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: errorMessage },
      { status: 500 }
    );
  }
}

// ======================================================
// PATCH /api/admin/notifications - Mark all as read
// ======================================================
export async function PATCH(request: Request) {
  try {
     const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized: No active session." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = markAsReadSchema.safeParse(body);

    if (!validated.success && Object.keys(body).length > 0) {
      return NextResponse.json(
        { message: "Validation error", errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const now = new Date();
    const userId = session.user.id as string;

    // FIX 2: APPLICANT (User model) cannot be updated with this field.
    // If you don't track read status for applicants, skip the update.
    if (session.user.role === 'APPLICANT') {
       // Do nothing or return a specific message if no update is performed
       // If you want to track read status, you must add 'lastViewedActivityTimestamp' to your User model.
    } else if (['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role)) {
      // ADMIN model HAS lastViewedActivityTimestamp
      await prisma.admin.update({
        where: { id: userId },
        data: { 
          lastViewedActivityTimestamp: now,
          updatedAt: now // Update updatedAt to ensure freshness if needed
        },
      });
    } else {
      return NextResponse.json(
        { message: "Role not supported for marking notifications as read." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Notifications marked as read (if supported for role).", timestamp: now.toISOString() },
      { status: 200 }
    );
  } catch (error: unknown) { // FIX 5: Changed 'any' to 'unknown'
    const errorMessage = getErrorMessage(error);
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: errorMessage },
      { status: 500 }
    );
  }
}