// app/admin/applications/[id]/edit/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeftCircle,
  Save,
  Loader2,
  AlertCircle,
  User,
  Building,
  Briefcase,
  Car,
  Banknote,
  UploadCloud,
  FileText,
  Gavel,
  Users,
  Edit,
  Trash2,
  Paperclip,
  XCircle,
  CheckCircle,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CustomLoader from "@/components/ui/custom-loader";
import { cn } from "@/lib/utils";

import { z } from "zod";

const formSchema = z.object({
  userId: z.string().min(1, { message: "Applicant ID is missing." }),
  fullName: z.string().nullish(),
  fatherName: z.string().nullish(),
  grandfatherName: z.string().nullish(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  idNumber: z.string().nullish(),
  primaryPhoneNumber: z.string().nullish(),
  emailAddress: z.string().email("Invalid email address").nullish(),
  alternativePhoneNumber: z.string().nullish(),
  residentialAddress: z.string().nullish(),
  region: z.string().nullish(),
  city: z.string().nullish(),
  woredaKebele: z.string().nullish(),
  houseNumber: z.string().nullish(),
  isBusiness: z.boolean().optional(),
  entityName: z.string().nullish(),
  tin: z.string().nullish(),
  businessLicenseNo: z.string().nullish(),
  associationName: z.string().nullish(),
  membershipNumber: z.string().nullish(),
  preferredVehicleType: z.enum(["Diesel_Minibus", "Electric_Minibus", "Electric_Mid_Bus_21_1", "Traditional_Minibus"]).optional(),
  vehicleQuantity: z.coerce.number()
    .min(0, { message: "Quantity cannot be negative." })
    .max(100, { message: "Quantity cannot exceed 100." })
    .optional(),
  intendedUse: z.string().nullish(),
  driverFullName: z.string().nullish(),
  driverLicenseNo: z.string().nullish(),
  licenseCategory: z.enum(["A", "B", "C", "D"]).optional(),
  enableGpsTracking: z.boolean().optional(),
  acceptEpayment: z.boolean().optional(),
  digitalSignatureUrl: z.string().nullish(),
  agreedToTerms: z.boolean().optional(),
  preferredFinancingInstitution: z.string().nullish(),
  loanAmountRequested: z.coerce.number()
    .min(0, { message: "Loan amount cannot be negative." })
    .optional(),
  loanApplicationStatus: z.enum(["Pending", "Approved", "Disbursed", "Denied"]).optional(),
  bankReferenceNumber: z.string().nullish(),
  downPaymentProofUrl: z.string().nullish(),
  idScanUrl: z.string().nullish(),
  tinNumberUrl: z.string().nullish(),
  supportingLettersUrl: z.string().nullish(),
  applicationStatus: z.enum(["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"]).optional(),
  remarks: z.string().nullish(),
  assignedToId: z.string().nullish(),
  processedById: z.string().nullish(),
});

type FormData = z.infer<typeof formSchema>;

interface ApplicationData {
  id: string;
  applicantId: string;
  fullName: string;
  fatherName: string | null;
  grandfatherName: string | null;
  gender: string | null;
  idNumber: string | null;
  primaryPhoneNumber: string;
  emailAddress: string | null;
  alternativePhoneNumber: string | null;
  residentialAddress: string | null;
  region: string | null;
  city: string | null;
  woredaKebele: string | null;
  houseNumber: string | null;
  isBusiness: boolean;
  entityName: string | null;
  tin: string | null;
  businessLicenseNo: string | null;
  associationName: string | null;
  membershipNumber: string | null;
  preferredVehicleType: string | null;
  vehicleQuantity: number | null;
  intendedUse: string | null;
  driverFullName: string | null;
  driverLicenseNo: string | null;
  licenseCategory: "A" | "B" | "C" | "D" | null;
  enableGpsTracking: boolean | null;
  acceptEpayment: boolean | null;
  digitalSignatureUrl: string | null;
  agreedToTerms: boolean | null;
  preferredFinancingInstitution: string | null;
  loanAmountRequested: number | null;
  loanApplicationStatus: "Pending" | "Approved" | "Disbursed" | "Denied" | null;
  bankReferenceNumber: string | null;
  downPaymentProofUrl: string | null;
  idScanUrl: string | null;
  tinNumberUrl: string | null;
  supportingLettersUrl: string | null;
  applicationStatus: "NEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | null;
  remarks: string | null;
  assignedToId: string | null;
  processedById: string | null;
  createdAt: string;
  updatedAt: string;
  registeredBy?: { fullName: string } | null;
  assignedTo?: { fullName: string } | null;
  processedBy?: { fullName: string } | null;
}

interface UserOption {
  id: string;
  fullName: string;
}

export default function EditApplicationPage() {
  const { id: applicationId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<UserOption[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<{
    downPaymentProof?: File | null;
    idScan?: File | null;
    tinNumber?: File | null;
    supportingLetters?: File | null;
  }>({});

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      applicantFullName  : "",
      fatherName: "",
      grandfatherName: "",
      gender: undefined,
      idNumber: "",
      primaryPhoneNumber: "",
      emailAddress: "",
      alternativePhoneNumber: "",
      residentialAddress: "",
      region: "",
      city: "",
      woredaKebele: "",
      houseNumber: "",
      isBusiness: false,
      entityName: "",
      tin: "",
      businessLicenseNo: "",
      associationName: "",
      membershipNumber: "",
      preferredVehicleType: undefined,
      vehicleQuantity: 0,
      intendedUse: "",
      driverFullName: "",
      driverLicenseNo: "",
      licenseCategory: undefined,
      enableGpsTracking: false,
      acceptEpayment: false,
      digitalSignatureUrl: "",
      agreedToTerms: false,
      preferredFinancingInstitution: "",
      loanAmountRequested: 0,
      loanApplicationStatus: undefined,
      bankReferenceNumber: "",
      downPaymentProofUrl: "",
      idScanUrl: "",
      tinNumberUrl: "",
      supportingLettersUrl: "",
      applicationStatus: undefined,
      remarks: "",
      assignedToId: undefined,
      processedById: undefined,
    },
  });

  const isMainAdmin = session?.user?.role === "MAIN_ADMIN";

  const handleFileChange = useCallback((fieldName: keyof typeof selectedFiles, file: File | null) => {
    setSelectedFiles(prev => ({ ...prev, [fieldName]: file }));
    // Clear validation errors for the URL field when a new file is selected
    if (file) form.clearErrors(`${fieldName}Url` as keyof FormData);
  }, [form]);

  const handleDeleteUrl = useCallback((urlFieldName: keyof FormData) => {
    form.setValue(urlFieldName, null, { shouldDirty: true });
    toast.info(`Existing ${urlFieldName.replace('Url', '').replace(/([A-Z])/g, ' $1').toLowerCase()} marked for removal.`);
  }, [form]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/admin/login");
      return;
    }

    const authorizedRoles = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];
    if (!session.user.role || !authorizedRoles.includes(session.user.role)) {
      toast.error("Access Denied", { description: "You do not have permission to edit applications." });
      router.push("/admin/dashboard");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const appRes = await fetch(`/api/admin/applications/${applicationId}`);
        if (!appRes.ok) throw new Error((await appRes.json()).message || "Failed to fetch application data.");
        const appData: ApplicationData = await appRes.json();

        // Fetch admin users only if the current user is a MAIN_ADMIN
        if (isMainAdmin) {
          const usersRes = await fetch('/api/admin/users?role=MAIN_ADMIN,REGISTRAR_ADMIN');
          if (usersRes.ok) setAdminUsers((await usersRes.json()).data || []);
          else console.warn("Failed to fetch admin users for assignment.");
        }

        // --- All data of the chosen user is set here for editing ---
        form.reset({
          userId: appData.applicantId,
          applicantFullName : appData.fullName || "",
          fatherName: appData.fatherName || "",
          grandfatherName: appData.grandfatherName || "",
          gender: appData.gender as "Male" | "Female" | "Other" || undefined,
          idNumber: appData.idNumber || "",
          primaryPhoneNumber: appData.primaryPhoneNumber || "",
          emailAddress: appData.emailAddress || "",
          alternativePhoneNumber: appData.alternativePhoneNumber || "",
          residentialAddress: appData.residentialAddress || "",
          region: appData.region || "",
          city: appData.city || "",
          woredaKebele: appData.woredaKebele || "",
          houseNumber: appData.houseNumber || "",
          isBusiness: appData.isBusiness ?? false, // Ensure boolean default
          entityName: appData.entityName || "",
          tin: appData.tin || "",
          businessLicenseNo: appData.businessLicenseNo || "",
          associationName: appData.associationName || "",
          membershipNumber: appData.membershipNumber || "",
          preferredVehicleType: appData.preferredVehicleType as "Diesel_Minibus" | "Electric_Minibus" | "Electric_Mid_Bus_21_1" | "Traditional_Minibus" || undefined,
          vehicleQuantity: appData.vehicleQuantity ?? 0, // Ensure number default
          intendedUse: appData.intendedUse || "",
          driverFullName: appData.driverFullName || "",
          driverLicenseNo: appData.driverLicenseNo || "",
          licenseCategory: appData.licenseCategory as "A" | "B" | "C" | "D" || undefined,
          enableGpsTracking: appData.enableGpsTracking ?? false, // Ensure boolean default
          acceptEpayment: appData.acceptEpayment ?? false, // Ensure boolean default
          digitalSignatureUrl: appData.digitalSignatureUrl || "",
          agreedToTerms: appData.agreedToTerms ?? false, // Ensure boolean default
          preferredFinancingInstitution: appData.preferredFinancingInstitution || "",
          loanAmountRequested: appData.loanAmountRequested ?? 0, // Ensure number default
          loanApplicationStatus: appData.loanApplicationStatus as "Pending" | "Approved" | "Disbursed" | "Denied" || undefined,
          bankReferenceNumber: appData.bankReferenceNumber || "",
          downPaymentProofUrl: appData.downPaymentProofUrl || "",
          idScanUrl: appData.idScanUrl || "",
          tinNumberUrl: appData.tinNumberUrl || "",
          supportingLettersUrl: appData.supportingLettersUrl || "",
          applicationStatus: appData.applicationStatus as "NEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" || undefined,
          remarks: appData.remarks || "",
          assignedToId: appData.assignedToId || undefined, // undefined for Select placeholder
          processedById: appData.processedById || undefined, // undefined for Select placeholder
        });
      } catch (err: any) {
        setError(err.message);
        toast.error("Error loading application", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    if (applicationId) fetchData();
  }, [applicationId, session, status, router, form, isMainAdmin]);

  const FileUploaderField = ({
    label,
    urlFieldName,
    fileStateKey,
  }: {
    label: string;
    urlFieldName: keyof FormData;
    fileStateKey: keyof typeof selectedFiles;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUrl = form.watch(urlFieldName) as string | null | undefined;
    const file = selectedFiles[fileStateKey];
    const isFileSelected = !!file;
    const isUrlPresent = !!currentUrl;
    const displayedFileName = isFileSelected ? file.name : (isUrlPresent ? currentUrl.split('/').pop() : "No file selected");

    const handleClearSelectedFile = () => {
      handleFileChange(fileStateKey, null);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Clear the input visually
    };

    const handleFileInputClick = () => fileInputRef.current?.click();

    return (
      <div className="space-y-2">
        <Label htmlFor={String(urlFieldName)}>{label}</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <input
              id={String(urlFieldName)}
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileChange(fileStateKey, e.target.files?.[0] || null)}
            />
            <Button type="button" onClick={handleFileInputClick} variant="outline" className="flex-shrink-0">
              <Upload className="mr-2 h-4 w-4" /> {isFileSelected ? "Change File" : "Choose File"}
            </Button>
            <span className={cn(
              "flex-1 text-sm truncate",
              isFileSelected ? "text-blue-600" : (isUrlPresent ? "text-gray-700" : "text-gray-500 italic")
            )}>
              {isFileSelected && <CheckCircle className="inline-block h-4 w-4 mr-1 text-green-500" />}
              {displayedFileName}
            </span>
            {isFileSelected ? (
              <Button type="button" variant="ghost" size="sm" onClick={handleClearSelectedFile} className="ml-2" title="Clear selected file">
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            ) : isUrlPresent ? (
              <>
                <a href={currentUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0" title="View uploaded document">
                  <Paperclip className="h-4 w-4" />
                </a>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteUrl(urlFieldName)} className="ml-2 flex-shrink-0" title="Delete existing document">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : null}
          </div>
          {/* Display validation error for the URL field */}
          {form.formState.errors[urlFieldName] && <p className="text-sm text-red-500">{(form.formState.errors[urlFieldName] as any)?.message}</p>}
        </div>
      </div>
    );
  };

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    setError(null);

    const payload: Partial<FormData> = { ...data };

    // Handle file uploads (mocking for now)
    for (const key of Object.keys(selectedFiles) as (keyof typeof selectedFiles)[]) {
      const file = selectedFiles[key];
      const urlFieldName = `${key}Url` as keyof FormData;
      if (file) {
        toast.info(`Uploading ${file.name}...`);
        // Simulate upload delay
        const mockUploadSuccess = await new Promise(resolve => setTimeout(() => resolve(true), 1500));
        if (mockUploadSuccess) {
          // Replace with actual upload logic and get the real URL
          const mockUrl = `https://example.com/uploads/${file.name.replace(/\s/g, '_')}_${Date.now()}`;
          payload[urlFieldName] = mockUrl as any; // Cast to any to satisfy type checker for string | null
          toast.success(`${file.name} uploaded successfully!`);
        } else {
          toast.error(`Failed to upload ${file.name}. Please try again.`);
          setIsSaving(false);
          return; // Stop submission if upload fails
        }
      }
    }

    // Handle deletion of existing URLs if no new file is selected and URL is cleared
    const urlFields: (keyof FormData)[] = ['downPaymentProofUrl', 'idScanUrl', 'tinNumberUrl', 'supportingLettersUrl'];
    for (const urlField of urlFields) {
      const initialUrl = form.formState.defaultValues?.[urlField];
      const currentUrl = form.watch(urlField);
      const fileStateKey = urlField.replace('Url', '') as keyof typeof selectedFiles;

      // If there was an initial URL and it's now null/undefined AND no new file was selected
      if (initialUrl && (!currentUrl || currentUrl === '') && !selectedFiles[fileStateKey]) {
        toast.info(`Deleting existing file for ${urlField.replace('Url', '').replace(/([A-Z])/g, ' $1').toLowerCase()}...`);
        // Simulate deletion delay
        const mockDeleteSuccess = await new Promise(resolve => setTimeout(() => resolve(true), 500));
        if (mockDeleteSuccess) {
          // In a real scenario, you'd send an API call to delete the file from your storage
          toast.success(`Existing file for ${urlField.replace('Url', '').replace(/([A-Z])/g, ' $1').toLowerCase()} deleted.`);
        } else {
          toast.error(`Failed to delete existing file for ${urlField.replace('Url', '').replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
          // Decide whether to halt submission here or proceed. For now, we'll proceed.
        }
      }
    }

    // Set business-related fields to null if isBusiness is false
    if (!payload.isBusiness) {
      payload.entityName = null;
      payload.tin = null;
      payload.businessLicenseNo = null;
    }

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update application.");
      }

      toast.success("Application updated successfully!");
      router.push(`/admin/applications/${applicationId}/view`);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to update application", { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          <Edit className="inline-block mr-3 text-blue-600" />
          Edit Application: {applicationId?.substring(0, 8)}...
        </h1>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => router.push("/admin/applications")}>
            <ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to List
          </Button>
        </div>
      </div>

      {isLoading ? (
        <CustomLoader message="Loading application for edit..." emoji="✍️" />
      ) : error ? (
        <div className="min-h-screen p-6 text-center text-red-600 bg-gray-50">
          <h2 className="text-xl font-semibold">Error Loading Application</h2>
          <p>{error}</p>
          <Button onClick={() => router.push("/admin/applications")} className="mt-4">
            <ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to Applications List
          </Button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> Applicant Personal Information
              </CardTitle>
              <CardDescription>Update the applicant&apos;s personal details.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...form.register("fullName")} />
                {form.formState.errors.fullName && <p className="text-sm text-red-500">{form.formState.errors.applicantFullName  .message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father&apos;s Name</Label>
                <Input id="fatherName" {...form.register("fatherName")} />
                {form.formState.errors.fatherName && <p className="text-sm text-red-500">{form.formState.errors.fatherName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="grandfatherName">Grandfather&apos;s Name</Label>
                <Input id="grandfatherName" {...form.register("grandfatherName")} />
                {form.formState.errors.grandfatherName && <p className="text-sm text-red-500">{form.formState.errors.grandfatherName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) => form.setValue("gender", value as "Male" | "Female" | "Other")}
                  value={form.watch("gender") || ""} // Ensure controlled component
                >
                  <SelectTrigger id="gender"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input id="idNumber" {...form.register("idNumber")} />
                {form.formState.errors.idNumber && <p className="text-sm text-red-500">{form.formState.errors.idNumber.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryPhoneNumber">Primary Phone Number</Label>
                <Input id="primaryPhoneNumber" {...form.register("primaryPhoneNumber")} />
                {form.formState.errors.primaryPhoneNumber && <p className="text-sm text-red-500">{form.formState.errors.primaryPhoneNumber.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternativePhoneNumber">Alternative Phone Number</Label>
                <Input id="alternativePhoneNumber" {...form.register("alternativePhoneNumber")} />
                {form.formState.errors.alternativePhoneNumber && <p className="text-sm text-red-500">{form.formState.errors.alternativePhoneNumber.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input id="emailAddress" type="email" {...form.register("emailAddress")} />
                {form.formState.errors.emailAddress && <p className="text-sm text-red-500">{form.formState.errors.emailAddress.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> Residential Address
              </CardTitle>
              <CardDescription>Update the applicant&apos;s residential address details.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="residentialAddress">Residential Address</Label>
                <Input id="residentialAddress" {...form.register("residentialAddress")} />
                {form.formState.errors.residentialAddress && <p className="text-sm text-red-500">{form.formState.errors.residentialAddress.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" {...form.register("region")} />
                {form.formState.errors.region && <p className="text-sm text-red-500">{form.formState.errors.region.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City/Sub-city</Label>
                <Input id="city" {...form.register("city")} />
                {form.formState.errors.city && <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="woredaKebele">Woreda/Kebele</Label>
                <Input id="woredaKebele" {...form.register("woredaKebele")} />
                {form.formState.errors.woredaKebele && <p className="text-sm text-red-500">{form.formState.errors.woredaKebele.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="houseNumber">House Number</Label>
                <Input id="houseNumber" {...form.register("houseNumber")} />
                {form.formState.errors.houseNumber && <p className="text-sm text-red-500">{form.formState.errors.houseNumber.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" /> Business Information
              </CardTitle>
              <CardDescription>Update business details if the applicant is a business entity.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2 col-span-full">
                <Checkbox
                  id="isBusiness"
                  checked={form.watch("isBusiness") || false}
                  onCheckedChange={(checked) => form.setValue("isBusiness", !!checked)}
                />
                <Label htmlFor="isBusiness">Is this a business entity?</Label>
              </div>
              {(form.watch("isBusiness") || false) && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="entityName">Business Entity Name</Label>
                    <Input id="entityName" {...form.register("entityName")} />
                    {form.formState.errors.entityName && <p className="text-sm text-red-500">{form.formState.errors.entityName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tin">TIN</Label>
                    <Input id="tin" {...form.register("tin")} />
                    {form.formState.errors.tin && <p className="text-sm text-red-500">{form.formState.errors.tin.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessLicenseNo">Business License No.</Label>
                    <Input id="businessLicenseNo" {...form.register("businessLicenseNo")} />
                    {form.formState.errors.businessLicenseNo && <p className="text-sm text-red-500">{form.formState.errors.businessLicenseNo.message}</p>}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-600" /> Cooperative/Association
              </CardTitle>
              <CardDescription>Details about the applicant&apos;s cooperative or association.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="associationName">Association Name</Label>
                <Input id="associationName" {...form.register("associationName")} />
                {form.formState.errors.associationName && <p className="text-sm text-red-500">{form.formState.errors.associationName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="membershipNumber">Membership Number</Label>
                <Input id="membershipNumber" {...form.register("membershipNumber")} />
                {form.formState.errors.membershipNumber && <p className="text-sm text-red-500">{form.formState.errors.membershipNumber.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" /> Driver Information
              </CardTitle>
              <CardDescription>Details of the primary driver.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="driverFullName">Driver&apos;s Full Name</Label>
                <Input id="driverFullName" {...form.register("driverFullName")} />
                {form.formState.errors.driverFullName && <p className="text-sm text-red-500">{form.formState.errors.driverFullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverLicenseNo">Driver&apos;s License No.</Label>
                <Input id="driverLicenseNo" {...form.register("driverLicenseNo")} />
                {form.formState.errors.driverLicenseNo && <p className="text-sm text-red-500">{form.formState.errors.driverLicenseNo.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseCategory">License Category</Label>
                <Select
                  onValueChange={(value) => form.setValue("licenseCategory", value as "A" | "B" | "C" | "D")}
                  value={form.watch("licenseCategory") || ""} // Ensure controlled component
                >
                  <SelectTrigger id="licenseCategory"><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.licenseCategory && <p className="text-sm text-red-500">{form.formState.errors.licenseCategory.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-700" /> Optional Preferences
              </CardTitle>
              <CardDescription>Additional service preferences.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableGpsTracking"
                  checked={form.watch("enableGpsTracking") ?? false} // Use ?? for booleans
                  onCheckedChange={(checked) => form.setValue("enableGpsTracking", !!checked)}
                />
                <Label htmlFor="enableGpsTracking">Enable GPS Tracking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptEpayment"
                  checked={form.watch("acceptEpayment") ?? false} // Use ?? for booleans
                  onCheckedChange={(checked) => form.setValue("acceptEpayment", !!checked)}
                />
                <Label htmlFor="acceptEpayment">Accept E-Payment</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-red-600" /> Vehicle Details
              </CardTitle>
              <CardDescription>Information about the vehicle requested by the applicant.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferredVehicleType">Vehicle Type</Label>
                <Select
                  onValueChange={(value) => form.setValue("preferredVehicleType", value as any)}
                  value={form.watch("preferredVehicleType") || ""} // Ensure controlled component
                >
                  <SelectTrigger id="preferredVehicleType"><SelectValue placeholder="Select Vehicle Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diesel_Minibus">Diesel Minibus</SelectItem>
                    <SelectItem value="Electric_Minibus">Electric Minibus</SelectItem>
                    <SelectItem value="Electric_Mid_Bus_21_1">Electric Mid Bus (21+1)</SelectItem>
                    <SelectItem value="Traditional_Minibus">Traditional Minibus</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.preferredVehicleType && <p className="text-sm text-red-500">{form.formState.errors.preferredVehicleType.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleQuantity">Quantity Requested</Label>
                <Input id="vehicleQuantity" type="number" {...form.register("vehicleQuantity", { valueAsNumber: true })} />
                {form.formState.errors.vehicleQuantity && <p className="text-sm text-red-500">{form.formState.errors.vehicleQuantity.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="intendedUse">Intended Use</Label>
                <Textarea id="intendedUse" {...form.register("intendedUse")} />
                {form.formState.errors.intendedUse && <p className="text-sm text-red-500">{form.formState.errors.intendedUse.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-green-600" /> Financing Information
              </CardTitle>
              <CardDescription>Details regarding the requested loan and financing.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferredFinancingInstitution">Preferred Financing Institution</Label>
                <Input id="preferredFinancingInstitution" {...form.register("preferredFinancingInstitution")} />
                {form.formState.errors.preferredFinancingInstitution && <p className="text-sm text-red-500">{form.formState.errors.preferredFinancingInstitution.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanAmountRequested">Loan Amount Requested (ETB)</Label>
                <Input id="loanAmountRequested" type="number" {...form.register("loanAmountRequested", { valueAsNumber: true })} />
                {form.formState.errors.loanAmountRequested && <p className="text-sm text-red-500">{form.formState.errors.loanAmountRequested.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankReferenceNumber">Bank Reference Number</Label>
                <Input id="bankReferenceNumber" {...form.register("bankReferenceNumber")} />
                {form.formState.errors.bankReferenceNumber && <p className="text-sm text-red-500">{form.formState.errors.bankReferenceNumber.message}</p>}
              </div>
              {isMainAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="loanApplicationStatus">Loan Application Status</Label>
                  <Select
                    onValueChange={(value) => form.setValue("loanApplicationStatus", value as any)}
                    value={form.watch("loanApplicationStatus") || ""} // Ensure controlled component
                  >
                    <SelectTrigger id="loanApplicationStatus"><SelectValue placeholder="Select Loan Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Disbursed">Disbursed</SelectItem>
                      <SelectItem value="Denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.loanApplicationStatus && <p className="text-sm text-red-500">{form.formState.errors.loanApplicationStatus.message}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-indigo-700" /> Legal & Signature
              </CardTitle>
              <CardDescription>Applicant&apos;s agreement and digital signature.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreedToTerms"
                  checked={form.watch("agreedToTerms") ?? false} // Use ?? for booleans
                  onCheckedChange={(checked) => form.setValue("agreedToTerms", !!checked)}
                />
                <Label htmlFor="agreedToTerms">Agreed to Terms & Conditions</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="digitalSignatureUrl">Digital Signature URL</Label>
                <Input id="digitalSignatureUrl" {...form.register("digitalSignatureUrl")} readOnly className="bg-gray-100" />
                {form.formState.errors.digitalSignatureUrl && <p className="text-sm text-red-500">{form.formState.errors.digitalSignatureUrl.message}</p>}
                {form.watch("digitalSignatureUrl") && (
                  <a href={form.watch("digitalSignatureUrl") || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm break-all">
                    <Paperclip className="h-4 w-4" /> View Signature
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-gray-600" /> Document Attachments
              </CardTitle>
              <CardDescription>Upload or manage supporting documents.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploaderField label="Down Payment Proof" urlFieldName="downPaymentProofUrl" fileStateKey="downPaymentProof" />
              <FileUploaderField label="ID Scan" urlFieldName="idScanUrl" fileStateKey="idScan" />
              <FileUploaderField label="TIN Number Document" urlFieldName="tinNumberUrl" fileStateKey="tinNumber" />
              <FileUploaderField label="Supporting Letters" urlFieldName="supportingLettersUrl" fileStateKey="supportingLetters" />
            </CardContent>
          </Card>

          {isMainAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" /> Application Management
                </CardTitle>
                <CardDescription>Update application status and assign personnel.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="applicationStatus">Application Status</Label>
                  <Select
                    onValueChange={(value) => form.setValue("applicationStatus", value as any)}
                    value={form.watch("applicationStatus") || ""} // Ensure controlled component
                  >
                    <SelectTrigger id="applicationStatus"><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">NEW</SelectItem>
                      <SelectItem value="UNDER_REVIEW">UNDER REVIEW</SelectItem>
                      <SelectItem value="APPROVED">APPROVED</SelectItem>
                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.applicationStatus && <p className="text-sm text-red-500">{form.formState.errors.applicationStatus.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedToId">Assigned To</Label>
                  <Select
                    onValueChange={(value) => form.setValue("assignedToId", value === "null-value" ? null : value)}
                    value={form.watch("assignedToId") || "null-value"} // Use a unique string for null/undefined SelectItem
                  >
                    <SelectTrigger id="assignedToId"><SelectValue placeholder="Select User" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null-value">Unassigned</SelectItem> {/* Non-empty value */}
                      {adminUsers.map((user) => <SelectItem key={user.id} value={user.id}>{user.fullName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.assignedToId && <p className="text-sm text-red-500">{form.formState.errors.assignedToId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processedById">Processed By (Last Updated)</Label>
                  <Select
                    onValueChange={(value) => form.setValue("processedById", value === "null-value" ? null : value)}
                    value={form.watch("processedById") || "null-value"} // Use a unique string for null/undefined SelectItem
                  >
                    <SelectTrigger id="processedById"><SelectValue placeholder="Select User" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null-value">N/A</SelectItem> {/* Non-empty value */}
                      {adminUsers.map((user) => <SelectItem key={user.id} value={user.id}>{user.fullName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.processedById && <p className="text-sm text-red-500">{form.formState.errors.processedById.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="remarks">Remarks/Notes</Label>
                  <Textarea id="remarks" {...form.register("remarks")} />
                  {form.formState.errors.remarks && <p className="text-sm text-red-500">{form.formState.errors.remarks.message}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push(`/admin/applications/${applicationId}/view`)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}