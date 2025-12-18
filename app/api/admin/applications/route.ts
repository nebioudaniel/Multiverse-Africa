//@ts-nocheck
// ./app/api/admin/applications/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from 'zod';
import { Prisma, ApplicationStatus, LoanApplicationStatus, LicenseCategory, VehicleType } from '@prisma/client'; 
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    if (err instanceof PrismaClientKnownRequestError) {
        return `Database Error (${err.code}): ${err.message}`;
    }
    // Handle specific Prisma validation errors that may not be PrismaClientKnownRequestError
    if (typeof err === 'object' && err !== null && 'name' in err && (err as { name: string }).name === 'PrismaClientValidationError') {
         return `Prisma Validation Error: ${(err as unknown as { message: string }).message.split('\n').pop()}`; // Get the last line of the error
    }
    return "An unexpected error occurred.";
};

// ======================================================
// Zod Schema for Application Creation (Backend)
// ======================================================
const createApplicationSchema = z.object({
  userId: z.string().min(1, "Please select an applicant."),
  applicantFullName: z.string().min(1, "Applicant full name is required."),
  fatherName: z.string().nullable().optional(), 
  grandfatherName: z.string().nullable().optional(), 
  gender: z.enum(["Male", "Female", "Other"]).nullable().optional(), 
  idNumber: z.string().nullable().optional(),
  primaryPhoneNumber: z.string().nullable().optional(),
  // Ensure email handles the 'or(z.literal(""))' from the frontend
  applicantEmailAddress: z.string().email("Invalid email address").nullable().optional().or(z.literal("")),
  residentialAddress: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  woredaKebele: z.string().nullable().optional(),
  houseNumber: z.string().nullable().optional(),

  associationName: z.string().nullable().optional(),
  membershipNumber: z.string().nullable().optional(),

  // Driver Information (on Application Model)
  driverFullName: z.string().min(1, { message: "Driver's Full Name is required." }),
  driverLicenseNo: z.string().min(1, { message: "Driver's License Number is required." }),
  licenseCategory: z.enum(["A", "B", "C", "D"], { 
    // ✅ FIX 1: Change required_error to message for z.enum() compatibility
    message: "License Category is required and must be one of A, B, C, or D.",
  }),

  // Vehicle Details (on Application Model)
  vehicleType: z.enum(["Diesel_Minibus", "Electric_Minibus", "Electric_Mid_Bus_21_1", "Traditional_Minibus"], { 
    // ✅ FIX 2: Change required_error to message for z.enum() compatibility
    message: "Vehicle type is required and must be one of the specified types." 
  }),
  
  quantityRequested: z.number().int().min(1, "Quantity must be at least 1."),
  intendedUse: z.string().nullable().optional(),

  // User-Only Fields (Validated but will update the User Model)
  enableGpsTracking: z.boolean().nullable().optional(),
  acceptEpayment: z.boolean().nullable().optional(),
  digitalSignatureUrl: z.string().nullable().optional(),
  agreedToTerms: z.boolean().nullable().optional(),

  preferredFinancingInstitution: z.string().nullable().optional(), 
  loanAmountRequested: z.number().min(0, "Loan amount cannot be negative.").optional(),
  bankReferenceNumber: z.string().nullable().optional(),

  // DOCUMENT URL FIELDS
  downPaymentProofUrl: z.string().nullable().optional(),
  idScanUrl: z.string().nullable().optional(),
  tinNumberUrl: z.string().nullable().optional(),
  supportingLettersUrl: z.string().nullable().optional(),

  initialRemarks: z.string().nullable().optional(),

  // Status fields 
  applicationStatus: z.enum(["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"]).optional(),
  loanApplicationStatus: z.enum(["Pending", "Approved", "Disbursed"]).optional(),
});
// ----------------------------------------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role)) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const statusFilter = searchParams.get('status');

    // Use Prisma type for where clause
    const whereClause: Prisma.ApplicationWhereInput = {};

    if (searchQuery) {
      whereClause.OR = [
        { applicantFullName: { contains: searchQuery, mode: 'insensitive' } },
        { primaryPhoneNumber: { contains: searchQuery, mode: 'insensitive' } },
        { applicantEmailAddress: { contains: searchQuery, mode: 'insensitive' } },
        { id: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    if (statusFilter && statusFilter !== 'all' && ['NEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(statusFilter)) {
      // Cast the statusFilter to the Prisma ApplicationStatus type
      whereClause.applicationStatus = statusFilter as ApplicationStatus;
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      select: {
        id: true,
        applicantFullName: true,
        primaryPhoneNumber: true,
        applicantEmailAddress: true,
        applicationStatus: true,
        loanApplicationStatus: true,
        createdAt: true,
        updatedAt: true,
        assignedTo: { select: { fullName: true } },
        processedBy: { select: { fullName: true } },
        applicant: {
          select: {
            id: true,
            fullName: true,
            emailAddress: true,
            primaryPhoneNumber: true,
            role: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error: unknown) { 
    const errorMessage = getErrorMessage(error);
    console.error('Error fetching applications:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: errorMessage }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);


    if (!session || !session.user || !['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role)) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const body = await request.json();

    const validatedData = createApplicationSchema.safeParse(body);

    if (!validatedData.success) {
      console.error('Validation error (backend):', validatedData.error.flatten().fieldErrors);
      return new NextResponse(
        JSON.stringify({ message: "Validation error", errors: validatedData.error.flatten().fieldErrors }),
        { status: 400 }
      );
    }

    const {
      userId,
      applicantFullName,
      fatherName,
      grandfatherName,
      gender,
      idNumber,
      primaryPhoneNumber,
      applicantEmailAddress,
      residentialAddress,
      region,
      city,
      woredaKebele,
      houseNumber,
      associationName,
      membershipNumber,
      driverFullName,
      driverLicenseNo,
      licenseCategory,
      vehicleType,
      quantityRequested,
      intendedUse,
      preferredFinancingInstitution,
      loanAmountRequested,
      bankReferenceNumber,
      downPaymentProofUrl,
      idScanUrl,
      tinNumberUrl,
      supportingLettersUrl,
      initialRemarks,
      applicationStatus,
      loanApplicationStatus,
      
      // Fields that belong to the User model
      enableGpsTracking, 
      acceptEpayment,    
      digitalSignatureUrl, 
      agreedToTerms,       
    } = validatedData.data;

    // Check applicant existence
    const applicant = await prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, emailAddress: true, isBusiness: true }
    });

    if (!applicant) {
      return new NextResponse(JSON.stringify({ message: "Applicant not found." }), { status: 404 });
    }

    // Use a transaction to ensure both Application creation and User update succeed
    const [newApplication] = await prisma.$transaction([
        // 1. Create the Application
        prisma.application.create({
          data: {
            applicantId: userId,
            applicantFullName,
            // Snapshot Data
            fatherName,
            grandfatherName,
            gender,
            idNumber,
            primaryPhoneNumber,
            // Coerce empty string email to null for DB
            applicantEmailAddress: applicantEmailAddress || null, 
            residentialAddress,
            region,
            city,
            woredaKebele,
            houseNumber,
            
            // Business/Association Snapshot 
            isBusiness: applicant.isBusiness, 
            tin: null, 
            businessLicenseNo: null,
            
            associationName,
            membershipNumber,
            
            // Driver Information
            driverFullName,
            driverLicenseNo,
            // Cast to Prisma enum type
            licenseCategory: licenseCategory as LicenseCategory, 

            // Vehicle Details
            vehicleType: vehicleType as VehicleType,             
            preferredVehicleType: vehicleType as VehicleType,          
            vehicleQuantity: quantityRequested,         
            quantityRequested: quantityRequested,       
            
            intendedUse,
            
            preferredFinancingInstitution,
            loanAmountRequested: loanAmountRequested || null,
            bankReferenceNumber,
            
            // DOCUMENT URL FIELDS
            downPaymentProofUrl,
            idScanUrl,
            tinNumberUrl,
            supportingLettersUrl,
            
            // Status & Remarks
            applicationStatus: (applicationStatus || 'NEW') as ApplicationStatus,
            loanApplicationStatus: (loanApplicationStatus || 'Pending') as LoanApplicationStatus,
            remarks: initialRemarks, 
            
            // Admin who created/processed the application
            processedById: session.user.id,
            assignedToId: session.user.id, 
          },
          select: { id: true },
        }),
        
        // 2. Update the User model with the specific User-only fields
        prisma.user.update({
            where: { id: userId },
            data: {
                // User-Only Fields
                enableGpsTracking,
                acceptEpayment,
                digitalSignatureUrl,
               agreedToTerms: agreedToTerms ?? false,
                
                // Update User's driver info
                driverFullName,
                driverLicenseNo,
                licenseCategory: licenseCategory as LicenseCategory, 
            }
        })
    ]);

    // Activity Log
    await prisma.activityLog.create({
      data: {
        action: "APPLICATION_CREATED",
        description: `Application ${newApplication.id.substring(0,8)}... created by admin ${session.user.name || session.user.email} for user ${applicant.fullName || applicant.emailAddress || userId.substring(0,8)}...`,
        performedById: session.user.id,
        entityId: newApplication.id,
        entityType: "Application",
      }
    });

    return new NextResponse(JSON.stringify(newApplication), { status: 201 });
  } catch (error: unknown) { 
    const errorMessage = getErrorMessage(error);
    console.error('Error creating application (backend):', error);
    
    // Check for Prisma unique constraint error (P2025 is typically record not found, but kept for context)
    // P2002 is for unique constraint violation
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
         return NextResponse.json({ message: 'Applicant not found or similar record issue' }, { status: 404 });
       }
    
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: errorMessage }), { status: 500 });
  }
}