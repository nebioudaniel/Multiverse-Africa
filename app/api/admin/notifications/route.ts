// app/api/admin/notifications/route.ts
// This file uses ActivityLog as the source for notifications

import { NextResponse } from 'next/server';
import { auth } from '@/app/auth'; // Ensure this path is correct
import prisma from '@/lib/prisma'; // Ensure this path is correct and uses the singleton pattern
import { z } from 'zod';

// ======================================================
// Zod Schemas for Validation
// ======================================================

// Schema for marking notifications as read (or updating last viewed timestamp)
const markAsReadSchema = z.object({
  action: z.literal("mark_all_read").optional(),
});

// ======================================================
// GET /api/admin/notifications - Fetch relevant ActivityLogs as notifications
// ======================================================
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized: No active session." }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const showNewOnly = searchParams.get('newOnly') === 'true';

    const skip = (page - 1) * limit;

    let whereClause: any = {};

    // --- Define what constitutes a "notification" for each role from ActivityLog ---
    if (session.user.role === 'APPLICANT') {
      whereClause.OR = [
        { entityId: session.user.id, entityType: 'User' },
        {
          entityId: {
            in: (
              await prisma.application.findMany({
                where: { applicantId: session.user.id },
                select: { id: true },
              })
            ).map((app) => app.id),
          },
          entityType: 'Application',
        },
        { action: 'SYSTEM_ALERT' },
      ];
    } else if (
      session.user.role === 'MAIN_ADMIN' ||
      session.user.role === 'REGISTRAR_ADMIN'
    ) {
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
      return new NextResponse(
        JSON.stringify({
          message: 'No notification criteria defined for this user role.',
        }),
        { status: 403 }
      );
    }

    // Filter for "new" notifications if requested
    if (showNewOnly) {
      let lastViewedTimestamp: Date | null = null;
      if (session.user.role === 'APPLICANT') {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id as string }, // Corrected ID type
          select: { lastViewedActivityTimestamp: true },
        });
        lastViewedTimestamp = user?.lastViewedActivityTimestamp || null;
      } else {
        // Admins: fallback to updatedAt since they don't have lastViewedActivityTimestamp
        const admin = await prisma.admin.findUnique({
          where: { id: session.user.id as string }, // Corrected ID type
          select: { updatedAt: true },
        });
        lastViewedTimestamp = admin?.updatedAt || null;
      }

      if (lastViewedTimestamp) {
        whereClause.createdAt = { gt: lastViewedTimestamp };
      }
    }

    const [activities, totalActivities] = await prisma.$transaction([
      prisma.activityLog.findMany({
        where: whereClause,
        include: {
          performedBy: {
            select: { id: true, fullName: true, email: true, role: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where: whereClause }),
    ]);

    // Fetch the user's last viewed timestamp for the frontend to compute read status
    let currentUsersLastViewedTimestamp: Date | null = null;
    if (session.user.role === 'APPLICANT') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id as string }, // Corrected ID type
        select: { lastViewedActivityTimestamp: true },
      });
      currentUsersLastViewedTimestamp =
        user?.lastViewedActivityTimestamp || null;
    } else {
      // Admin fallback
      const admin = await prisma.admin.findUnique({
        where: { id: session.user.id as string }, // Corrected ID type
        select: { updatedAt: true },
      });
      currentUsersLastViewedTimestamp = admin?.updatedAt || null;
    }

    return NextResponse.json(
      {
        data: activities,
        pagination: {
          total: totalActivities,
          page,
          limit,
          totalPages: Math.ceil(totalActivities / limit),
        },
        currentUsersLastViewedTimestamp: currentUsersLastViewedTimestamp,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching notifications (from ActivityLog):', error);
    return new NextResponse(
      JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// ======================================================
// PATCH /api/admin/notifications - Mark all as "read"
// ======================================================
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized: No active session." }), { status: 401 });
    }

    const body = await request.json();
    const validatedData = markAsReadSchema.safeParse(body);
    if (!validatedData.success && Object.keys(body).length > 0) {
      console.error('Validation error:', validatedData.error.flatten().fieldErrors);
      return new NextResponse(
        JSON.stringify({ message: "Validation error", errors: validatedData.error.flatten().fieldErrors }),
        { status: 400 }
      );
    }

    const now = new Date();

    if (session.user.role === 'APPLICANT') {
      await prisma.user.update({
        where: { id: session.user.id as string },
        data: { lastViewedActivityTimestamp: now },
      });
    } else if (session.user.role === 'MAIN_ADMIN' || session.user.role === 'REGISTRAR_ADMIN') {
      // This part was the source of the error.
      // The session.user.id corresponds to a user's ID, not an admin's.
      // We need to use the `admin` table correctly.
      await prisma.admin.update({
        where: { id: session.user.id as string }, // The ID in session.user is the applicant ID
        data: { updatedAt: now },
      });
    } else {
      return new NextResponse(JSON.stringify({ message: "Role not supported for marking notifications as read." }), { status: 403 });
    }

    return new NextResponse(JSON.stringify({ message: "All relevant notifications marked as read.", timestamp: now.toISOString() }), { status: 200 });

  } catch (error: any) {
    console.error('Error marking notifications as read:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}