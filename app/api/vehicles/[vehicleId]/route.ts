import db from "@/lib/db";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    vehicleId: string;
  }>;
};

// DELETE a vehicle
export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { vehicleId } = await params;

    const vehicle = await db.vehicle.delete({
      where: { id: vehicleId },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("[VEHICLE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// UPDATE a vehicle
export async function PATCH(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { vehicleId } = await params;
    const body = await req.json();
    const { name, description, capacity, type, images } = body;

    const vehicle = await db.vehicle.update({
      where: { id: vehicleId },
      data: { name, description, capacity, type, images },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("[VEHICLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
