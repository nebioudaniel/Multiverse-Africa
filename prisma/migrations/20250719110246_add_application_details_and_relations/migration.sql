/*
  Warnings:

  - The `role` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `alternativePhoneNumber` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `businessLicenseNo` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `entityName` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `fatherName` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `grandfatherName` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `intendedUse` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `isBusiness` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `preferredVehicleType` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `remarksNotes` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `taxIdentificationNumberUrl` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `tin` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleQuantity` on the `Application` table. All the data in the column will be lost.
  - The `loanApplicationStatus` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `loanAmountRequested` on the `Application` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - The `applicationStatus` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `alternativePhoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `associationName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `businessLicenseNo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `entityName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fatherName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `grandfatherName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `houseNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `intendedUse` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isBusiness` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `membershipNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `preferredVehicleType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleQuantity` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `woredaKebele` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantityRequested` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Made the column `applicantFullName` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `region` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `woredaKebele` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `primaryPhoneNumber` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idNumber` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `residentialAddress` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `associationName` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `membershipNumber` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `preferredFinancingInstitution` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `loanAmountRequested` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('MAIN_ADMIN', 'REGISTRAR_ADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LoanApplicationStatus" AS ENUM ('Pending', 'Approved', 'Disbursed');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "role",
ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'REGISTRAR_ADMIN';

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "alternativePhoneNumber",
DROP COLUMN "businessLicenseNo",
DROP COLUMN "entityName",
DROP COLUMN "fatherName",
DROP COLUMN "grandfatherName",
DROP COLUMN "intendedUse",
DROP COLUMN "isBusiness",
DROP COLUMN "preferredVehicleType",
DROP COLUMN "remarksNotes",
DROP COLUMN "taxIdentificationNumberUrl",
DROP COLUMN "tin",
DROP COLUMN "vehicleQuantity",
ADD COLUMN     "quantityRequested" INTEGER NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "tinNumberUrl" TEXT,
ADD COLUMN     "vehicleType" TEXT NOT NULL,
ALTER COLUMN "applicantFullName" SET NOT NULL,
ALTER COLUMN "region" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "woredaKebele" SET NOT NULL,
ALTER COLUMN "primaryPhoneNumber" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "idNumber" SET NOT NULL,
ALTER COLUMN "residentialAddress" SET NOT NULL,
ALTER COLUMN "associationName" SET NOT NULL,
ALTER COLUMN "membershipNumber" SET NOT NULL,
ALTER COLUMN "preferredFinancingInstitution" SET NOT NULL,
DROP COLUMN "loanApplicationStatus",
ADD COLUMN     "loanApplicationStatus" "LoanApplicationStatus" NOT NULL DEFAULT 'Pending',
ALTER COLUMN "loanAmountRequested" SET NOT NULL,
ALTER COLUMN "loanAmountRequested" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "applicationStatus",
ADD COLUMN     "applicationStatus" "ApplicationStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "alternativePhoneNumber",
DROP COLUMN "associationName",
DROP COLUMN "businessLicenseNo",
DROP COLUMN "city",
DROP COLUMN "entityName",
DROP COLUMN "fatherName",
DROP COLUMN "grandfatherName",
DROP COLUMN "houseNumber",
DROP COLUMN "intendedUse",
DROP COLUMN "isBusiness",
DROP COLUMN "membershipNumber",
DROP COLUMN "preferredVehicleType",
DROP COLUMN "region",
DROP COLUMN "tin",
DROP COLUMN "vehicleQuantity",
DROP COLUMN "woredaKebele",
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'APPLICANT';

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateIndex
CREATE INDEX "Application_applicantId_idx" ON "Application"("applicantId");

-- CreateIndex
CREATE INDEX "Application_assignedToId_idx" ON "Application"("assignedToId");

-- CreateIndex
CREATE INDEX "Application_processedById_idx" ON "Application"("processedById");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
