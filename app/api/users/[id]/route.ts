import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from '@/app/auth';

// GET user by ID
export async function GET(request: Request, context: { params: { id: string } }) {
  const id = context.params.id;

  if (!id) {
    return new NextResponse(JSON.stringify({ message: "Missing user ID in request." }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ADMIN_USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH (Update user by ID)
export async function PATCH(request: Request, context: { params: { id: string } }) {
  const id = context.params.id;

  if (!id) {
    return new NextResponse(JSON.stringify({ message: "Missing user ID in request." }), { status: 400 });
  }

  try {
    const session = await auth();

    if (!session || !session.user || (session.user.role !== "MAIN_ADMIN" && session.user.role !== "REGISTRAR_ADMIN")) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await request.json();

    const { fullName, emailAddress, primaryPhoneNumber, role } = body;

    // A more robust check for required fields, allowing for partial updates
    if (!fullName && !emailAddress && !primaryPhoneNumber && !role) {
      return new NextResponse("No fields to update provided", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        emailAddress,
        primaryPhoneNumber,
        role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[ADMIN_USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE user by ID
// Corrected to receive the context object
export async function DELETE(request: Request, context: { params: { id: string } }) {
  const id = context.params.id;

  if (!id) {
    return new NextResponse(JSON.stringify({ message: "Missing user ID in request." }), { status: 400 });
  }

  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "MAIN_ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (session.user.id === id) {
      return new NextResponse("You cannot delete your own account.", { status: 400 });
    }

    const userToDelete = await prisma.user.findUnique({ where: { id } });

    if (!userToDelete) {
      return new NextResponse("User not found", { status: 404 });
    }

    // This check assumes the user role is not changeable,
    // which is a good security practice.
    if (userToDelete.role === "MAIN_ADMIN") {
      return new NextResponse("You cannot delete another Main Admin", { status: 403 });
    }

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error("[ADMIN_USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}