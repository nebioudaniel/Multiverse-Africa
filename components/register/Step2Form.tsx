// src/app/[locale]/register/Step2Form.tsx (Main File)
'use client';

import React, { useMemo, useState } from "react"; // ADDED useState
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { VehicleDetailSelector } from "./VehicleCarousel"; 
import { useRegistration, fullRegistrationSchema, RegistrationFormData } from "./RegisterFormContainer";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';
import {
  Car,
  FileText,
  ArrowLeft,
  CheckCircle,
  User,
  Circle,
  Handshake,
  HardHat,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
// NEW: Import the Terms Dialog component
import TermsDialog from '../../app/[locale]/register/TermsDialog'; 


// --- Terms and Conditions Content (Raw HTML/Text for the Dialog) ---
// Note: Using a single string with <br> and <b> for simplicity in presentation
const TERMS_CONTENT_EN = `

<b>This Website Registration Agreement (“Agreement”) is entered into by and between:</b>
Multiverse Enterprise PLC (“Multiverse”), duly incorporated under the laws of the Federal Democratic Republic of Ethiopia, with its principal office at Gotera ,Adiss Ababa, acting as the official sales and marketing partner for approved vehicle suppliers, and as the operator of this registration platform,
<b>AND</b>
Any individual, association, company, cooperative, regional state, or government agency registering through this platform (“Applicant”).

<br><br><b>ARTICLE 1 – DEFINITIONS</b>
1.1. <b>“Applicant”</b> means any person, cooperative, company, regional state, or government entity submitting registration on this platform.
1.2. <b>“Suppliers”</b> means King Long, Shacman, or any other approved manufacturer of minibuses, midbuses, trucks, or related products.
1.3. <b>“DEIG”</b> means the Defense Engineering Industry Group, responsible for assembly of SKD/CKD kits in Ethiopia.
1.4. <b>“Bank”</b> means any financial institution approached by the Applicant for financing or loan facilities.
1.5. <b>“Registration”</b> means submission of information on this platform to express interest in acquiring vehicles.
1.6. <b>“Sales Agreement”</b> means a separate contract entered into between the Applicant and the Supplier (through Multiverse as sales & marketing agent, or directly with Supplier), subject to full payment.

<br><br><b>ARTICLE 2 – PURPOSE & SCOPE</b>
2.1. This Agreement governs use of Multiverse’s website for registration of vehicles supplied by approved manufacturers.
2.2. Multiverse acts in its capacity as exclusive sales and marketing partner for such vehicles but does not assume manufacturer, assembler, or financing liabilities.
2.3. Registration constitutes an expression of interest only and does not create a binding purchase or financing obligation.

<br><br><b>ARTICLE 3 – SALES & MARKETING ROLE OF MULTIVERSE</b>
3.1. Multiverse is responsible for:
<ul>
  <li>Facilitating sales and marketing activities,</li>
  <li>Coordinating presales and expressions of interest,</li>
  <li>Liaising with Banks, DEIG, and Suppliers to streamline the process.</li>
</ul>
3.2. Multiverse’s role is strictly limited to facilitation. Multiverse is not the manufacturer, assembler, or lender.
3.3. Any binding purchase shall only occur upon execution of a separate Sales Agreement and receipt of full payment.

<br><br><b>ARTICLE 4 – SUPPLIER RESPONSIBILITIES</b>
4.1. All obligations concerning product quality, performance, safety, specifications, warranties, delivery timelines, and after-sales service rest exclusively with <b>Suppliers (e.g., King Long, Shacman)</b>.
4.2. Multiverse shall not be liable for:
<ul>
  <li>Product defects, recalls, or safety issues,</li>
  <li>Delays or failure in manufacturing or shipment,</li>
  <li>Warranty or after-sales disputes.</li>
</ul>

<br><br><b>ARTICLE 5 – RESPONSIBILITIES OF DEIG</b>
5.1. Where vehicles are locally assembled by DEIG, DEIG assumes full responsibility for assembly quality, compliance with standards, and homologation.
5.2. Multiverse is not responsible for any delays, faults, or damages arising from assembly.

<br><br><b>ARTICLE 6 – RESPONSIBILITIES OF BANKS & FINANCING</b>
6.1. Financing decisions, approvals, rejections, and terms are the sole responsibility of Banks.
6.2. Multiverse does not guarantee financing or loan approvals.
6.3. Multiverse shall not be liable for delays, rejections, or disputes arising from financing arrangements.

<br><br><b>ARTICLE 7 – OBLIGATIONS OF APPLICANTS</b>
7.1. Applicants must provide complete and accurate information during registration.
7.2. Applicants acknowledge that:
<ul>
  <li>Registration does not guarantee allocation or delivery of vehicles,</li>
  <li>Sales occur only after signing a Sales Agreement and making full payment,</li>
  <li>Financing arrangements are between the Applicant and the Bank.</li>
</ul>
7.3. Applicants indemnify Multiverse against losses caused by false or misleading information.

<br><br><b>ARTICLE 8 – LIMITATION OF LIABILITY</b>
8.1. Multiverse shall not be liable for:
<ul>
  <li>Direct, indirect, or consequential damages,</li>
  <li>Financial or business losses,</li>
  <li>Product faults, accidents, or recalls,</li>
  <li>Assembly issues under DEIG’s responsibility,</li>
  <li>Rejections of financing by Banks.</li>
</ul>
8.2. All liability rests with Suppliers, DEIG, or Banks as applicable.

<br><br><b>ARTICLE 13 – DISCLAIMER</b>
13.1. <b>Registration is not a Sale</b> – Submission of information through this website constitutes only an expression of interest. It does not create any entitlement to delivery, nor does it constitute a reservation or guarantee of a vehicle.
13.2. <b>No Guarantee of Financing</b> – Multiverse does not provide financing. All financing is subject to approval by independent Banks, and Multiverse shall not be liable for rejection, delays, or terms of any loan application.
13.3. <b>No Liability for Manufacturing, Assembly, or Delivery</b> – All product-related matters, including quality, safety, performance, delivery, and warranties, are the sole responsibility of the Supplier. Local assembly issues are the sole responsibility of DEIG. Multiverse acts only as sales and marketing partner and assumes no liability.
`;

const TERMS_CONTENT_AM = `


<b>ይህ የድረ-ገጽ ምዝገባ ስምምነት (“ስምምነቱ”) በሚከተሉት ወገኖች መካከል የተፈፀመ ነው፡-</b>
የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ ህግጋትን ተከትሎ የተቋቋመው መልቲቨርስ ኢንተርፕራይዝ ኃ.የተ.የግ.ማ. (“መልቲቨርስ”)፤ ዋናው ጽ/ቤቱ በ ጎተራ፣አዲስ አበባ የሚገኝ ሲሆን፣ ለተፈቀደላቸው የተሽከርካሪ አቅራቢዎች **ኦፊሴላዊ የሽያጭ እና ግብይት አጋር** በመሆንና የዚህን የምዝገባ መድረክ **ኦፕሬተር** በመሆን፣
<b>እና</b>
በዚህ መድረክ በኩል የሚመዘግብ ማንኛውም ግለሰብ፣ ማህበር፣ ኩባንያ፣ ህብረት ስራ ማህበር፣ ክልላዊ መንግስት፣ ወይም የመንግስት ኤጀንሲ (“አመልካች”)።

<br><br><b>አንቀጽ 1 – ትርጉሞች</b>
1.1. <b>“አመልካች”</b> ማለት በዚህ መድረክ ላይ ምዝገባ የሚያስገባ ማንኛውም ግለሰብ፣ ህብረት ስራ ማህበር፣ ኩባንያ፣ ክልላዊ መንግስት ወይም የመንግስት አካል ማለት ነው።
1.2. <b>“አቅራቢዎች”</b> ማለት ኪንግ ሎንግ (King Long)፣ ሻክማን (Shacman)፣ ወይም ሌላ ማንኛውም የጸደቀ ሚኒባስ፣ ሚድበስ፣ የጭነት መኪና ወይም ተዛማጅ ምርቶች አምራች ማለት ነው።
1.3. <b>“ዲ.ኢ.አይ.ጂ (DEIG)”</b> ማለት በኢትዮጵያ ውስጥ የኤስ.ኬ.ዲ (SKD) / ሲ.ኬ.ዲ (CKD) ኪት ስብስቦችን የማገጣጠም ኃላፊነት ያለበት የመከላከያ ኢንጂነሪንግ ኢንዱስትሪ ግሩፕ ማለት ነው።
1.4. <b>“ባንክ”</b> ማለት አመልካቹ ለፋይናንስ ወይም ለብድር አገልግሎት የሚያነጋግረው ማንኛውም የፋይናንስ ተቋም ማለት ነው።
1.5. <b>“ምዝገባ”</b> ማለት ተሽከርካሪዎችን ለመግዛት ፍላጎትን ለመግለጽ በዚህ መድረክ ላይ መረጃ ማስገባት ማለት ነው።
1.6. <b>“የሽያጭ ስምምነት”</b> ማለት በአመልካች እና በአቅራቢው (በመልቲቨርስ የሽያጭ እና ግብይት ወኪልነት፣ ወይም በቀጥታ ከአቅራቢው ጋር) መካከል የሚደረግ የተለየ ውል ሲሆን፣ ይህም ሙሉ ክፍያ ሲፈፀም ብቻ ተፈፃሚ ይሆናል።

<br><br><b>አንቀጽ 2 – ዓላማ እና ወሰን</b>
2.1. ይህ ስምምነት በጸደቁ አምራቾች የሚቀርቡ ተሽከርካሪዎችን ለመመዝገብ የመልቲቨርስን ድረ-ገጽ አጠቃቀም የሚገዛ ነው።
2.2. መልቲቨርስ ለእንደዚህ አይነት ተሽከርካሪዎች ብቸኛ የሽያጭ እና ግብይት አጋር በመሆን ያገለግላል እንጂ የአምራች፣ የአገጣጣሚ ወይም የፋይናንስ ኃላፊነቶችን አይወስድም።
2.3. ምዝገባው የፍላጎት መግለጫ ብቻ ሲሆን **ግዴታ ያለበት የግዢ ወይም የፋይናንስ ግዴታ** አይፈጥርም።

<br><br><b>አንቀጽ 3 – የመልቲቨርስ የሽያጭ እና ግብይት ሚና</b>
3.1. መልቲቨርስ ለሚከተሉት ተግባራት ኃላፊነት አለበት፡-
<ul>
  <li>የሽያጭ እና የግብይት እንቅስቃሴዎችን ማመቻቸት፣</li>
  <li>ቅድመ-ሽያጭ እና የፍላጎት መግለጫዎችን ማስተባበር፣</li>
  <li>ሂደቱን ለማቀላጠፍ ከባንኮች፣ ከዲ.ኢ.አይ.ጂ እና ከአቅራቢዎች ጋር መገናኘት።</li>
</ul>
3.2. የመልቲቨርስ ሚና በጥብቅ **ለማመቻቸት ብቻ** የተገደበ ነው። መልቲቨርስ አምራች፣ አገጣጣሚ ወይም አበዳሪ አይደለም።
3.3. ማንኛውም ግዴታ ያለበት ግዢ የሚፈጸመው የተለየ የሽያጭ ስምምነት ከተፈረመ እና ሙሉ ክፍያ ከተፈጸመ በኋላ ብቻ ነው።

<br><br><b>አንቀጽ 4 – የአቅራቢዎች ኃላፊነቶች</b>
4.1. የምርት ጥራት፣ አፈፃፀም፣ ደህንነት፣ ዝርዝር መግለጫዎች፣ ዋስትናዎች፣ የመላኪያ የጊዜ ሰሌዳዎች እና ከሽያጭ በኋላ አገልግሎት የሚመለከቱ ሁሉም ግዴታዎች **በአቅራቢዎች (ለምሳሌ ኪንግ ሎንግ፣ ሻክማን) ላይ ብቻ** ያርፋሉ።
4.2. መልቲቨርስ ለሚከተሉት ተጠያቂ አይሆንም፡-
<ul>
  <li>የምርት ጉድለቶች፣ የጥሪ-መመለስ (recalls) ወይም የደህንነት ጉዳዮች፣</li>
  <li>በማምረት ወይም በመርከብ መዘግየቶች ወይም ውድቀቶች፣</li>
  <li>በዋስትና ወይም ከሽያጭ በኋላ በሚነሱ አለመግባባቶች።</li>
</ul>

<br><br><b>አንቀጽ 5 – የዲ.ኢ.አይ.ጂ. ኃላፊነቶች</b>
5.1. ተሽከርካሪዎች በዲ.ኢ.አይ.ጂ. በአገር ውስጥ የሚገጣጠሙ ከሆነ፣ ዲ.ኢ.አይ.ጂ. ለመገጣጠም ጥራት፣ መስፈርቶችን ማሟላት እና ሆሞሎጌሽን **ሙሉ ኃላፊነት** ይወስዳል።
5.2. ከመገጣጠም የሚመጡ ማናቸውም መዘግየቶች፣ ስህተቶች ወይም ጉዳቶች ለመልቲቨርስ ኃላፊነት የለበትም።

<br><br><b>አንቀጽ 6 – የባንኮች እና የፋይናንስ ኃላፊነቶች</b>
6.1. የፋይናንስ ውሳኔዎች፣ ማጽደቂያዎች፣ ውድቀቶች እና ውሎች **ብቻቸውን የባንኮች ኃላፊነት** ናቸው።
6.2. መልቲቨርስ የፋይናንስ ወይም የብድር ማጽደቂያዎችን ዋስትና አይሰጥም።
6.3. መልቲቨርስ በፋይናንስ ዝግጅቶች ምክንያት ለሚነሱ መዘግየቶች፣ ውድቀቶች ወይም አለመግባባቶች ተጠያቂ አይሆንም።

<br><br><b>አንቀጽ 7 – የአመልካቾች ግዴታዎች</b>
7.1. አመልካቾች በሚመዘገቡበት ጊዜ **ሙሉ እና ትክክለኛ መረጃ** መስጠት አለባቸው።
7.2. አመልካቾች የሚከተሉትን ይገነዘባሉ፡-
<ul>
  <li>ምዝገባ የተሽከርካሪዎች መመደብ ወይም መላክ ዋስትና አይሰጥም፣</li>
  <li>ሽያጭ የሚፈጸመው የሽያጭ ስምምነት ከተፈረመ እና ሙሉ ክፍያ ከተፈጸመ በኋላ ብቻ ነው፣</li>
  <li>የፋይናንስ ዝግጅቶች በአመልካች እና በባንክ መካከል ናቸው።</li>
</ul>
7.3. አመልካቾች በሐሰት ወይም አሳሳች መረጃ ምክንያት ለሚደርሱ ኪሳራዎች መልቲቨርስን ካሳ ይከፍላሉ።

<br><br><b>አንቀጽ 8 – የተጠያቂነት ገደብ</b>
8.1. መልቲቨርስ ለሚከተሉት ተጠያቂ አይሆንም፡-
<ul>
  <li>ቀጥተኛ፣ ቀጥተኛ ያልሆኑ ወይም ተከታይ ጉዳቶች፣</li>
  <li>የፋይናንስ ወይም የንግድ ኪሳራዎች፣</li>
  <li>የምርት ስህተቶች፣ አደጋዎች ወይም የጥሪ-መመለስ፣</li>
  <li>በዲ.ኢ.አይ.ጂ. ኃላፊነት ስር ያሉ የመገጣጠም ጉዳዮች፣</li>
  <li>በባንኮች የፋይናንስ ውድቀቶች።</li>
</ul>
8.2. ሁሉም ተጠያቂነት እንደአግባቡ በአቅራቢዎች፣ በዲ.ኢ.አይ.ጂ. ወይም በባንኮች ላይ ያርፋል።

<br><br><b>አንቀጽ 13 – ማስተባበያ (Disclaimer)</b>
13.1. <b>ምዝገባ ሽያጭ አይደለም</b> – በዚህ ድረ-ገጽ በኩል መረጃ ማስገባት የፍላጎት መግለጫ ብቻ ነው። ለመላክ ምንም ዓይነት መብት አይፈጥርም፣ እንዲሁም የተሽከርካሪ ማስያዝ (reservation) ወይም ዋስትና አይሆንም።
13.2. <b>የፋይናንስ ዋስትና የለም</b> – መልቲቨርስ ፋይናንስ አይሰጥም። ሁሉም ፋይናንስ ነፃ በሆኑ ባንኮች ፈቃድ የሚወሰን ሲሆን፣ መልቲቨርስ ለማንኛውም የብድር ማመልከቻ ውድቀት፣ መዘግየት ወይም ውል ተጠያቂ አይሆንም።
13.3. <b>ለማምረት፣ ለመገጣጠም ወይም ለማድረስ ተጠያቂነት የለም</b> – የምርት ጥራት፣ ደህንነት፣ አፈፃፀም፣ አቅርቦት እና ዋስትናዎችን ጨምሮ ከምርት ጋር የተያያዙ ሁሉም ጉዳዮች **የአቅራቢው ብቸኛ ኃላፊነት** ናቸው። የአገር ውስጥ መገጣጠም ጉዳዮች **ብቻቸውን የዲ.ኢ.አይ.ጂ. ኃላፊነት** ናቸው። መልቲቨርስ እንደ ሽያጭ እና ግብይት አጋር ብቻ የሚሰራ ሲሆን ምንም አይነት ተጠያቂነት አይወስድም።
13.4. <b>ለጉዳት ተጠያቂነት የለም</b> – መልቲቨርስ በሚከተሉት ምክንያት ለሚመጡ ማናቸውም ቀጥተኛ፣ ቀጥተኛ ያልሆኑ፣ ድንገተኛ ወይም ተከታይ ጉዳቶች ተጠያቂ አይሆንም፡- በዚህ ድረ-ገጽ ከመጠቀም፣ የፋይናንስ ውድቀት፣ በቀረቡ ተሽከርካሪዎች ላይ የሚገኙ ጉድለቶች ወይም ስህተቶች፣ በመገጣጠም ወይም በመላክ መዘግየቶች፣ በቀረቡ ተሽከርካሪዎች ላይ የሚደርሱ አደጋዎች ወይም ጉዳቶች።
13.5. <b>አስገዳጅነት</b> – አመልካቹ በመመዝገብ ይህንን ማስተባበያ በግልጽ እንደተቀበለ ያረጋግጣል፣ እናም ሁሉም ተጠያቂነቶች እንደአግባቡ በአቅራቢዎች፣ በዲ.ኢ.አይ.ጂ. ወይም በባንኮች ላይ እንደሚወድቁ ይስማማል።
`;


// --- Sidebar Onboarding Step Component (unchanged) ---
function StepSidebarItem({ icon, title, description, isActive, isCompleted }) {
    const statusIcon = isCompleted 
        ? <CheckCircle className="text-green-500 w-6 h-6" />
        : isActive
        ? <ChevronRight className="text-blue-500 w-6 h-6" />
        : icon;
    
    return (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">{statusIcon}</div>
            <div className="flex-1">
                <h3 className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    {title}
                </h3>
                <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                    {description}
                </p>
            </div>
        </div>
    );
}

// --- Wizard Progress Bar Component (unchanged) ---
function WizardProgress({ activeStep }) { 
    const steps = [
        { name: "Personal & Business Details", icon: <User className="w-4 h-4" /> },
        { name: "Minibus & Service Details", icon: <Car className="w-4 h-4" /> },
    ];

    return (
        <div className={`flex items-center w-full max-w-sm mx-auto lg:max-w-none`}>
            {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${index < activeStep ? 'bg-green-600' : 'bg-gray-200'}`}>
                        {index < activeStep - 1 ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                            <span className={`text-sm font-bold ${index < activeStep ? 'text-white' : 'text-gray-600'}`}>{index + 1}</span>
                        )}
                    </div>
                    <span className={`text-sm ml-2 hidden lg:inline ${index < activeStep ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
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


// --- Validation Schema (unchanged) ---
const step2FormSchema = (t: any) =>
  z.object({
    preferredVehicleType: z.string().min(1, t("step2.validation.vehicleTypeRequired")),
    vehicleQuantity: z.coerce
      .number()
      .int(t("step2.validation.quantityWholeNumber"))
      .min(1, t("step2.validation.quantityMin"))
      .max(100, t("step2.validation.quantityMax")), 
    intendedUse: z.string().optional().nullable().transform(e => {
        if (e === "" || e === "none") {
            return null;
        }
        return e;
    }),
    digitalSignatureUrl: z.string().min(1, t("step2.validation.signatureRequired")),
    agreedToTerms: z.boolean().refine(val => val === true, t("step2.validation.agreeToTerms")),
  });

export function Step2Form() {
  const { formData, setFormData, resetForm } = useRegistration();
  const router = useRouter();
  const { t, locale } = useTranslation();
  
  // NEW: State for the Dialog
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  
  const openTermsDialog = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    setIsTermsDialogOpen(true);
  };
  const closeTermsDialog = () => setIsTermsDialogOpen(false);

  // Define a key for the first vehicle to use as a consistent default
  const INITIAL_VEHICLE_KEY = "model12Seater"; 
  const formSchema = useMemo(() => step2FormSchema(t), [t]);
  
  // FIX: Get the translated name of the default vehicle
  const defaultVehicleName = t(`step2.vehicles.${INITIAL_VEHICLE_KEY}`); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredVehicleType: formData.preferredVehicleType ?? defaultVehicleName,
      vehicleQuantity: formData.vehicleQuantity ?? 1,
      intendedUse: formData.intendedUse ?? "none", // Set default to "none" for the Select component
      digitalSignatureUrl: formData.digitalSignatureUrl ?? "",
      agreedToTerms: formData.agreedToTerms ?? false,
    },
    mode: "onBlur",
  });

  const handleVehicleSelect = (vehicleName: string) => {
    form.setValue("preferredVehicleType", vehicleName, { shouldValidate: true });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const finalValues = {
        ...values,
        intendedUse: values.intendedUse === "none" ? null : values.intendedUse
    };

    const finalData: RegistrationFormData = { ...formData, ...finalValues };
    setFormData(finalData);

    try {
      fullRegistrationSchema.parse(finalData);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        // ... (Error handling logic)
        const errorData = await response.json();
        toast.error(t('step2.registrationFailed'), {
          description: errorData.message || t('step2.unexpectedError'),
          duration: 7000,
          richColors: true
        });
        if (errorData.duplicateField) {
          form.setError(errorData.duplicateField, { type: 'manual', message: errorData.message });
        }
        return;
      }

      // ... (Success logic)
      const { user } = await response.json();
      toast.success(t('step2.registrationSuccessful'), {
        description: t('step2.yourApplicationSubmitted'),
        duration: 5000,
        richColors: true
      });

      const params = new URLSearchParams();
      params.append('id', user.id || 'N/A');

      router.replace(`/${locale}/register/thanks?${params.toString()}`);
      
      resetForm();

    } catch (error) {
       // ... (Validation and unexpected error handling logic)
       if (error instanceof z.ZodError) {
        toast.error(t('step2.validationError'), {
          description: t('step2.cannotProceed'),
          duration: 7000,
          richColors: true
        });
        error.errors.forEach(err => {
          form.setError(err.path.join('.') as any, {
            type: "manual",
            message: err.message,
          });
        });
      } else {
        toast.error(t('step2.unexpectedError'), {
          description: (error as Error).message || t('step2.unexpectedErrorOccurred'),
          duration: 7000,
          richColors: true
        });
      }
    }
  };

  const intendedUseOptions = [
    t('step2.useCity'),
    t('step2.useIntercity'),
    t('step2.useTourCharter'),
    t('step2.useStaffTransport'),
    t('step2.useOther')
  ];

  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar - Hydration Fix: Always render the aside, use 'hidden lg:flex' for visibility control */}
        <aside className="hidden lg:flex w-1/3 p-13 bg-gray-50 border-r border-gray-100 flex-col justify-between">
            <div>
              <div className="mt-8 mb-8">
                 <h1 className="text-3xl font-bold text-gray-900 mb-5">Welcome to <span className="text-blue-600"> Multiverse Minibus & Truck Registration</span>!</h1>
                <h2 className="text-xl text-gray-600 mb-8">Let's get you registered quickly and easily!</h2>
              </div>
              <div className="space-y-6">
                <StepSidebarItem
                  icon={<CheckCircle className="text-green-500 w-6 h-6" />}
                  title="Personal & Business Details"
                  description="Your details help us verify your identity and business information."
                  isActive={false}
                  isCompleted={true}
                />
                <StepSidebarItem
                  icon={<ChevronRight className="text-green-500 w-6 h-6" />}
                  title="Minibus and Truck & Service Details"
                  description="Provide your minibus information to get started with our service."
                  isActive={true}
                  isCompleted={false}
                />
                <StepSidebarItem
                  icon={<Circle className="text-gray-400 w-6 h-6" />}
                  title="Review & Confirm"
                  description="Review all the information you have provided before submitting your application."
                  isActive={false}
                  isCompleted={false}
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

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="w-full flex justify-center mb-8 pt-4 lg:pt-16 lg:pl-16">
            <WizardProgress activeStep={2} />
          </div>
          
          <div className="w-full pb-10 max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            <h2 className="text-2xl  text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2 md:justify-start justify-center">
              <Car className="h-8 w-8 text-green-600" />
              <span>
                {t("step2.title")}
                <span className="block text-base font-normal text-gray-600 dark:text-gray-400 mt-1">
                  {t("step2.subTitle")}
                </span>
              </span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8 border-b pb-4 text-center md:text-left leading-relaxed">
              {t('step2.fillOutVehicleInfo')}
            </p>
      
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Section: Vehicle Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    <Car className="inline-block mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {t("step2.vehicleDetails")}
                  </h3>
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-6">
                    <FormItem>
                      <FormLabel className="text-gray-800 dark:text-gray-200">{t('step2.preferredVehicleType')} <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        {/* NEW: Use the detailed selector component */}
                        <VehicleDetailSelector
                          selectedVehicle={form.watch("preferredVehicleType")}
                          onSelect={handleVehicleSelect}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
      
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                      <FormField
                        control={form.control}
                        name="vehicleQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 dark:text-gray-200">{t('step2.quantityRequested')} <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 1"
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value, 10))}
                                min={1}
                                max={100}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
      
                      <FormField
                        control={form.control}
                        name="intendedUse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 dark:text-gray-200">{t('step2.intendedUse')}</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value ?? "none"}>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('step2.intendedUsePlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">{t('step2.intendedUseNone')}</SelectItem> 
                                  {intendedUseOptions.map((use) => (
                                    <SelectItem key={use} value={use}>
                                      {use}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
      
                <Separator className="bg-gray-200 dark:bg-gray-700" />
      
                {/* Section: Program Agreement */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    <FileText className="inline-block mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {t('step2.programAgreement')}
                  </h3>
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="digitalSignatureUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 dark:text-gray-200">{t('step2.digitalSignature')} <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("step2.digitalSignaturePlaceholder")}
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
      
                    <FormField
                      control={form.control}
                      name="agreedToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-6 bg-gray-50 dark:bg-zinc-800 shadow-sm">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-gray-800 dark:text-gray-200">
                              {t('step2.agreedToTerms')}{" "}
                              {/* UPDATED: Replaced <a> tag with a button to open the dialog */}
                              <button 
                                onClick={openTermsDialog}
                                className="text-blue-600 hover:underline inline"
                                type="button" // Important to prevent form submission
                              >
                                {t('step2.viewTermsAndConditions')}
                              </button>.
                              <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
      
                <Separator className="bg-gray-200 dark:bg-gray-700" />
      
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button type="button" variant="outline" onClick={() => router.push(`/${locale}/register/step1`)} className="flex-1 py-3 text-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('step2.backToApplicantInfo')}
                  </Button>
                  <Button type="submit" className="flex-1 py-3 text-lg bg-gray-900 dark:bg-blue-600 text-white hover:bg-gray-700 dark:hover:bg-blue-700 transition-colors duration-200">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {t('step2.submitRegistration')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>

      {/* NEW: Render the Terms and Conditions Dialog */}
      <TermsDialog 
        isOpen={isTermsDialogOpen}
        onClose={closeTermsDialog}
        locale={locale}
        content={{
            english: TERMS_CONTENT_EN,
            amharic: TERMS_CONTENT_AM,
        }}
      />
    </>
  );
}