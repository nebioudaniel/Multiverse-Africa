import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// @ts-expect-error - Next.js route handler context type is intentionally untyped
export async function GET(req, { params }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  try {
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
