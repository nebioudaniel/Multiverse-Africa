"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Package,
  FileText,
  Briefcase,
  Factory,
  ClipboardCheck,
  CheckSquare,
  Handshake,
  HardHat,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";
import { toast } from "sonner";

interface ThankYouPageData {
  associationName: string | number | boolean | null | undefined;
  fullName: string;
  fatherName?: string;
  grandfatherName?: string;
  applicantAssociationName?: string;
  membershipNumber?: string;
  isBusiness?: boolean;
  tin?: string;
  businessLicenseNo?: string;
  region?: string;
  city?: string;
  woredaKebele?: string;
  primaryPhoneNumber: string;
  alternativePhoneNumber?: string;
  emailAddress?: string;
  preferredVehicleType: string;
  vehicleQuantity: number;
  intendedUse?: string;
  digitalSignatureUrl?: string;
  agreedToTerms?: boolean;
}

// --- Sidebar Onboarding Step Component ---
function OnboardingStep({
  icon,
  title,
  description,
  isActive,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div>{icon}</div>
      <div>
        <h3
          className={`text-sm font-semibold ${
            isActive ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {title}
        </h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function Sidebar() {
  const { t } = useTranslation();
  return (
    <aside className="w-1/3 p-13 bg-gray-50 border-r border-gray-100 flex-col justify-between hidden lg:flex print:hidden">
      <div>
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-5">
            Welcome to{" "}
            <span className="text-yellow-600"> Multiverse Minibus & Truck Registration</span>!
          </h1>
          <h2 className="text-xl text-gray-600 mb-8">
            Let's get you registered quickly and easily!
          </h2>
        </div>
        <div className="space-y-6">
          <OnboardingStep
            icon={<CheckCircle className="text-green-500 w-6 h-6" />}
            title="Personal & Business Details"
            description="Your details help us verify your identity and business information."
            isActive={true}
          />
          <OnboardingStep
            icon={<CheckCircle className="text-green-400 w-6 h-6" />}
            title="Minibus, Truck & Service Details"
            description="Provide your minibus ,truck information to get started with our service."
            isActive={true}
          />
          <OnboardingStep
            icon={<CheckCircle className="text-green-400 w-6 h-6" />}
            title="Review & Save"
            description="Review all the information you have provided and print it or save it "
            isActive={true}
          />
        </div>
      </div>
      <div className="mt-auto space-y-4 text-gray-600 text-sm">
        <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-900 transition-colors">
          <Handshake className="h-5 w-5 text-gray-400" />
          <span>{t("thanks.contactSupport")}</span>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-900 transition-colors">
          <HardHat className="h-5 w-5 text-gray-400" />
          <span>{t("thanks.helpCenter")}</span>
        </div>
      </div>
    </aside>
  );
}

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params?.locale as string;
  const [userData, setUserData] = useState<ThankYouPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const toastShownRef = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserData = async () => {
      const id = searchParams?.get("id");
      if (!id) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data: ThankYouPageData = await response.json();
        setUserData(data);

        if (!toastShownRef.current) {
          toast.success(t("thanks.dataLoaded"), {
            description: t("thanks.yourDetailsHaveBeenLoaded"),
          });
          toastShownRef.current = true;
        }
      } catch (err) {
        console.error(err);
        toast.error(t("thanks.dataLoadFailed"), {
          description: t("thanks.dataLoadFailedDescription"),
        });
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [searchParams, t]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      // Use a brief timeout to ensure CSS is applied before print dialog opens
      setTimeout(() => {
          window.print();
      }, 500);
    }
  };

  const DataRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | number | boolean | undefined | null;
  }) => {
    
    // Check for empty/null/undefined/NaN values
    const isValueEmpty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (typeof value === "number" && isNaN(value));

    // Determine the display value (N/A or translated boolean)
    const displayValue = isValueEmpty
      ? t("thanks.na") // Use the N/A translation key
      : typeof value === "boolean"
      ? value
        ? t("thanks.yes")
        : t("thanks.no")
      : value;

    // Special handling for Digital Signature URL
    if (label === t("thanks.digitalSignature") && !isValueEmpty) {
      return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <Icon className="h-4 w-4 text-gray-400 dark:text-zinc-600" />
            <span className="text-sm font-light text-gray-600 dark:text-zinc-400">
              {label}:
            </span>
          </div>
          {/* Only show the link if the value is a valid URL string, otherwise show N/A or actual text */}
          {typeof value === "string" && value.startsWith("http") ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:underline transition-colors print:hidden" // Hide link on print
            >
              {t("thanks.viewSignature")}
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-900 dark:text-zinc-100 print:text-xs">
                {displayValue} {/* Show actual text if not a URL/N/A */}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center space-x-3">
          <Icon className="h-4 w-4 text-gray-400 dark:text-zinc-600" />
          <span className="text-sm font-light text-gray-600 dark:text-zinc-400">
            {label}:
          </span>
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-zinc-100 print:text-xs">
          {displayValue}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-zinc-300">
            {t("thanks.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-lg text-center max-w-md w-full border border-gray-100 dark:border-zinc-800 shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t("thanks.noDataFoundTitle")}
          </h1>
          <p className="text-md text-gray-600 dark:text-zinc-300 mb-6">
            {t("thanks.noDataFoundMessage")}
          </p>
          <div className="mt-6">
            <Link href={`/${locale}/`}>
              <Button className="w-full px-6 py-3 text-md font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                {t("thanks.goToHomepage")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-4xl p-8 bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800 print:p-4 print:shadow-none print:border-0">
          <div className="text-center mb-10 print:mb-6">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4 print:h-8 print:w-8" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 print:text-xl print:text-black">
              {t("thanks.registrationComplete")}
            </h1>
            <p className="text-md text-gray-600 dark:text-zinc-400 print:text-sm print:text-gray-700">
              {t("thanks.thankYouSubmissionRecorded")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center print:text-base print:text-black">
                <User className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 print:text-black" />
                {t("thanks.personalInfo")}
              </h2>
              <div className="space-y-2">
                <DataRow
                  icon={User}
                  label={t("thanks.fullName")}
                  value={userData.fullName}
                />
                <DataRow
                  icon={User}
                  label={t("thanks.fathersName")}
                  value={userData.fatherName}
                />
                <DataRow
                  icon={User}
                  label={t("thanks.grandfathersName")}
                  value={userData.grandfatherName}
                />
                {/* Contact Details */}
                <DataRow
                  icon={Phone}
                  label={t("thanks.primaryPhone")}
                  value={userData.primaryPhoneNumber}
                />
                <DataRow
                  icon={Phone}
                  label={t("thanks.alternativePhone")}
                  value={userData.alternativePhoneNumber}
                />
                <DataRow
                  icon={Mail}
                  label={t("thanks.emailAddress")}
                  value={userData.emailAddress}
                />
              </div>
            </div>
            
            {/* Location and Cooperative Details Section */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center print:text-base print:text-black">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 print:text-black" />
                  {t("thanks.contactLocation")}
                </h2>
                <div className="space-y-2">
                    <DataRow
                      icon={MapPin}
                      label={t("thanks.region")}
                      value={userData.region}
                    />
                    <DataRow
                      icon={MapPin}
                      label={t("thanks.citySubCity")}
                      value={userData.city}
                    />
                    <DataRow
                      icon={MapPin}
                      label={t("thanks.woredaKebele")}
                      value={userData.woredaKebele}
                    />
                </div>
                
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 mt-6 flex items-center print:text-base print:text-black">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 print:text-black" />
                  {t("thanks.cooperativeAssociationDetails")}
                </h2>
                <div className="space-y-2">
                    <DataRow
                      icon={Building2}
                     label={t("thanks.associationName")} // <--- The correct label
                      value={userData.associationName}
                    />
                    <DataRow
                      icon={ClipboardCheck}
                      label={t("thanks.membershipNumber")}
                      value={userData.membershipNumber}
                    />
                </div>
            </div>
          </div>
          
          <Separator className="my-10 bg-gray-200 dark:bg-zinc-800 print:hidden" />
          <Separator className="hidden print:block my-4 bg-gray-400" />


          {/* Business and Vehicle Details Section (Full Width) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {/* Business Information */}
              <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center print:text-base print:text-black">
                      <Briefcase className="h-5 w-5 mr-2 text-green-600 dark:text-green-400 print:text-black" />
                      {t("thanks.businessInformation")}
                  </h2>
                  <div className="space-y-2">
                      <DataRow
                        icon={Briefcase}
                        label={t("thanks.isBusiness")}
                        value={userData.isBusiness}
                      />
                      {/* Always show TIN and License for completeness, using N/A if needed */}
                      <DataRow
                        icon={Factory}
                        label={t("thanks.tin")}
                        value={userData.tin}
                      />
                      <DataRow
                        icon={FileText}
                        label={t("thanks.businessLicenseNo")}
                        value={userData.businessLicenseNo}
                      />
                  </div>
              </div>
              
              {/* Vehicle & Agreement Details */}
              <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center print:text-base print:text-black">
                      <Car className="h-5 w-5 mr-2 text-green-600 dark:text-green-400 print:text-black" />
                      {t("thanks.minibusDetails")}
                  </h2>
                  <div className="space-y-2">
                      <DataRow
                        icon={Car}
                        label={t("thanks.preferredVehicle")}
                        value={userData.preferredVehicleType}
                      />
                      <DataRow
                        icon={Package}
                        label={t("thanks.quantity")}
                        value={userData.vehicleQuantity}
                      />
                      <DataRow
                        icon={Briefcase}
                        label={t("thanks.intendedUse")}
                        value={userData.intendedUse}
                      />
                      <DataRow
                        icon={FileText}
                        label={t("thanks.digitalSignature")}
                        value={userData.digitalSignatureUrl}
                      />
                      <DataRow
                        icon={CheckSquare}
                        label={t("thanks.agreedToTerms")}
                        value={userData.agreedToTerms}
                      />
                  </div>
              </div>
          </div>


          <Separator className="my-10 bg-gray-200 dark:bg-zinc-800 print:hidden" />

          {/* Instruction for print/save */}
          <p className="text-center text-sm text-gray-500 dark:text-zinc-500 mb-6 print:hidden">
            {t("thanks.forYourRecords")}
          </p>

          {/* Buttons - Hidden from print view */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden">
            {/* Button 1: Download as PDF (Uses handlePrint to access browser's 'Save as PDF' option) */}
            <Button
              onClick={handlePrint}
              className="flex-1 py-3 px-6 text-md font-medium text-white bg-blue-600 hover:bg-blue-500 dark:bg-gray-900 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t("thanks.downloadPDF")} 
            </Button>
            
            {/* Button 2: Print Application (Also uses handlePrint) */}
            <Button
              onClick={handlePrint}
              className="flex-1 py-3 px-6 text-md font-medium text-white bg-gray-900 hover:bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors"
            >
              {t("thanks.printApplication")}
            </Button>
            
            {/* Button 3: Go to Homepage */}
            <Link href={`/${locale}/`} className="flex-1">
              <Button
                variant="outline"
                className="w-full py-3 px-6 text-md font-medium border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {t("thanks.goToHomepage")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}