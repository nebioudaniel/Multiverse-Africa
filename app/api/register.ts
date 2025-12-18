// src/app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    return "An unknown error occurred.";
};

// The correct function signature for App Router dynamic routes
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
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
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: unknown) { // FIX: Changed 'any' to 'unknown'
    const errorMessage = getErrorMessage(error);
    console.error("GET /api/user/[id] error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}