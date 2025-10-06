"use client";

import { Step2Form } from "@/components/register/Step2Form";
import { useRegistration } from "@/components/register/RegisterFormContainer";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterStep2Page() {
  const { formData } = useRegistration();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only check once (prevents infinite redirects)
    if (checked) return;

    const isStep1DataMissing =
      !formData.fullName || formData.fullName.trim() === "" ||
      !formData.primaryPhoneNumber || formData.primaryPhoneNumber.trim() === "";

    if (isStep1DataMissing) {
      console.warn("Step1 data missing → redirecting to step1");
      router.replace(`/${locale}/register/step1`);
    }

    setChecked(true);
  }, [formData, router, locale, checked]);

  // Render nothing briefly until check runs
  if (!checked) {
    return null;
  }

  // Changed the container to allow the full-page layout of Step2Form to render properly
  return (
    <div className="w-full"> 
      <Step2Form />
    </div>
  );
}