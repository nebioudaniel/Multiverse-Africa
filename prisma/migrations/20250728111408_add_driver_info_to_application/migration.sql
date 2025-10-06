/*
  Warnings:

  - Added the required column `driverFullName` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driverLicenseNo` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licenseCategory` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LicenseCategory" AS ENUM ('A', 'B', 'C', 'D');

-- Step 1: Add the columns to the "Application" table as NULLABLE first
ALTER TABLE "Application" ADD COLUMN "driverFullName" TEXT;
ALTER TABLE "Application" ADD COLUMN "driverLicenseNo" TEXT;
ALTER TABLE "Application" ADD COLUMN "licenseCategory" "LicenseCategory";

-- Step 2: Update existing rows with a default value for the new columns
-- IMPORTANT: Choose sensible default values.
-- For text, 'N/A' or an empty string is common.
-- For LicenseCategory, you MUST pick one of your enum values (e.g., 'A', 'B', 'C', 'D').
-- I'm using 'N/A' for text and 'A' for LicenseCategory as examples.
UPDATE "Application" SET "driverFullName" = 'N/A' WHERE "driverFullName" IS NULL;
UPDATE "Application" SET "driverLicenseNo" = 'N/A' WHERE "driverLicenseNo" IS NULL;
UPDATE "Application" SET "licenseCategory" = 'A' WHERE "licenseCategory" IS NULL;

-- Step 3: Alter the columns to be NOT NULL
ALTER TABLE "Application" ALTER COLUMN "driverFullName" SET NOT NULL;
ALTER TABLE "Application" ALTER COLUMN "driverLicenseNo" SET NOT NULL;
ALTER TABLE "Application" ALTER COLUMN "licenseCategory" SET NOT NULL;


-- CreateTable for ActivityLog (This part was correct, ensuring it's here)
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "performedById" TEXT,
    "entityId" TEXT,
    "entityType" TEXT,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for ActivityLog
CREATE INDEX "ActivityLog_performedById_idx" ON "ActivityLog"("performedById");
CREATE INDEX "ActivityLog_entityId_idx" ON "ActivityLog"("entityId");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt" DESC); -- Added DESC for better ordering

-- AddForeignKey for ActivityLog
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;