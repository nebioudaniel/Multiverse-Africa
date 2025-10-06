// app/api/admin/applications/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';
import { z } from 'zod';

// ====================================================================
// HELPER FUNCTION
// ====================================================================
/**
 * Coerces a value to null if it is null, undefined, or an empty string.
 * This is crucial for consistent display of "Not Provided" in the frontend.
 */
const toNullIfEmptyString = (value: string | number | boolean | null | undefined): string | number | boolean | null => {
    if (typeof value === 'string' && value.trim() === '') {
        return null;
    }
    return value ?? null;
};


// ====================================================================
// ZOD SCHEMA
// ====================================================================
const applicationUpdateSchema = z.object({
  // Snapshot User Data 
  userId: z.string().min(1, { message: "Applicant ID is missing." }),
  applicantFullName: z.string().nullish(),
  fatherName: z.string().nullish(), 
  grandfatherName: z.string().nullish(),
  gender: z.enum(["Male", "Female", "Other"]).optional().nullable(),
  idNumber: z.string().nullish(),
  primaryPhoneNumber: z.string().nullish(),
  applicantEmailAddress: z.string().email("Invalid email address").nullish().or(z.literal('')),
  alternativePhoneNumber: z.string().nullish(), 
  residentialAddress: z.string().nullish(),
  region: z.string().nullish(),
  city: z.string().nullish(),
  woredaKebele: z.string().nullish(),
  houseNumber: z.string().nullish(),

  // Snapshot Business/Association Data
  isBusiness: z.boolean().optional(),
  entityName: z.string().nullish(),
  tin: z.string().nullish(),
  businessLicenseNo: z.string().nullish(),
  associationName: z.string().nullish(),
  membershipNumber: z.string().nullish(),
  
  // Snapshot Vehicle/Driver Data
  driverFullName: z.string().nullish(),
  driverLicenseNo: z.string().nullish(),
  licenseCategory: z.enum(["A", "B", "C", "D", "E"]).optional().nullable(), 
  
  preferredVehicleType: z.enum(["Diesel_Minibus", "Electric_Minibus", "Electric_Mid_Bus_21_1", "Traditional_Minibus"]).optional().nullable(),
  vehicleQuantity: z.coerce.number().min(1).max(100).optional(), 
  intendedUse: z.string().nullish(),
  
  // Snapshot Preference Data
  enableGpsTracking: z.boolean().optional(),
  acceptEpayment: z.boolean().optional(),

  // Snapshot Legal Data
  digitalSignatureUrl: z.string().nullish(),
  agreedToTerms: z.boolean().optional(),

  // Application-Specific Data
  preferredFinancingInstitution: z.string().nullish(),
  loanAmountRequested: z.coerce.number().min(0).optional(),
  loanApplicationStatus: z.enum(["Pending", "Approved", "Disbursed", "Denied"]).optional(),
  bankReferenceNumber: z.string().nullish(), 

  downPaymentProofUrl: z.string().nullish(),
  idScanUrl: z.string().nullish(),
  tinNumberUrl: z.string().nullish(),
  supportingLettersUrl: z.string().nullish(),

  applicationStatus: z.enum(["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"]).optional(),
  remarks: z.string().nullish(),
  assignedToId: z.string().nullish(),
  processedById: z.string().nullish(),
});


// ====================================================================
// GET Handler (View Application) - FIXED: Coerce "" to null
// ====================================================================
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session || !session.user || !['MAIN_ADMIN', 'REGISTRAR_ADMIN', 'APPLICANT'].includes(session.user.role)) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { id: applicationId } = params;

    // Authorization check for APPLICANT role
    if (session.user.role === 'APPLICANT') {
      const application = await prisma.application.findUnique({ where: { id: applicationId }, select: { applicantId: true } });
      if (!application || application.applicantId !== session.user.id) {
        return new NextResponse(JSON.stringify({ message: 'Forbidden: You can only view your own applications.' }), { status: 403 });
      }
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        applicant: { 
          select: {
            id: true,
            registeredBy: { select: { fullName: true } }
          }
        },
        assignedTo: { select: { fullName: true } },
        processedBy: { select: { fullName: true } }
      },
    });

    if (!application) {
      return new NextResponse(JSON.stringify({ message: 'Application not found.' }), { status: 404 });
    }

    // FIX: Apply toNullIfEmptyString to all string/URL fields to standardize null values
    const flattenedApplication = {
      // Base data
      id: application.id,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      assignedToId: toNullIfEmptyString(application.assignedToId),
      processedById: toNullIfEmptyString(application.processedById),
      loanApplicationStatus: application.loanApplicationStatus ?? null,
      applicationStatus: application.applicationStatus ?? null,
      
      // Mismatched fields
      userId: toNullIfEmptyString(application.applicantId),
      vehicleType: application.preferredVehicleType ?? null, 
      initialRemarks: toNullIfEmptyString(application.remarks),
      quantityRequested: application.vehicleQuantity ?? null, 
      
      // Explicitly include all snapshot fields, coercing empty strings to null
      applicantFullName: toNullIfEmptyString(application.applicantFullName),
      fatherName: toNullIfEmptyString(application.fatherName), 
      grandfatherName: toNullIfEmptyString(application.grandfatherName),
      gender: application.gender ?? null,
      idNumber: toNullIfEmptyString(application.idNumber),
      primaryPhoneNumber: toNullIfEmptyString(application.primaryPhoneNumber),
      applicantEmailAddress: toNullIfEmptyString(application.applicantEmailAddress),
      alternativePhoneNumber: toNullIfEmptyString(application.alternativePhoneNumber),
      residentialAddress: toNullIfEmptyString(application.residentialAddress),
      region: toNullIfEmptyString(application.region),
      city: toNullIfEmptyString(application.city),
      woredaKebele: toNullIfEmptyString(application.woredaKebele),
      houseNumber: toNullIfEmptyString(application.houseNumber),
      isBusiness: application.isBusiness ?? null,
      entityName: toNullIfEmptyString(application.entityName),
      tin: toNullIfEmptyString(application.tin),
      businessLicenseNo: toNullIfEmptyString(application.businessLicenseNo),
      associationName: toNullIfEmptyString(application.associationName), 
      membershipNumber: toNullIfEmptyString(application.membershipNumber),

      driverFullName: toNullIfEmptyString(application.driverFullName),
      driverLicenseNo: toNullIfEmptyString(application.driverLicenseNo),
      licenseCategory: application.licenseCategory ?? null,
      
      // BOOLEAN & URL FIXES
      enableGpsTracking: application.enableGpsTracking ?? null,
      acceptEpayment: application.acceptEpayment ?? null,
      digitalSignatureUrl: toNullIfEmptyString(application.digitalSignatureUrl),
      agreedToTerms: application.agreedToTerms ?? null, 
      
      intendedUse: toNullIfEmptyString(application.intendedUse),

      preferredFinancingInstitution: toNullIfEmptyString(application.preferredFinancingInstitution),
      loanAmountRequested: application.loanAmountRequested ?? null,
      bankReferenceNumber: toNullIfEmptyString(application.bankReferenceNumber),

      // Document URL FIXES
      downPaymentProofUrl: toNullIfEmptyString(application.downPaymentProofUrl),
      idScanUrl: toNullIfEmptyString(application.idScanUrl),
      tinNumberUrl: toNullIfEmptyString(application.tinNumberUrl),
      supportingLettersUrl: toNullIfEmptyString(application.supportingLettersUrl),
      
      // Included relations
      assignedTo: application.assignedTo || null,
      processedBy: application.processedBy || null,
      registeredBy: application.applicant?.registeredBy || null, 
      
      // Cleanup the nested objects 
      applicant: undefined, 
      remarks: undefined, 
      preferredVehicleType: undefined, 
      vehicleQuantity: undefined, 
    };

    return NextResponse.json(flattenedApplication, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching application:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}

// --------------------------------------------------------------------

// ====================================================================
// PUT Handler (Update Application) - FIXED: Handles nullish input correctly
// ====================================================================
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session || !session.user || !['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role)) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { id: applicationId } = params;

    const body = await request.json();

    const validatedData = applicationUpdateSchema.safeParse(body);

    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error.flatten().fieldErrors);
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
      alternativePhoneNumber, 
      residentialAddress,
      region,
      city,
      woredaKebele,
      houseNumber,
      isBusiness,
      entityName,
      tin,
      businessLicenseNo,
      associationName,
      membershipNumber,
      driverFullName,
      driverLicenseNo,
      licenseCategory,
      preferredVehicleType,
      vehicleQuantity,
      intendedUse,
      enableGpsTracking,
      acceptEpayment,
      digitalSignatureUrl,
      agreedToTerms,
      preferredFinancingInstitution,
      loanAmountRequested,
      loanApplicationStatus,
      bankReferenceNumber,
      downPaymentProofUrl,
      idScanUrl,
      tinNumberUrl,
      supportingLettersUrl,
      applicationStatus,
      remarks,
      assignedToId,
      processedById,
    } = validatedData.data;
    
    const existingApplication = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { applicantId: true }
    });

    if (!existingApplication) {
      return new NextResponse(JSON.stringify({ message: "Application not found for update." }), { status: 404 });
    }

    // 1. Prepare Application Data for Update (Snapshot + Application-specific fields)
    const applicationDataForUpdate: any = {
      applicantFullName,
      fatherName,
      grandfatherName,
      gender,
      idNumber,
      primaryPhoneNumber,
      applicantEmailAddress,
      alternativePhoneNumber,
      residentialAddress,
      region,
      city,
      woredaKebele,
      houseNumber,
      // FIX: Use '?? null' for all optional booleans and URLs to save 'null' when missing
      isBusiness: isBusiness ?? null, 
      entityName: (isBusiness ?? null) ? entityName : null, 
      tin: (isBusiness ?? null) ? tin : null,
      businessLicenseNo: (isBusiness ?? null) ? businessLicenseNo : null,
      associationName,
      membershipNumber,
      preferredVehicleType,
      vehicleQuantity, 
      intendedUse,
      driverFullName, 
      driverLicenseNo,
      licenseCategory,
      enableGpsTracking: enableGpsTracking ?? null, 
      acceptEpayment: acceptEpayment ?? null, 
      digitalSignatureUrl: digitalSignatureUrl ?? null, 
      agreedToTerms: agreedToTerms ?? null, 
      
      preferredFinancingInstitution,
      loanAmountRequested,
      bankReferenceNumber,
      downPaymentProofUrl,
      idScanUrl,
      tinNumberUrl,
      supportingLettersUrl,
      remarks, 

      ...(session.user.role === 'MAIN_ADMIN' && {
        applicationStatus,
        loanApplicationStatus,
        assignedToId,
        processedById,
      })
    };
    
    // 2. Prepare User Data for Update 
    const userDataForUpdate: any = {
      fullName: applicantFullName,
      fatherName,
      grandfatherName,
      gender,
      idNumber,
      primaryPhoneNumber,
      emailAddress: applicantEmailAddress,
      alternativePhoneNumber,
      residentialAddress,
      region,
      city,
      woredaKebele,
      houseNumber,
      // FIX: Apply '?? null' for consistency in User update as well
      isBusiness: isBusiness ?? null, 
      associationName,
      membershipNumber,
      preferredVehicleType,
      vehicleQuantity,
      intendedUse,
      enableGpsTracking: enableGpsTracking ?? null, 
      acceptEpayment: acceptEpayment ?? null,
      digitalSignatureUrl: digitalSignatureUrl ?? null, 
      agreedToTerms: agreedToTerms ?? null, 
    };

    if (isBusiness ?? null) {
      userDataForUpdate.entityName = entityName || null;
      userDataForUpdate.tin = tin || null;
      userDataForUpdate.businessLicenseNo = businessLicenseNo || null;
    } else {
      userDataForUpdate.entityName = null;
      userDataForUpdate.tin = null;
      userDataForUpdate.businessLicenseNo = null;
    }

    const [updatedApp, updatedUser] = await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: applicationDataForUpdate,
      }),
      prisma.user.update({
        where: { id: userId },
        data: userDataForUpdate,
      }),
    ]);

    await prisma.activityLog.create({
      data: {
        action: "APPLICATION_UPDATED",
        description: `Application ${applicationId} updated by admin ${session.user.id}`,
        performedById: session.user.id,
        entityId: applicationId,
        entityType: "Application",
      }
    });

    return NextResponse.json({ application: updatedApp, user: updatedUser }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating application:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}