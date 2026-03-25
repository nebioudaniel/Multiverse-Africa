// src/app/api/register/route.ts

import { NextResponse } from 'next/server';
import * as z from 'zod';
import prisma from '@/lib/prisma'; // Use your shared Prisma client
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; // Import specific Prisma error

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    return "An unknown error occurred.";
};

// Retry helper for Neon transient errors
async function createUserWithRetry(data: any) {
  for (let i = 0; i < 3; i++) {
    try {
      return await prisma.user.create({ data });
    } catch (err: any) {
      // Retry only if Neon fails temporarily
      if (err.message.includes("Response from the Engine was empty") && i < 2) {
        await new Promise(r => setTimeout(r, 100)); // wait 100ms before retry
        continue;
      }
      throw err; // throw any other errors
    }
  }
}

// Zod schema for API validation
const apiSchema = z.object({
  fullName: z.string().min(2, "Full Name is required and must be at least 2 characters."),
  fatherName: z.string().min(2, "Father's Name is required and must be at least 2 characters."),
  grandfatherName: z.string().nullable().optional(),
  
  applicantAssociationName: z.string().nullable().optional(),
  membershipNumber: z.string().nullable().optional(),

  isBusiness: z.boolean().default(false).optional(),
  tin: z.string().nullable().optional(),
  businessLicenseNo: z.string().nullable().optional(),

  region: z.string().min(1, "Region is required."),
  city: z.string().min(2, "City/Sub-City is required."),
  woredaKebele: z.string().min(2, "Woreda / Kebele is required."),
  primaryPhoneNumber: z.string().regex(/^\+?([0-9]{9,15})$/, "Invalid phone number format.").min(1, "Primary Phone Number is required."),
  alternativePhoneNumber: z.string().regex(/^\+?([0-9]{9,15})$/, "Invalid phone number format.").nullable().optional(),
  emailAddress: z.string().email("Invalid email address.").nullable().optional(),

  preferredVehicleType: z.string().min(1, "Preferred Vehicle Type/Model is required."),
  vehicleQuantity: z.number().int().min(1, "Quantity must be at least 1.").max(20, "Quantity cannot exceed 20."),
  intendedUse: z.string().min(1, "Intended Use is required."),
  
  digitalSignatureUrl: z.string().min(1, "Digital signature is required."),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions."),
}).superRefine((data, ctx) => {
  if (data.isBusiness && (!data.businessLicenseNo || data.businessLicenseNo.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Business License No. is required if you are registering as a business.",
      path: ["businessLicenseNo"],
    });
  }
  if (!data.primaryPhoneNumber && (!data.emailAddress || data.emailAddress.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either Primary Phone Number or Email Address is required for contact.",
      path: ["primaryPhoneNumber"],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either Primary Phone Number or Email Address is required for contact.",
      path: ["emailAddress"],
    });
  }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("API: Received data for registration:", body);

    const validatedData = apiSchema.parse(body);

    // Create user with retry helper
    const newUser = await createUserWithRetry({
      fullName: validatedData.fullName,
      fatherName: validatedData.fatherName,
      grandfatherName: validatedData.grandfatherName,
      associationName: validatedData.applicantAssociationName,
      membershipNumber: validatedData.membershipNumber,
      isBusiness: validatedData.isBusiness ?? false,
      entityName: null,
      tin: validatedData.isBusiness ? validatedData.tin : null,
      businessLicenseNo: validatedData.isBusiness ? validatedData.businessLicenseNo : null,
      region: validatedData.region,
      city: validatedData.city,
      woredaKebele: validatedData.woredaKebele,
      primaryPhoneNumber: validatedData.primaryPhoneNumber,
      alternativePhoneNumber: validatedData.alternativePhoneNumber,
      emailAddress: validatedData.emailAddress,
      
      passwordHash: null,
      gender: null,
      idNumber: null,
      residentialAddress: null,
      houseNumber: null,
      driverFullName: null,
      driverLicenseNo: null,
      licenseCategory: null,
      enableGpsTracking: null,
      acceptEpayment: null,

      preferredVehicleType: validatedData.preferredVehicleType,
      vehicleQuantity: validatedData.vehicleQuantity,
      intendedUse: validatedData.intendedUse,
      
      digitalSignatureUrl: validatedData.digitalSignatureUrl,
      agreedToTerms: validatedData.agreedToTerms,
    });

    console.log("API: Data successfully validated and SAVED to DB:", newUser);

    // --- ACTIVITY LOG ---
    if (newUser) {
      try {
        const logDescription = `New ${newUser.isBusiness ? 'business' : 'individual'} applicant registered: ${newUser.fullName} (ID: ${newUser.id}).`;
        await prisma.activityLog.create({
          data: {
            action: "NEW_USER_REGISTRATION",
            description: logDescription,
            entityId: newUser.id,
            entityType: "User",
          }
        });
        console.log("ActivityLog entry created for new user registration.");
      } catch (logError) {
        console.error("Failed to create ActivityLog for new user:", logError);
      }
    }

    return NextResponse.json({ message: "Registration successful!", user: newUser }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      const targetField = (error.meta as { target: string[] })?.target?.[0];
      let errorMessage = "A user with this " + (targetField || "unique field") + " already exists. Please use a different one.";
      console.error(`API: Unique constraint failed on: ${targetField}`, error);
      return NextResponse.json({ message: errorMessage, errors: [{ path: targetField, message: errorMessage }] }, { status: 409 });
    }
    if (error instanceof z.ZodError) {
      console.error("API: Zod Validation Error Details:");
      error.issues.forEach(err => {
        console.error(`  Path: ${err.path.join('.')}, Message: ${err.message}`);
      });
      return NextResponse.json({ message: "Validation failed. Please check your inputs.", errors: error.issues }, { status: 400 });
    }

    const errorMessage = getErrorMessage(error);
    console.error("API: Unexpected error during registration:", error);
    return NextResponse.json({ message: "Internal Server Error", error: errorMessage }, { status: 500 });
  }
}
