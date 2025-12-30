import { VehicleForm } from "../_components/vehicle-form";

export default function NewVehiclePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Vehicle</h1>
      <VehicleForm />
    </div>
  );
}