"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  ArrowLeftCircle,
  Eye,
  Printer,
  FileText,
  User,
  Car,
  Edit,
  Paperclip,
  Banknote,
  Briefcase,
  UserRound,
  Target,
  Signature,
  Download,
  FileDown,
  FileTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomLoader from "@/components/ui/custom-loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import JSZip from "jszip";
import Papa from "papaparse";
import { jsPDF } from "jspdf";

// INTERFACE
interface ApplicationData {
  id: string;
  userId: string | null;
  applicantFullName: string | null;
  fatherName: string | null;
  grandfatherName: string | null;
  gender: "Male" | "Female" | "Other" | null;
  idNumber: string | null;
  primaryPhoneNumber: string | null;
  applicantEmailAddress: string | null;
  alternativePhoneNumber: string | null;
  residentialAddress: string | null;
  region: string | null;
  city: string | null;
  woredaKebele: string | null;
  houseNumber: string | null;
  isBusiness: boolean | null;
  entityName: string | null;
  tin: string | null;
  businessLicenseNo: string | null;
  associationName: string | null;
  membershipNumber: string | null;
  driverFullName: string | null;
  driverLicenseNo: string | null;
  licenseCategory: "A" | "B" | "C" | "D" | "E" | null;
  vehicleType: "Diesel_Minibus" | "Electric_Minibus" | "Electric_Mid_Bus_21_1" | "Traditional_Minibus" | null;
  quantityRequested: number | null;
  intendedUse: string | null;
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
  initialRemarks: string | null;
  applicationStatus: "NEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | null;
  assignedToId: string | null;
  processedById: string | null;
  createdAt: string;
  updatedAt: string;
  registeredBy?: { fullName: string } | null;
  assignedTo?: { fullName: string } | null;
  processedBy?: { fullName: string } | null;
}

export default function ViewApplicationPage() {
  const { id: applicationId } = useParams() as { id: string };
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session?.user) { router.push("/admin/login"); return; }

    const authorizedRoles = ['MAIN_ADMIN', 'REGISTRAR_ADMIN', 'APPLICANT'];
    if (!session.user.role || !authorizedRoles.includes(session.user.role)) {
      toast.error("Access Denied", { description: "You do not have permission to view applications." });
      router.push("/admin/dashboard");
      return;
    }

    const fetchApplication = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/applications/${applicationId}`);
        if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch application data.");

        const data: ApplicationData = await res.json();
        setApplication(data);
      } catch (err: any) {
        setError(err.message || String(err));
        toast.error("Error loading application", { description: err.message || String(err) });
      } finally { setIsLoading(false); }
    };

    if (applicationId) fetchApplication();
  }, [applicationId, session, sessionStatus, router]);

  const handleExportCSV = () => { /* implement as before */ };
  const handleExportPDF = () => { /* implement as before */ };
  const handleDownloadAttachments = async () => { /* implement as before */ };
  const handlePrint = () => { /* implement as before */ };

  const getApplicationStatusVariant = (status: ApplicationData["applicationStatus"]) => {
    switch (status) {
      case "NEW": return "default";
      case "UNDER_REVIEW": return "secondary";
      case "APPROVED": return "success";
      case "REJECTED": return "destructive";
      default: return "default";
    }
  };

  const getLoanStatusVariant = (status: ApplicationData["loanApplicationStatus"]) => {
    switch (status) {
      case "Pending": return "default";
      case "Approved": return "success";
      case "Disbursed": return "outline";
      case "Denied": return "destructive";
      default: return "default";
    }
  };

  const getRegistrationStatusVariant = (isComplete: boolean) => isComplete ? "success" : "destructive";

  const isApplicantRegistrationComplete = (appData: ApplicationData | null): boolean => {
    if (!appData) return false;

    const requiredFields: (keyof ApplicationData)[] = [
      'applicantFullName', 'fatherName', 'grandfatherName', 'primaryPhoneNumber', 'idNumber', 'gender',
      'residentialAddress', 'region', 'city', 'woredaKebele',
      'driverFullName', 'driverLicenseNo', 'licenseCategory'
    ];

    const legalComplete = appData.agreedToTerms === true && !!appData.digitalSignatureUrl;

    const baseComplete = requiredFields.every(field => !!appData[field]) && legalComplete;

    return baseComplete;
  };

  const FieldValue = ({ label, value }: { label: string; value: string | number | boolean | null | undefined }) => (
    <div className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900 break-words max-w-[65%] text-right">
        {value !== null && value !== undefined && String(value).trim() !== '' ? String(value) : "Not Provided"}
      </span>
    </div>
  );

  const FileLink = ({ label, url }: { label: string; url: string | null | undefined }) => (
    <div className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      {url && String(url).trim() !== '' ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2 break-all text-right max-w-[65%]">
          <Paperclip className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{url.split('/').pop()?.split('?')[0] || "Document"}</span>
        </a>
      ) : <span className="text-sm text-gray-500 text-right max-w-[65%]">Not Provided</span>}
    </div>
  );

  const BooleanField = ({ label, value }: { label: string; value: boolean | null | undefined }) => (
    <div className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className={`text-sm font-semibold text-right max-w-[65%] ${value === true ? 'text-green-600' : value === false ? 'text-red-600' : 'text-gray-500'}`}>
        {value === true ? 'Yes' : value === false ? 'No' : 'Not Provided'}
      </span>
    </div>
  );

  if (isLoading || sessionStatus === "loading") {
    return <CustomLoader message="Loading application details..." emoji="📝" />;
  }
  if (error) return (
    <div className="min-h-screen p-6 sm:p-8 text-center bg-gray-50 flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-red-600">Error Loading Application</h2>
      <p className="mt-2 text-gray-600">{error}</p>
      <Button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">Try Again</Button>
    </div>
  );
  if (!application) return (
    <div className="min-h-screen p-6 sm:p-8 text-center bg-gray-50 flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-gray-600">Application Not Found</h2>
      <p className="mt-2 text-gray-500">The application with ID "{applicationId}" could not be found.</p>
      <Button onClick={() => router.push("/admin/applications")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"><ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to Applications</Button>
    </div>
  );

  const isRegComplete = isApplicantRegistrationComplete(application);

  return (
    <div className="min-h-screen p-6 sm:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Eye className="h-7 w-7 text-blue-600" />
            Application Details: {application.id.substring(0, 8)}...
          </h1>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => router.push(`/admin/applications/${application.id}/edit`)} className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <Edit className="mr-2 h-5 w-5" /> Edit Application
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/applications")} className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <ArrowLeftCircle className="mr-2 h-5 w-5" /> Back to List
            </Button>
          </div>
        </div>
        <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold text-gray-800">Application Details</CardTitle>
          </CardHeader>
          <CardContent ref={contentRef} className="p-6 sm:p-8 space-y-6">
            {/* Application Overview */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-indigo-600" /> Application Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FieldValue label="Application ID" value={application.id} />
                <FieldValue label="User ID" value={application.userId} />
                <FieldValue label="Submitted On" value={new Date(application.createdAt).toLocaleDateString()} />
                <FieldValue label="Last Updated" value={new Date(application.updatedAt).toLocaleDateString()} />
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-gray-600">Application Status</span>
                  <Badge variant={getApplicationStatusVariant(application.applicationStatus)} className="px-3 py-1">
                    {application.applicationStatus?.replace(/_/g, " ") || "Not Provided"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-gray-600">Loan Status</span>
                  <Badge variant={getLoanStatusVariant(application.loanApplicationStatus)} className="px-3 py-1">
                    {application.loanApplicationStatus || "Not Provided"}
                  </Badge>
                </div>
                <FieldValue label="Assigned To" value={application.assignedTo?.fullName || "Unassigned"} />
                <FieldValue label="Last Processed By" value={application.processedBy?.fullName || "Not Provided"} />
                <FieldValue label="Remarks/Notes" value={application.initialRemarks} />
              </div>
            </div>
            <Separator className="bg-gray-300" />

            {/* Buyer Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <User className="h-6 w-6 text-blue-600" /> Buyer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FieldValue label="Full Name" value={application.applicantFullName} />
                <FieldValue label="Father's Name" value={application.fatherName} />
                <FieldValue label="Grandfather's Name" value={application.grandfatherName} />
                <FieldValue label="Gender" value={application.gender} />
                <FieldValue label="ID Number" value={application.idNumber} />
                <FieldValue label="Primary Phone" value={application.primaryPhoneNumber} />
                <FieldValue label="Alternative Phone" value={application.alternativePhoneNumber} />
                <FieldValue label="Email Address" value={application.applicantEmailAddress} />
                <FieldValue label="Residential Address" value={application.residentialAddress} />
                <FieldValue label="Region" value={application.region} />
                <FieldValue label="City/Sub-city" value={application.city} />
                <FieldValue label="Woreda/Kebele" value={application.woredaKebele} />
                <FieldValue label="House Number" value={application.houseNumber} />
                <BooleanField label="Is Business" value={application.isBusiness} />
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-gray-600">Registration Status</span>
                  <Badge variant={getRegistrationStatusVariant(isRegComplete)} className="px-3 py-1">
                    {isRegComplete ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
                <FieldValue label="Registered By" value={application.registeredBy?.fullName || "Not Provided"} />
              </div>
            </div>

            {(application.isBusiness || application.associationName || application.membershipNumber) && (
              <>
                <Separator className="bg-gray-300" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <Briefcase className="h-6 w-6 text-purple-600" /> Business / Association Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldValue label="Business Entity Name" value={application.entityName} />
                    <FieldValue label="TIN" value={application.tin} />
                    <FieldValue label="Business License No." value={application.businessLicenseNo} />
                    <FieldValue label="Association Name" value={application.associationName} />
                    <FieldValue label="Membership Number" value={application.membershipNumber} />
                  </div>
                </div>
              </>
            )}
            <Separator className="bg-gray-300" />

            {/* Driver Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <UserRound className="h-6 w-6 text-teal-600" /> Driver Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FieldValue label="Driver's Full Name" value={application.driverFullName} />
                <FieldValue label="Driver's License No." value={application.driverLicenseNo} />
                <FieldValue label="License Category" value={application.licenseCategory} />
              </div>
            </div>
            <Separator className="bg-gray-300" />

            {/* Vehicle Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Car className="h-6 w-6 text-red-600" /> Vehicle Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FieldValue label="Vehicle Type" value={application.vehicleType ? application.vehicleType.replace(/_/g, " ") : null} />
                <FieldValue label="Quantity Requested" value={application.quantityRequested} />
                <FieldValue label="Intended Use" value={application.intendedUse} />
              </div>
            </div>
            <Separator className="bg-gray-300" />

            {/* Optional Preferences */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Target className="h-6 w-6 text-blue-700" /> Optional Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BooleanField label="GPS Tracking Enabled" value={application.enableGpsTracking} />
                <BooleanField label="Accepts E-Payment" value={application.acceptEpayment} />
              </div>
            </div>
            <Separator className="bg-gray-300" />

            {/* Financing Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Banknote className="h-6 w-6 text-green-600" /> Financing Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FieldValue label="Preferred Financing Institution" value={application.preferredFinancingInstitution} />
                <FieldValue label="Loan Amount Requested (ETB)" value={application.loanAmountRequested} />
                <FieldValue label="Bank Reference Number" value={application.bankReferenceNumber} />
                <FieldValue label="Loan Application Status" value={application.loanApplicationStatus} />
              </div>
            </div>
            <Separator className="bg-gray-300" />

            {/* Legal & Signature */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Signature className="h-6 w-6 text-yellow-600" /> Legal & Signature
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BooleanField label="Agreed to Terms" value={application.agreedToTerms} />
                <FileLink label="Digital Signature" url={application.digitalSignatureUrl} />
              </div>
            </div>
            <Separator className="bg-gray-300" />

            {/* Document Attachments */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Paperclip className="h-6 w-6 text-orange-600" /> Document Attachments
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FileLink label="Down Payment Proof" url={application.downPaymentProofUrl} />
                <FileLink label="ID Scan" url={application.idScanUrl} />
                <FileLink label="TIN Document" url={application.tinNumberUrl} />
                <FileLink label="Supporting Letters" url={application.supportingLettersUrl} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 sm:p-8 flex flex-wrap gap-3 justify-end border-t border-gray-200">
            <Button onClick={handleExportCSV} variant="outline" className="text-sm border-gray-300 text-gray-700 hover:bg-gray-100"><FileDown className="mr-2 h-4 w-4" /> Export CSV</Button>
            <Button onClick={handleExportPDF} variant="outline" className="text-sm border-gray-300 text-gray-700 hover:bg-gray-100"><FileTextIcon className="mr-2 h-4 w-4" /> Export PDF</Button>
            <Button onClick={handleDownloadAttachments} variant="outline" className="text-sm border-gray-300 text-gray-700 hover:bg-gray-100"><Download className="mr-2 h-4 w-4" /> Download Attachments</Button>
            <Button onClick={handlePrint} variant="outline" className="text-sm border-gray-300 text-gray-700 hover:bg-gray-100"><Printer className="mr-2 h-4 w-4" /> Print View</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
