-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "grandfatherName" TEXT,
    "isBusiness" BOOLEAN NOT NULL DEFAULT false,
    "entityName" TEXT,
    "tin" TEXT,
    "businessLicenseNo" TEXT,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "woredaKebele" TEXT NOT NULL,
    "primaryPhoneNumber" TEXT NOT NULL,
    "alternativePhoneNumber" TEXT,
    "emailAddress" TEXT,
    "preferredVehicleType" TEXT NOT NULL,
    "vehicleQuantity" INTEGER NOT NULL,
    "intendedUse" TEXT NOT NULL,
    "gender" TEXT,
    "idNumber" TEXT,
    "residentialAddress" TEXT,
    "houseNumber" TEXT,
    "associationName" TEXT,
    "membershipNumber" TEXT,
    "preferredFinancingInstitution" TEXT,
    "loanApplicationStatus" TEXT,
    "loanAmountRequested" DOUBLE PRECISION,
    "bankReferenceNumber" TEXT,
    "downPaymentProofUrl" TEXT,
    "idScanUrl" TEXT,
    "taxIdentificationNumberUrl" TEXT,
    "supportingLettersUrl" TEXT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'NEW',
    "remarksNotes" TEXT,
    "assignedOfficerId" TEXT,
    "completedByAdminId" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'REGISTRAR_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registration_primaryPhoneNumber_key" ON "Registration"("primaryPhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_emailAddress_key" ON "Registration"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_assignedOfficerId_fkey" FOREIGN KEY ("assignedOfficerId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_completedByAdminId_fkey" FOREIGN KEY ("completedByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
