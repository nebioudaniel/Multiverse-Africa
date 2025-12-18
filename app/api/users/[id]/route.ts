//@ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET user by ID
export async function GET(request: Request, context: any) {
  const { id } = context.params;

  if (!id) {
    return new NextResponse(JSON.stringify({ message: "Missing user ID in request." }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ADMIN_USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH user by ID
export async function PATCH(request: Request, context: any) {
  const { id } = context.params;

  if (!id) {
    return new NextResponse(JSON.stringify({ message: "Missing user ID in request." }), { status: 400 });
  }

  try {
    const session = await auth();

    if (!session || !session.user || !["MAIN_ADMIN", "REGISTRAR_ADMIN"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await request.json();
    const { fullName, emailAddress, primaryPhoneNumber, role } = body;

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
export async function DELETE(request: Request, context: any) {
  const { id } = context.params;

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

    if (!session || !session.user || session.user.role !== 'MAIN_ADMIN') {
      return new NextResponse("You cannot delete another Main Admin", { status: 403 });
    }

    const deletedUser = await prisma.user.delete({ where: { id } });

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error("[ADMIN_USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
