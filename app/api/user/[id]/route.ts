// /app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        fullName: true,
        fatherName: true,
        grandfatherName: true,
        // CORRECTED: Use 'associationName' which exists in the model
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
  } catch (error: any) {
    console.error("GET /api/user/[id] error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}