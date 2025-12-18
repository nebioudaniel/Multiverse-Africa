import { NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';
 // FIX 1: Import Prisma types
import * as z from 'zod';

const prisma = new PrismaClient();

const querySchema = z.object({
  primaryPhoneNumber: z.string().optional(),
  emailAddress: z.string().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  try {
    const queryParams = querySchema.parse(Object.fromEntries(searchParams));
    const { primaryPhoneNumber, emailAddress } = queryParams;

    if (!primaryPhoneNumber && !emailAddress) {
      return NextResponse.json(
        { message: "No parameters provided for uniqueness check." },
        { status: 400 }
      );
    }

    // FIX 2: Explicitly type 'conditions' using Prisma.UserWhereInput[]
    const conditions: Prisma.UserWhereInput[] = [];

    if (primaryPhoneNumber?.trim()) {
      conditions.push({ primaryPhoneNumber });
    }

    if (emailAddress?.trim()) {
      conditions.push({ emailAddress });
    }

    if (conditions.length === 0) {
      return NextResponse.json(
        { isUnique: true, message: "No valid parameters provided for uniqueness check." },
        { status: 200 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: conditions,
      },
      select: {
        primaryPhoneNumber: true,
        emailAddress: true,
      },
    });

    if (existingUser) {
      let duplicateField = '';
      if (existingUser.primaryPhoneNumber === primaryPhoneNumber) {
        duplicateField = 'primaryPhoneNumber';
      } else if (existingUser.emailAddress === emailAddress) {
        duplicateField = 'emailAddress';
      }

      return NextResponse.json(
        { isUnique: false, duplicateField, message: `${duplicateField} is already in use.` },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { isUnique: true, message: "Phone number and email are available." },
      { status: 200 }
    );

  } catch (error) {
   if (error instanceof z.ZodError) {
  return NextResponse.json(
    { message: "Invalid query parameters.", errors: error.issues },
    { status: 400 }
  );
}

    console.error("API: Error checking uniqueness:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}