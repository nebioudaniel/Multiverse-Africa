//@ts-nocheck
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    return "An unexpected error occurred.";
};

// FIX: Disable no-unused-vars specifically for the '_' parameter
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: Request) { 
  try {
   const session = await getServerSession(authOptions);


    if (!session || !session.user || session.user.role !== 'MAIN_ADMIN') {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const admins = await prisma.admin.findMany({
      where: {
        role: {
          in: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'],
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    });

    return NextResponse.json(admins, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error('Error fetching administrators for activity:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: errorMessage }), { status: 500 });
  }
}