/*
  Warnings:

  - A unique constraint covering the columns `[idNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `vehicleType` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `isBusiness` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('Diesel Minibus', 'Electric Minibus', 'Electric Mid Bus (21+1)');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_applicantId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "vehicleType",
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "alternativePhoneNumber" TEXT,
ADD COLUMN     "associationName" TEXT,
ADD COLUMN     "businessLicenseNo" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "entityName" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "grandfatherName" TEXT,
ADD COLUMN     "houseNumber" TEXT,
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "isBusiness" BOOLEAN NOT NULL,
ADD COLUMN     "membershipNumber" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "residentialAddress" TEXT,
ADD COLUMN     "tin" TEXT,
ADD COLUMN     "woredaKebele" TEXT;

-- CreateIndex
CREATE INDEX "Application_applicationStatus_idx" ON "Application"("applicationStatus");

-- CreateIndex
CREATE INDEX "Application_loanApplicationStatus_idx" ON "Application"("loanApplicationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "User_idNumber_key" ON "User"("idNumber");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
