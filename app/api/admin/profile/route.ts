//@ts-nocheck
// app/api/admin/profile/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    return "An unexpected error occurred.";
};


// --- ZOD Schema for Profile Updates (PUT) ---
const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  // emailAddress is optional for update, but must be nullable in the data if passed as null
  emailAddress: z.string().email("Invalid email format.").optional().nullable(), 
});

// ----------------------------------------------------------------------
// --- GET Handler: Fetch Profile ---
// ----------------------------------------------------------------------
export async function GET() {
  try {
    const session = await getServerSession(authOptions);


    if (!session?.user?.id || !session.user.role) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized: Missing session data" }), { status: 401 });
    }

    let profile = null;
    const userId = session.user.id;
    const userRole = session.user.role;

    // 1. Check all explicit admin roles (MAIN_ADMIN, REGISTRAR_ADMIN) in the 'Admin' table.
    if (['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(userRole)) {
      profile = await prisma.admin.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (profile) {
        return NextResponse.json({
          id: profile.id,
          fullName: profile.fullName,
          emailAddress: profile.email,
          primaryPhoneNumber: null,
          role: profile.role,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        });
      }
    } 
    
    // 2. Fallback check for the 'User' table
    if (userRole === "APPLICANT") { 
      profile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          emailAddress: true,
          primaryPhoneNumber: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (profile) {
        return NextResponse.json({
          id: profile.id,
          fullName: profile.fullName,
          emailAddress: profile.emailAddress,
          primaryPhoneNumber: profile.primaryPhoneNumber,
          role: profile.role,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        });
      }
    }
    
    console.error(`❌ Profile not found for user ${userId} with role ${userRole}.`);
    return new NextResponse(JSON.stringify({ message: "Profile not found for this user/role." }), { status: 404 });

  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err);
    console.error("❌ GET Profile Error (Unhandled Exception):", err);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error", error: errorMessage }), { status: 500 });
  }
}

// ----------------------------------------------------------------------
// --- PUT Handler: Update User Profile by Role ---
// ----------------------------------------------------------------------
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.role) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized: Missing session data" }), { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;
    const body = await request.json();
    const validated = updateProfileSchema.safeParse(body);

    if (!validated.success) {
      return new NextResponse(JSON.stringify({
        message: "Validation error",
        errors: validated.error.flatten().fieldErrors
      }), { status: 400 });
    }

    // Ensure email is set to null if it's an empty string or undefined/null from the form
    // The type of emailToUse is string | null, which is accepted by String? fields in Prisma.
    const emailToUse = validated.data.emailAddress?.trim() || null;
    
    const { fullName } = validated.data;
    let updatedProfile;

    // --- Only allow MAIN_ADMIN and APPLICANT to update profiles ---
    
    // 1. MAIN_ADMIN Update (in Admin table)
    if (userRole === 'MAIN_ADMIN') {
      updatedProfile = await prisma.admin.update({
        where: { id: userId },
        data: { 
            fullName: fullName, 
            email: emailToUse, // This now works because the email field is String?
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        id: updatedProfile.id,
        fullName: updatedProfile.fullName,
        emailAddress: updatedProfile.email,
        primaryPhoneNumber: null,
        role: updatedProfile.role,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt,
      });

    // 2. APPLICANT Update (in User table)
    } else if (userRole === "APPLICANT") { 
      updatedProfile = await prisma.user.update({
        where: { id: userId },
        data: { 
            fullName: fullName, 
            emailAddress: emailToUse, // This works because emailAddress is likely already String?
        },
        select: {
          id: true,
          fullName: true,
          emailAddress: true,
          primaryPhoneNumber: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        id: updatedProfile.id,
        fullName: updatedProfile.fullName,
        emailAddress: updatedProfile.emailAddress,
        primaryPhoneNumber: updatedProfile.primaryPhoneNumber,
        role: updatedProfile.role,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt,
      });

    } else if (userRole === 'REGISTRAR_ADMIN') {
        // 3. Block REGISTRAR_ADMIN updates
        return new NextResponse(JSON.stringify({ message: "Forbidden: Registrar Admins cannot update their profile." }), { status: 403 });
    } else {
        return new NextResponse(JSON.stringify({ message: "Forbidden: Role not authorized for profile update." }), { status: 403 });
    }
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err);
    console.error("❌ PUT Profile Error:", err);
    
    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
            return new NextResponse(JSON.stringify({ message: "Profile record not found." }), { status: 404 });
        }
        if (err.code === 'P2002') {
             return new NextResponse(JSON.stringify({ message: "The email address is already in use by another account." }), { status: 409 });
        }
    }
    
    return new NextResponse(JSON.stringify({ message: "Internal Server Error", error: errorMessage }), { status: 500 });
  }
}