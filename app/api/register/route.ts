// src/app/api/register/route.ts

import { NextResponse } from 'next/server';
import * as z from 'zod';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; // FIX 1: Import specific Prisma error

// Initialize Prisma Client
const prisma = new PrismaClient();

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    return "An unknown error occurred.";
};

// This Zod schema must be IDENTICAL to the fullRegistrationSchema used on your frontend
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
  primaryPhoneNumber: z.string().regex(/^\+?([0-9]{9,15})$/, "Invalid phone number format. E.g., +251912345678 or 0912345678").min(1, "Primary Phone Number is required."),
  alternativePhoneNumber: z.string().regex(/^\+?([0-9]{9,15})$/, "Invalid phone number format.").nullable().optional(),
  emailAddress: z.string().email("Invalid email address.").nullable().optional(),

  preferredVehicleType: z.string().min(1, "Preferred Vehicle Type/Model is required."),
  vehicleQuantity: z.number().int().min(1, "Quantity must be at least 1.").max(20, "Quantity cannot exceed 20."),
  intendedUse: z.string().min(1, "Intended Use is required."),
  
  digitalSignatureUrl: z.string().min(1, "Digital signature is required."),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions."),

}).superRefine((data, ctx) => {
  if (data.isBusiness) {
    if (!data.businessLicenseNo || data.businessLicenseNo.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Business License No. is required if you are registering as a business.",
        path: ["businessLicenseNo"],
      });
    }
  }
   // Ensure at least one of primaryPhoneNumber or emailAddress is provided
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

    const newUser = await prisma.user.create({
      data: {
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
      },
      select: { // Select fields needed for activity log and response
        id: true,
        fullName: true,
        primaryPhoneNumber: true,
        emailAddress: true,
        preferredVehicleType: true,
        vehicleQuantity: true,
        isBusiness: true, // Include for activity log message
      }
    });

    console.log("API: Data successfully validated and SAVED to DB:", newUser);

    // --- ACTIVITY LOG (NOTIFICATION) LOGIC START ---
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
        // Do not block the main registration process if logging fails
    }
    // --- ACTIVITY LOG (NOTIFICATION) LOGIC END ---

    return NextResponse.json({ message: "Registration successful!", user: newUser }, { status: 200 });

  } catch (error: unknown) { // FIX 2: Changed 'any' to 'unknown'
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      const targetField = (error.meta as { target: string[] })?.target?.[0];
      let errorMessage = "A user with this ";
      if (targetField === 'emailAddress') {
        errorMessage += "email address";
      } else if (targetField === 'primaryPhoneNumber') {
        errorMessage += "phone number";
      } else if (targetField === 'idNumber') {
        errorMessage += "ID number";
      }
      else {
        errorMessage += targetField || "unique field";
      }
      errorMessage += " already exists. Please use a different one.";

      console.error(`API: Unique constraint failed on: ${targetField}`, error);
      return NextResponse.json(
        { message: errorMessage, errors: [{ path: targetField, message: errorMessage }] },
        { status: 409 }
      );
    }
    if (error instanceof z.ZodError) {
      console.error("API: Zod Validation Error Details:");
     error.issues.forEach(err => {
        console.error(`  Path: ${err.path.join('.')}, Message: ${err.message}`);
      });
      return NextResponse.json(
       // Corrected code for the JSON response payload:
{ message: "Validation failed. Please check your inputs.", errors: error.issues },
        { status: 400 }
      );
    }
    
    const errorMessage = getErrorMessage(error);
    console.error("API: Unexpected error during registration:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}