// app/api/admin/delete-message/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Use DELETE method for destructive operations
export async function DELETE(request: Request) {
  try {
    // 1. Extract the ID of the message to be deleted
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Missing message ID for deletion.' },
        { status: 400 } // Bad Request
      );
    }

    // 2. Use Prisma to delete the record
    await prisma.contactMessage.delete({
      where: { id },
    });

    // 3. Success response
    return NextResponse.json(
      { message: 'Message successfully deleted.' },
      { status: 200 } // OK
    );

  } catch (error) {
    console.error('Database deletion error:', error);
    
    // Handle case where the ID is not found (P2025 is common Prisma code for "record not found")
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
       return NextResponse.json(
          { message: 'Message not found.' },
          { status: 404 }
       );
    }

    return NextResponse.json(
      { message: 'Failed to delete message.' },
      { status: 500 } // Internal Server Error
    );
  }
}