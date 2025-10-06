/*
  Warnings:

  - You are about to drop the column `adminStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `completedByAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Registration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_assignedOfficerId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_completedByAdminId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "adminStatus",
DROP COLUMN "completedByAdmin",
ADD COLUMN     "applicationStatus" TEXT NOT NULL DEFAULT 'NEW',
ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "associationName" TEXT,
ADD COLUMN     "bankReferenceNumber" TEXT,
ADD COLUMN     "downPaymentProofUrl" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "houseNumber" TEXT,
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "idScanUrl" TEXT,
ADD COLUMN     "loanAmountRequested" DOUBLE PRECISION,
ADD COLUMN     "loanApplicationStatus" TEXT DEFAULT 'Pending',
ADD COLUMN     "membershipNumber" TEXT,
ADD COLUMN     "preferredFinancingInstitution" TEXT,
ADD COLUMN     "processedById" TEXT,
ADD COLUMN     "remarksNotes" TEXT,
ADD COLUMN     "residentialAddress" TEXT,
ADD COLUMN     "supportingLettersUrl" TEXT,
ADD COLUMN     "taxIdentificationNumberUrl" TEXT;

-- DropTable
DROP TABLE "Registration";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
