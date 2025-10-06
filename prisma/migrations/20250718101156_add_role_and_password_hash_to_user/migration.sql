/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grandfatherName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intendedUse` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isBusiness` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredVehicleType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleQuantity` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `woredaKebele` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `fullName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `primaryPhoneNumber` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fatherName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "alternativePhoneNumber" TEXT,
ADD COLUMN     "businessLicenseNo" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "emailAddress" TEXT,
ADD COLUMN     "entityName" TEXT,
ADD COLUMN     "grandfatherName" TEXT NOT NULL,
ADD COLUMN     "intendedUse" TEXT NOT NULL,
ADD COLUMN     "isBusiness" BOOLEAN NOT NULL,
ADD COLUMN     "preferredVehicleType" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "tin" TEXT,
ADD COLUMN     "vehicleQuantity" INTEGER NOT NULL,
ADD COLUMN     "woredaKebele" TEXT NOT NULL,
ALTER COLUMN "fullName" SET NOT NULL,
ALTER COLUMN "primaryPhoneNumber" SET NOT NULL,
ALTER COLUMN "fatherName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");
