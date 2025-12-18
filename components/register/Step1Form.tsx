'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegistration } from "./RegisterFormContainer";
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  Building,
  CheckCircle,
  Circle,
  HardHat,
  CarTaxiFront,
  Handshake
} from 'lucide-react';

// --- NEW: Define the Prop Types for OnboardingStep ---
interface OnboardingStepProps {
  icon: React.ReactNode; 
  title: string;
  description: string;
  isActive: boolean;
}

// --- Sidebar Onboarding Step Component (FIXED) ---
function OnboardingStep({ icon, title, description, isActive }: OnboardingStepProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1">
        <h3 className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{title}</h3>
        <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>{description}</p>
      </div>
    </div>
  );
}

// --- Wizard Progress Bar Component ---
function WizardProgress({ activeStep, isLargeDevice }: { activeStep: number, isLargeDevice: boolean }) {
  const steps = [
    { name: "Personal & Business Details", icon: <User className="w-4 h-4" /> },
    { name: "Minibus & Service Details", icon: <CarTaxiFront className="w-4 h-4" /> },
  ];

  return (
    <div className={`flex items-center ${isLargeDevice ? 'w-full' : 'w-full max-w-sm mx-auto'}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${index < activeStep ? 'bg-green-600' : 'bg-gray-200'}`}>
            <span className={`text-sm font-bold ${index < activeStep ? 'text-white' : 'text-gray-600'}`}>{index + 1}</span>
          </div>
          <span className={`text-sm ml-2 ${isLargeDevice ? '' : 'hidden lg:inline'} ${index < activeStep ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
            {step.name}
          </span>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${index < activeStep ? 'bg-green-600' : 'bg-gray-300'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Main Form Component ---
export function Step1Form() {
  const { formData, setFormData } = useRegistration();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t, locale } = useTranslation();
  const [isLargeDevice, setIsLargeDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeDevice(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Validation Schema (moved inside the component to use `t`) ---
  const step1FormSchema = useMemo(() => z.object({
    fullName: z.string().min(2, t("step1.validation.fullNameRequired")),
    fatherName: z.string().min(2, t("step1.validation.fatherNameRequired")),
    grandfatherName: z.string().nullable().optional(),
    applicantAssociationName: z.string().nullable().optional(),
    membershipNumber: z.string().nullable().optional(),
    isBusiness: z.boolean().default(false).optional(),
    tin: z.string().nullable().optional(),
    businessLicenseNo: z.string().nullable().optional(),
    region: z.string().min(1, t("step1.validation.regionRequired")),
    city: z.string().min(2, t("step1.validation.cityRequired")),
    woredaKebele: z.string().min(2, t("step1.validation.woredaKebeleRequired")),
    primaryPhoneNumber: z.string().regex(/^\+?([0-9]{9,15})$/, t("step1.validation.invalidPhoneNumber")).min(1, t("step1.validation.primaryPhoneRequired")),
    alternativePhoneNumber: z.string().regex(/^\+?([0-9]{9,15})$/, t("step1.validation.invalidPhoneNumber")).nullable().optional(),
    emailAddress: z.string().email(t("step1.validation.invalidEmail")).nullable().optional(),
  }).superRefine((data, ctx) => {
    if (data.isBusiness && (!data.businessLicenseNo || data.businessLicenseNo.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("step1.validation.businessLicenseRequired"),
        path: ["businessLicenseNo"],
      });
    }
    if (!data.primaryPhoneNumber && (!data.emailAddress || data.emailAddress.trim() === '')) {
      const message = t("step1.validation.phoneOrEmailRequired");
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["primaryPhoneNumber"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["emailAddress"],
      });
    }
  }), [t]);

  const form = useForm<z.infer<typeof step1FormSchema>>({
    resolver: zodResolver(step1FormSchema),
    defaultValues: {
      fullName: formData.fullName ?? "",
      fatherName: formData.fatherName ?? "",
      grandfatherName: formData.grandfatherName ?? null,
      applicantAssociationName: formData.applicantAssociationName ?? null,
      membershipNumber: formData.membershipNumber ?? null,
      isBusiness: formData.isBusiness ?? false,
      tin: formData.tin ?? null,
      businessLicenseNo: formData.businessLicenseNo ?? null,
      region: formData.region ?? "",
      city: formData.city ?? "",
      woredaKebele: formData.woredaKebele ?? "",
      primaryPhoneNumber: formData.primaryPhoneNumber ?? "",
      alternativePhoneNumber: formData.alternativePhoneNumber ?? null,
      emailAddress: formData.emailAddress ?? null,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: z.infer<typeof step1FormSchema>) => {
    setIsLoading(true);

    try {
      let isUnique = true;
      let duplicateField = "";
      let duplicateMessage = "";

      const queryParams = new URLSearchParams();
      const hasPrimaryPhone = values.primaryPhoneNumber?.trim() !== '';
      const hasEmail = values.emailAddress?.trim() !== '';

      if (hasPrimaryPhone) queryParams.append('primaryPhoneNumber', values.primaryPhoneNumber);

      // FIX: Use non-null assertion (!) because 'hasEmail' check ensures it is not null/undefined/empty string.
      if (hasEmail) queryParams.append('emailAddress', values.emailAddress!); 

      if (hasPrimaryPhone || hasEmail) {
        const response = await fetch(`/api/check-uniqueness?${queryParams.toString()}`);
        const data = await response.json();
        if (!response.ok || !data.isUnique) {
          isUnique = false;
          duplicateField = data.duplicateField || "field";
          duplicateMessage = data.message || t("step1.duplicateEntry");
        }
      }

      if (!isUnique) {
        toast.error(t("step1.duplicateEntry"), {
          description: duplicateMessage,
          duration: 7000,
          richColors: true
        });

        if (duplicateField === 'primaryPhoneNumber') {
          form.setError('primaryPhoneNumber', { type: 'manual', message: duplicateMessage });
        } else if (duplicateField === 'emailAddress') {
          form.setError('emailAddress', { type: 'manual', message: duplicateMessage });
        }
        setIsLoading(false);
        return;
      }

      const dataToSave = { ...values };
      if (!dataToSave.isBusiness) {
        dataToSave.tin = null;
        dataToSave.businessLicenseNo = null;
      }
      dataToSave.grandfatherName ||= null;
      dataToSave.applicantAssociationName ||= null;
      dataToSave.membershipNumber ||= null;
      dataToSave.alternativePhoneNumber ||= null;
      dataToSave.emailAddress ||= null;

      setFormData(prev => ({ ...prev, ...dataToSave }));
      router.push(`/${locale}/register/step2`);
    } catch (error) {
      console.error("Error during uniqueness check:", error);
      toast.error(t("step1.networkError"), {
        description: "An error occurred. Please try again.",
        duration: 7000,
        richColors: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isBusiness = form.watch("isBusiness");

  const regions = [
    t("step1.regionAddisAbaba"),
    t("step1.regionAfar"),
    t("step1.regionAmhara"),
    t("step1.regionBenishangulGumuz"),
    t("step1.regionGambela"),
    t("step1.regionHarari"),
    t("step1.regionOromia"),
    t("step1.regionSidama"),
    t("step1.regionSomali"),
    t("step1.regionSWEPR"),
    t("step1.regionTigray"),
    t("step1.regionCentralEthiopia"),
    t("step1.regionSouthernEthiopia"),
    t("step1.regionDireDawa")
  ];
  
  const associationNames = [
    t("step1.assocTsehay"),
    t("step1.assocZebra"),
    t("step1.assocAdissHywet"),
    t("step1.assocNser"),
    t("step1.assocBelen"),
    t("step1.assocMetebaber"),
     t("step1.assocBelechta"),
    t("step1.assocWalta"),
    t("step1.assocgohe"),
     t("step1.assocberhutesfa"),
    t("step1.assocselamta"),
    t("step1.assocfeker"),
    t("step1.assocTla"),
    t("step1.assocOther")
  ];

  return ( 
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar for Large Devices */}
      {isLargeDevice && (
        <aside className="w-1/3 p-13 bg-gray-50 border-r border-gray-100 flex flex-col justify-between">
          <div>
            <div className="mt-8 mb-8"> {/* Added mt-8 to push the content down */}
              <h1 className="text-3xl font-bold text-gray-900 mb-5">Welcome to <span className="text-blue-600"> Multiverse Minibus & Truck Registration</span>!</h1>
              <h2 className="text-xl text-gray-600 mb-8">Let&apos;s get you registered quickly and easily!</h2>
            </div>
            <div className="space-y-6">
              <OnboardingStep
                icon={<CheckCircle className="text-green-500 w-6 h-6" />}
                title="Personal & Business Details"
                description="Your details help us verify your identity and business information."
                isActive={true}
              />
              <OnboardingStep
                icon={<Circle className="text-gray-400 w-6 h-6" />}
                title="Minibus, Truck & Service Details"
                description="Provide your minibus ,truck information to get started with our service."
                isActive={false}
              />
              <OnboardingStep
                icon={<Circle className="text-gray-400 w-6 h-6" />}
                title="Review & Confirm"
                description="Review all the information you have provided before submitting your application."
                isActive={false}
              />
            </div>
          </div>
          <div className="mt-auto space-y-4 text-gray-600 text-sm">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-900 transition-colors">
              <Handshake className="h-5 w-5 text-gray-400" />
              <span>Contact Support</span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-900 transition-colors">
              <HardHat className="h-5 w-5 text-gray-400" />
              <span>Help Center</span>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Wizard Progress Bar */}
        <div className="w-full flex justify-center mb-8 pt-4 lg:pt-16 lg:pl-16">
          <WizardProgress activeStep={1} isLargeDevice={isLargeDevice} />
        </div>
        
        <div className="w-full pb-42 max-w-40xl mx-auto p-10 md:p-16 sm:p-30 lg:p-18">
          <h2 className="text-1xl font-bold text-gray-900 mb-2 flex items-center gap-2 md:justify-start justify-center">
            <User className="h-8 w-8 text-green-600" />
            <span>
              {t("step1.title")}  
              <span className="block text-base font-normal text-gray-600 mt-1">
                {t("step1.subTitle")}
              </span>
            </span>
          </h2>

          <p className="text-sm text-gray-500 mb-8 border-b pb-4 text-center md:text-left leading-relaxed">
            {t("step1.fill_out_form_description")}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Section: Personal Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  <User className="inline-block mr-2 h-5 w-5 text-blue-600" />
                  {t("step1.personalDetails")}
                </h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.firstName")} <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input placeholder="Solomon" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.fathersName")} <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input placeholder="Abebe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grandfatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.grandfathersNameOptional")}</FormLabel>
                        <FormControl><Input placeholder="Kebede" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              {/* Section: Contact Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  <Phone className="inline-block mr-2 h-5 w-5 text-blue-600" />
                  {t("step1.contactDetails")}
                </h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="primaryPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.primaryPhoneNumber")} <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input type="tel" placeholder="+251912345678" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alternativePhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.alternativePhoneNumberOptional")}</FormLabel>
                        <FormControl><Input type="tel" placeholder="+2519xxxxxxxx" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t("step1.emailAddressOptional")}</FormLabel>
                        <FormControl><Input type="email" placeholder="email@example.com" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              {/* Section: Address */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  <MapPin className="inline-block mr-2 h-5 w-5 text-blue-600" />
                  {t("step1.addressDetails")}
                </h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.region")} <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder={t("step1.region")} /></SelectTrigger>
                            <SelectContent>
                              {regions.map((name) => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.citySubCity")} <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g., Bole" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="woredaKebele"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.woredaKebele")} <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g., Woreda 10" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              {/* Section: Cooperative & Business */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  <Briefcase className="inline-block mr-2 h-5 w-5 text-blue-600" />
                  {t("step1.cooperativeDetailsTitle")}
                </h3>
                <Separator />
                <p className="text-sm text-muted-foreground">{t("step1.cooperativeDetailsDescription")}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="applicantAssociationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.associationName")}</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                            <SelectTrigger><SelectValue placeholder={t("step1.associationName")} /></SelectTrigger>
                            <SelectContent>
                              {associationNames.map((name) => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="membershipNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("step1.membershipNumber")}</FormLabel>
                        <FormControl><Input placeholder="e.g., M00123" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <div className="pt-4 mt-8">
                  <FormField
                    control={form.control}
                    name="isBusiness"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 p-4 rounded-md bg-gray-50 border border-gray-200 shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) {
                                form.setValue('tin', null);
                                form.setValue('businessLicenseNo', null);
                                form.clearErrors(['tin', 'businessLicenseNo']);
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-base">
                            <Building className="inline-block mr-2 h-5 w-5 text-blue-600" />
                            {t("step1.registeringAsBusiness")}
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">{t("step1.businessEntityDescription")}</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                {isBusiness && (
                  <div className="space-y-4 border rounded-md p-6 bg-gray-50 shadow-sm transition-all duration-300 ease-in-out">
                    <h3 className="text-xl font-semibold text-gray-800">
                      <Building className="inline-block mr-2 h-5 w-5 text-blue-600" />
                      {t("step1.businessDetailsTitle")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <FormField
                        control={form.control}
                        name="tin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("step1.tinOptional")}</FormLabel>
                            <FormControl><Input placeholder="e.g., 123-456-789" {...field} value={field.value ?? ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="businessLicenseNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("step1.businessLicenseNo")} <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input placeholder="e.g., B-12345" {...field} value={field.value ?? ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? t("step1.checkingUniqueness") : t("step1.proceedToMinibusDetails")}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}