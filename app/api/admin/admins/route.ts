//@ts-nocheck
// app/api/admin/admins/route.ts
// This route is for creating and listing administrators.
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';// FIX 1: Import Prisma types
// Schema for creating a new admin
const createAdminSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "A valid email is required." }).min(1, { message: "Email is required." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),

  role: z.enum(
    {
      MAIN_ADMIN: "MAIN_ADMIN",
      REGISTRAR_ADMIN: "REGISTRAR_ADMIN",
    },
    {
      message: "Admin role is required.",
    }
  ),
});


// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    return "An unexpected error occurred.";
};

/**
 * GET /api/admin/admins
 * Fetches a paginated list of all administrators.
 * Only a MAIN_ADMIN can view other administrators.
 */
export async function GET(request: Request) {
  try {
   const session = await getServerSession(authOptions);


    if (!session || !session.user || session.user.role !== 'MAIN_ADMIN') {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // FIX 2 & 3: Changed 'let whereClause: any = {}' to 'const whereClause: Prisma.AdminWhereInput = {}'
    const whereClause: Prisma.AdminWhereInput = {};

    if (searchQuery) {
      whereClause.OR = [
        { fullName: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const [admins, totalAdmins] = await prisma.$transaction([
      prisma.admin.findMany({
        where: whereClause,
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          registeredBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.admin.count({ where: whereClause }),
    ]);

    return NextResponse.json(
      {
        data: admins,
        pagination: {
          total: totalAdmins,
          page,
          limit,
          totalPages: Math.ceil(totalAdmins / limit),
        },
      },
      { status: 200 }
    );

  } catch (error: unknown) { // FIX 4: Changed 'any' to 'unknown'
    const errorMessage = getErrorMessage(error);
    console.error('Error fetching administrators:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: errorMessage }), { status: 500 });
  } finally {
    // Note: Removed $disconnect based on common Next.js/Prisma singleton pattern, 
    // but kept if your setup strictly requires it. For most modern setups, it's unnecessary.
    // await prisma.$disconnect(); 
  }
}

/**
 * POST /api/admin/admins
 * Creates a new administrator.
 * Only a MAIN_ADMIN can create new administrators.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'MAIN_ADMIN') {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAdminSchema.safeParse(body);

    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error.flatten().fieldErrors);
      return new NextResponse(
        JSON.stringify({ message: "Validation error", errors: validatedData.error.flatten().fieldErrors }),
        { status: 400 }
      );
    }

    const { fullName, email, password, role } = validatedData.data;
    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        fullName,
        email,
        passwordHash,
        role,
        registeredById: session.user.id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'ADMIN_CREATED_ADMIN',
        description: `Administrator "${newAdmin.fullName}" (${newAdmin.email}) with role "${newAdmin.role}" was created by ${session.user.name || session.user.email}.`,
        entityId: newAdmin.id,
        entityType: 'Admin',
        performedById: session.user.id,
      },
    });

    return new NextResponse(JSON.stringify(newAdmin), { status: 201 });

  } catch (error: unknown) { // FIX 5: Changed 'any' to 'unknown'
    const errorMessage = getErrorMessage(error);
    console.error('Error creating administrator:', error);

    // Check for Prisma unique constraint error
   if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return new NextResponse(JSON.stringify({ message: 'An admin with this email already exists.' }), { status: 409 });
}
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: errorMessage }), { status: 500 });
  } finally {
    // Note: Removed $disconnect
    // await prisma.$disconnect();
  }
}