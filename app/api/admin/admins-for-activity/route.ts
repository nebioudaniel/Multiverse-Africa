// app/api/admin/admins-for-activity/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();

    // Authorization: Only MAIN_ADMIN can view this list
    if (!session || !session.user || session.user.role !== 'MAIN_ADMIN') {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const admins = await prisma.admin.findMany({ // Use prisma.admin to fetch admins
      where: {
        role: {
          in: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'], // Only list actual admin roles
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true, // Use 'email' field for Admin model
        role: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    });

    return NextResponse.json(admins, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching administrators for activity:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  } finally {
    // No disconnect for development with global.prisma singleton
  }
}