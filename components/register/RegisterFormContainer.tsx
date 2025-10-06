// src/components/register/RegisterFormContainer.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as z from 'zod';
import { toast } from 'sonner';

// Define the schema for the entire registration process.
// This schema MUST match the one used in your API route (api/register/route.ts)
// and consistent across all form components (Step1Form, Step2Form).
export const fullRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full Name is required and must be at least 2 characters."),
  fatherName: z.string().min(2, "Father's Name is required and must be at least 2 characters."),
  grandfatherName: z.string().nullable().optional(),

  applicantAssociationName: z.string().nullable().optional(),
  membershipNumber: z.string().nullable().optional(),

  isBusiness: z.boolean().default(false).optional(),
  tin: z.string().nullable().optional(),
  businessLicenseNo: z.string().nullable().optional(),

  region: z.string().min(1, "Region is required."),
  city: z.string().min(2, "City/Sub-City is required."),
  woredaKebele: z.string().min(2, "Woreda / Kebele is required."),
  primaryPhoneNumber: z.string().regex(/^\+?([0-9]{9,15})$/, "Invalid phone number format. E.g., +251912345678 or 0912345678").min(1, "Primary Phone Number is required."),
  alternativePhoneNumber: z.string().regex(/^\+?([0-9]{9,15})$/, "Invalid phone number format.").nullable().optional(),
  emailAddress: z.string().email("Invalid email address.").nullable().optional(), // Made optional and nullable

  preferredVehicleType: z.string().min(1, "Preferred Vehicle Type/Model is required."),
  vehicleQuantity: z.number().int().min(1, "Quantity must be at least 1.").max(20, "Quantity cannot exceed 20."),
  intendedUse: z.string().min(1, "Intended Use is required."),
  
  digitalSignatureUrl: z.string().min(1, "Digital signature is required."),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions."),
}).superRefine((data, ctx) => {
  if (data.isBusiness) {
    if (!data.businessLicenseNo || data.businessLicenseNo.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Business License No. is required if you are registering as a business.",
        path: ["businessLicenseNo"],
      });
    }
  }
});

export type RegistrationFormData = z.infer<typeof fullRegistrationSchema>;

interface RegistrationContextType {
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
  isPrintReady: () => boolean;
  resetForm: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const initialFormData: RegistrationFormData = {
  fullName: "",
  fatherName: "",
  grandfatherName: null,
  applicantAssociationName: null,
  membershipNumber: null,
  isBusiness: false,
  tin: null,
  businessLicenseNo: null,
  region: "",
  city: "",
  woredaKebele: "",
  primaryPhoneNumber: "",
  alternativePhoneNumber: null,
  emailAddress: null, // Initialized to null
  preferredVehicleType: "",
  vehicleQuantity: 1,
  intendedUse: "",
  digitalSignatureUrl: "",
  agreedToTerms: false,
};

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('registrationFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          const dataToValidate = {
            ...parsedData,
            isBusiness: parsedData.isBusiness ?? false,
            agreedToTerms: parsedData.agreedToTerms ?? false,
            vehicleQuantity: parsedData.vehicleQuantity ? Number(parsedData.vehicleQuantity) : 1,

            entityName: undefined,
            enableGpsTracking: undefined,
            acceptEpayment: undefined,

            grandfatherName: parsedData.grandfatherName === '' ? null : parsedData.grandfatherName,
            applicantAssociationName: parsedData.applicantAssociationName === '' ? null : parsedData.applicantAssociationName,
            membershipNumber: parsedData.membershipNumber === '' ? null : parsedData.membershipNumber,
            tin: parsedData.tin === '' ? null : parsedData.tin,
            businessLicenseNo: parsedData.businessLicenseNo === '' ? null : parsedData.businessLicenseNo,
            alternativePhoneNumber: parsedData.alternativePhoneNumber === '' ? null : parsedData.alternativePhoneNumber,
            emailAddress: parsedData.emailAddress === '' ? null : parsedData.emailAddress, // Ensure null for empty string
          };

          fullRegistrationSchema.parse(dataToValidate);
          console.log("Loaded valid registration data from localStorage:", dataToValidate);
          return dataToValidate as RegistrationFormData;
        } catch (error) {
          console.error("Failed to parse or validate localStorage data. Clearing invalid data:", error);
          localStorage.removeItem('registrationFormData');
        }
      }
    }
    return initialFormData;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const dataToSave = fullRegistrationSchema.parse(formData);
        localStorage.setItem('registrationFormData', JSON.stringify(dataToSave));
      } catch (error) {
        console.warn("Attempted to save invalid form data to localStorage. Skipping save.", error);
      }
    }
  }, [formData]);

  const isPrintReady = () => {
    try {
      fullRegistrationSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("isPrintReady validation failed:", error.errors);
        const missingPaths = error.errors.map(err => {
            switch(err.path.join('.')) {
                case 'fullName': return 'Full Name';
                case 'fatherName': return 'Father\'s Name';
                case 'region': return 'Region';
                case 'city': return 'City/Sub-City';
                case 'woredaKebele': return 'Woreda/Kebele';
                case 'primaryPhoneNumber': return 'Primary Phone Number';
                case 'preferredVehicleType': return 'Preferred Vehicle Type';
                case 'vehicleQuantity': return 'Vehicle Quantity';
                case 'intendedUse': return 'Intended Use';
                case 'digitalSignatureUrl': return 'Digital Signature';
                case 'agreedToTerms': return 'Terms and Conditions agreement';
                case 'businessLicenseNo': return 'Business License Number';
                case 'tin': return 'TIN';
                case 'alternativePhoneNumber': return 'Alternative Phone Number';
                case 'grandfatherName': return 'Grandfather\'s Name';
                case 'applicantAssociationName': return 'Association Name';
                case 'membershipNumber': return 'Membership Number';
                default: return err.path.join('.');
            }
        }).join(', ');
        toast.warning("Missing/Invalid Information", {
          description: `Please ensure all *required* fields are filled. Missing/Invalid: ${missingPaths}.`,
          duration: 7000,
          richColors: true
        });
      } else {
        toast.error("Validation Error", {
          description: "An unexpected error occurred during validation.",
        });
      }
      return false;
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('registrationFormData');
    }
  };

  return (
    <RegistrationContext.Provider value={{ formData, setFormData, isPrintReady, resetForm }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}