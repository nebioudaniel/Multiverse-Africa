// app/api/admin/mark-read/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Missing message ID.' }, { status: 400 });
    }

    // Update the message in the database
    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json(
      { message: 'Message marked as read.', data: updatedMessage },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { message: 'Failed to update message status.' },
      { status: 500 }
    );
  }
}