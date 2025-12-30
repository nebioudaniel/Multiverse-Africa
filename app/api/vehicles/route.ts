import db  from "@/lib/db"; // Adjust this import to match your prisma client location
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const vehicles = await db.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("[VEHICLES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, capacity, type, images } = body;

    if (!name || !description || !images || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const vehicle = await db.vehicle.create({
      data: {
        name,
        description,
        capacity,
        type,
        images, // This is your array of Edge Store URLs
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("[VEHICLES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}