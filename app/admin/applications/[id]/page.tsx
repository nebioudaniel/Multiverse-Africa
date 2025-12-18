//@ts-nocheck
// app/admin/applications/[id]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Pencil, ExternalLink, ArrowLeftCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CustomLoader from "@/components/ui/custom-loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

// --- INTERFACE ---
interface ApplicationRecord {
  id: string;
  applicantId: string;
  applicantFullName: string;
  fatherName: string;
  grandfatherName: string | null;
  isBusiness: boolean;
  entityName: string | null;
  tin: string | null;
  businessLicenseNo: string | null;
  region: string | null;
  city: string | null;
  woredaKebele: string | null;
  primaryPhoneNumber: string;
  alternativePhoneNumber: string | null;
  applicantEmailAddress: string | null;
  preferredVehicleType: string;
  vehicleQuantity: number;
  intendedUse: string;

  gender: string | null;
  idNumber: string | null;
  residentialAddress: string | null;
  houseNumber: string | null;
  associationName: string | null;
  membershipNumber: string | null;
  preferredFinancingInstitution: string | null;
  loanApplicationStatus: string | null;
  loanAmountRequested: number | null;
  bankReferenceNumber: string | null;
  downPaymentProofUrl: string | null;
  idScanUrl: string | null;
  taxIdentificationNumberUrl: string | null;
  supportingLettersUrl: string | null;

  applicationStatus: string;
  remarksNotes: string | null;

  assignedToId: string | null;
  assignedTo?: { id: string; fullName: string; email: string } | null;
  processedById: string | null;
  processedBy?: { id: string; fullName: string; email: string } | null;

  createdAt: string;
  updatedAt: string;

  applicant?: {
    id: string;
    fullName: string;
    emailAddress: string | null;
    primaryPhoneNumber: string;
  } | null;
}

// Internal Interface for safe usage
interface ApplicationPageProps {
  params: { id: string };
}

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return "An unexpected error occurred. Please try again.";
};

// 🛑 WORKAROUND FIX: Using 'any' for the component props to bypass the global
// 'PageProps' constraint conflict (where PageProps is incorrectly typed as Promise<any> globally).
export default function ApplicationDetailPage(props: any) { 
  
  // Safe cast to use the params correctly inside the component
  const { id } = (props.params as ApplicationPageProps['params']);

  const { data: session, status } = useSession();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Data Fetching (Wrapped in useCallback) ---
  const fetchApplication = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch application");
      }
      const data: ApplicationRecord = await res.json();
      setApplication(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
        duration: 5000,
        richColors: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/admin/login");
      return;
    }

   const authorizedRoles = ["MAIN_ADMIN", "REGISTRAR_ADMIN"];
if (!(session.user as any)?.role || !authorizedRoles.includes((session.user as any).role)) {
  toast.error("Access Denied", {
    description: "You do not have permission to view this page.",
  });
  router.push("/admin/dashboard");
  return;
}


    fetchApplication();
  }, [session, status, router, fetchApplication]);

  // --- Delete Application Handler (Main Admin only) ---
  const handleDeleteApplication = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete application");
      }

      toast.success("Application Deleted", {
        description: "Application has been successfully deleted.",
        duration: 3000,
        richColors: true,
      });
      router.push("/admin/applications");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      toast.error("Deletion Failed", {
        description: errorMessage || "An unexpected error occurred.",
        duration: 5000,
        richColors: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to render values professionally
  const renderValue = (key: keyof ApplicationRecord, value: ApplicationRecord[keyof ApplicationRecord] | string | number | boolean | undefined | null) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-500">-</span>;
    }

    // Ensure value is handled as its specific type if it's an object/array
    if (key === 'assignedTo' || key === 'processedBy') {
        const user = value as ApplicationRecord['assignedTo'];
        return user?.fullName || <span className="text-gray-500">N/A</span>;
    }

    // Handle primitive types or primitives within the ApplicationRecord
switch (key) {
  case "createdAt":
  case "updatedAt":
    return new Date(value as string).toLocaleString();

  case "isBusiness":
    return (value as boolean) ? "Yes" : "No";

  case "applicationStatus":
    return (
      <Badge
        variant={
          value === "NEW"
            ? "default"
            : value === "UNDER_REVIEW"
            ? "secondary"
            : value === "APPROVED"
            ? "outline" // Replaced success
            : "destructive"
        }
      >
        {String(value).replace(/_/g, " ")}
      </Badge>
    );

  case "loanApplicationStatus":
    return (
      <Badge
        variant={
          value === "Pending"
            ? "outline"
            : value === "Approved"
            ? "secondary" // Replaced success
            : value === "Disbursed"
            ? "default"
            : "default"
        }
      >
        {String(value)}
      </Badge>
    );

  case "downPaymentProofUrl":
  case "idScanUrl":
  case "taxIdentificationNumberUrl":
  case "supportingLettersUrl":
    return (
      <a
        href={value as string}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        View Document <ExternalLink className="h-4 w-4" />
      </a>
    );

  case "loanAmountRequested":
    return `ETB ${(value as number).toLocaleString()}`;

  case "primaryPhoneNumber":
  case "alternativePhoneNumber":
    return (
      <a href={`tel:${value as string}`} className="text-blue-600 hover:underline">
        {value as string}
      </a>
    );

  case "applicantEmailAddress":
    return (
      <a href={`mailto:${value as string}`} className="text-blue-600 hover:underline">
        {value as string}
      </a>
    );

  default:
    if (typeof value === "object" && value !== null) {
      // For any other unexpected object, display its string representation
      return JSON.stringify(value);
    }
    return String(value);
}
}; 


  if (isLoading) {
    return <CustomLoader message="Fetching application details..." emoji="🔍" />;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 text-center text-red-600 bg-gray-50">
        <h2 className="text-xl font-semibold">Error Loading Application</h2>
        <p>{error}</p>
        <Button onClick={() => fetchApplication()} className="mt-4">
          Try Again
        </Button>
        <Button onClick={() => router.push('/admin/applications')} variant="outline" className="ml-4">
          <ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to List
        </Button>
      </div>
    );
  }

  const authorizedRoles = ["MAIN_ADMIN", "REGISTRAR_ADMIN"];
  if (!session?.user?.role || !authorizedRoles.includes(session.user.role)) {
    return (
      <div className="min-h-screen p-6 text-center text-red-600 bg-gray-50">
        <h2 className="text-xl font-semibold text-black">Access Denied</h2>
        <p>You do not have permission to view or edit this page.</p>
        <Button onClick={() => router.push("/admin/dashboard")} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen p-6 text-center text-black-500 bg-gray-50">
        <h2 className="text-xl font-semibold">Application Not Found</h2>
        <p>The application with ID {id} could not be loaded.</p>
        <Button onClick={() => router.push("/admin/applications")} className="mt-4">
          Back to Applications List
        </Button>
      </div>
    );
  }

  const isMainAdmin = session.user.role === "MAIN_ADMIN";

  // Define the order and grouping of fields
  const fieldOrder: {
    section: string;
    fields: (keyof ApplicationRecord)[];
    showIf?: (app: ApplicationRecord) => boolean;
  }[] = [
    {
      section: "Applicant Contact & Personal Information",
      fields: [
        "applicantFullName",
        "fatherName",
        "grandfatherName",
        "gender",
        "idNumber",
        "primaryPhoneNumber",
        "alternativePhoneNumber",
        "applicantEmailAddress",
      ],
    },
    {
      section: "Residential Address",
      fields: [
        "residentialAddress",
        "houseNumber",
        "region",
        "city",
        "woredaKebele",
      ],
    },
    {
      section: "Cooperative/Association Details",
      fields: ["associationName", "membershipNumber"],
    },
    {
      section: "Business Details",
      fields: ["isBusiness", "entityName", "tin", "businessLicenseNo"],
      showIf: (app: ApplicationRecord) => app.isBusiness,
    },
    {
      section: "Vehicle Details",
      fields: ["preferredVehicleType", "vehicleQuantity", "intendedUse"],
    },
    {
      section: "Financing & Loan Information",
      fields: [
        "preferredFinancingInstitution",
        "loanApplicationStatus",
        "loanAmountRequested",
        "bankReferenceNumber",
      ],
    },
    {
      section: "Document Attachments",
      fields: [
        "downPaymentProofUrl",
        "idScanUrl",
        "taxIdentificationNumberUrl",
        "supportingLettersUrl",
      ],
    },
    {
      section: "Administrative Tracking & Status",
      fields: [
        "applicationStatus",
        "remarksNotes",
        "assignedTo",
        "processedBy",
        "createdAt",
        "updatedAt",
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-3 md:mb-0">
          Application Details: <span className="text-blue-600">{application.applicantFullName}</span>
        </h1>
        <div className="flex flex-wrap items-center space-x-3">
          <Badge className="text-base py-1 px-3 bg-blue-500 text-white">
            Status: {application.applicationStatus.replace(/_/g, " ")}
          </Badge>
          {application.loanApplicationStatus && (
            <Badge variant="secondary" className="text-base py-1 px-3 bg-purple-500 text-white">
              Loan: {application.loanApplicationStatus}
            </Badge>
          )}
          <Button variant="outline" asChild>
            <Link href={`/admin/applications/${application.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Application
            </Link>
          </Button>
          {isMainAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the application for{" "}
                    {application.applicantFullName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteApplication}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Continue"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button variant="outline" asChild>
            <Link href="/admin/applications">Back to List</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-lg p-6">
        <ScrollArea className="h-[calc(100vh-250px)]">
          {fieldOrder.map((sectionData, index) => {
            if (sectionData.showIf && !sectionData.showIf(application)) {
              return null;
            }

            // Filter fields to only include those present in the 'application' object
            const sectionFields = sectionData.fields.filter(
              (fieldKey) => application[fieldKey] !== undefined 
            );

            if (sectionFields.length === 0) {
              return null;
            }

            return (
              <div
                key={sectionData.section}
                className={index > 0 ? "mt-8 pt-6 border-t border-gray-200" : ""}
              >
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{sectionData.section}</h2>
                <Table>
                  <TableBody>
                    {sectionFields.map((fieldKey) => (
                      <TableRow key={fieldKey}>
                        <TableCell className="font-medium text-gray-700 w-1/3 md:w-1/4">
                          {fieldKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </TableCell>
                        <TableCell className="text-gray-800">
                          {renderValue(fieldKey, application[fieldKey])}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </ScrollArea>
      </div>
    </div>
  );
}