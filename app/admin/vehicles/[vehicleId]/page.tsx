import db from "@/lib/db";
import { VehicleForm } from "../_components/vehicle-form";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    vehicleId: string;
  }>;
};

export default async function EditVehiclePage({ params }: PageProps) {
  const { vehicleId } = await params;

  const vehicle = await db.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Edit Vehicle: {vehicle.name}
      </h1>
      <VehicleForm initialData={vehicle} />
    </div>
  );
}
