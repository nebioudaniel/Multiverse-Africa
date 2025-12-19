//@ts-nocheck
// app/api/admin/applications/[id]/route.ts
// Fully compatible with Next.js 15.4.1+ (App Router)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from 'zod';
// Import Prisma and error class via the namespace
import { Prisma } from '@prisma/client'; 

// Helper: convert empty string → null
const toNullIfEmptyString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim() === '') return null;
  return typeof value === 'string' ? value : null;
};

// Helper: safe error message
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  // FIX: Access error class via Prisma namespace
  if (err instanceof Prisma.PrismaClientKnownRequestError) return `Database Error: ${err.code}`; 
  return 'An unexpected error occurred.';
};

// Zod schema (unchanged — perfect)
const applicationUpdateSchema = z.object({
  userId: z.string().min(1).optional(),
  applicantFullName: z.string().nullish(),
  fatherName: z.string().nullish(),
  grandfatherName: z.string().nullish(),
  gender: z.string().optional().nullable(),
  idNumber: z.string().nullish(),
  primaryPhoneNumber: z.string().nullish(),
  applicantEmailAddress: z.string().email().or(z.literal('')).nullish(),
  alternativePhoneNumber: z.string().nullish(),
  residentialAddress: z.string().nullish(),
  region: z.string().nullish(),
  city: z.string().nullish(),
  woredaKebele: z.string().nullish(),
  houseNumber: z.string().nullish(),

  isBusiness: z.boolean().optional(),
  entityName: z.string().nullish(),
  tin: z.string().nullish(),
  businessLicenseNo: z.string().nullish(),
  associationName: z.string().nullish(),
  membershipNumber: z.string().nullish(),

  driverFullName: z.string().nullish(),
  driverLicenseNo: z.string().nullish(),
  licenseCategory: z.enum(['A', 'B', 'C', 'D', 'E']).optional().nullable(),

  vehicleType: z.enum(['Diesel_Minibus', 'Electric_Minibus', 'Electric_Mid_Bus_21_1', 'Traditional_Minibus']).optional().nullable(),
  quantityRequested: z.coerce.number().min(0).max(100).optional(),
  intendedUse: z.string().nullish(),

  enableGpsTracking: z.boolean().optional(),
  acceptEpayment: z.boolean().optional(),
  digitalSignatureUrl: z.string().nullish(),
  agreedToTerms: z.boolean().optional(),

  preferredFinancingInstitution: z.string().nullish(),
  loanAmountRequested: z.coerce.number().optional(),
  loanApplicationStatus: z.enum(['Pending', 'Approved', 'Disbursed', 'Denied']).optional().nullable(),
  bankReferenceNumber: z.string().nullish(),

  downPaymentProofUrl: z.string().nullish(),
  idScanUrl: z.string().nullish(),
  tinNumberUrl: z.string().nullish(),
  supportingLettersUrl: z.string().nullish(),

  applicationStatus: z.enum(['NEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']).optional().nullable(),
  initialRemarks: z.string().nullish(),
  assignedToId: z.string().nullish(),
});

// GET → View application
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
   const session = await getServerSession(authOptions);


    // FIX: Use type assertion for session.user.role
    const userRole = (session?.user?.role as string); 
    const allowedRoles = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];
    if (!session?.user || !allowedRoles.includes(userRole)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        applicant: {
          select: {
            id: true,
            registeredBy: { select: { fullName: true } },
            digitalSignatureUrl: true,
            agreedToTerms: true,
            enableGpsTracking: true,
            acceptEpayment: true,
          },
        },
        assignedTo: { select: { fullName: true } },
        processedBy: { select: { fullName: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    const flattenedApplication = {
      ...application,
      userId: application.applicantId,
      remarks: application.remarks,
      initialRemarks: application.remarks,
      digitalSignatureUrl: application.applicant.digitalSignatureUrl,
      agreedToTerms: application.applicant.agreedToTerms,
      enableGpsTracking: application.applicant.enableGpsTracking,
      acceptEpayment: application.applicant.acceptEpayment,
      applicant: undefined,
    };

    return NextResponse.json(flattenedApplication);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
  }
};

// PUT → Update application
export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
     const session = await getServerSession(authOptions);

    // FIX: Use type assertion for session.user.role
    const userRole = (session?.user?.role as string);
    const allowedRoles = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];
    if (!session?.user || !allowedRoles.includes(userRole)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = applicationUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ message: 'Validation Error', errors: validated.error.flatten() }, { status: 400 });
    }

    const data = validated.data;

    const applicationRecord = await prisma.application.findUnique({
      where: { id },
      select: { applicantId: true },
    });

    if (!applicationRecord) {
      return NextResponse.json({ message: 'Application Not Found' }, { status: 404 });
    }

    const processedByUpdate = data.applicationStatus && data.applicationStatus !== 'NEW'
      ? { processedById: session.user.id }
      : {};

    const applicationUpdateData = {
      applicantFullName: toNullIfEmptyString(data.applicantFullName),
      fatherName: toNullIfEmptyString(data.fatherName),
      grandfatherName: toNullIfEmptyString(data.grandfatherName),
      gender: data.gender,
      idNumber: toNullIfEmptyString(data.idNumber),
      primaryPhoneNumber: toNullIfEmptyString(data.primaryPhoneNumber),
      applicantEmailAddress: toNullIfEmptyString(data.applicantEmailAddress),
      alternativePhoneNumber: toNullIfEmptyString(data.alternativePhoneNumber),
      residentialAddress: toNullIfEmptyString(data.residentialAddress),
      region: toNullIfEmptyString(data.region),
      city: toNullIfEmptyString(data.city),
      woredaKebele: toNullIfEmptyString(data.woredaKebele),
      houseNumber: toNullIfEmptyString(data.houseNumber),

      isBusiness: data.isBusiness,
      entityName: toNullIfEmptyString(data.entityName),
      tin: toNullIfEmptyString(data.tin),
      businessLicenseNo: toNullIfEmptyString(data.businessLicenseNo),
      associationName: toNullIfEmptyString(data.associationName),
      membershipNumber: toNullIfEmptyString(data.membershipNumber),

      driverFullName: toNullIfEmptyString(data.driverFullName),
      driverLicenseNo: toNullIfEmptyString(data.driverLicenseNo),
      licenseCategory: data.licenseCategory,

      vehicleType: data.vehicleType,
      quantityRequested: data.quantityRequested,
      intendedUse: toNullIfEmptyString(data.intendedUse),

      preferredFinancingInstitution: toNullIfEmptyString(data.preferredFinancingInstitution),
      loanAmountRequested: data.loanAmountRequested,
      loanApplicationStatus: data.loanApplicationStatus,
      bankReferenceNumber: toNullIfEmptyString(data.bankReferenceNumber),

      downPaymentProofUrl: toNullIfEmptyString(data.downPaymentProofUrl),
      idScanUrl: toNullIfEmptyString(data.idScanUrl),
      tinNumberUrl: toNullIfEmptyString(data.tinNumberUrl),
      supportingLettersUrl: toNullIfEmptyString(data.supportingLettersUrl),

      remarks: toNullIfEmptyString(data.initialRemarks),
      applicationStatus: data.applicationStatus,
      assignedToId: toNullIfEmptyString(data.assignedToId),
      ...processedByUpdate,
    };

    const userUpdateData = {
      fullName: toNullIfEmptyString(data.applicantFullName),
      fatherName: toNullIfEmptyString(data.fatherName),
      grandfatherName: toNullIfEmptyString(data.grandfatherName),
      driverFullName: toNullIfEmptyString(data.driverFullName),
      driverLicenseNo: toNullIfEmptyString(data.driverLicenseNo),
      licenseCategory: data.licenseCategory,
      digitalSignatureUrl: toNullIfEmptyString(data.digitalSignatureUrl),
      agreedToTerms: data.agreedToTerms,
      enableGpsTracking: data.enableGpsTracking,
      acceptEpayment: data.acceptEpayment,
    };

    const [updatedApplication] = await prisma.$transaction([
      prisma.application.update({
        where: { id },
        // FIX 1: Cast the application data object to resolve the type error
        data: applicationUpdateData as Prisma.ApplicationUpdateInput, 
      }),
      prisma.user.update({
        where: { id: applicationRecord.applicantId },
        // FIX 2: Cast the user data object to resolve the type error (Line 239)
        data: userUpdateData as Prisma.UserUpdateInput, 
      }),
    ]);

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('PUT Error:', error);
    // FIX: Access error class via Prisma namespace
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return NextResponse.json({ message: 'Not Found' }, { status: 404 });
      if (error.code === 'P2002') return NextResponse.json({ message: 'Duplicate field' }, { status: 409 });
    }
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
  }
};

// DELETE → Delete application
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // FIX: Use type assertion for session.user.role
    if (!session?.user || (session.user.role as string) !== 'MAIN_ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.application.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE Error:', error);
    // FIX: Access error class via Prisma namespace
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
  }
};