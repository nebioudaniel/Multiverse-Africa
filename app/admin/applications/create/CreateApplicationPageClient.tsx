/* trunk-ignore-all(prettier) */
// app/admin/applications/create/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  Signature,
  XCircle,
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

// ======================================================
// DEFINE ethiopianBanksAndMFIs OUTSIDE THE COMPONENT FUNCTION
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


// Define the Zod schema for the form
const formSchema = z.object({
  // Applicant Selection
  userId: z.string().min(1, { message: "Please select an applicant." }),

  // Applicant Information (snapshotted from User) - now mostly optional
  applicantFullName: z.string().nullable().optional(),
  gender: z.enum(["Male", "Female", "Other"]).nullable().optional(), // Now optional
  idNumber: z.string().nullable().optional(), // Now optional
  primaryPhoneNumber: z.string().nullable().optional(), // Now optional
  // Ensure email is optional and can be null if empty
  applicantEmailAddress: z.string().email("Invalid email address").nullable().optional().or(z.literal("")),
  residentialAddress: z.string().nullable().optional(), // Now optional
  region: z.string().nullable().optional(), // Now optional
  city: z.string().nullable().optional(), // Now optional
  woredaKebele: z.string().nullable().optional(), // Now optional
  houseNumber: z.string().nullable().optional(), // Already nullable/optional

  // Business Specific (snapshotted from User, conditional)
  isBusiness: z.boolean().nullable().optional(),
  entityName: z.string().nullable().optional(),
  tin: z.string().nullable().optional(),
  businessLicenseNo: z.string().nullable().optional(),

  // Cooperative/Association (snapshotted from User, optional)
  associationName: z.string().nullable().optional(),
  membershipNumber: z.string().nullable().optional(),

  // Driver Information for this Application
  driverFullName: z.string().min(1, { message: "Driver's Full Name is required." }),
  driverLicenseNo: z.string().min(1, { message: "Driver's License Number is required." }),
  // FIX: Added "E" to the enum to match the frontend JSX and backend API
  licenseCategory: z.enum(["A", "B", "C", "D", "E"], { 
    required_error: "License Category is required.",
  }),

  // Vehicle Details
  vehicleType: z.enum(["Diesel_Minibus", "Electric_Minibus", "Electric_Mid_Bus_21_1", "Traditional_Minibus"], {
    required_error: "Please select a vehicle type.",
  }),
  quantityRequested: z.coerce.number()
    .min(1, { message: "Quantity must be at least 1." })
    .max(100, { message: "Quantity cannot exceed 100." }),
  intendedUse: z.string().nullable().optional(),

  // Optional Preferences (These are from the User model)
  enableGpsTracking: z.boolean().nullable().optional(),
  acceptEpayment: z.boolean().nullable().optional(),

  // Legal & Signature (from User model)
  digitalSignatureUrl: z.string().nullable().optional(),
  agreedToTerms: z.boolean().nullable().optional(),

  // Financing Information
  preferredFinancingInstitution: z.string().nullable().optional(),
  loanAmountRequested: z.coerce.number()
    .min(0, { message: "Loan amount cannot be negative." }),
  bankReferenceNumber: z.string().nullable().optional(),

  // Document Attachments (URLs will be set after upload)
  downPaymentProofUrl: z.string().nullable().optional(),
  idScanUrl: z.string().nullable().optional(),
  tinNumberUrl: z.string().nullable().optional(),
  supportingLettersUrl: z.string().nullable().optional(),

  // Application Tracking (initial values, status is handled by API default)
  initialRemarks: z.string().nullable().optional(),

  // Status Fields (Moved to last, role-dependent visibility/editability handled in JSX)
  applicationStatus: z.enum(["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"]).optional(),
  loanApplicationStatus: z.enum(["Pending", "Approved", "Disbursed"]).optional(),
});

// Type for the user data fetched from the API
interface UserOption {
  id: string;
  fullName: string;
  emailAddress: string | null;
  primaryPhoneNumber: string | null;
  gender: string | null;
  idNumber: string | null;
  residentialAddress: string | null;
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
  enableGpsTracking: boolean | null;
  acceptEpayment: boolean | null;
  digitalSignatureUrl: string | null;
  agreedToTerms: boolean | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  // Added for preferredFinancingInstitution pre-fill logic
  preferredFinancingInstitution: string | null;
}

export default function CreateApplicationPageClient() {
  console.log("CreateApplicationPage: Component rendered.");
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

  // State for new files selected by the user
  const [selectedFiles, setSelectedFiles] = useState<{
    downPaymentProof?: File | null;
    idScan?: File | null;
    tinNumber?: File | null;
    supportingLetters?: File | null;
  }>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: preselectedUserId || "",
      applicantFullName: "",
      gender: undefined,
      idNumber: "",
      primaryPhoneNumber: "",
      applicantEmailAddress: "", // Initialize as empty string
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
  const isMainAdmin = session?.user?.role === "MAIN_ADMIN";

  // Reusable FileDropzoneField component for Popover
  const FileDropzoneField = ({
    label,
    fileStateKey,
    description,
  }: {
    label: string;
    fileStateKey: keyof typeof selectedFiles;
    description?: string;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const file = selectedFiles[fileStateKey];
    const isFileSelected = !!file;

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedFiles(prev => ({ ...prev, [fileStateKey]: e.target.files?.[0] || null }));
    }, [fileStateKey]);

    const handleClearSelectedFile = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedFiles(prev => ({ ...prev, [fileStateKey]: null }));
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
    }, [fileStateKey]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
        setSelectedFiles(prev => ({ ...prev, [fileStateKey]: droppedFiles[0] }));
      }
    }, [fileStateKey, setSelectedFiles]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
    }, []);

    const handleFileInputClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="mb-4 last:mb-0">
        <Label className="text-sm font-medium leading-none mb-2 block">{label}</Label>
        {description && <p className="text-xs text-muted-foreground mb-3">{description}</p>}

        <input
          id={`file-upload-${fileStateKey}`}
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {isFileSelected ? (
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-300 bg-gray-50 shadow-sm text-sm">
            <div className="flex items-center space-x-2 truncate">
              <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="font-medium text-blue-700 truncate">{file?.name}</span>
              {file?.size && (
                <span className="text-gray-500 text-xs flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSelectedFile}
              className="ml-2 flex-shrink-0"
              title="Remove file"
            >
              <XCircle className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
            onClick={handleFileInputClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <UploadCloud className="h-6 w-6 mb-2 text-gray-400" />
            <p className="text-sm font-medium">Drag & drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB</p>
          </div>
        )}
      </div>
    );
  };

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
          let warningMessage = `User ID ${preselectedUserId} from URL could not be found or already has an application.`;
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
  }, [preselectedUserId, form, router]); // Removed 'apiError', 'users' from dependencies to prevent re-renders on every apiError/users state change which is handled inside

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
    if (!session.user.role || !authorizedRoles.includes(session.user.role)) {
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
          
          // FIX: Updated the cast to reflect the actual vehicle type values in the SelectContent later in the form
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
                  // If it's not "Other / Specify" but also not in the list, assume it's a custom input
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
              applicantFullName: "", gender: undefined, idNumber: "", primaryPhoneNumber: "",
              applicantEmailAddress: "", residentialAddress: "", region: "", city: "",
              woredaKebele: "", houseNumber: "", isBusiness: false, entityName: "", tin: "",
              businessLicenseNo: "", associationName: "", membershipNumber: "",
              // driverFullName: "", driverLicenseNo: "", licenseCategory: undefined, // Keep driver info
              // vehicleType: undefined, quantityRequested: 1, intendedUse: "", // Keep vehicle info
              enableGpsTracking: false, // These can reset
              acceptEpayment: false, // These can reset
              digitalSignatureUrl: "", // These can reset
              agreedToTerms: false, // These can reset
              userId: "", // Clear the user selection
              preferredFinancingInstitution: "", // Clear financing institution
          }, { keepErrors: true, keepDirty: true }); // Keep errors and dirty state for untouched fields
          setShowOtherInstitutionInput(false);
      }
    } else {
        console.log("useEffect: Condition for pre-filling not met (isLoading, apiError, or users.length is not ready).");
    }
  }, [selectedUserId, users, form, isLoading, apiError]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit: Form submission started.");
    setIsSubmitting(true);
    setApiError(null);

    const dataToSend = { ...values };

    // --- Critical: Convert empty strings to null for optional fields ---
    for (const key of Object.keys(dataToSend) as Array<keyof typeof dataToSend>) {
        const val = dataToSend[key];
        // Check if value is an empty string and the field is optional/nullable in the schema
        if (typeof val === 'string' && val.trim() === '') {
            // A more robust way to check if a Zod field is optional/nullable
            const schemaField = formSchema.shape[key];
            if (schemaField && ('_def' in schemaField) && (schemaField._def.typeName === 'ZodOptional' || schemaField._def.typeName === 'ZodNullable')) {
                dataToSend[key] = null as any;
            }
            // Explicitly handle email if it's an empty string to be null
            if (key === 'applicantEmailAddress' && val.trim() === '') {
                dataToSend[key] = null as any;
            }
        }
    }

    // Explicitly handle preferredFinancingInstitution if "Other / Specify" selected
    if (showOtherInstitutionInput && dataToSend.preferredFinancingInstitution === "") {
        dataToSend.preferredFinancingInstitution = null;
    }


    // --- Handle File Uploads ---
    const uploadedFileUrls: { [key: string]: string | null } = {};
    let uploadSuccess = true;

    for (const key of Object.keys(selectedFiles) as (keyof typeof selectedFiles)[]) {
        const file = selectedFiles[key];
        const urlFieldName = `${key}Url` as keyof typeof dataToSend; // e.g., 'downPaymentProof' -> 'downPaymentProofUrl'

        if (file) {
            toast.info(`Uploading ${file.name}...`, { duration: 2000 });
            try {
                // *** IMPORTANT: REPLACE THIS MOCK FILE UPLOAD LOGIC ***
                // You need to implement your actual file upload API endpoint and logic here.
                
                // Mock upload for demonstration
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
                const mockUrl = `https://example.com/uploads/${file.name.replace(/\s/g, '_')}_${Date.now()}`;
                uploadedFileUrls[urlFieldName] = mockUrl;
                toast.success(`${file.name} uploaded successfully!`);

            } catch (uploadError: any) {
                console.error(`onSubmit: Error uploading ${file.name}:`, uploadError);
                toast.error(`Failed to upload ${file.name}: ${uploadError.message || 'Unknown error'}`);
                uploadSuccess = false;
                break; // Stop if any upload fails
            }
        } else {
            uploadedFileUrls[urlFieldName] = null; // Ensure null if no file selected for that field
        }
    }

    if (!uploadSuccess) {
        console.log("onSubmit: File upload failed, stopping submission.");
        setIsSubmitting(false);
        return; // Stop form submission if file upload failed
    }

    // Merge uploaded URLs into the dataToSend
    Object.assign(dataToSend, uploadedFileUrls);

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
  if (isLoading && !apiError) {
    return <CustomLoader message="Loading page data..." emoji="📝" />;
  }

  const userComboboxOptions = users.map(user => ({
    label: `${user.fullName} (${user.primaryPhoneNumber || user.emailAddress || 'No Contact'})`,
    value: user.id,
  }));

  // Calculate number of files selected
  const numberOfFilesSelected = Object.values(selectedFiles).filter(file => file !== null).length;
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
              These fields are pre-filled from the selected applicant's profile and can be adjusted for this specific application.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="applicantFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input type="email" {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                      checked={field.value}
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
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
              These settings reflect preferences from the selected applicant's profile and can be adjusted.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="enableGpsTracking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
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
                        checked={field.value}
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
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Applicant Agreed to Terms and Conditions
                      </FormLabel>
                      <FormDescription>
                        This indicates the applicant's acceptance during registration.
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
                      <Input {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      The applicant's digital signature URL/text provided during registration. This field is for reference and cannot be changed here.
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select vehicle type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Diesel_Minibus">Diesel_Minibus</SelectItem>
                        <SelectItem value="Electric_Minibus">Electric_Minibus</SelectItem>
                        <SelectItem value="Electric_Mid_Bus_21_1">Electric_Mid_Bus_21_1</SelectItem>
                        <SelectItem value="Traditional_Minibus">Traditional_Minibus</SelectItem>
                        {/* Note: I'm using the simpler enum values from your backend API for consistency */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantityRequested"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity Requested</FormLabel>
                    <FormControl><Input type="number" {...field} min={1} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="intendedUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intended Use (Optional)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormDescription>
                      e.g., Staff Transport, Tour / Charter, Public Transport
                    </FormDescription>
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
              {isMainAdmin && (
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
              )}
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
                    <FormControl><Input type="number" step="0.01" {...field} min={0} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
                    <FormDescription>Transaction or application reference</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Attachments (Now with Enhanced Popover UI) */}
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
                    {filesUploaded ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" /> Files Uploaded ({numberOfFilesSelected})
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
                        Attach all necessary files for the application review.
                      </p>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      <FileDropzoneField
                        label="Down Payment Proof"
                        fileStateKey="downPaymentProof"
                        description="Receipt or bank statement proving down payment."
                      />
                      <FileDropzoneField
                        label="Applicant ID Scan"
                        fileStateKey="idScan"
                        description="Scanned copy of national ID or passport."
                      />
                      <FileDropzoneField
                        label="TIN Number Document"
                        fileStateKey="tinNumber"
                        description="Tax Identification Number certificate (if applicable)."
                      />
                      <FileDropzoneField
                        label="Supporting Letters"
                        fileStateKey="supportingLetters"
                        description="Any additional letters of recommendation or support."
                      />
                    </div>
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
                    <Textarea placeholder="Any initial remarks or notes about this application" {...field} />
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
                These statuses control the workflow of the application. Only Main Admins can set these on creation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="applicationStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Application Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select Application Status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NEW">NEW</SelectItem>
                          <SelectItem value="UNDER_REVIEW">UNDER REVIEW</SelectItem>
                          <SelectItem value="APPROVED">APPROVED</SelectItem>
                          <SelectItem value="REJECTED">REJECTED</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the overall application status.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full flex items-center justify-center mt-8 py-3 text-lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Application...
              </>
            ) : (
              <>
                Create Application <PlusCircle className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}