/*
  Warnings:

  - You are about to drop the column `alternativePhoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `applicationStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `associationName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bankReferenceNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `businessLicenseNo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `downPaymentProofUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `entityName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fatherName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `grandfatherName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `houseNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idScanUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `intendedUse` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isBusiness` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loanAmountRequested` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loanApplicationStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `membershipNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `preferredFinancingInstitution` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `preferredVehicleType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `primaryPhoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `processedById` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `remarksNotes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `residentialAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `supportingLettersUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `taxIdentificationNumberUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleQuantity` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `woredaKebele` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_processedById_fkey";

-- DropIndex
DROP INDEX "User_emailAddress_key";

-- DropIndex
DROP INDEX "User_primaryPhoneNumber_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "alternativePhoneNumber",
DROP COLUMN "applicationStatus",
DROP COLUMN "assignedToId",
DROP COLUMN "associationName",
DROP COLUMN "bankReferenceNumber",
DROP COLUMN "businessLicenseNo",
DROP COLUMN "city",
DROP COLUMN "downPaymentProofUrl",
DROP COLUMN "emailAddress",
DROP COLUMN "entityName",
DROP COLUMN "fatherName",
DROP COLUMN "gender",
DROP COLUMN "grandfatherName",
DROP COLUMN "houseNumber",
DROP COLUMN "idNumber",
DROP COLUMN "idScanUrl",
DROP COLUMN "intendedUse",
DROP COLUMN "isBusiness",
DROP COLUMN "loanAmountRequested",
DROP COLUMN "loanApplicationStatus",
DROP COLUMN "membershipNumber",
DROP COLUMN "preferredFinancingInstitution",
DROP COLUMN "preferredVehicleType",
DROP COLUMN "primaryPhoneNumber",
DROP COLUMN "processedById",
DROP COLUMN "region",
DROP COLUMN "remarksNotes",
DROP COLUMN "residentialAddress",
DROP COLUMN "supportingLettersUrl",
DROP COLUMN "taxIdentificationNumberUrl",
DROP COLUMN "tin",
DROP COLUMN "vehicleQuantity",
DROP COLUMN "woredaKebele",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER',
ALTER COLUMN "fullName" DROP NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "applicantFullName" TEXT,
    "fatherName" TEXT,
    "grandfatherName" TEXT,
    "isBusiness" BOOLEAN DEFAULT false,
    "entityName" TEXT,
    "tin" TEXT,
    "businessLicenseNo" TEXT,
    "region" TEXT,
    "city" TEXT,
    "woredaKebele" TEXT,
    "primaryPhoneNumber" TEXT,
    "alternativePhoneNumber" TEXT,
    "applicantEmailAddress" TEXT,
    "preferredVehicleType" TEXT,
    "vehicleQuantity" INTEGER,
    "intendedUse" TEXT,
    "gender" TEXT,
    "idNumber" TEXT,
    "residentialAddress" TEXT,
    "houseNumber" TEXT,
    "associationName" TEXT,
    "membershipNumber" TEXT,
    "preferredFinancingInstitution" TEXT,
    "loanApplicationStatus" TEXT DEFAULT 'Pending',
    "loanAmountRequested" DECIMAL(10,2),
    "bankReferenceNumber" TEXT,
    "downPaymentProofUrl" TEXT,
    "idScanUrl" TEXT,
    "taxIdentificationNumberUrl" TEXT,
    "supportingLettersUrl" TEXT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'NEW',
    "remarksNotes" TEXT,
    "assignedToId" TEXT,
    "processedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
