// src/i18n/translations.ts
import { Locale } from './locales';

// --- (TranslationKeys type definition remains the same and is correct) ---
export type TranslationKeys = {
  navbar: {
    home: string;
    language: string;
  };
  step1: {
    title: string;
    subTitle: string;
    personalDetails: string;
    contactDetails: string;
    addressDetails: string;
    fill_out_form_description: string;
    firstName: string;
    fathersName: string;
    grandfathersNameOptional: string;
    primaryPhoneNumber: string;
    alternativePhoneNumberOptional: string;
    emailAddressOptional: string;
    region: string;
    citySubCity: string;
    woredaKebele: string;
    cooperativeDetailsTitle: string;
    cooperativeDetailsDescription: string;
    associationName: string;
    membershipNumber: string;
    registeringAsBusiness: string;
    businessEntityDescription: string;
    businessDetailsTitle: string;
    tinOptional: string;
    businessLicenseNo: string;
    proceedToMinibusDetails: string;
    checkingUniqueness: string;
    // --- REQUIRED KEYS ---
    validationError: string;
    duplicateEntry: string;
    networkError: string;
    eitherPhoneOrEmailRequired: string;
    // ---------------------
    validation: {
      fullNameRequired: string;
      fatherNameRequired: string;
      regionRequired: string;
      cityRequired: string;
      woredaKebeleRequired: string;
      invalidPhoneNumber: string;
      primaryPhoneRequired: string;
      invalidEmail: string;
      businessLicenseRequired: string;
      phoneOrEmailRequired: string;
    };
    regionAddisAbaba: string;
    regionAfar: string;
    regionAmhara: string;
    regionBenishangulGumuz: string;
    regionGambela: string;
    regionHarari: string;
    regionOromia: string;
    regionSidama: string;
    regionSomali: string;
    regionSWEPR: string;
    regionTigray: string;
    regionCentralEthiopia: string;
    regionSouthernEthiopia: string;
    regionDireDawa: string;
    assocTsehay: string;
    assocZebra: string;
    assocAdissHywet: string;
    assocNser: string;
    assocBelen: string;
    assocMetebaber: string;
    assocBelechta: string;
    assocWalta: string;
    assocgohe: string;
    assocberhutesfa: string;
    assocselamta: string;
    assocfeker: string;
    assocTla: string;
    assocOther: string;
  };
  step2: {
    title: string;
    subTitle: string;
    fillOutVehicleInfo: string;
    vehicleDetails: string;
    preferredVehicleType: string;
    quantityRequested: string;
    intendedUse: string;
    intendedUsePlaceholder: string;
    intendedUseNone: string;
    programAgreement: string;
    digitalSignature: string;
    digitalSignaturePlaceholder: string;
    agreedToTerms: string;
    viewTermsAndConditions: string;
    backToApplicantInfo: string;
    submitRegistration: string;
    selectThisVehicle: string;
    selected: string;
    chooseOtherOption: string;
    registrationSuccessful: string;
    yourApplicationSubmitted: string;
    registrationFailed: string;
    unexpectedError: string;
    unexpectedErrorOccurred: string;
    validationError: string;
    cannotProceed: string;
    useCity: string;
    useIntercity: string;
    useTourCharter: string;
    useStaffTransport: string;
    useOther: string;
    category: {
        minibus: string;
        truck: string;
    };
    vehicles: { 
        model15Plus1Seater: string; 
        desc15Plus1Seater: string; 
        model18Seater: string; 
        desc18Seater: string; 
        model22Plus1Seater: string; 
        desc22Plus1Seater: string; 
        modelShacmanDump: string;
        descShacmanDump: string;
        modelShacmanTractor: string;
        descShacmanTractor: string;
        modelShacmanMixer: string;
        descShacmanMixer: string;
    };
    validation: {
      vehicleTypeRequired: string;
      quantityWholeNumber: string;
      quantityMin: string;
      quantityMax: string; 
      signatureRequired: string;
      agreeToTerms: string;
    };
  };
  thanks: {
    registrationComplete: string;
    thankYouSubmissionRecorded: string;
    yourSubmittedDetails: string;
    applicantID: string;
    fullName: string;
    fathersName: string;
    grandfathersName: string;
    businessInformation: string;
    registeringAsBusiness: string;
    tin: string;
    businessLicenseNo: string;
    contactLocation: string;
    primaryPhone: string;
    alternativePhone: string;
    emailAddress: string;
    region: string;
    citySubCity: string;
    woredaKebele: string;
    cooperativeAssociationDetails: string;
    associationName: string;
    membershipNumber: string;
    minibusDetails: string;
    preferredVehicleType: string;
    vehicleQuantity: string;
    intendedUse: string;
    programAgreement: string;
    digitalSignature: string;
    agreedToTerms: string;
    viewSignature: string;
    goToHomepage: string;
    printApplication: string;
    forYourRecords: string;
    noDataFoundTitle: string;
    noDataFoundMessage: string;
    noDataFoundInstructions: string;
    yes: string;
    no: string;
    personalInfo: string; 
    applicationDetails: string; 
    isBusiness: string; 
    preferredVehicle: string; 
    quantity: string; 
    dataLoaded: string;
    yourDetailsHaveBeenLoaded: string;
    dataLoadFailed: string;
    dataLoadFailedDescription: string;
    loading: string;
    contactSupport: string;
    helpCenter: string;
    na: string;
    downloadPDF: string;
  };
};

const translations: Record<Locale, TranslationKeys> = {
  am: {
    // ... (omitted step 1 & step 2 for brevity)
    navbar: {
      home: 'መነሻ',
      language: 'ቋንቋ',
    },
    step1: {
      // ... (existing keys)
      title: 'አመልካች መረጃ',
      subTitle: '(ደረጃ 1 ከ 2)',
      personalDetails: 'የግል መረጃ',
      contactDetails: 'የስልክ መረጃ',
      addressDetails: 'የአድራሻ መረጃ',
      fill_out_form_description: 'እባክዎ መረጃዎን በትክክል ይሙሉ',
      firstName: 'የመጀመሪያ ስም',
      fathersName: 'የአባት ስም',
      grandfathersNameOptional: 'የአያት ስም (አማራጭ)',
      primaryPhoneNumber: 'ዋና ስልክ ቁጥር',
      alternativePhoneNumberOptional: 'ተጨማሪ ስልክ ቁጥር (አማራጭ)',
      emailAddressOptional: 'ኢሜል አድራሻ (አማራጭ)',
      region: 'ክልል',
      citySubCity: 'ከተማ/ክፍለ ከተማ',
      woredaKebele: 'ወረዳ / ቀበሌ',
      cooperativeDetailsTitle: 'የትብብር / ማህበር ዝርዝሮች (አማራጭ)',
      cooperativeDetailsDescription: 'የትራንስፖርት ትብብር ወይም ማህበር አባል ከሆኑ እባክዎ ይምረጡ እና የአባልነት ቁጥርዎን ያቅርቡ።',
      associationName: 'የማህበር ስም',
      membershipNumber: 'የአባልነት ቁጥር',
      registeringAsBusiness: 'እንደ ንግድ ድርጅት እየተመዘገቡ ነው?',
      businessEntityDescription: 'መደበኛ የንግድ ድርጅት (ለምሳሌ ኃ.የተ.የግ.ማ፣ የግል ድርጅት) ወክለው እየተመዘገቡ ከሆነ ይህን ሳጥን ምልክት ያድርጉ።',
      businessDetailsTitle: 'የንግድ ድርጅት ዝርዝሮች',
      tinOptional: 'ቲን (አማራጭ)',
      businessLicenseNo: 'የንግድ ፈቃድ ቁጥር',
      proceedToMinibusDetails: 'ወደ ሚኒባስ ዝርዝሮች ይቀጥሉ',
      checkingUniqueness: 'ልዩነት በመፈተሽ ላይ...',
      // --- MISSING AMHARIC VALUES ADDED HERE ---
      validationError: 'የማረጋገጫ ስህተት', 
      duplicateEntry: 'የተደጋገመ ግቤት',
      networkError: 'የአውታረ መረብ ስህተት',
      eitherPhoneOrEmailRequired: 'ዋና ስልክ ቁጥር ወይም ኢሜል አድራሻ ያስፈልጋል።',
      // ------------------------------------------
      validation: {
        fullNameRequired: 'እባክዎ የመጀመሪያ ስምዎን ያስገቡ',
        fatherNameRequired: 'እባክዎ የአባትዎን ስም ያስገቡ',
        regionRequired: 'እባክዎ ክልል ይምረጡ',
        cityRequired: 'እባክዎ ከተማ/ክፍለ ከተማ ያስገቡ',
        woredaKebeleRequired: 'እባክዎ ወረዳ/ቀበሌ ያስገቡ',
        invalidPhoneNumber: 'ልክ የሆነ ስልክ ቁጥር ያስገቡ',
        primaryPhoneRequired: 'ዋና ስልክ ቁጥር ያስፈልጋል',
        invalidEmail: 'ልክ የሆነ ኢሜል አድራሻ ያስገቡ',
        businessLicenseRequired: 'የንግድ ፈቃድ ቁጥር ያስፈልጋል',
        phoneOrEmailRequired: 'ዋና ስልክ ቁጥር ወይም ኢሜል አድራሻ ያስፈልጋል።'
      },
      regionAddisAbaba: 'አዲስ አበባ',
      regionAfar: 'አፋር',
      regionAmhara: 'አማራ',
      regionBenishangulGumuz: 'ቤኒሻንጉል ጉሙዝ',
      regionGambela: 'ጋምቤላ',
      regionHarari: 'ሐረሪ',
      regionOromia: 'ኦሮሚያ',
      regionSidama: 'ሲዳማ',
      regionSomali: 'ሶማሌ',
      regionSWEPR: 'ደቡብ ምዕራብ ኢትዮጵያ ህዝቦች ክልል',
      regionTigray: 'ትግራይ',
      regionCentralEthiopia: 'ማዕከላዊ ኢትዮጵያ ክልል',
      regionSouthernEthiopia: 'ደቡብ ኢትዮጵያ ክልል',
      regionDireDawa: 'ድሬዳዋ (ቻርተርድ ከተማ)',
      assocTsehay: 'ፀሐይ ታ/ባ/ማህበር',
      assocZebra: 'ዘብራ ታ/ባ/ማህበር',
      assocAdissHywet: 'አዲስ ህይወት ታ/ባ/ማህበር',
      assocNser: 'ንስር ታ/ባ/ማህበር',
      assocBelen: 'ቤለን ታ/ባ/ማህበር',
      assocMetebaber: 'መተባበር ታ/ባ/ማህበር',
      assocBelechta: 'ብልጭታ ታ/ባ/ማህበር',
      assocWalta: 'ዋልታ ታ/ባ/ማህበር',
      assocgohe: 'ጎህ ታ/ባ/ማህበር',
      assocberhutesfa: 'ብሩህ ተስፋ ታ/ባ/ማህበር',
      assocselamta: 'ሰላምታ ታ/ባ/ማህበር',
      assocfeker: 'ፍቅር ታ/ባ/ማህበር',
      assocTla: 'ጥላ ታ/ባ/ማህበር',
      assocOther: 'ሌላ ታ/ባ/ማህበር',
    },
    step2: {
      // ... (omitted step2 keys for brevity)
      title: 'ተሽከርካሪ ዝርዝሮች እና የመጨረሻ ማረጋገጫ',
      subTitle: '(ደረጃ 2 ከ 2)',
      fillOutVehicleInfo: 'እባክዎ የተሽከርካሪ(ዎች) መረጃዎን በትክክል ይሙሉ እና የፕሮግራሙን ውሎች በመስማማት ማመልከቻዎን ያጠናቅቁ።',
      vehicleDetails: 'የተሽከርካሪ ዝርዝሮች',
      preferredVehicleType: 'ተመራጭ የተሽከርካሪ አይነት/ሞዴል',
      quantityRequested: 'የተጠየቀው ብዛት',
      intendedUse: 'የታሰበ አጠቃቀም (አማራጭ)',
      intendedUsePlaceholder: 'የአገልግሎት አይነት ይምረጡ',
      intendedUseNone: 'አይመረጥም (አማራጭ)',
      programAgreement: 'የፕሮግራም ስምምነት',
      digitalSignature: 'ዲጂታል ፊርማ',
      digitalSignaturePlaceholder: 'ለምሳሌ፣ /እገሌ/',
      agreedToTerms: 'በፕሮግራሙ ውሎች እና ሁኔታዎች እስማማለሁ።',
      viewTermsAndConditions: 'ውሎችን እና ሁኔታዎችን ይመልከቱ',
      backToApplicantInfo: 'ወደ አመልካች መረጃ ይመለሱ',
      submitRegistration: 'ምዝገባ አስገባ',
      selectThisVehicle: 'ይህን ተሽከርካሪ ይምረጡ',
      selected: 'ተመርጧል',
      chooseOtherOption: 'ሌላ አማራጭ ይምረጡ', 
      registrationSuccessful: 'ምዝገባ ተሳክቷል!',
      yourApplicationSubmitted: 'ማመልከቻዎ ገብቷል እና በግምገማ ላይ ነው።',
      registrationFailed: 'ምዝገባ አልተሳካም',
      unexpectedError: 'ያልተጠበቀ ስህተት',
      unexpectedErrorOccurred: 'በመላክ ላይ ያልተጠበቀ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።',
      validationError: 'የማረጋገጫ ስህተት',
      cannotProceed: 'መቀጠል አይቻልም',
      useCity: 'ከተማ ውስጥ አገልግሎት',
      useIntercity: 'ከተማ ውስጥ/ክልላዊ አገልግሎት',
      useTourCharter: 'ጉብኝት / ቻርተር አገልግሎት',
      useStaffTransport: 'የሰራተኞች ትራንስፖርት',
      useOther: 'ሌላ',
      category: {
          minibus: 'ሚኒበሶች (ለተሳፋሪ)',
          truck: 'የንግድ መኪናዎች',
      },
      vehicles: { 
          model15Plus1Seater: 'ሚኒባስ (15+1 መቀመጫ)', 
          desc15Plus1Seater: 'ዘመናዊ፣ ቅልጥፍና ያለው ገጽታው፣ የተትረፈረፈ የፈረስ ጉልበቱ፣ የተሻሻለው አደረጃጀት እና የኃይል ቆጣቢነቱ ይህ ቫን በሕዝብ ማመላለሻ፣ በቱሪዝም እና በሻትል አገልግሎቶች በስፋት እንዲሠራ ያስችለዋል።', 
          model18Seater: 'ሚኒባስ (18 መቀመጫ)', 
          desc18Seater: 'King Long 18-መቀመጫ ኤሌክትሪክ ቫን የሎጅስቲክስ ተሽከርካሪ ገበያን የመራ ጥራት ያለው ምርት ነው። በአረንጓዴነት፣ በአካባቢ ጥበቃ እና በኃይል ቆጣቢነት ጽንሰ-ሀሳቦች ላይ አጥብቆ የሚሰራ ነው።', 
          model22Plus1Seater: 'አነስተኛ አውቶቡስ (22+1 መቀመጫ)', 
          desc22Plus1Seater: 'ኪንግ ሎንግ ኪንግስተር የተሽከርካሪውን መዋቅራዊ ጥንካሬ ለማሳደግ የሙሉ-ሻጋታ አካል (all-stamping body) እና በውስን ቅርጽ ለውጥ የሚደረግ ማጣበቅ (butt-welding with limited deformation) ጨምሮ የላቀ ቴክኖሎጂዎችን ይጠቀማል። በተጨማሪም፣ ኃይለኛ ገጽታን የሚፈጥር ጠንካራ ዲዛይን እና በዘመናዊ መንገድ የተቀየሰ የተቀናጀ የፈሳሽ (flowing) LED መሪ ማትሪክስ የፊት መብራት በማቅረብ፣ የተስተካከለና ማራኪ ገጽታን ያስገኛል።', 
          modelShacmanDump: 'ሻክማን ካርጎ መኪና (ጭነት)',
          descShacmanDump: 'ለተሻለ ምቾት በአየር የተሞላ መቀመጫ ያለው አንጋፋና ምቹ ካቢኔ እና ለተሻለ ደህንነት በቴክኖሎጂ የታገዘ ንድፍ ያገኛሉ። ለኃይል ማመንጫነት ዌይቻይ ወይም ከሚንስ ሞተሮችን (180–560 የፈረስ ጉልበት፣ 6L–13L መጠን) መምረጥ ይችላሉ። ለተለያዩ ፍላጎቶችዎ የሚስማማ 9፣ 10 ወይም 12 ፍጥነት ያለው ፋስት ማርሽ ሳጥን ይምረጡ።',
          modelShacmanTractor: 'ሻክማን ዳምፐር መኪና ( ገልባጭ)',
          descShacmanTractor: 'ፍሬም: ለከፍተኛ የመሸከም አቅም በQ345B ከፍተኛ ጥንካሬ ብረት እና በራስ-ሰር ብየዳ የተሰራ። ክፍሎች አስተማማኝ አፈጻጸምን ለማረጋገጥ ታዋቂ የምርት ስም አክሰሎችና ማንጠልጠያ ሲስተሞችን ይዟል።',
          modelShacmanMixer: 'ሻክማን ውሃ እና ዘይት ጭነት መኪና',
          descShacmanMixer: 'ለማንኛውም ሥራ የሚያስችል አስተማማኝ፣ ጠንካራና ኃይለኛ ነው። ካቢኔ: ከፍተኛ ደህንነትና ምቾት የሚሰጥ በአየር የተሞላ መቀመጫ እና በቴክኖሎጂ የታገዘ ንድፍ ያለው ሰፊና ብሩህ ካቢኔ። ሞተር: ለኃይል ማመንጫነት ዌይቻይ ወይም ከሚንስ ሞተሮችን (180–560 የፈረስ ጉልበት፣ 6L–13L መጠን) መምረጥ ይቻላል። ማርሽ ሳጥን: ለተለያዩ ፍላጎቶች የሚያስፈልገውን 9፣ 10 ወይም 12 ፍጥነት ያለው ፋስት ማርሽ ሳጥን ይዟል።',
      },
      validation: {
        vehicleTypeRequired: 'እባክዎ የሚመርጡትን የተሽከርካሪ አይነት ይምረጡ።',
        quantityWholeNumber: 'የተሽከርካሪ ብዛት ሙሉ ቁጥር መሆን አለበት።',
        quantityMin: 'ቢያንስ 1 ተሽከርካሪ መጠየቅ አለብዎት።',
        quantityMax: 'ከፍተኛው የተሽከርካሪ ብዛት 100 ነው።', 
        signatureRequired: 'ዲጂታል ፊርማ ያስፈልጋል።',
        agreeToTerms: 'ለመቀጠል በውሎች እና ሁኔታዎች መስማማት አለብዎት።',
      },
    },
    thanks: {
      registrationComplete: 'ምዝገባ ተጠናቋል!',
      thankYouSubmissionRecorded: 'ስለ ማመልከቻዎ እናመሰግናለን። ዝርዝሮችዎ ተመዝግበዋል።',
      yourSubmittedDetails: 'ያቀረቡት ዝርዝሮች',
      applicantID: 'የአመልካች መለያ',
      fullName: 'ሙሉ ስም',
      fathersName: 'የአባት ስም',
      grandfathersName: 'የአያት ስም',
      businessInformation: 'የንግድ መረጃ',
      registeringAsBusiness: 'እንደ ንግድ ድርጅት እየተመዘገቡ ነው',
      tin: 'ቲን',
      businessLicenseNo: 'የንግድ ፈቃድ ቁጥር',
      contactLocation: 'እውቂያ እና ቦታ',
      primaryPhone: 'ዋና ስልክ',
      alternativePhone: 'ተጨማሪ ስልክ',
      emailAddress: 'ኢሜል አድራሻ',
      region: 'ክልል',
      citySubCity: 'ከተማ/ክፍለ ከተማ',
      woredaKebele: 'ወረዳ / ቀበሌ',
      cooperativeAssociationDetails: 'የትብብር / ማህበር ዝርዝሮች',
      associationName: 'የማህበር ስም',
      membershipNumber: 'የአባልነት ቁጥር',
      minibusDetails: 'ተሽከርካሪ ዝርዝሮች',
      preferredVehicleType: 'ተመራጭ የተሽከርካሪ አይነት',
      vehicleQuantity: 'የተሽከርካሪ ብዛት',
      intendedUse: 'የታሰበ አጠቃቀም',
      programAgreement: 'የፕሮግራም ስምምነት',
      digitalSignature: 'ዲጂታል ፊርማ',
      agreedToTerms: 'በውሎች ተስማምቷል',
      viewSignature: 'ፊርማ ይመልከቱ',
      goToHomepage: 'ወደ መነሻ ገጽ ይሂዱ',
      printApplication: 'ማመልከቻ ያትሙ',
      forYourRecords: 'ለመዝገብዎ፣ እባክዎ ይህን ገጽ ያትሙ ወይም ቅጽበታዊ ገጽ እይታ ያንሱ።',
      noDataFoundTitle: 'ምንም የምዝገባ ውሂብ አልተገኘም',
      noDataFoundMessage: 'ይህን ገጽ በቀጥታ የደረሱበት ወይም ክፍለ ጊዜዎ ጊዜው ያለፈበት ይመስላል።',
      noDataFoundInstructions: 'ዝርዝሮችዎን ለማስገባት እባክዎ ወደ ምዝገባ ቅጽ ይመለሱ።',
      yes: 'አዎ',
      no: 'አይ',
      personalInfo: 'የአመልካች ዝርዝሮች', 
      applicationDetails: 'የማመልከቻ ዝርዝሮች', 
      isBusiness: 'እንደ ንግድ ድርጅት ይመዘገባሉ?', 
      preferredVehicle: 'ተመራጭ ተሽከርካሪ', 
      quantity: 'የተጠየቀ ብዛት', 
      dataLoaded: 'መረጃው ተጭኗል',
      yourDetailsHaveBeenLoaded: 'እርስዎ ያስገቡት መረጃ በተሳካ ሁኔታ ተጭኗል።',
      dataLoadFailed: 'መረጃ አልተጫነም',
      dataLoadFailedDescription: 'የማመልከቻው መረጃ ሊገኝ አልቻለም። እባክዎ ገጹን እንደገና ይጫኑ።',
      loading: 'የማመልከቻ መረጃ በመጫን ላይ...',
      contactSupport: 'ድጋፍ ይጠይቁ',
      helpCenter: 'የእርዳታ ማዕከል',
      na: 'አልተገለጸም',
      // <<< ADDED NEW KEY HERE >>>
      downloadPDF: 'እንደ PDF አውርድ', 
    },
  },
  en: {
    // ... (omitted step 1 & step 2 for brevity)
    navbar: {
      home: 'Home',
      language: 'Language',
    },
    step1: {
      // ... (existing keys)
      title: 'Applicant Information',
      subTitle: '(Step 1 of 2)',
      personalDetails: 'Personal Details',
      contactDetails: 'Contact Details',
      addressDetails: 'Address Details',
      fill_out_form_description: 'Please fill out your information correctly.',
      firstName: 'First Name',
      fathersName: 'Father\'s Name',
      grandfathersNameOptional: 'Grandfather\'s Name (Optional)',
      primaryPhoneNumber: 'Primary Phone Number',
      alternativePhoneNumberOptional: 'Alternative Phone Number (Optional)',
      emailAddressOptional: 'Email Address (Optional)',
      region: 'Region',
      citySubCity: 'City/Sub-City',
      woredaKebele: 'Woreda / Kebele',
      cooperativeDetailsTitle: 'Cooperative / Association Details (Optional)',
      cooperativeDetailsDescription: 'If you are a member of a transport cooperative or association, please select it and provide your membership number.',
      associationName: 'Association Name',
      membershipNumber: 'Membership Number',
      registeringAsBusiness: 'Registering as a Business Entity?',
      businessEntityDescription: 'Check this box if you are registering on behalf of a formal business entity (e.g., PLC, Sole Proprietorship).',
      businessDetailsTitle: 'Business Entity Details',
      tinOptional: 'TIN (Optional)',
      businessLicenseNo: 'Business License No.',
      proceedToMinibusDetails: 'Proceed to Minibus Details',
      checkingUniqueness: 'Checking Uniqueness...',
      // --- ENGLISH VALUES ARE ALREADY HERE ---
      validationError: 'Validation Error',
      duplicateEntry: 'Duplicate Entry',
      networkError: 'Network Error',
      eitherPhoneOrEmailRequired: 'Either Primary Phone Number or Email Address is required.',
      // ---------------------------------------
      validation: {
        fullNameRequired: 'Full Name is required',
        fatherNameRequired: 'Father\'s Name is required',
        regionRequired: 'Please select a region',
        cityRequired: 'City/Sub-City is required',
        woredaKebeleRequired: 'Woreda/Kebele is required',
        invalidPhoneNumber: 'Invalid phone number format',
        primaryPhoneRequired: 'Primary phone number is required',
        invalidEmail: 'Invalid email address format',
        businessLicenseRequired: 'Business License Number is required',
        phoneOrEmailRequired: 'Either a Primary Phone Number or an Email Address is required.'
      },
      regionAddisAbaba: 'Addis Ababa',
      regionAfar: 'Afar',
      regionAmhara: 'Amhara',
      regionBenishangulGumuz: 'Benishangul-Gumuz',
      regionGambela: 'Gambela',
      regionHarari: 'Harari',
      regionOromia: 'Oromia',
      regionSidama: 'Sidama',
      regionSomali: 'Somali',
      regionSWEPR: 'South West Ethiopia Peoples\' Region',
      regionTigray: 'Tigray',
      regionCentralEthiopia: 'Central Ethiopia Region',
      regionSouthernEthiopia: 'Southern Ethiopia Region',
      regionDireDawa: 'Dire Dawa (Chartered City)',
      assocTsehay: 'Tsehay Association',
      assocZebra: 'Zebra Association',
      assocAdissHywet: 'Addis Hiwot Association',
      assocNser: 'Nser Association',
      assocBelen: 'Belen Association',
      assocMetebaber: 'Metebaber Association',
      assocBelechta: 'Belechta Association',
      assocWalta: 'Walta Association',
      assocgohe: 'Gohe Association',
      assocberhutesfa: 'Berhut Tesfa Association',
      assocselamta: 'Selamta Association',
      assocfeker: 'Feker Association',
      assocTla: 'Tla Association',
      assocOther: 'Other Association/Cooperative',
    },
    step2: {
      // ... (omitted step2 keys for brevity)
      title: 'Vehicle Details & Final Confirmation',
      subTitle: '(Step 2 of 2)',
      fillOutVehicleInfo: 'Please fill out the required information regarding your vehicle(s) and agree to the program terms to complete your application.',
      vehicleDetails: 'Vehicle Details',
      preferredVehicleType: 'Preferred Vehicle Type/Model',
      quantityRequested: 'Quantity Requested',
      intendedUse: 'Intended Use (Optional)',
      intendedUsePlaceholder: 'Select a service type',
      intendedUseNone: 'Not selected (Optional)',
      programAgreement: 'Program Agreement',
      digitalSignature: 'Digital Signature',
      digitalSignaturePlaceholder: 'e.g., /Jane Doe/',
      agreedToTerms: 'I agree to the program terms and conditions.',
      viewTermsAndConditions: 'View terms and conditions',
      backToApplicantInfo: 'Back to Applicant Info',
      submitRegistration: 'Submit Registration',
      selectThisVehicle: 'Select This Vehicle',
      selected: 'Selected',
      chooseOtherOption: 'Choose Other Option', 
      registrationSuccessful: 'Registration Successful!',
      yourApplicationSubmitted: 'Your application has been successfully submitted and is under review.',
      registrationFailed: 'Registration Failed',
      unexpectedError: 'An unexpected error occurred.',
      unexpectedErrorOccurred: 'An unexpected error occurred during submission. Please try again.',
      validationError: 'Validation Error',
      cannotProceed: 'Please correct all highlighted errors before proceeding.',
      useCity: 'City Service',
      useIntercity: 'Intercity/Regional Service',
      useTourCharter: 'Tourism/Charter',
      useStaffTransport: 'Staff/Employee Transport',
      useOther: 'Other',
      category: {
          minibus: 'Minibuses (Passenger)',
          truck: 'Commercial Trucks',
      },
       vehicles: { 
          model15Plus1Seater: 'Minibus (15+1 Seater)', 
          desc15Plus1Seater: 'Stylish, streamlined appearance, abundant horsepower, optimized configuration and energy efficiency enable the van to be widely used in passenger transportation, tourism and shuttles.', 
          model18Seater: 'Minibus (18-Seater)', 
          desc18Seater: 'Kingo 18 Seats Electric Van is a high-quality product that leads the logistics vehicle market, and adheres to the concept of green, environmental protection and energy saving in all aspects.', 
          model22Plus1Seater: 'Minibus (22+1 Seater)', 
          desc22Plus1Seater: 'The King Long Kingster is applying advanced technologies including all-stamping body and butt-welding with limited deformation to enhance the structural strength of the body. It also features strong design creating a powerful appearance and all-new designed integrated flowing LED steering matrix headlight, generating a restraining and elegant appearance in flexible relaxation.', 
          modelShacmanDump: 'Shacman Cargo Truck',
          descShacmanDump: 'Enjoy a classic, comfortable cab with an air-suspension seat and a high-tech design for enhanced safety. Power options include Weichai or Cummins engines (180–560 HP, 6L–13L displacement). Choose a Fast Gearbox with 9, 10, or 12 speeds to match your heavy-duty needs.',
          modelShacmanTractor: 'Shacman Dumper Truck',
          descShacmanTractor: 'Frame: Built with Q345B high-strength steel and automated arc welding for maximum load-bearing capacity. Running Gear: Features reliable, well-known brand axles and suspension for guaranteed performance.Offer: Available as customizable cargo trailers..',
          modelShacmanMixer: 'Shacman Water and Oil Truck',
          descShacmanMixer: 'The F3000 Series, introduced in 2009, is one of our best-selling products—reliable, rugged, and powerful enough for any task. Cab: Spacious and bright cab equipped with an air-suspension seat and high-tech design for maximum safety and comfort. Engine: Power comes from an optional Weichai or Cummins engine (180–560 HP, 6L–13L displacement). Gearbox: Features a Fast Gearbox with 9, 10, or 12 speeds to meet diverse operational needs.',
        },
        validation: {
          vehicleTypeRequired: 'Please select your preferred vehicle type.',
          quantityWholeNumber: 'Vehicle quantity must be a whole number.',
          quantityMin: 'You must request at least 1 vehicle.',
          quantityMax: 'The maximum quantity is 100 vehicles.',
          signatureRequired: 'A digital signature is required.',
          agreeToTerms: 'You must agree to the Terms and Conditions to proceed.',
        },
      },
      thanks: {
        registrationComplete: 'Registration Complete!',
        thankYouSubmissionRecorded: 'Thank you for your submission. Your details have been recorded.',
        yourSubmittedDetails: 'Your Submitted Details',
        applicantID: 'Applicant ID',
        fullName: 'Full Name',
        fathersName: 'Father\'s Name',
        grandfathersName: 'Grandfather\'s Name',
        businessInformation: 'Business Information',
        registeringAsBusiness: 'Registering as Business',
        tin: 'TIN',
        businessLicenseNo: 'Business License No.',
        contactLocation: 'Contact & Location',
        primaryPhone: 'Primary Phone',
        alternativePhone: 'Alternative Phone',
        emailAddress: 'Email Address',
        region: 'Region',
        citySubCity: 'City/Sub-City',
        woredaKebele: 'Woreda / Kebele',
        cooperativeAssociationDetails: 'Cooperative / Association Details',
        associationName: 'Association Name',
        membershipNumber: 'Membership Number',
        minibusDetails: 'Minibus Details',
        preferredVehicleType: 'Preferred Vehicle Type',
        vehicleQuantity: 'Vehicle Quantity',
        intendedUse: 'Intended Use',
        programAgreement: 'Program Agreement',
        digitalSignature: 'Digital Signature',
        agreedToTerms: 'Agreed to Terms',
        viewSignature: 'View Signature',
        goToHomepage: 'Go to Homepage',
        printApplication: 'Print Application',
        forYourRecords: 'For your records, please print this page or take a screenshot.',
        noDataFoundTitle: 'No Registration Data Found',
        noDataFoundMessage: 'It looks like you\'ve accessed this page directly or your session has expired.',
        noDataFoundInstructions: 'Please go back to the registration form to submit your details.',
        yes: 'Yes',
        no: 'No',
        personalInfo: 'Applicant Details', 
        applicationDetails: 'Application Details', 
        isBusiness: 'Registering as Business?', 
        preferredVehicle: 'Preferred Vehicle Type', 
        quantity: 'Quantity Requested', 
        dataLoaded: 'Data Loaded', 
        yourDetailsHaveBeenLoaded: 'Your submitted details have been loaded successfully.', 
        dataLoadFailed: 'Data Load Failed', 
        dataLoadFailedDescription: 'Could not retrieve application data. Please try refreshing.', 
        loading: 'Loading Application Data...', 
        contactSupport: 'Contact Support', 
        helpCenter: 'Help Center', 
        na: 'N/A',
        downloadPDF: 'Download as PDF', 
      },
    },
}; 

export default translations;