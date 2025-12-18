//@ts-nocheck
// app/api/admin/users/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from 'zod';
import bcrypt from 'bcryptjs';
// FIX: Imported Prisma namespace to access QueryMode
import { Prisma } from '@prisma/client';

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    return "An unexpected error occurred.";
};

// Schema to validate input for both Users and Admins
const createUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  fatherName: z.string().nullable().optional(),
  grandfatherName: z.string().nullable().optional(),
  isBusiness: z.boolean().default(false).optional(),
  entityName: z.string().nullable().optional(),
  tin: z.string().nullable().optional(),
  businessLicenseNo: z.string().nullable().optional(),
  email: z.string().email("Invalid email address.").nullable().optional(),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  primaryPhoneNumber: z.string().min(10).nullable().optional(),
  alternativePhoneNumber: z.string().nullable().optional(),
  gender: z.enum(["Male", "Female", "Other"]).nullable().optional(),
  idNumber: z.string().nullable().optional(),
  residentialAddress: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  woredaKebele: z.string().nullable().optional(),
  houseNumber: z.string().nullable().optional(),
  associationName: z.string().nullable().optional(),
  membershipNumber: z.string().nullable().optional(),
  preferredVehicleType: z.string().nullable().optional(),
  vehicleQuantity: z.number().int().min(0).nullable().optional(),
  intendedUse: z.string().nullable().optional(),
  digitalSignatureUrl: z.string().nullable().optional(),
  role: z.enum(["APPLICANT", "MAIN_ADMIN", "REGISTRAR_ADMIN"]),
  agreedToTerms: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (!data.email && !data.primaryPhoneNumber) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email or Phone required", path: ["email"] });
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email or Phone required", path: ["primaryPhoneNumber"] });
  }
});


/**
 * Handles GET requests to fetch user data.
 * @param request The incoming request.
 * @returns A JSON response with the list of users or an error.
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);


    // Access control: only admins can view users
    if (!session || !session.user || !['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role)) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search');

    // FIX: Used 'Prisma.QueryMode' for the type assertion to match the import style
    const searchFilter = searchQuery ? {
      OR: [
        { fullName: { contains: searchQuery, mode: 'insensitive' as Prisma.QueryMode } },
        { emailAddress: { contains: searchQuery, mode: 'insensitive' as Prisma.QueryMode } },
        { primaryPhoneNumber: { contains: searchQuery, mode: 'insensitive' as Prisma.QueryMode } },
        { id: { contains: searchQuery, mode: 'insensitive' as Prisma.QueryMode } },
      ],
    } : {};
    
    // Fetch users with a comprehensive `select` clause
    const users = await prisma.user.findMany({
      where: searchFilter,
      select: {
        id: true,
        fullName: true,
        fatherName: true,
        grandfatherName: true,
        associationName: true,
        membershipNumber: true,
        isBusiness: true,
        tin: true,
        businessLicenseNo: true,
        region: true,
        city: true,
        woredaKebele: true,
        primaryPhoneNumber: true,
        alternativePhoneNumber: true,
        emailAddress: true,
        preferredVehicleType: true,
        vehicleQuantity: true,
        intendedUse: true,
        digitalSignatureUrl: true,
        agreedToTerms: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: users }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("Error fetching users:", error);
    return new NextResponse(JSON.stringify({ message: "Server error", error: errorMessage }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Handles POST requests to create a new user or admin.
 * @param request The incoming request.
 * @returns A JSON response with the created user/admin or an error.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const validated = createUserSchema.safeParse(body);

    if (!validated.success) {
      return new NextResponse(JSON.stringify({ message: "Validation failed", errors: validated.error.flatten().fieldErrors }), { status: 400 });
    }

    const {
      fullName,
      email,
      password,
      role,
      ...userData
    } = validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Only MAIN_ADMIN can create admins
    if (role !== "APPLICANT") {
      if (!session?.user || session.user.role !== "MAIN_ADMIN") {
        return new NextResponse(JSON.stringify({ message: "Only MAIN_ADMIN can create admins." }), { status: 403 });
      }

      if (!email) {
        return new NextResponse(JSON.stringify({ message: "Email is required for admins." }), { status: 400 });
      }

      const newAdmin = await prisma.admin.create({
        data: {
          fullName,
          email,
          passwordHash: hashedPassword,
          role,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return NextResponse.json({ message: "Admin created successfully", ...newAdmin }, { status: 201 });
    }

    // ✅ APPLICANT: Registered by current admin
    if (!session?.user || !session.user.id) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized. Please log in again." }), { status: 401 });
    }

    const registeredByAdmin = await prisma.admin.findUnique({ where: { id: session.user.id } });
    if (!registeredByAdmin) {
      return new NextResponse(JSON.stringify({ message: "Logged-in admin not found in database." }), { status: 404 });
    }

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        fullName,
        emailAddress: email,
        passwordHash: hashedPassword,
        role,
        registeredById: registeredByAdmin.id,
      },
      // Corrected select clause to return all necessary data
      select: {
        id: true,
        fullName: true,
        fatherName: true,
        grandfatherName: true,
        associationName: true,
        membershipNumber: true,
        isBusiness: true,
        tin: true,
        businessLicenseNo: true,
        region: true,
        city: true,
        woredaKebele: true,
        primaryPhoneNumber: true,
        alternativePhoneNumber: true,
        emailAddress: true,
        preferredVehicleType: true,
        vehicleQuantity: true,
        intendedUse: true,
        digitalSignatureUrl: true,
        agreedToTerms: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ message: "User created successfully", ...newUser }, { status: 201 });

  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("Error in POST /api/admin/users:", error);

    // Check for Prisma unique constraint error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return new NextResponse(JSON.stringify({ message: "Email or phone already exists." }), { status: 409 });
    }

    return new NextResponse(JSON.stringify({ message: "Server error", error: errorMessage }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}