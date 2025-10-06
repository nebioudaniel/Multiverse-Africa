import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';
import { z } from 'zod';

// ======================================================
// Zod Schema for Application Creation (Backend)
// ======================================================
const createApplicationSchema = z.object({
  userId: z.string().min(1, "Please select an applicant."),
  applicantFullName: z.string().min(1, "Applicant full name is required."),
  gender: z.enum(["Male", "Female", "Other"]).nullable().optional(), 
  idNumber: z.string().nullable().optional(),
  primaryPhoneNumber: z.string().nullable().optional(),
  applicantEmailAddress: z.string().email("Invalid email address").nullable().optional(),
  residentialAddress: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  woredaKebele: z.string().nullable().optional(),
  houseNumber: z.string().nullable().optional(),

  // Business fields are excluded as requested
  associationName: z.string().nullable().optional(),
  membershipNumber: z.string().nullable().optional(),

  // Driver Information
  driverFullName: z.string().min(1, { message: "Driver's Full Name is required." }),
  driverLicenseNo: z.string().min(1, { message: "Driver's License Number is required." }),
  
  // Confirmed to be added/present in Application model from previous steps
  licenseCategory: z.enum(["A", "B", "C", "D", "E"], { 
    required_error: "License Category is required.",
  }),

  // Vehicle Details
  vehicleType: z.enum(["Diesel_Minibus", "Electric_Minibus", "Electric_Mid_Bus_21_1", "Traditional_Minibus"], { 
    required_error: "Vehicle type is required." 
  }),
  
  quantityRequested: z.number().int().min(1, "Quantity must be at least 1."),
  intendedUse: z.string().nullable().optional(),

  // Optional Preferences - These are VALIDATED but will NOT be saved to the Application model 
  // to prevent Prisma errors if they only exist on the User model.
  enableGpsTracking: z.boolean().nullable().optional(),
  acceptEpayment: z.boolean().nullable().optional(),

  // Legal & Signature - Same as Optional Preferences
  digitalSignatureUrl: z.string().nullable().optional(),
  agreedToTerms: z.boolean().nullable().optional(),

  preferredFinancingInstitution: z.string().nullable().optional(), 
  loanAmountRequested: z.number().min(0, "Loan amount cannot be negative."),
  bankReferenceNumber: z.string().nullable().optional(),

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
    const session = await auth();

    if (!session || !session.user || !['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role)) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const statusFilter = searchParams.get('status');

    let whereClause: any = {};

    if (searchQuery) {
      whereClause.OR = [
        { applicantFullName: { contains: searchQuery, mode: 'insensitive' } },
        { primaryPhoneNumber: { contains: searchQuery, mode: 'insensitive' } },
        { applicantEmailAddress: { contains: searchQuery, mode: 'insensitive' } },
        { id: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    if (statusFilter && statusFilter !== 'all' && ['NEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(statusFilter)) {
      whereClause.applicationStatus = statusFilter;
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
            fatherName: true,
            grandfatherName: true,
            emailAddress: true,
            primaryPhoneNumber: true,
            alternativePhoneNumber: true,
            gender: true,
            idNumber: true,
            residentialAddress: true,
            region: true,
            city: true,
            woredaKebele: true,
            houseNumber: true,
            associationName: true,
            membershipNumber: true,
            preferredVehicleType: true,
            vehicleQuantity: true,
            intendedUse: true,
            role: true,
            createdAt: true,
            registeredBy: { select: { fullName: true } },
            // CRITICAL: These fields are retrieved from the Applicant (User) model for the View page
            enableGpsTracking: true,
            acceptEpayment: true,
            digitalSignatureUrl: true,
            agreedToTerms: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}
// ----------------------------------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const session = await auth();

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

    // Destructure all fields from validatedData.data
    const {
      userId,
      applicantFullName,
      gender, // These fields are being saved, assuming they exist on the Application schema
      idNumber,
      primaryPhoneNumber,
      applicantEmailAddress,
      residentialAddress,
      region,
      city,
      woredaKebele,
      houseNumber,
      // Removed unused business/association fields
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
      driverFullName,
      driverLicenseNo,
      licenseCategory,
      
      // CRITICAL: We still need to destructure these, but we WON'T save them to the Application model
      // to avoid Prisma validation errors if they are only on the User model.
      enableGpsTracking,
      acceptEpayment,
      digitalSignatureUrl,
      agreedToTerms,
    } = validatedData.data;

    const applicant = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!applicant) {
      return new NextResponse(JSON.stringify({ message: "Applicant not found." }), { status: 404 });
    }

    const newApplication = await prisma.application.create({
      data: {
        applicantId: userId,
        applicantFullName,
        
        // FIX: The following fields are now included in the create operation.
        // If your live Application table does not have these columns, 
        // this will cause a PrismaClientValidationError.
        gender,
        idNumber,
        primaryPhoneNumber,
        applicantEmailAddress,
        residentialAddress,
        region,
        city,
        woredaKebele,
        houseNumber,
        
        isBusiness: false, // Hardcoded to false
        tin: null,
        businessLicenseNo: null,
        associationName: null,
        membershipNumber: null,
        
        // Driver Information
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
        
        // CRITICAL FIX: The four optional/legal fields are now EXCLUDED from the create operation.
        // This is done to prevent the API from crashing if they are missing from the Application schema.
        // We rely on the GET request above to fetch these values from the 'applicant' (User) relation.
        // enableGpsTracking: enableGpsTracking, // REMOVED
        // acceptEpayment: acceptEpayment,       // REMOVED
        // digitalSignatureUrl: digitalSignatureUrl, // REMOVED
        // agreedToTerms: agreedToTerms,       // REMOVED

        applicationStatus: applicationStatus || 'NEW',
        loanApplicationStatus: loanApplicationStatus || 'Pending',
        remarks: initialRemarks, // Mapped from initialRemarks
        
        processedById: session.user.id,
        assignedToId: session.user.id,
      },
      select: { id: true },
    });

    // Create activity log for application creation
    await prisma.activityLog.create({
      data: {
        action: "APPLICATION_CREATED",
        description: `Application ${newApplication.id.substring(0,8)}... created by admin ${session.user.name || session.user.email} for user ${applicant.fullName || applicant.emailAddress || applicant.id.substring(0,8)}...`,
        performedById: session.user.id,
        entityId: newApplication.id,
        entityType: "Application",
      }
    });

    return new NextResponse(JSON.stringify(newApplication), { status: 201 });
  } catch (error: any) {
    console.error('Error creating application (backend):', error);
    if (error.code === 'P2003') { // Foreign key constraint violation
      return new NextResponse(
        JSON.stringify({
          message: `Foreign key constraint violated. This usually means the applicant ID or assigned/processed admin ID does not exist.`,
          error: error.message,
        }),
        { status: 400 }
      );
    } else if (error.code === 'P2025') { // Record not found (e.g., applicant not found)
      return new NextResponse(JSON.stringify({ message: "Applicant not found for application creation." }), { status: 404 });
    } else if (error.name === 'PrismaClientValidationError') { // Catch specific Prisma validation errors
        console.error("Prisma Validation Error Details:", error.message);
        return new NextResponse(JSON.stringify({ message: `Invalid data provided for application creation. A field is likely missing from your live Prisma schema. Error: ${error.message}` }), { status: 400 });
    }
    // Generic error for other unexpected issues
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}