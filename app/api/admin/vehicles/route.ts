import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all vehicles
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch vehicles" }, { status: 500 });
  }
}

// POST: Create new vehicle
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, capacity, type, images } = body;

    const vehicle = await prisma.vehicle.create({
      data: { name, description, capacity, type, images },
    });
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create vehicle" }, { status: 500 });
  }
}

// PUT: Update existing vehicle
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, capacity, type, images } = body;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { name, description, capacity, type, images },
    });
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update vehicle" }, { status: 500 });
  }
}

// DELETE: Remove vehicle
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Missing vehicle id" }, { status: 400 });

    await prisma.vehicle.delete({ where: { id } });
    return NextResponse.json({ message: "Vehicle deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete vehicle" }, { status: 500 });
  }
}
