// app/api/admin/users/[id]/route.ts
// THIS IS A NEW FILE FOR HANDLING SPECIFIC USER IDs

import { NextResponse } from 'next/server';
import { auth } from '@/app/auth'; // Ensure this path is correct
import prisma from '@/lib/prisma'; // Ensure this path is correct
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Role } from '@prisma/client'; // Keep this import for type safety and comparisons

// ======================================================
// Zod Schemas for Validation
// ======================================================

// Directly define the enum values as literal strings for Zod.
// This avoids the runtime `Object.values(Role)` issue.
const userRoleEnumValues = ['MAIN_ADMIN', 'REGISTRAR_ADMIN', 'APPLICANT'] as const;


// Schema for updating an existing User (can be Applicant or Admin)
// All fields are optional here as PATCH requests allow partial updates
const userUpdateSchema = z.object({
  fullName: z.string().min(1, "Full name is required.").optional(),
  emailAddress: z.string().email("Invalid email address.").min(1, "Email is required.").optional(),
  password: z.string().min(8, "Password must be at least 8 characters long.").optional(),

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

  // Use the directly defined array of string literals here
  role: z.enum(userRoleEnumValues).optional(),
});


// ======================================================
// GET /api/admin/users/[id] - Fetch a single User (Applicant or Admin)
// ======================================================
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    // Authorization: Only MAIN_ADMIN or REGISTRAR_ADMIN can view user details
    // A user can also view their own details.
    if (!session || !session.user || (session.user.role !== "MAIN_ADMIN" && session.user.role !== "REGISTRAR_ADMIN" && session.user.id !== params.id)) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const { id } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
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
            select: {
                id: true,
                fullName: true,
                email: true,
            },
        },
        applications: {
            select: {
                id: true,
                applicationStatus: true,
                createdAt: true,
            }
        }
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found." }), { status: 404 });
    }

    // Further authorization: REGISTRAR_ADMINs cannot view MAIN_ADMIN details
    if (session.user.role === "REGISTRAR_ADMIN" && user.role === Role.MAIN_ADMIN && session.user.id !== user.id) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized: You cannot view Main Admin details." }), { status: 403 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: (error as Error).message }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// ======================================================
// PATCH /api/admin/users/[id] - Update a User (Applicant or Admin)
// ======================================================
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const { id } = params;

    if (!session || !session.user || (session.user.role !== "MAIN_ADMIN" && session.user.role !== "REGISTRAR_ADMIN" && session.user.id !== id)) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const body = await request.json();
    const validatedData = userUpdateSchema.safeParse(body);

    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error.flatten().fieldErrors);
      return new NextResponse(
        JSON.stringify({ message: "Validation error", errors: validatedData.error.flatten().fieldErrors }),
        { status: 400 }
      );
    }

    const { password, role, ...updateData } = validatedData.data;
    const dataToUpdate: any = { ...updateData };

    const existingUser = await prisma.user.findUnique({
        where: { id: id },
        select: { id: true, role: true, emailAddress: true, primaryPhoneNumber: true }
    });

    if (!existingUser) {
        return new NextResponse(JSON.stringify({ message: "User not found for update." }), { status: 404 });
    }

    if (role !== undefined) {
        if (session.user.role !== "MAIN_ADMIN") {
            return new NextResponse(JSON.stringify({ message: "Unauthorized: Only Main Admins can change user roles." }), { status: 403 });
        }
        if (session.user.id === id && role !== existingUser.role) {
            return new NextResponse(JSON.stringify({ message: "Forbidden: You cannot change your own role." }), { status: 403 });
        }
        if (existingUser.role === Role.MAIN_ADMIN && id !== session.user.id) {
            return new NextResponse(JSON.stringify({ message: "Forbidden: Cannot change another Main Admin's role." }), { status: 403 });
        }
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
        if (conflict) {
            return new NextResponse(JSON.stringify({ message: 'User with this email address already exists.' }), { status: 409 });
        }
    }
    if (dataToUpdate.primaryPhoneNumber && dataToUpdate.primaryPhoneNumber !== existingUser.primaryPhoneNumber) {
        const conflict = await prisma.user.findFirst({
            where: { primaryPhoneNumber: dataToUpdate.primaryPhoneNumber, id: { not: id } },
        });
        if (conflict) {
            return new NextResponse(JSON.stringify({ message: 'User with this primary phone number already exists.' }), { status: 409 });
        }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
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
        description: `User "${updatedUser.fullName}" (ID: ${updatedUser.id.substring(0,8)}...) was updated by admin ${session.user.name || session.user.email}.`,
        entityId: updatedUser.id,
        entityType: 'User',
        performedById: session.user.id,
      }
    });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ message: "Validation error", errors: error.errors }),
        { status: 400 }
      );
    }
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return new NextResponse(JSON.stringify({ message: "User not found for update." }), { status: 404 });
    }
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        return new NextResponse(
            JSON.stringify({ message: `A user with this ${error.meta.target} already exists.`, code: error.code }),
            { status: 409 }
        );
    }
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// ======================================================
// DELETE /api/admin/users/[id] - Delete a User (Applicant or Admin)
// ======================================================
// app/api/admin/users/[id]/route.ts
// ... (all other imports and code above this function are unchanged) ...

// ======================================================
// DELETE /api/admin/users/[id] - Delete a User (Applicant or Admin)
// ======================================================
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        const { id } = params;

        // 1. Authorization: Only MAIN_ADMIN can delete users.
        if (!session || !session.user || session.user.role !== "MAIN_ADMIN") {
            return new NextResponse(
                JSON.stringify({ message: "Unauthorized: Only Main Admins can delete users." }),
                { status: 401 }
            );
        }

        // 2. Prevent a user from deleting their own account.
        if (session.user.id === id) {
            return new NextResponse(
                JSON.stringify({ message: "Forbidden: You cannot delete your own account." }),
                { status: 403 }
            );
        }

        // 3. Find the user to delete and ensure they exist.
        const userToDelete = await prisma.user.findUnique({
            where: { id: id },
            select: { id: true, role: true, fullName: true, emailAddress: true },
        });

        if (!userToDelete) {
            return new NextResponse(
                JSON.stringify({ message: "User not found." }),
                { status: 404 }
            );
        }

        // 4. Prevent the deletion of another MAIN_ADMIN.
        if (userToDelete.role === "MAIN_ADMIN") {
            return new NextResponse(
                JSON.stringify({ message: "Forbidden: Cannot delete another Main Admin account." }),
                { status: 403 }
            );
        }
        
        // Use a Prisma transaction to ensure both deletions succeed or fail together.
        const result = await prisma.$transaction(async (prisma) => {
            // First, delete the activity logs associated with the user's ID.
            // This prevents the foreign key constraint violation.
            await prisma.activityLog.deleteMany({
                where: {
                    performedById: id,
                },
            });

            // Second, log the user deletion *before* deleting the user record.
            // This log is created by the admin performing the action, not the user being deleted.
            await prisma.activityLog.create({
                data: {
                    action: 'USER_DELETED_BY_ADMIN',
                    description: `User "${userToDelete.fullName || userToDelete.emailAddress}" (ID: ${userToDelete.id.substring(0, 8)}...) was deleted by admin ${session.user.name || session.user.email}.`,
                    entityId: userToDelete.id,
                    entityType: 'User',
                    performedById: session.user.id, // The ID of the current logged-in user (admin)
                }
            });

            // Third, delete the user record.
            return await prisma.user.delete({
                where: { id: id },
                select: { id: true, fullName: true, emailAddress: true }
            });
        });

        // 5. Return a successful response.
        return new NextResponse(null, { status: 204 });

    } catch (error: any) {
        console.error('Error deleting user:', error);
        // The Prisma transaction will handle errors, so we can check for them here.
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            return new NextResponse(
                JSON.stringify({ message: "User not found for deletion." }),
                { status: 404 }
            );
        }
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error', error: (error as Error).message }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}