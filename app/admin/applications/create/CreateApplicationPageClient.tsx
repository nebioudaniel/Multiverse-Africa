"use client";

import React, { useEffect, useState, useCallback , useRef} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEdgeStore } from "@/lib/edgestore-client";

// UI/Component Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomLoader from "@/components/ui/custom-loader";
import {
  ArrowLeftCircle,
  PlusCircle,
  UploadCloud,
  Loader2,
  UserPlus,
  FileText,
  Car,
  CheckCircle,
  Building,
  Info,
  Banknote,
  Briefcase,
  UserRound,
  Target,
  Gavel,
  Truck,
  Signature,
  XCircle,
  Bus,
} from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { ComboboxSearch } from "@/components/ui/combobox-search";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ❌ REMOVED THE INVALID HOOK CALL FROM HERE
// const currentUrlRef = useRef<HTMLAnchorElement>(null); 
// ======================================================
// 1. CONSTANTS AND ZOD SCHEMA DEFINITIONS
// ======================================================
const ethiopianBanksAndMFIs = [
  "Commercial Bank of Ethiopia (CBE)", "Awash Bank", "Dashen Bank", "Bank of Abyssinia",
  "Nib International Bank", "United Bank", "Zemen Bank", "Cooperative Bank of Oromia (CBO)",
  "Enat Bank", "Hibret Bank", "Oromia Bank", "Debub Global Bank", "Addis International Bank",
  "Bunna Bank", "Siinqee Bank", "Global Bank Ethiopia", "Tsehay Bank", "Ahadu Bank",
  "Amhara Bank", "Hijra Bank (Interest-Free)", "ZamZam Bank (Interest-Free)",
  "Goh Betoch Bank (Mortgage Bank)",
  "Addis Credit and Saving Institution S.C. (AdCSI)", "Amhara Credit and Saving Institution S.C. (ACSI)",
  "Benishangul Gumuz Micro Finance Institution S.C.", "Busa Gonofa Microfinance Institution S.C.",
  "Debob Gojjam Microfinance Institution S.C.", "Dire Dawa Micro Finance Institution S.C.",
  "Eshet Micro Finance Institution S.C.", "Ethiopia Catholic Church Social Development Commission (ECC-SDCO) Microfinance",
  "Gamogofa Micro Finance Institution S.C.", "Gasha Microfinance Institution S.C.",
  "Grand Microfinance Institution S.C.", "Harar Microfinance Institution S.C.",
  "Meklit Microfinance Institution S.C.", "Metemamen Microfinance Institution S.C.",
  "Omo Microfinance Institution S.C.", "Peace Microfinance S.C.",
  "Raya Microfinance Institution S.C.", "Sidama Microfinance Institution S.C.",
  "Sphere Microfinance Institution S.C.", "Vision Fund Microfinance Institution S.C.",
  "Wasasa Microfinance Institution S.C.", "Wisdom Microfinance Institution S.C.",
  "Other / Specify",
].map(name => ({ value: name, label: name }));

// ❌ REMOVED THE INVALID HOOK CALLS FROM HERE
// const [resolver, setResolver] = useState<any>(null);
//   useEffect(() => {
//     import("@hookform/resolvers/zod").then((module) => {
//       setResolver(() => module.zodResolver(formSchema));
//     });
//   }, []);

const formSchema = z.object({
  // Applicant Selection
  userId: z.string().min(1, { message: "Please select an applicant." }),

  // Applicant Information (snapshotted from User)
  applicantFullName: z.string().nullable().optional(),
  fatherName: z.string().nullable().optional(),
  grandfatherName: z.string().nullable().optional(),

  gender: z.enum(["Male", "Female", "Other"]).nullable().optional(),
  idNumber: z.string().nullable().optional(),
  primaryPhoneNumber: z.string().nullable().optional(),
  applicantEmailAddress: z.string().email("Invalid email address").nullable().optional().or(z.literal("")),
  residentialAddress: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  woredaKebele: z.string().nullable().optional(),
  houseNumber: z.string().nullable().optional(),

  // Business Specific
  isBusiness: z.boolean().nullable().optional(),
  entityName: z.string().nullable().optional(),
  tin: z.string().nullable().optional(),
  businessLicenseNo: z.string().nullable().optional(),

  // Cooperative/Association
  associationName: z.string().nullable().optional(),
  membershipNumber: z.string().nullable().optional(),

  // Driver Information
  driverFullName: z.string().min(1, { message: "Driver's Full Name is required." }),
  driverLicenseNo: z.string().min(1, { message: "Driver's License Number is required." }),
licenseCategory: z.enum(
  ["A", "B", "C", "D", "E"] as const,
  {
    error: "License Category is required.",
  }
),
// Vehicle Details
vehicleType: z.string().min(1, { message: "Please select a vehicle from the catalog." }),

  quantityRequested: z.coerce.number()
    .min(1, { message: "Quantity must be at least 1." })
    .max(100, { message: "Quantity cannot exceed 100." }),
  intendedUse: z.string().nullable().optional(),

  // Optional Preferences
  enableGpsTracking: z.boolean().nullable().optional(),
  acceptEpayment: z.boolean().nullable().optional(),

  // Legal & Signature
  digitalSignatureUrl: z.string().nullable().optional(),
  agreedToTerms: z.boolean().nullable().optional(),

  // Financing Information
  preferredFinancingInstitution: z.string().nullable().optional(),
  loanAmountRequested: z.coerce.number()
    .min(0, { message: "Loan amount cannot be negative." }),
  bankReferenceNumber: z.string().nullable().optional(),

  // Document Attachments
  downPaymentProofUrl: z.string().nullable().optional(),
  idScanUrl: z.string().nullable().optional(),
  tinNumberUrl: z.string().nullable().optional(),
  supportingLettersUrl: z.string().nullable().optional(),

  // Application Tracking
  initialRemarks: z.string().nullable().optional(),

  // Status Fields
  applicationStatus: z.enum(["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"]).optional(),
  loanApplicationStatus: z.enum(["Pending", "Approved", "Disbursed"]).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface UserOption {
  // 🔑 User Identification & System Fields
  id: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  // 👤 Personal Details (Nullable if optional in DB)
  fullName: string; // Assuming fullName is always present
  fatherName: string | null;
  grandfatherName: string | null;
  gender: string | null;
  idNumber: string | null;
  primaryPhoneNumber: string | null;
  emailAddress: string | null;
  
  // 🏠 Residential Address
  residentialAddress: string | null;
  region: string | null; // <-- Fixed the missing/duplicated 'city' and 'region' area
  city: string | null;
  woredaKebele: string | null;
  houseNumber: string | null;

  // 💼 Business Details (Nullable)
  isBusiness: boolean;
  entityName: string | null;
  tin: string | null;
  businessLicenseNo: string | null;
  associationName: string | null;
  membershipNumber: string | null;

  // 🚗 Vehicle & Usage Details (Using the most common type from your duplicates)
  // Note: I'm using 'string | null' for preferredVehicleType as it's the most flexible
  preferredVehicleType: string | null; 
  vehicleQuantity: number | null;
  intendedUse: string | null;
  
  // ✅ Preferences (Nullable Booleans)
  enableGpsTracking: boolean | null;
  acceptEpayment: boolean | null;
  digitalSignatureUrl: string | null;
  agreedToTerms: boolean | null;

  // 🏦 Financing Details
  preferredFinancingInstitution: string | null;
  // loanAmountRequested, bankReferenceNumber are likely not on the UserOption 
  // but on the FormSchema, so I have excluded them here.
}

// ======================================================
// 2. EdgeStoreField COMPONENT (FIXED: Moved outside the main function)
// ======================================================

interface EdgeStoreFieldProps {
  label: string;
  urlFieldName: keyof FormSchema;
  description?: string;
  form: UseFormReturn<FormSchema>;
  useEdgeStore: typeof useEdgeStore;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const EdgeStoreField = ({
  label,
  urlFieldName,
  description,
  form,
  useEdgeStore,
  setIsUploading,
}: EdgeStoreFieldProps) => {
  const currentUrl = form.watch(urlFieldName);
  const fileName = currentUrl ? String(currentUrl).split("/").pop() : null;

  // ✅ FIX 1: useRef hook moved INSIDE the functional component
  const currentUrlRef = useRef<HTMLAnchorElement>(null); 


  const { edgestore } = useEdgeStore();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setIsUploadingLocal(true);
   const res = await edgestore.documents.upload({
  file,
  onProgressChange: (p: number) => console.log("Progress →", p),
});

      form.setValue(urlFieldName, res.url, { shouldValidate: true });
      toast.success(`${file.name} uploaded successfully!`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast.error("Upload failed: " + errorMessage);
    } finally {
      setIsUploading(false);
      setIsUploadingLocal(false);
    }
  };

  const handleRemoveFile = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUrl) return;

    try {
      // Optional: Delete from storage
      // await edgestore.documents.delete({ url: currentUrl });
      
      form.setValue(urlFieldName, "" as any, { shouldValidate: true });
      toast.info("File removed.");
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast.error("Delete failed: " + errorMessage);
    }
  };

  
  return (
    <div className="mb-4 border p-3 rounded-lg bg-gray-50">
      <Label className="text-sm font-medium mb-1 block">{label}</Label>
      {description && <p className="text-xs text-muted-foreground mb-3">{description}</p>}

      {currentUrl ? (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50">
          <div className="flex items-center space-x-2 truncate">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-700 truncate">{fileName}</span>

            <a
              ref={currentUrlRef}
              href={currentUrl as string} // Added href for functionality
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-xs"
            >
              (View)
            </a>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
          >
            <XCircle className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ) : (
        <div
          className="border border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleUpload(file);
          }}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.onchange = (e: Event) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleUpload(file);
            };
            input.click();
          }}
        >
          {isUploadingLocal ? (
            <p className="text-sm text-gray-600">Uploading…</p>
          ) : (
            <p className="text-sm text-gray-600">Click or drag file here</p>
          )}
        </div>
      )}
    </div>
  );
};


// ======================================================
// 3. MAIN COMPONENT DEFINITION
// ======================================================
export default function CreateApplicationPageClient() {
  console.log("CreateApplicationPage: Component rendered.");
  
  // ✅ FIX 2: Moved useState and useEffect for resolver inside the component
  const [resolver, setResolver] = useState<any>(null);

  useEffect(() => {
    import("@hookform/resolvers/zod").then((module) => {
      setResolver(() => module.zodResolver(formSchema));
    });
  }, []);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedUserId = searchParams.get('userId');

  const [users, setUsers] = useState<UserOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showOtherInstitutionInput, setShowOtherInstitutionInput] = useState(false);
const [catalogVehicles, setCatalogVehicles] = useState<any[]>([]);

  // Effect to fetch the vehicles from your API
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch('/api/vehicles');
        const data = await res.json();
        setCatalogVehicles(data);
      } catch (error) {
        console.error("Error loading vehicle catalog:", error);
      }
    };
    fetchCatalog();
  }, []);


  // === START: UploadThing State ===
  const [isUploading, setIsUploading] = useState(false); // Global state to track if UploadThing is actively uploading
  // === END: UploadThing State ===

  // ❌ REMOVED THE PROBLEMTHIC GUARD CLAUSE!
  // if (!resolver) {
  //   // This is the initial render state while the zodResolver is being dynamically imported
  //   return <CustomLoader message="Preparing form..." emoji="⚙️" />;
  // }


const form = useForm<FormSchema>({
    // FIX: Pass resolver, which will be null initially, but useForm should handle it.
    // If react-hook-form cannot handle a null resolver, you may need to define an empty
    // resolver initially, but generally, passing null/undefined is fine.
    resolver, 
    defaultValues: {
      userId: preselectedUserId || "",
      applicantFullName: "",
      fatherName: "",
      grandfatherName: "",

      gender: undefined,
      idNumber: "",
      primaryPhoneNumber: "",
      applicantEmailAddress: "", 
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

      driverFullName: "",
      driverLicenseNo: "",
      licenseCategory: undefined,

      vehicleType: undefined,
      quantityRequested: 1, 
      intendedUse: "",

      enableGpsTracking: false,
      acceptEpayment: false,

      digitalSignatureUrl: "",
      agreedToTerms: false,

      preferredFinancingInstitution: "",
      loanAmountRequested: 0,
      bankReferenceNumber: "",
      
      downPaymentProofUrl: "",
      idScanUrl: "",
      tinNumberUrl: "",
      supportingLettersUrl: "",

      initialRemarks: "",
      applicationStatus: "NEW",
      loanApplicationStatus: "Pending",
    },
  });

  const selectedUserId = form.watch("userId");
  const isBusiness = form.watch("isBusiness");
 const isMainAdmin = (session?.user as any)?.role === "MAIN_ADMIN";


  // Fetch users (now filtered by backend)
  const fetchData = useCallback(async () => {
    console.log("fetchData: Starting data fetch. setIsLoading(true).");
    setIsLoading(true);
    setApiError(null);
    try {
      console.log("fetchData: Fetching users from /api/admin/users?filter=noApplication...");
      const usersRes = await fetch("/api/admin/users?filter=noApplication");
      if (!usersRes.ok) {
        const errorData = await usersRes.json().catch(() => ({ message: "Unknown error fetching users." }));
        console.error("fetchData: Failed to fetch users (API error):", errorData);
        setApiError(errorData.message || "Failed to load user list.");
        throw new Error(errorData.message || "Failed to fetch users.");
      }
      const usersResponseData = await usersRes.json();
      console.log("fetchData: Raw users API response (filtered for no applications):", usersResponseData);

      let fetchedUsers: UserOption[] = [];
      if (usersResponseData && Array.isArray(usersResponseData.data)) {
        fetchedUsers = usersResponseData.data;
        console.log("fetchData: Fetched users (filtered by backend):", fetchedUsers);
      } else {
        console.error("fetchData: API response for users is not in expected format:", usersResponseData);
        setApiError("Invalid user data format from server (expected 'data' array).");
        throw new Error("Invalid user data format received from server.");
      }
      setUsers(fetchedUsers);

      if (preselectedUserId && fetchedUsers.length > 0) {
        const userExists = fetchedUsers.some(user => user.id === preselectedUserId);

        if (userExists) {
          console.log(`fetchData: Preselected user ${preselectedUserId} found.`);
          form.setValue("userId", preselectedUserId, { shouldValidate: true });
        } else if (preselectedUserId) {
          const warningMessage = `User ID ${preselectedUserId} from URL could not be found or already has an application.`;
          console.warn(`fetchData: Issue with preselected user ${preselectedUserId}: ${warningMessage}`);
          toast.warning("Pre-selected user issue", {
            description: warningMessage,
          });
          router.replace('/admin/applications/create');
        }
      }
      console.log("fetchData: Users fetched successfully. Setting isLoading to false.");

    } catch (err: any) {
      const finalErrorMessage = apiError || err.message || "An unexpected error occurred while loading data.";
      setApiError(finalErrorMessage);
      console.error("fetchData: Overall Error in fetchData:", err);
      toast.error("Error loading page data", {
        description: finalErrorMessage,
        duration: 5000,
        richColors: true,
      });
    } finally {
      console.log("fetchData: Finally block reached. Setting isLoading to false.");
      setIsLoading(false); // Ensure isLoading is always set to false
    }
  }, [preselectedUserId, form, router, apiError]);

  // Effect for initial data fetch and auth check
  useEffect(() => {
    console.log("useEffect [session, status, router, fetchData]: Running. Session status:", status);
    if (status === "loading") {
      console.log("useEffect: Session status is 'loading', returning early.");
      return;
    }

    if (!session?.user) {
      console.log("useEffect: No session user, redirecting to login.");
      router.push("/admin/login");
      return;
    }

    const authorizedRoles = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];
   if (!(session.user as any)?.role || !authorizedRoles.includes((session.user as any)?.role)) {
      console.log("useEffect: Unauthorized role, redirecting to dashboard.");
      toast.error("Access Denied", {
        description: "You do not have permission to create applications.",
      });
      router.push("/admin/dashboard");
      return;
    }

    console.log("useEffect: Auth check passed. Calling fetchData().");
    fetchData();
  }, [session, status, router, fetchData]);

  // Effect to pre-fill form when a user is selected (or cleared)
  useEffect(() => {
    console.log("useEffect [selectedUserId, users, form, isLoading, apiError]: Running.");
    console.log("Current state - isLoading:", isLoading, "apiError:", apiError, "users.length:", users.length, "selectedUserId:", selectedUserId);

    if (!isLoading && !apiError && users.length > 0) {
      if (selectedUserId) {
        console.log(`useEffect: selectedUserId is present (${selectedUserId}). Attempting to find user.`);
        const selectedUser = users.find(user => user.id === selectedUserId);
        if (selectedUser) {
          console.log("useEffect: User found, setting form values.");
          form.setValue("applicantFullName", selectedUser.fullName || "");

          form.setValue("fatherName", selectedUser.fatherName || "");
          form.setValue("grandfatherName", selectedUser.grandfatherName || "");

          form.setValue("gender", selectedUser.gender as "Male" | "Female" | "Other" || undefined);
          form.setValue("idNumber", selectedUser.idNumber || "");
          form.setValue("primaryPhoneNumber", selectedUser.primaryPhoneNumber || "");
          // Set email to null if it's empty in user data
          form.setValue("applicantEmailAddress", selectedUser.emailAddress || "");
          form.setValue("residentialAddress", selectedUser.residentialAddress || "");
          form.setValue("region", selectedUser.region || "");
          form.setValue("city", selectedUser.city || "");
          form.setValue("woredaKebele", selectedUser.woredaKebele || "");
          form.setValue("houseNumber", selectedUser.houseNumber || "");

          form.setValue("isBusiness", selectedUser.isBusiness || false);
          form.setValue("entityName", selectedUser.entityName || "");
          form.setValue("tin", selectedUser.tin || "");
          form.setValue("businessLicenseNo", selectedUser.businessLicenseNo || "");

          form.setValue("associationName", selectedUser.associationName || "");
          form.setValue("membershipNumber", selectedUser.membershipNumber || "");

          form.setValue("vehicleType", selectedUser.preferredVehicleType as "Diesel_Minibus" | "Electric_Minibus" | "Electric_Mid_Bus_21_1" | "Traditional_Minibus" || undefined);

          form.setValue("quantityRequested", selectedUser.vehicleQuantity || 1);
          form.setValue("intendedUse", selectedUser.intendedUse || "");

          form.setValue("enableGpsTracking", selectedUser.enableGpsTracking || false);
          form.setValue("acceptEpayment", selectedUser.acceptEpayment || false);
          form.setValue("digitalSignatureUrl", selectedUser.digitalSignatureUrl || "");
          form.setValue("agreedToTerms", selectedUser.agreedToTerms || false);

          const preferredFinancing = selectedUser.preferredFinancingInstitution || "";
          form.setValue("preferredFinancingInstitution", preferredFinancing);
          if (preferredFinancing === "Other / Specify") {
            setShowOtherInstitutionInput(true);
          } else {
            const isInList = ethiopianBanksAndMFIs.some(opt => opt.value === preferredFinancing);
            if (preferredFinancing && !isInList) {
              form.setValue("preferredFinancingInstitution", preferredFinancing);
              setShowOtherInstitutionInput(true);
            } else {
              setShowOtherInstitutionInput(false);
            }
          }

          if (!selectedUser.isBusiness) {
            form.setValue("entityName", "");
            form.setValue("tin", "");
            form.setValue("businessLicenseNo", "");
          }
        } else {
          console.warn(`useEffect: Selected user ${selectedUserId} not found in fetched users.`);
        }
      } else {
        console.log("useEffect: selectedUserId is empty, resetting form fields related to applicant.");
        // Only reset specific fields related to the applicant, not the whole form
        form.reset({
          ...form.getValues(), // Keep current values for other fields
          applicantFullName: "",
          fatherName: "",
          grandfatherName: "",
          gender: undefined, idNumber: "", primaryPhoneNumber: "",
          applicantEmailAddress: "", residentialAddress: "", region: "", city: "",
          woredaKebele: "", houseNumber: "", isBusiness: false, entityName: "", tin: "",
          businessLicenseNo: "", associationName: "", membershipNumber: "",
          enableGpsTracking: false,
          acceptEpayment: false,
          digitalSignatureUrl: "",
          agreedToTerms: false,
          userId: "", // Clear the user selection
          preferredFinancingInstitution: "", // Clear financing institution
          // Clear File URLs
          downPaymentProofUrl: "",
          idScanUrl: "",
          tinNumberUrl: "",
          supportingLettersUrl: "",
        }, { keepErrors: true, keepDirty: true }); // Keep errors and dirty state for untouched fields
        setShowOtherInstitutionInput(false);
      }
    } else {
      console.log("useEffect: Condition for pre-filling not met (isLoading, apiError, or users.length is not ready).");
    }
  }, [selectedUserId, users, form, isLoading, apiError]);

  // Handle form submission
  async function onSubmit(values: FormSchema) {
    console.log("onSubmit: Form submission started.");
    setIsSubmitting(true);
    setApiError(null);

    const dataToSend = { ...values };

    // --- Critical: Convert empty strings to null for optional fields ---
    for (const key of Object.keys(dataToSend) as (keyof FormSchema)[]) {
      const val = dataToSend[key];
      if (typeof val === "string" && val.trim() === "") {
        // These are all nullable in your schema
        const nullableStringKeys = [
          "applicantFullName", "fatherName", "grandfatherName", "idNumber",
          "primaryPhoneNumber", "applicantEmailAddress", "residentialAddress",
          "region", "city", "woredaKebele", "houseNumber", "entityName",
          "tin", "businessLicenseNo", "associationName", "membershipNumber",
          "intendedUse", "digitalSignatureUrl", "preferredFinancingInstitution",
          "bankReferenceNumber", "downPaymentProofUrl", "idScanUrl",
          "tinNumberUrl", "supportingLettersUrl", "initialRemarks"
        ] as const;
      if (nullableStringKeys.includes(key as any)) {
          (dataToSend[key] as string | null) = null;
        }
      }
    }

    // Ensure business-related fields are nullified if isBusiness is false
    if (!dataToSend.isBusiness) {
      dataToSend.entityName = null;
      dataToSend.tin = null;
      dataToSend.businessLicenseNo = null;
    }

    try {
      console.log("onSubmit: Sending application data to /api/admin/applications:", dataToSend);
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Unknown error from server." }));
        console.error("onSubmit: API responded with error:", errorData);
        throw new Error(errorData.message || "Failed to create application.");
      }

      const newApplication = await res.json();
      console.log("onSubmit: Application created successfully:", newApplication);
      toast.success("Application created successfully!", {
        description: `Application ID: ${newApplication.id.substring(0, 8)}...`,
        duration: 5000,
        richColors: true,
      });
      router.push(`/admin/applications/${newApplication.id}/view`);
    } catch (err: any) {
      setApiError(err.message);
      toast.error("Error creating application", {
        description: err.message,
        duration: 5000,
        richColors: true,
      });
      console.error("onSubmit: Application creation error:", err);
    } finally {
      console.log("onSubmit: Submission process finished. Setting isSubmitting to false.");
      setIsSubmitting(false);
    }
  }

  console.log("CreateApplicationPage: Rendering based on isLoading:", isLoading, "apiError:", apiError);
  // FIX: This check now only relies on isLoading and apiError (which covers data fetching and session status), 
  // ensuring the main component body (where useForm lives) is always run.
  if (isLoading && !apiError) {
    return <CustomLoader message="Loading page data..." emoji="📝" />;
  }

  const userComboboxOptions = users.map(user => ({
    label: `${user.fullName} (${user.primaryPhoneNumber || user.emailAddress || 'No Contact'})`,
    value: user.id,
  }));

  // Calculate number of files selected (check if URL fields are populated)
  const numberOfFilesSelected = [
    form.watch('downPaymentProofUrl'),
    form.watch('idScanUrl'),
    form.watch('tinNumberUrl'),
    form.watch('supportingLettersUrl'),
  ].filter(url => !!url).length;

  const filesUploaded = numberOfFilesSelected > 0;

  const sectionContainerClass = "p-6 rounded-lg shadow-sm border-t border-gray-200 pt-8 mt-8 first:mt-0 first:pt-0 first:border-t-0";

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">
          <PlusCircle className="inline-block mr-3 text-green-600" />
          Create New Application
        </h1>
        <Button variant="outline" onClick={() => router.push("/admin/applications")}>
          <ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to Applications
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 bg-white p-8 rounded-lg shadow-md">
          {apiError && !isLoading && (
            <div className="text-red-500 text-sm text-center mb-4 p-2 border border-red-200 rounded-md bg-red-50">
              Error: {apiError}. Please check your backend database connection.
            </div>
          )}

          {/* Section: Applicant Selection */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-blue-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <UserPlus className="mr-2 h-5 w-5 text-blue-600" /> Select Applicant
            </h2>
            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Existing Applicant</FormLabel>
                    <FormControl>
                      <Combobox
                        options={userComboboxOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search or select an applicant..."
                        searchPlaceholder="Search applicants by name, phone or ID..."
                        noResultsMessage={
                          isLoading ? "Loading applicants..." :
                            apiError ? `Error loading applicants: ${apiError}` :
                              "No new applicants available or loaded."
                        }
                        disabled={isLoading || (userComboboxOptions.length === 0 && !apiError)}
                      />
                    </FormControl>
                    <FormDescription>
                      {apiError ? (
                        <span className="text-red-500">Error: {apiError}. Please check your backend database connection.</span>
                      ) : userComboboxOptions.length === 0 && !isLoading ? (
                        <span className="text-orange-500">No new applicants available or loaded.</span>
                      ) : "Select an existing user to create an application for them."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Applicant Information */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-purple-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <Info className="mr-2 h-5 w-5 text-purple-600" /> Applicant Personal Information (Snapshot)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These fields are pre-filled from the selected applicant&apos; profile and can be adjusted for this specific application.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="applicantFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Father's Name */}
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father&apos; Name (Snapshot)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Grandfather's Name */}
              <FormField
                control={form.control}
                name="grandfatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grandfather&apos; Name (Snapshot)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="primaryPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone Number (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="applicantEmailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address (Optional)</FormLabel>
                    <FormControl><Input type="email" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="residentialAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Address (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/Sub-city (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="woredaKebele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Woreda/Kebele (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="houseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Number (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Business Specific Information (Conditional) */}
          <div className={sectionContainerClass}>
            <FormField
              control={form.control}
              name="isBusiness"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <h2 className="text-xl font-semibold text-yellow-700 flex items-center">
                      <Briefcase className="mr-2 h-5 w-5 text-yellow-600" /> Business Details
                    </h2>
                    <FormDescription>
                      Check this if the application is for a business entity.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isBusiness && ( // Conditionally render business fields if isBusiness is true
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="entityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business/Entity Name</FormLabel>
                      <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TIN (Tax Identification Number) (Optional)</FormLabel>
                      <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessLicenseNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business License Number (Optional)</FormLabel>
                      <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Section: Cooperative/Association */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-orange-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <Building className="mr-2 h-5 w-5 text-orange-600" /> Cooperative/Association Details
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These fields are pre-filled from the selected applicants profile and can be adjusted.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="associationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Association Name (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="membershipNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Number (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Driver Information */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-teal-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <UserRound className="mr-2 h-5 w-5 text-teal-600" /> Buyer Information
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Enter the primary buyer’s details for this application.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="driverFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormDescription>As shown on ID</FormDescription>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="driverLicenseNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormDescription>From official document</FormDescription>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">A - Motorcycle</SelectItem>
                        <SelectItem value="B">B - Light Vehicles</SelectItem>
                        <SelectItem value="C">C - Medium Vehicles (Trucks)</SelectItem>
                        <SelectItem value="D">D - Heavy Vehicles (Buses/Minibuses)</SelectItem>
                        <SelectItem value="E">E - Specialized Vehicles</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Optional Preferences (GPS & E-Payment) */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-blue-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <Target className="mr-2 h-5 w-5 text-blue-600" /> Optional Preferences (from Applicant Profile)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These settings reflect preferences from the selected applicant&apos; profile and can be adjusted.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="enableGpsTracking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Enable GPS/Fleet Tracking for this vehicle
                      </FormLabel>
                      <FormDescription>
                        Indicates if the applicant desires GPS tracking services.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceptEpayment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Accept E-Payment for services
                      </FormLabel>
                      <FormDescription>
                        Indicates if the applicant is set up to receive digital payments.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Legal & Signature */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <Gavel className="mr-2 h-5 w-5 text-indigo-600" /> Legal & Signature
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              The Digital Signature is pre-filled and uneditable. Agreement to terms can be adjusted.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agreedToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Applicant Agreed to Terms and Conditions
                      </FormLabel>
                      <FormDescription>
                        This indicates the applicant&apos; acceptance during registration.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="digitalSignatureUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Signature className="mr-2 h-4 w-4 text-gray-500" /> Digital Signature (Uneditable)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled value={field.value || 'N/A'} />
                    </FormControl>
                    <FormDescription>
                      The applicant&apos; digital signature URL/text provided during registration. This field is for reference and cannot be changed here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Vehicle Details */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-red-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <Car className="mr-2 h-5 w-5 text-red-600" /> Vehicle Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
  control={form.control}
  name="vehicleType"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Vehicle Type</FormLabel>
      <Select onValueChange={field.onChange} value={field.value || ""}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={catalogVehicles.length > 0 ? "Choose a vehicle..." : "Loading fleet..."} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {catalogVehicles.map((v) => (
            <SelectItem key={v.id} value={v.name}>
              <div className="flex items-center gap-2">
                {v.type === 'truck' ? <Truck className="h-4 w-4 text-orange-500" /> : <Bus className="h-4 w-4 text-emerald-500" />}
                <span>{v.name}</span>
                <span className="text-[10px] text-muted-foreground ml-2">({v.capacity})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
            </div>
          </div>

          {/* Section: Financing Information */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-green-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <Banknote className="mr-2 h-5 w-5 text-green-600" /> Financing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="preferredFinancingInstitution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Financing Institution (Optional)</FormLabel>
                    <FormControl>
                      <ComboboxSearch
                        options={ethiopianBanksAndMFIs} // This is now correctly defined globally
                        value={showOtherInstitutionInput ? "Other / Specify" : field.value || ""}
                        onValueChange={(selectedValue) => {
                          if (selectedValue === "Other / Specify") {
                            setShowOtherInstitutionInput(true);
                            field.onChange(""); // Clear current value to force user input for "Other"
                          } else {
                            setShowOtherInstitutionInput(false);
                            field.onChange(selectedValue);
                          }
                        }}
                        placeholder="Search or select a financing institution..."
                        searchPlaceholder="Search institutions..."
                        emptyMessage="No institution found. Consider 'Other / Specify'."
                      />
                    </FormControl>
                    <FormMessage />
                    {showOtherInstitutionInput && (
                      <div className="mt-2">
                        <Input
                          placeholder="Please specify institution name..."
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <FormDescription>
                          Please enter the full name of the financing institution.
                        </FormDescription>
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanAmountRequested"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount Requested (ETB)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        min={0}
                        value={field.value === 0 ? '' : field.value} // Display empty string if value is 0
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankReferenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Reference Number (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormDescription>Transaction or application reference</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Attachments (Now with UploadThing) */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <UploadCloud className="mr-2 h-5 w-5 text-gray-600" /> Attachments (Upload Files)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Click the button below to upload supporting documents for this application.
            </p>
            <div className="flex justify-center">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={filesUploaded ? "secondary" : "outline"}
                    className={cn(
                      "text-blue-600 hover:text-blue-700",
                      filesUploaded && "bg-green-50 text-green-700 hover:bg-green-100 border-green-300"
                    )}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading Files...
                      </>
                    ) : filesUploaded ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" /> Files Attached ({numberOfFilesSelected})
                      </>
                    ) : (
                      <>
                        <UploadCloud className="mr-2 h-4 w-4" /> Upload Files
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-6">
                  <div className="grid gap-4">
                    <div className="space-y-2 text-center">
                      <h4 className="font-semibold text-lg leading-none">Document Uploads</h4>
                      <p className="text-sm text-muted-foreground">
                        Attach all necessary files. Max size is configured in EdgeStore.
                      </p>
                    </div>
                    {/* === START: EdgeStore Field Calls === */}
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      <EdgeStoreField
                        label="Down Payment Proof"
                        urlFieldName="downPaymentProofUrl"
                        description="Receipt or bank statement proving down payment."
                        form={form}
                        useEdgeStore={useEdgeStore}
                        setIsUploading={setIsUploading}
                      />

                      <EdgeStoreField
                        label="Applicant ID Scan"
                        urlFieldName="idScanUrl"
                        description="Scanned copy of national ID or passport."
                        form={form}
                        useEdgeStore={useEdgeStore}
                        setIsUploading={setIsUploading}
                      />

                      <EdgeStoreField
                        label="TIN Number Document"
                        urlFieldName="tinNumberUrl"
                        description="Tax Identification Number certificate."
                        form={form}
                        useEdgeStore={useEdgeStore}
                        setIsUploading={setIsUploading}
                      />

                      <EdgeStoreField
                        label="Supporting Letters"
                        urlFieldName="supportingLettersUrl"
                        description="Additional letters of recommendation."
                        form={form}
                        useEdgeStore={useEdgeStore}
                        setIsUploading={setIsUploading}
                      />

                    </div>
                    {/* === END: EdgeStore Field Calls === */}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Section: Initial Remarks */}
          <div className={sectionContainerClass}>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-indigo-600" /> Initial Remarks
            </h2>
            <FormField
              control={form.control}
              name="initialRemarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Remarks (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any initial remarks or notes about this application" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Application Statuses */}
          {isMainAdmin && (
            <div className={sectionContainerClass}>
              <h2 className="text-xl font-semibold text-teal-700 mb-4 pb-3 border-b border-gray-100 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-teal-600" /> Application Statuses
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                These statuses control the workflow of the application. Only **Main Admins** can set these on creation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="applicationStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Review Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select Application Status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NEW">NEW</SelectItem>
                          <SelectItem value="UNDER_REVIEW">UNDER_REVIEW</SelectItem>
                          <SelectItem value="APPROVED">APPROVED</SelectItem>
                          <SelectItem value="REJECTED">REJECTED</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the internal review status.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="loanApplicationStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Application Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select Loan Application Status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Disbursed">Disbursed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the current status of the loan itself.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <div className={`${sectionContainerClass} border-t pt-6 flex justify-end gap-3`}>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || !selectedUserId || isUploading}
              className="px-8 bg-green-600 hover:bg-green-700"
            >
              {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating Application..." : isUploading ? "Waiting for Uploads..." : "Create Application"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}