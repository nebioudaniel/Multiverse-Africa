//@ts-nocheck
// app/api/admin/admins/[id]/route.ts
// Fully compatible with Next.js 15.4.1+ (App Router)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcryptjs';

// ---------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------
const updateAdminSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }).optional(),
  email: z.string().email({ message: 'A valid email is required.' }).min(1).optional(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }).optional(),
  role: z.enum(['MAIN_ADMIN', 'REGISTRAR_ADMIN']).optional(),
});

const adminIdSchema = z.string().uuid({ message: 'Invalid admin ID format.' });

// ---------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (err instanceof PrismaClientKnownRequestError) return `Database error: ${err.code}`;
  return 'An unexpected error occurred.';
};

// ---------------------------------------------------------------------
// GET → Fetch one admin
// ---------------------------------------------------------------------
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Promise + await below
) => {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);


    if (!session?.user || session.user.role !== 'MAIN_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const parsed = adminIdSchema.safeParse(id);
    if (!parsed.success) {
      // ✅ FIXED Line 50: Access parsed.error.issues (the correct Zod property name)
return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: parsed.data },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        registeredBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    if (!admin) {
      return NextResponse.json({ message: 'Administrator not found.' }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error('GET /api/admin/admins/[id] →', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: getErrorMessage(error) },
      { status: 500 }
    );
  }
};

// ---------------------------------------------------------------------
// PATCH → Update admin
// ---------------------------------------------------------------------
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
   const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'MAIN_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const parsedId = adminIdSchema.safeParse(id);
    if (!parsedId.success) {
      return NextResponse.json({ message: parsedId.error.issues[0].message }, { status: 400 });
    }
    const adminId = parsedId.data;

    const body = await req.json();
    const parsedBody = updateAdminSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: 'Validation error', errors: parsedBody.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, email, password, role } = parsedBody.data;

    const existingAdmin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!existingAdmin) {
      return NextResponse.json({ message: 'Administrator not found.' }, { status: 404 });
    }

    if (session.user.id === adminId && role && role !== existingAdmin.role) {
      return NextResponse.json({ message: 'MAIN_ADMIN cannot change their own role.' }, { status: 403 });
    }

    const dataToUpdate: any = {};
    if (fullName !== undefined) dataToUpdate.fullName = fullName;
    if (email !== undefined) dataToUpdate.email = email;
    if (role !== undefined) dataToUpdate.role = role;
    if (password) dataToUpdate.passwordHash = await bcrypt.hash(password, 10);

    if (dataToUpdate.email && dataToUpdate.email !== existingAdmin.email) {
      const emailExists = await prisma.admin.findUnique({ where: { email: dataToUpdate.email } });
      if (emailExists && emailExists.id !== adminId) {
        return NextResponse.json({ message: 'Admin with this email already exists.' }, { status: 409 });
      }
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: dataToUpdate,
      select: { id: true, fullName: true, email: true, role: true, updatedAt: true },
    });

    await prisma.activityLog.create({
      data: {
        action: 'ADMIN_UPDATED_ADMIN',
        description: `Administrator "${updatedAdmin.fullName}" (${updatedAdmin.email}) was updated by ${session.user.name || session.user.email}.`,
        entityId: updatedAdmin.id,
        entityType: 'Admin',
        performedById: session.user.id,
      },
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('PATCH /api/admin/admins/[id] →', error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return NextResponse.json({ message: 'Administrator not found.' }, { status: 404 });
      if (error.code === 'P2002') return NextResponse.json({ message: 'Email already in use.' }, { status: 409 });
    }
    return NextResponse.json(
      { message: 'Internal Server Error', error: getErrorMessage(error) },
      { status: 500 }
    );
  }
};

// ---------------------------------------------------------------------
// DELETE → Remove admin
// ---------------------------------------------------------------------
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
   const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'MAIN_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const parsed = adminIdSchema.safeParse(id);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    }
    const adminId = parsed.data;

    if (session.user.id === adminId) {
      return NextResponse.json({ message: 'MAIN_ADMIN cannot delete their own account.' }, { status: 403 });
    }

    const adminToDelete = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { role: true, fullName: true, email: true },
    });

    if (!adminToDelete) {
      return NextResponse.json({ message: 'Administrator not found.' }, { status: 404 });
    }

    if (adminToDelete.role === 'MAIN_ADMIN') {
      const mainAdminCount = await prisma.admin.count({ where: { role: 'MAIN_ADMIN' } });
      if (mainAdminCount <= 1) {
        return NextResponse.json({ message: 'Cannot delete the last MAIN_ADMIN account.' }, { status: 403 });
      }
    }

    await prisma.admin.delete({ where: { id: adminId } });

    await prisma.activityLog.create({
      data: {
        action: 'ADMIN_DELETED_ADMIN',
        description: `Administrator "${adminToDelete.fullName}" (${adminToDelete.email}) was deleted by ${session.user.name || session.user.email}.`,
        entityId: adminId,
        entityType: 'Admin',
        performedById: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/admin/admins/[id] →', error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: 'Administrator not found.' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Internal Server Error', error: getErrorMessage(error) },
      { status: 500 }
    );
  }
};