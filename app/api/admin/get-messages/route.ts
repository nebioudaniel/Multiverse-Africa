// app/api/admin/get-messages/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Initialize Prisma Client outside the handler
const prisma = new PrismaClient();

// The App Router requires exporting the specific HTTP method function (GET)
export async function GET() {
  // NOTE: In a real application, you would add authentication/authorization here.
  
  try {
    // 1. Use Prisma to fetch all messages, ordered by creation date (newest first)
    // Ensure contactMessage is correctly generated in your Prisma Client
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 2. Success response using NextResponse
    return NextResponse.json(
      { messages },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error('Database fetch error:', error);
    
    // 3. Error response
    return NextResponse.json(
      { message: 'Failed to retrieve messages from the database.' },
      { status: 500 } // Internal Server Error
    );
  }
}

// Optional: Explicitly define other methods to return 405 if required.
// export async function POST() {
//   return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
// }