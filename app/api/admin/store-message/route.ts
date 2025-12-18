// app/api/admin/store-message/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Initialize Prisma Client outside the handler for best performance
const prisma = new PrismaClient();

// The App Router requires exporting the specific HTTP method function (e.g., POST)
export async function POST(request: Request) {
  try {
    // 1. Extract data from the request body using request.json()
    const { name, email, interestedIn, phone, message } = await request.json();

    // 2. Simple validation
    if (!name || !email || !interestedIn || !message) {
      return NextResponse.json(
        { message: 'Missing required fields: name, email, interest, or message.' },
        { status: 400 } // Bad Request
      );
    }

    // 3. Use Prisma to create a new ContactMessage record
    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        interestedIn,
        phone,
        message,
      },
    });

    // 4. Success response using NextResponse
    return NextResponse.json(
      { 
        message: 'Message successfully stored for admin review.', 
        data: newMessage 
      },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error('Database insertion error:', error);
    
    // Check if the error is related to parsing JSON or Prisma
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';

    return NextResponse.json(
      { 
        message: 'Failed to save message to the database.',
        error: errorMessage
      },
      { status: 500 } // Internal Server Error
    );
  }
}

// 💡 IMPORTANT: To explicitly prevent other methods (like GET, PUT, DELETE) 
// from returning a default Next.js error, you can optionally export an empty function 
// for the methods you DO NOT SUPPORT. This will prevent the 405 error if a user 
// tries to use the wrong method.

// export async function GET() {
//   return NextResponse.json({ message: 'GET method not supported on this endpoint.' }, { status: 405 });
// }