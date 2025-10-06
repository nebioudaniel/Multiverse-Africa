-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
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
    "adminStatus" TEXT NOT NULL DEFAULT 'pending',
    "completedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_primaryPhoneNumber_key" ON "User"("primaryPhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");
