//@ts-nocheck
// app/admin/applications/[id]/view/page.tsx (Complete and Corrected)
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
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import html2canvas from 'html2canvas';

// INTERFACE (assumed complete)
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

  // Content ref for PDF/Print
  const contentRef = useRef<HTMLDivElement>(null); 
  // Ref for the entire page wrapper to control print styles
  const pageWrapperRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session?.user) { router.push("/admin/login"); return; }

   const authorizedRoles = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];
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

  // VVVVVV EXPORT FUNCTIONS VVVVVV

  const handleExportExcel = () => { 
    if (!application) {
        toast.error("No application data to export.");
        return;
    }

    try {
        // Flatten the application data for Excel
        const flatData = {
            'Application ID': application.id,
            'Submitted On': new Date(application.createdAt).toLocaleDateString(),
            'Application Status': application.applicationStatus?.replace(/_/g, " ") || 'N/A',
            'Loan Status': application.loanApplicationStatus || 'N/A',
            'Applicant Full Name': application.applicantFullName,
            "Father's Name": application.fatherName,
            "Grandfather's Name": application.grandfatherName,
            'Gender': application.gender,
            'ID Number': application.idNumber,
            'Primary Phone': application.primaryPhoneNumber,
            'Email Address': application.applicantEmailAddress,
            'Region': application.region,
            'City': application.city,
            'Woreda/Kebele': application.woredaKebele,
            'House Number': application.houseNumber,
            'Is Business': application.isBusiness ? 'Yes' : 'No',
            'Business Entity Name': application.entityName,
            'TIN': application.tin,
            'Business License No.': application.businessLicenseNo,
            'Driver Full Name': application.driverFullName,
            "Driver's License No.": application.driverLicenseNo,
            'License Category': application.licenseCategory,
            'Vehicle Type': application.vehicleType?.replace(/_/g, " ") || 'N/A',
            'Quantity Requested': application.quantityRequested,
            'Intended Use': application.intendedUse,
            'GPS Tracking Enabled': application.enableGpsTracking ? 'Yes' : 'No',
            'Accepts E-Payment': application.acceptEpayment ? 'Yes' : 'No',
            'Loan Amount Requested (ETB)': application.loanAmountRequested,
            'Preferred Financing Institution': application.preferredFinancingInstitution,
            'Agreed to Terms': application.agreedToTerms ? 'Yes' : 'No',
            'Assigned To': application.assignedTo?.fullName || 'Unassigned',
            'Remarks': application.initialRemarks || 'N/A',
        };

        const ws = XLSX.utils.json_to_sheet([flatData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Application Details");

        const fileName = `Application_${application.id.substring(0, 8)}.xlsx`;
        XLSX.writeFile(wb, fileName);

        toast.success("Export Successful", { description: `Application data exported to ${fileName}.` });

    } catch (e: any) {
        console.error("Excel export error:", e);
        toast.error("Export Failed", { description: e.message || "An error occurred during Excel file creation." });
    }
  };

  /**
   * FIX 1: Corrected PDF generation to ensure better compatibility and page splitting.
   */
  const handleExportPDF = () => { 
    if (!application || !contentRef.current) {
        toast.error("Cannot generate PDF: Missing data or content.");
        return;
    }

    const toastId = toast.loading("Generating PDF... Please wait.");
    const content = contentRef.current;
    
    // Temporarily hide actions/buttons for PDF capture
    const actionButtons = content.closest('div')?.querySelector('footer');
    if (actionButtons) actionButtons.style.display = 'none'; // Hide the CardFooter

    html2canvas(content, { 
        scale: 3, // Increase scale for high-quality capture
        useCORS: true, 
        allowTaint: true, // Allows images from other origins (e.g., signatures)
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0); // Use JPEG for smaller file size
        
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        // Logic for multi-page PDF
        while (heightLeft > 0) {
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
            position -= pdfHeight;

            if (heightLeft > 0) {
                pdf.addPage();
            }
        }

        const fileName = `Application_${application.id.substring(0, 8)}.pdf`;
        pdf.save(fileName);
        
        toast.success("PDF Downloaded", { id: toastId, description: `Application view exported to ${fileName}.` });
    }).catch((error) => {
        console.error("PDF generation error:", error);
        toast.error("PDF Failed", { id: toastId, description: "Could not render content for PDF. Check console for details." });
    }).finally(() => {
        // Reset action buttons display
        if (actionButtons) actionButtons.style.display = 'flex'; // Assuming CardFooter uses flex
    });
  };

  /**
   * FIX 2: Implementation for Download Attachments.
   */
  const handleDownloadAttachments = async () => { 
    if (!application) return toast.error("No application data available.");

    const attachments = [
        { name: "Down_Payment_Proof", url: application.downPaymentProofUrl },
        { name: "ID_Scan", url: application.idScanUrl },
        { name: "TIN_Document", url: application.tinNumberUrl },
        { name: "Supporting_Letters", url: application.supportingLettersUrl },
        { name: "Digital_Signature", url: application.digitalSignatureUrl },
    ].filter(a => a.url); // Filter out null/empty URLs

    if (attachments.length === 0) {
        toast.info("No attachments found for this application.");
        return;
    }

    const toastId = toast.loading(`Downloading ${attachments.length} attachments...`);
    let successfulDownloads = 0;

    // Use a temporary link element to trigger the download for each file
    for (const attachment of attachments) {
        if (attachment.url) {
            try {
                // Fetch the file to get the correct content type/name
                const res = await fetch(attachment.url, { mode: 'cors' });
                if (!res.ok) throw new Error(`Failed to fetch ${attachment.name}`);
                
                const blob = await res.blob();
                // Basic extension guess. In production, consider fetching file metadata if possible.
                const fileExtension = blob.type.split('/')[1] === 'jpeg' ? 'jpg' : blob.type.split('/')[1] || 'bin'; 

                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `${attachment.name}_${application.id.substring(0, 8)}.${fileExtension}`;
                
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(downloadLink.href);

                successfulDownloads++;
            } catch (error) {
                console.error(`Download failed for ${attachment.name}:`, error);
                // Continue to the next attachment even if one fails
            }
        }
    }

    toast.success("Download Complete", { 
        id: toastId, 
        description: `Successfully downloaded ${successfulDownloads} out of ${attachments.length} files.`,
        duration: 5000
    });
  };


  /**
   * FIX 3: Implementation for Print View (Hides UI elements not needed for print).
   */
  const handlePrint = () => { 
    if (!pageWrapperRef.current) {
        toast.error("Cannot print: Content element not found.");
        return;
    }

    // Add a class to the wrapper that hides non-content elements via CSS media query
    pageWrapperRef.current.classList.add('print-only-content');
    
    // Wait for the browser to apply the CSS changes, then print
    setTimeout(() => {
        window.print();
        // Remove the class after printing is done (or fails)
        pageWrapperRef.current?.classList.remove('print-only-content');
    }, 100); 
  };
  // ^^^^^^ EXPORT FUNCTIONS ^^^^^^

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
      <p className="mt-2 text-gray-500">The application with ID {applicationId} could not be found.</p>
      <Button onClick={() => router.push("/admin/applications")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"><ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to Applications</Button>
    </div>
  );

  const isRegComplete = isApplicantRegistrationComplete(application);

  return (
    // FIX 3: Added pageWrapperRef to the outermost div for print control
    <div className="min-h-screen p-6 sm:p-8 bg-gray-50" ref={pageWrapperRef}> 
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
          
          {/* CardContent has the contentRef attached for PDF/Print */}
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
            {/* EXPORT BUTTONS */}
            <Button onClick={handleExportExcel} variant="outline" className="text-sm border-green-400 text-gray-700 hover:bg-green-200"><FileDown className="mr-2 h-4 w-4" /> Export Excel</Button>
            <Button onClick={handlePrint} variant="outline" className="text-sm border-blue-400 text-gray-700 hover:bg-blue-200"><Printer className="mr-2 h-4 w-4" /> Print View</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}