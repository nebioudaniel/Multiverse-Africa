//@ts-nocheck
// app/api/admin/users/[id]/route.ts
// Fully compatible with Next.js 15.4.1+ (App Router)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { AdminRole } from '@prisma/client';
// Helper
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred.';
};
// After `prisma generate`, these become:

// Zod schema
const userRoleEnumValues = ['MAIN_ADMIN', 'REGISTRAR_ADMIN', 'APPLICANT'] as const;

const userUpdateSchema = z.object({
  fullName: z.string().min(1).optional(),
  emailAddress: z.string().email().min(1).optional(),
  password: z.string().min(8).optional(),
  fatherName: z.string().nullable().optional(),
  grandfatherName: z.string().nullable().optional(),
  isBusiness: z.boolean().optional(),
  entityName: z.string().nullable().optional(),
  tin: z.string().nullable().optional(),
  businessLicenseNo: z.string().nullable().optional(),
  primaryPhoneNumber: z.string().nullable().optional(),
  alternativePhoneNumber: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  idNumber: z.string().nullable().optional(),
  residentialAddress: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  woredaKebele: z.string().nullable().optional(),
  houseNumber: z.string().nullable().optional(),
  associationName: z.string().nullable().optional(),
  membershipNumber: z.string().nullable().optional(),
  preferredVehicleType: z.string().nullable().optional(),
  vehicleQuantity: z.coerce.number().int().min(0).nullable().optional(),
  intendedUse: z.string().nullable().optional(),
  role: z.enum(userRoleEnumValues).optional(),
});

// GET → Fetch user by ID
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);


    if (
      !session?.user ||
      (session.user.role !== 'MAIN_ADMIN' &&
        session.user.role !== 'REGISTRAR_ADMIN' &&
        session.user.id !== id)
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        emailAddress: true,
        primaryPhoneNumber: true,
        gender: true,
        region: true,
        city: true,
        idNumber: true,
        residentialAddress: true,
        woredaKebele: true,
        houseNumber: true,
        isBusiness: true,
        entityName: true,
        tin: true,
        businessLicenseNo: true,
        associationName: true,
        membershipNumber: true,
        preferredVehicleType: true,
        vehicleQuantity: true,
        intendedUse: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        registeredBy: {
          select: { id: true, fullName: true, email: true },
        },
        applications: {
          select: { id: true, applicationStatus: true, createdAt: true },
        },
      },
    });

   if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // FIX 1: Use string literal with type assertion to override type safety warning
    // This allows comparison between the user's role (UserRole/string) and the admin role string.
    if (session.user.role === 'REGISTRAR_ADMIN' && (user.role as string) === 'MAIN_ADMIN' && session.user.id !== user.id) {
      return NextResponse.json({ message: 'Unauthorized: You cannot view Main Admin details.' }, { status: 403 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: getErrorMessage(error) }, { status: 500 });
  }
};

// PATCH → Update user
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const session = await auth();

    if (
      !session?.user ||
      (session.user.role !== 'MAIN_ADMIN' &&
        session.user.role !== 'REGISTRAR_ADMIN' &&
        session.user.id !== id)
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = userUpdateSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { message: 'Validation error', errors: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { password, role, ...updateData } = validatedData.data;
    const dataToUpdate: any = { ...updateData };

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, emailAddress: true, primaryPhoneNumber: true },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found for update.' }, { status: 404 });
    }

    if (role !== undefined) {
      if (session.user.role !== 'MAIN_ADMIN') {
        return NextResponse.json({ message: 'Unauthorized: Only Main Admins can change roles.' }, { status: 403 });
      }
      if (session.user.id === id && role !== existingUser.role) {
        return NextResponse.json({ message: 'Forbidden: You cannot change your own role.' }, { status: 403 });
      }
     if ((existingUser.role as string) === 'MAIN_ADMIN' && id !== session.user.id) {
    return NextResponse.json({ message: 'Forbidden: Cannot change another Main Admin role.' }, { status: 403 });
};
      dataToUpdate.role = role;
    }

    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    if (dataToUpdate.isBusiness === false) {
      dataToUpdate.entityName = null;
      dataToUpdate.tin = null;
      dataToUpdate.businessLicenseNo = null;
    }

    if (dataToUpdate.emailAddress && dataToUpdate.emailAddress !== existingUser.emailAddress) {
      const conflict = await prisma.user.findFirst({
        where: { emailAddress: dataToUpdate.emailAddress, id: { not: id } },
      });
      if (conflict) return NextResponse.json({ message: 'Email already in use.' }, { status: 409 });
    }

    if (dataToUpdate.primaryPhoneNumber && dataToUpdate.primaryPhoneNumber !== existingUser.primaryPhoneNumber) {
      const conflict = await prisma.user.findFirst({
        where: { primaryPhoneNumber: dataToUpdate.primaryPhoneNumber, id: { not: id } },
      });
      if (conflict) return NextResponse.json({ message: 'Phone number already in use.' }, { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        fullName: true,
        emailAddress: true,
        primaryPhoneNumber: true,
        role: true,
        updatedAt: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'USER_UPDATED_BY_ADMIN',
        description: `User "${updatedUser.fullName}" was updated by ${session.user.name || session.user.email}.`,
        entityId: updatedUser.id,
        entityType: 'User',
        performedById: session.user.id,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return NextResponse.json({ message: 'User not found.' }, { status: 404 });
      if (error.code === 'P2002') return NextResponse.json({ message: 'Duplicate field value.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: getErrorMessage(error) }, { status: 500 });
  }
};

// DELETE → Delete user
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user || session.user.role !== 'MAIN_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized: Only Main Admins can delete users.' }, { status: 401 });
    }

    if (session.user.id === id) {
      return NextResponse.json({ message: 'Forbidden: You cannot delete your own account.' }, { status: 403 });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, fullName: true, emailAddress: true },
    });

    if (!userToDelete) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    if ((userToDelete.role as string) === 'MAIN_ADMIN') { // Use type assertion
      return NextResponse.json({ message: 'Forbidden: Cannot delete another Main Admin.' }, { status: 403 });
}

    await prisma.$transaction(async (tx) => {
      await tx.activityLog.deleteMany({ where: { performedById: id } });
      await tx.activityLog.create({
        data: {
          action: 'USER_DELETED_BY_ADMIN',
          description: `User "${userToDelete.fullName || userToDelete.emailAddress}" was deleted by ${session.user.name || session.user.email}.`,
          entityId: userToDelete.id,
          entityType: 'User',
          performedById: session.user.id,
        },
      });
      await tx.user.delete({ where: { id } });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: getErrorMessage(error) }, { status: 500 });
  }
};