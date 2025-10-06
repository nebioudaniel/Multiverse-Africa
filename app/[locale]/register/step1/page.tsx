'use client';

import { Step1Form } from "@/components/register/Step1Form";

export default function RegisterStep1Page() {
  return (
    // This parent div now acts as a full-width container for the form,
    // allowing the form component itself to manage its internal spacing.
    // The min-h-screen class ensures it fills the viewport height.
        <div className="flex flex-col items-center justify-center min-h-screen">
      <Step1Form />
    </div>
  );
}