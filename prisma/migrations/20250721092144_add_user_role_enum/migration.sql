/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('APPLICANT');

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "applicantFullName" DROP NOT NULL,
ALTER COLUMN "region" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "woredaKebele" DROP NOT NULL,
ALTER COLUMN "primaryPhoneNumber" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "idNumber" DROP NOT NULL,
ALTER COLUMN "residentialAddress" DROP NOT NULL,
ALTER COLUMN "associationName" DROP NOT NULL,
ALTER COLUMN "membershipNumber" DROP NOT NULL,
ALTER COLUMN "preferredFinancingInstitution" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "primaryPhoneNumber" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'APPLICANT';
