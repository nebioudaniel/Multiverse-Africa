// app/admin/applications/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, FileText, Search, Filter, Edit, Eye, Trash2 } from "lucide-react"; // Import Trash2 icon
import CustomLoader from "@/components/ui/custom-loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { // Import Shadcn UI AlertDialog components
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


// Define a minimal User interface for the nested applicant object
interface ApplicantData {
    id: string;
    fullName: string;
    fatherName: string | null;
    grandfatherName: string | null;
    isBusiness: boolean;
    entityName: string | null;
    tin: string | null;
    businessLicenseNo: string | null;
    emailAddress: string | null;
    primaryPhoneNumber: string;
    alternativePhoneNumber: string | null;
    gender: string | null;
    idNumber: string | null;
    residentialAddress: string | null;
    region: string | null;
    city: string | null;
    woredaKebele: string | null;
    houseNumber: string | null;
    associationName: string | null;
    membershipNumber: string | null;
    preferredVehicleType: string | null;
    vehicleQuantity: number | null;
    intendedUse: string | null;
    role: string;
    createdAt: string;
    registeredBy?: {
        fullName: string;
    } | null;
}

// Update Application interface to include the nested applicant data
interface Application {
  id: string;
  applicantFullName: string;
  primaryPhoneNumber: string;
  applicantEmailAddress?: string | null;
  applicationStatus: "NEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  loanApplicationStatus: "Pending" | "Approved" | "Disbursed" | "Denied";
  assignedTo?: {
    fullName: string;
  } | null;
  processedBy?: {
    fullName: string;
  } | null;
  applicant?: ApplicantData | null; // NEW: Nested applicant data
  createdAt: string;
  updatedAt: string;
}

export default function AdminApplicationsPageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // State to track which application is being deleted

  const [searchTermInput, setSearchTermInput] = useState(searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  // Determine if the current user is a Main Admin
  const isMainAdmin = session?.user?.role === "MAIN_ADMIN";


  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/admin/login");
      return;
    }

    const authorizedRoles = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];
    if (!session.user.role || !authorizedRoles.includes(session.user.role)) {
      toast.error("Access Denied", {
        description: "You do not have permission to view applications.",
      });
      router.push("/admin/dashboard");
      return;
    }

    fetchApplications();
  }, [session, status, router, searchQuery, statusFilter]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);

      if (statusFilter && statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      router.replace(`?${params.toString()}`, { shallow: true });

      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch applications.");
      }
      const data: Application[] = await res.json();
      setApplications(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Error loading applications", {
        description: err.message,
        duration: 5000,
        richColors: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    setSearchQuery(searchTermInput);
  };

  const isApplicantRegistrationComplete = (applicant: ApplicantData | null | undefined): boolean => {
    if (!applicant) return false;

    const requiredFields: (keyof ApplicantData)[] = [
      'fullName',
      'primaryPhoneNumber',
      'idNumber',
      'gender',
      'residentialAddress',
      'region',
      'city',
      'woredaKebele',
    ];

    const allRequiredPresent = requiredFields.every(field => {
      const value = applicant[field];
      return value !== null && value !== undefined && String(value).trim() !== '';
    });

    if (applicant.isBusiness) {
      const businessFields: (keyof ApplicantData)[] = ['entityName', 'tin', 'businessLicenseNo'];
      const allBusinessFieldsPresent = businessFields.every(field => {
        const value = applicant[field];
        return value !== null && value !== undefined && String(value).trim() !== '';
      });
      return allRequiredPresent && allBusinessFieldsPresent;
    }

    return allRequiredPresent;
  };

  const getApplicationStatusVariant = (status: Application["applicationStatus"]) => {
    switch (status) {
      case "NEW":
        return "success";
      case "UNDER_REVIEW":
        return "warning";
      case "APPROVED":
        return "info";
      case "REJECTED":
        return "destructive";
      default:
        return "default";
    }
  };

  const getLoanStatusVariant = (status: Application["loanApplicationStatus"]) => {
    switch (status) {
      case "Pending":
        return "default";
      case "Approved":
        return "success";
      case "Disbursed":
        return "info";
      case "Denied":
        return "destructive";
      default:
        return "default";
    }
  };

  const getRegistrationStatusVariant = (isComplete: boolean) => {
    return isComplete ? "success" : "destructive";
  };

  // New function to handle application deletion
  const handleDeleteApplication = async (applicationId: string) => {
    setIsDeleting(applicationId); // Set state to indicate this application is being deleted
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete application.");
      }

      toast.success("Application deleted successfully!", {
        description: `Application ID: ${applicationId.substring(0, 8)}... has been removed.`,
      });
      fetchApplications(); // Re-fetch the list to update the UI
    } catch (err: any) {
      toast.error("Error deleting application", {
        description: err.message,
        duration: 5000,
        richColors: true,
      });
    } finally {
      setIsDeleting(null); // Clear deleting state
    }
  };


  if (isLoading || status === "loading") {
    return <CustomLoader message="Loading applications..." emoji="📋" />;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 text-center text-red-600 bg-gray-50">
        <h2 className="text-xl font-semibold">Error Loading Applications</h2>
        <p>{error}</p>
        <Button onClick={() => fetchApplications()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">
          <FileText className="inline-block mr-3 text-indigo-600" />
          All Applications
        </h1>
        {(session?.user?.role === 'MAIN_ADMIN' || session?.user?.role === 'REGISTRAR_ADMIN') && (
          <Button onClick={() => router.push("/admin/applications/create")} className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Application
          </Button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <Input
            placeholder="Search by name, phone, email, or application ID..."
            value={searchTermInput}
            onChange={(e) => setSearchTermInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchClick();
              }
            }}
            className="pl-10 pr-4"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button onClick={handleSearchClick} className="flex-shrink-0">
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-[180px] flex-shrink-0">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => {
          setSearchTermInput('');
          setSearchQuery('');
          setStatusFilter('all');
        }} className="flex-shrink-0">
          Reset Filters
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {applications.length === 0 && !isLoading ? (
          <div className="p-6 text-center text-gray-600">
            No applications found matching your criteria.
            <Button variant="link" onClick={() => router.push("/admin/applications/create")}>
                Create one now?
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Applicant Reg. Status</TableHead>
                <TableHead>Application Status</TableHead>
                <TableHead>Loan Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Processed By</TableHead>
                <TableHead>Registered By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => {
                const isRegComplete = isApplicantRegistrationComplete(app.applicant);
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      <span title={app.id}>{app.id.substring(0, 8)}...</span>
                    </TableCell>
                    <TableCell>{app.applicantFullName}</TableCell>
                    <TableCell>{app.primaryPhoneNumber}</TableCell>
                    <TableCell>
                      <Badge variant={getRegistrationStatusVariant(isRegComplete)}>
                        {isRegComplete ? "Complete" : "Incomplete"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getApplicationStatusVariant(app.applicationStatus)}>
                        {app.applicationStatus.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLoanStatusVariant(app.loanApplicationStatus)}>
                        {app.loanApplicationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.assignedTo?.fullName || "Unassigned"}</TableCell>
                    <TableCell>{app.processedBy?.fullName || "N/A"}</TableCell>
                    <TableCell>{app.applicant?.registeredBy?.fullName || "N/A"}</TableCell>
                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right flex space-x-2 justify-end"> {/* Added flex and space-x-2 */}
                      {/* View Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/applications/${app.id}/view`)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      {/* Edit Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/applications/${app.id}/edit`)}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>

                      {/* Delete Button (Main Admin Only) */}
                      {isMainAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isDeleting === app.id} // Disable if this specific app is being deleted
                              className="flex items-center"
                            >
                              {isDeleting === app.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                              )}
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the application
                                with ID <strong>{app.id.substring(0, 8)}...</strong> and remove its data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteApplication(app.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isDeleting === app.id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}