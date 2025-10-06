// app/api/admin/activity/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();

    // Authorization: Only MAIN_ADMIN can view activity logs
    if (!session || !session.user || session.user.role !== 'MAIN_ADMIN') {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const adminIdFilter = searchParams.get('adminId');
    const searchTerm = searchParams.get('search'); // For searching description, action

    let whereClause: any = {};

    if (adminIdFilter && adminIdFilter !== 'all') {
      whereClause.performedById = adminIdFilter;
    }

    if (searchTerm) {
      whereClause.OR = [
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { action: { contains: searchTerm, mode: 'insensitive' } },
        // You can add more fields to search here if needed, e.g.,
        // { performedBy: { fullName: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    const activityLogs = await prisma.activityLog.findMany({
      where: whereClause,
      include: {
        performedBy: { // Include the admin who performed the action
          select: {
            id: true,
            fullName: true,
            email: true, // Use 'email' field for Admin model
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Newest activities first
      },
      take: 100, // Limit to recent 100 activities for performance
    });

    return NextResponse.json(activityLogs, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  } finally {
    // No disconnect for development with global.prisma singleton
  }
}