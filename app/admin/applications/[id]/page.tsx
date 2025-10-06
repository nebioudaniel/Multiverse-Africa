// app/admin/applications/[id]/page.tsx
"use client";

import { useEffect, useState, use as useReact } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, XCircle, Trash2, Pencil, ExternalLink } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import CustomLoader from "@/components/ui/custom-loader";
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming you have this component or similar for scrollable content


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"; // Ensure TableCell and TableRow are imported if used directly

// Define the type for an Application record to match your Prisma Application model
interface ApplicationRecord {
  id: string;
  applicantId: string; // Foreign key to User model
  applicantFullName: string; // Copied from User
  fatherName: string; // Copied from User
  grandfatherName: string | null; // Copied from User
  isBusiness: boolean; // Copied from User
  entityName: string | null; // Copied from User
  tin: string | null; // Copied from User
  businessLicenseNo: string | null; // Copied from User
  region: string | null; // Copied from User
  city: string | null; // Copied from User
  woredaKebele: string | null; // Copied from User
  primaryPhoneNumber: string; // Copied from User
  alternativePhoneNumber: string | null; // Copied from User
  applicantEmailAddress: string | null; // Copied from User (was emailAddress)
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
  assignedTo?: { id: string; fullName: string; email: string } | null; // Relationship to Admin
  processedById: string | null;
  processedBy?: { id: string; fullName: string; email: string } | null; // Relationship to Admin

  createdAt: string;
  updatedAt: string;

  // If you include the full applicant object in your API response, define it here:
  applicant?: {
    id: string;
    fullName: string;
    emailAddress: string | null;
    primaryPhoneNumber: string;
    // ... other fields from User model if needed
  } | null;
}


interface ApplicationPageProps {
  params: { id: string };
}

export default function ApplicationDetailPage({ params }: ApplicationPageProps) {
  // FIX: useReact() is generally not used for direct prop access.
  // The params object is directly available.
  const { id } = params;

  const { data: session, status } = useSession();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Data Fetching ---
  const fetchApplication = async () => {
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
    } catch (err: any) {
      setError(err.message);
      toast.error("Error", {
        description: err.message,
        duration: 5000,
        richColors: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/admin/login");
      return;
    }

    const authorizedRoles = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];
    if (!session.user.role || !authorizedRoles.includes(session.user.role)) {
      toast.error("Access Denied", {
        description: "You do not have permission to view this page.",
      });
      router.push("/admin/dashboard");
      return;
    }

    fetchApplication();
  }, [id, session, status, router]);

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
      router.push('/admin/applications');
    } catch (err: any) {
      toast.error("Deletion Failed", {
        description: err.message || "An unexpected error occurred.",
        duration: 5000,
        richColors: true,
      });
    } finally {
      setIsDeleting(false);
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
        <Button onClick={fetchApplication} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const authorizedRoles = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];
  if (!session?.user?.role || !authorizedRoles.includes(session.user.role)) {
    return (
      <div className="min-h-screen p-6 text-center text-red-600 bg-gray-50">
        <h2 className="text-xl font-semibold text-black">Access Denied</h2>
        <p>You do not have permission to view or edit this page.</p>
        <Button onClick={() => router.push('/admin/dashboard')} className="mt-4">
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
            <Button onClick={() => router.push('/admin/applications')} className="mt-4">
              Back to Applications List
            </Button>
        </div>
    );
  }

  const isMainAdmin = session.user.role === 'MAIN_ADMIN';

  // Helper function to render values professionally
  const renderValue = (key: string, value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-500">-</span>;
    }

    switch (key) {
      case 'createdAt':
      case 'updatedAt':
        return new Date(value).toLocaleString();
      case 'isBusiness':
        return value ? 'Yes' : 'No';
      case 'applicationStatus':
        return (
          <Badge variant={
            value === "NEW" ? "default" :
            value === "UNDER_REVIEW" ? "secondary" :
            value === "APPROVED" ? "success" : "destructive"
          }>
            {String(value).replace(/_/g, ' ')}
          </Badge>
        );
      case 'loanApplicationStatus':
        return (
          <Badge variant={
            value === "Pending" ? "outline" :
            value === "Approved" ? "success" :
            value === "Disbursed" ? "default" : // Use 'default' or define a custom 'disbursed' variant
            "default"
          }>
            {String(value)}
          </Badge>
        );
      case 'downPaymentProofUrl':
      case 'idScanUrl':
      case 'taxIdentificationNumberUrl':
      case 'supportingLettersUrl':
        return (
          <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
            View Document <ExternalLink className="h-4 w-4" />
          </a>
        );
      case 'assignedTo':
      case 'processedBy':
        return value?.fullName || <span className="text-gray-500">N/A</span>;
      case 'loanAmountRequested':
        return `ETB ${value.toLocaleString()}`;
      case 'primaryPhoneNumber':
      case 'alternativePhoneNumber':
        return <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>;
      case 'applicantEmailAddress': // CORRECTED: Use applicantEmailAddress
        return <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
      default:
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    }
  };

  // Define the order and grouping of fields
  const fieldOrder = [
    { section: "Applicant Information", fields: ['applicantFullName', 'fatherName', 'grandfatherName', 'gender', 'idNumber', 'primaryPhoneNumber', 'alternativePhoneNumber', 'applicantEmailAddress', 'residentialAddress', 'houseNumber', 'region', 'city', 'woredaKebele'] }, // CORRECTED: Use applicantFullName, applicantEmailAddress
    { section: "Cooperative/Association Details", fields: ['associationName', 'membershipNumber'] },
    { section: "Vehicle Details", fields: ['preferredVehicleType', 'vehicleQuantity', 'intendedUse'] },
    { section: "Business Details", fields: ['isBusiness', 'entityName', 'tin', 'businessLicenseNo'], showIf: (app: ApplicationRecord) => app.isBusiness },
    { section: "Financing Information", fields: ['preferredFinancingInstitution', 'loanApplicationStatus', 'loanAmountRequested', 'bankReferenceNumber'] },
    { section: "Attachments", fields: ['downPaymentProofUrl', 'idScanUrl', 'taxIdentificationNumberUrl', 'supportingLettersUrl'] },
    { section: "Application Tracking", fields: ['applicationStatus', 'remarksNotes', 'assignedTo', 'processedBy', 'createdAt', 'updatedAt'] },
  ];


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        {/* CORRECTED: Use applicantFullName */}
        <h1 className="text-3xl font-bold text-gray-800">
          Application Details: <span className="text-blue-600">{application.applicantFullName}</span>
        </h1>
        <div className="flex items-center space-x-3">
            <Badge className="text-base py-1 px-3 bg-blue-500 text-white">Status: {application.applicationStatus.replace(/_/g, ' ')}</Badge>
            {application.loanApplicationStatus && (
                <Badge variant="secondary" className="text-base py-1 px-3 bg-purple-500 text-white">Loan: {application.loanApplicationStatus}</Badge>
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
                            This action cannot be undone. This will permanently delete the application for "{application.applicantFullName}". {/* CORRECTED: Use applicantFullName */}
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
            // This prevents rendering rows for fields that might be null/undefined/missing from the fetched data
            const sectionFields = sectionData.fields.filter(fieldKey => (application as any)[fieldKey] !== undefined);


            if (sectionFields.length === 0) {
              return null;
            }

            return (
              <div key={sectionData.section} className={index > 0 ? "mt-8 pt-6 border-t border-gray-200" : ""}>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{sectionData.section}</h2>
                <Table>
                  <TableBody>
                    {sectionFields.map((fieldKey) => (
                      <TableRow key={fieldKey}>
                        <TableCell className="font-medium text-gray-700 w-1/3 md:w-1/4">
                          {fieldKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </TableCell>
                        <TableCell className="text-gray-800">
                          {renderValue(fieldKey, (application as any)[fieldKey])}
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