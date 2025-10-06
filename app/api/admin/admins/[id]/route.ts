// app/api/admin/admins/[id]/route.ts
// This route is for fetching, updating, and deleting a single administrator.

import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcryptjs';

const updateAdminSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }).optional(),
  email: z.string().email({ message: "A valid email is required." }).min(1, { message: "Email is required." }).optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).optional(),
  role: z.enum(["MAIN_ADMIN", "REGISTRAR_ADMIN"], { required_error: "Admin role is required." }).optional(),
});

const adminIdSchema = z.string().uuid({ message: "Invalid admin ID format." });

/**
 * GET /api/admin/admins/[id]
 * Fetches a single administrator by ID.
 * Only a MAIN_ADMIN can view administrator details.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'MAIN_ADMIN') {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const validatedId = adminIdSchema.safeParse(params.id);
    if (!validatedId.success) {
      return new NextResponse(JSON.stringify({ message: validatedId.error.errors[0].message }), { status: 400 });
    }
    const adminId = validatedId.data;

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
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
    });

    if (!admin) {
      return new NextResponse(JSON.stringify({ message: 'Administrator not found.' }), { status: 404 });
    }

    return NextResponse.json(admin, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching administrator:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}

/**
 * PATCH /api/admin/admins/[id]
 * Updates a single administrator.
 * Only a MAIN_ADMIN can perform this action, and cannot change their own role.
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'MAIN_ADMIN') {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const validatedId = adminIdSchema.safeParse(params.id);
    if (!validatedId.success) {
      return new NextResponse(JSON.stringify({ message: validatedId.error.errors[0].message }), { status: 400 });
    }
    const adminId = validatedId.data;

    const body = await request.json();
    const validatedData = updateAdminSchema.safeParse(body);

    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error.flatten().fieldErrors);
      return new NextResponse(
        JSON.stringify({ message: "Validation error", errors: validatedData.error.flatten().fieldErrors }),
        { status: 400 }
      );
    }

    const { fullName, email, password, role } = validatedData.data;

    const existingAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      return new NextResponse(JSON.stringify({ message: 'Administrator not found.' }), { status: 404 });
    }

    if (session.user.id === adminId && role && role !== existingAdmin.role) {
        return new NextResponse(JSON.stringify({ message: 'MAIN_ADMIN cannot change their own role.' }), { status: 403 });
    }

    const dataToUpdate: any = {};
    if (fullName !== undefined) dataToUpdate.fullName = fullName;
    if (email !== undefined) dataToUpdate.email = email;
    if (role !== undefined) dataToUpdate.role = role;
    if (password) {
        dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }
    
    if (dataToUpdate.email && dataToUpdate.email !== existingAdmin.email) {
      const emailExists = await prisma.admin.findUnique({
        where: { email: dataToUpdate.email },
      });
      if (emailExists && emailExists.id !== adminId) {
        return new NextResponse(JSON.stringify({ message: 'Admin with this email already exists.' }), { status: 409 });
      }
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: dataToUpdate,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        updatedAt: true,
      },
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

    return new NextResponse(JSON.stringify(updatedAdmin), { status: 200 });

  } catch (error: any) {
    console.error('Error updating administrator:', error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return new NextResponse(JSON.stringify({ message: "Administrator not found." }), { status: 404 });
    }
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        return new NextResponse(JSON.stringify({ message: 'An admin with this email already exists.' }), { status: 409 });
    }
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}

/**
 * DELETE /api/admin/admins/[id]
 * Deletes a single administrator.
 * Only a MAIN_ADMIN can perform this action, and cannot delete their own account or the last MAIN_ADMIN.
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'MAIN_ADMIN') {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const validatedId = adminIdSchema.safeParse(params.id);
    if (!validatedId.success) {
      return new NextResponse(JSON.stringify({ message: validatedId.error.errors[0].message }), { status: 400 });
    }
    const adminId = validatedId.data;

    if (session.user.id === adminId) {
      return new NextResponse(JSON.stringify({ message: 'MAIN_ADMIN cannot delete their own account.' }), { status: 403 });
    }

    const adminToDelete = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { role: true, fullName: true, email: true },
    });

    if (!adminToDelete) {
      return new NextResponse(JSON.stringify({ message: 'Administrator not found.' }), { status: 404 });
    }

    if (adminToDelete.role === 'MAIN_ADMIN') {
        const mainAdminsCount = await prisma.admin.count({
            where: { role: 'MAIN_ADMIN' }
        });
        if (mainAdminsCount <= 1) {
            return new NextResponse(JSON.stringify({ message: 'Cannot delete the last MAIN_ADMIN account.' }), { status: 403 });
        }
    }

    await prisma.admin.delete({
      where: { id: adminId },
    });

    await prisma.activityLog.create({
      data: {
        action: 'ADMIN_DELETED_ADMIN',
        description: `Administrator "${adminToDelete.fullName}" (${adminToDelete.email}) with role "${adminToDelete.role}" was deleted by ${session.user.name || session.user.email}.`,
        entityId: adminId,
        entityType: 'Admin',
        performedById: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error('Error deleting administrator:', error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return new NextResponse(JSON.stringify({ message: "Administrator not found for deletion." }), { status: 404 });
    }
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}