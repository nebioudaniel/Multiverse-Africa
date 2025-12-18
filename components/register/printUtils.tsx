//src/components/register/printUtils.tsx
import React from 'react';
// Assuming the actual interface is defined here:
import { RegistrationFormData } from './RegisterFormContainer';

export const printApplicationContent = (data: RegistrationFormData) => {
  console.log("printApplicationContent called with data:", data); // Confirm data is passed

  if (!data) {
    console.error("printApplicationContent: Data is null or undefined.");
    return <p className="text-center text-red-500">Error: No application data available for printing.</p>;
  }

  // Helper to safely get value for optional fields
  const getValue = (value: string | number | boolean | undefined | null | any[] | object, emptyText = 'N/A') => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
      return emptyText;
    }
    return String(value); // Convert everything to a string for display
  };

  // Temporarily assert data as 'any' to access business fields that TypeScript can't find
  const dataAsAny = data as any; 

  return (
    <div className="p-8 font-sans text-gray-800 bg-white leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-center">Minibus Registration Application Summary</h1>

      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">1. Applicant Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <p><strong>Full Name:</strong> {getValue(data.fullName)}</p>
          <p><strong>Father Name:</strong> {getValue(data.fatherName)}</p>
          <p><strong>Grandfather Name:</strong> {getValue(data.grandfatherName)}</p>
          <p><strong>Primary Phone:</strong> {getValue(data.primaryPhoneNumber)}</p>
          <p><strong>Alternative Phone:</strong> {getValue(data.alternativePhoneNumber)}</p>
          <p><strong>Email Address:</strong> {getValue(data.emailAddress)}</p>
          <p><strong>Region:</strong> {getValue(data.region)}</p>
          <p><strong>City/Sub-City:</strong> {getValue(data.city)}</p>
          <p><strong>Woreda/Kebele:</strong> {getValue(data.woredaKebele)}</p>
        </div>

        {/* Accessing the business-specific fields using the asserted object */}
        {data.isBusiness && (
          <div className="mt-6 p-4 border rounded-md bg-blue-50">
            <h3 className="text-xl font-semibold mb-3 text-blue-800">Business Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <p><strong>Registered as Business:</strong> Yes</p>
              <p><strong>Association/Business Name:</strong> {getValue(dataAsAny.entityName)}</p> {/* FIX APPLIED HERE */}
              <p><strong>TIN:</strong> {getValue(dataAsAny.tin)}</p> {/* FIX APPLIED HERE */}
              <p><strong>Business License No.:</strong> {getValue(dataAsAny.businessLicenseNo)}</p> {/* FIX APPLIED HERE */}
            </div>
          </div>
        )}
      </div>

      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">2. Minibus Purchase Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <p><strong>Preferred Vehicle Type:</strong> {getValue(data.preferredVehicleType)}</p>
          <p><strong>Quantity Requested:</strong> {getValue(data.vehicleQuantity)}</p>
          <p><strong>Intended Use:</strong> {getValue(data.intendedUse)}</p>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500 text-center">
        This is an automatically generated summary of your application.
      </div>
    </div>
  );
};