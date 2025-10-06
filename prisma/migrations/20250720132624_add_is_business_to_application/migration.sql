-- AlterEnum
ALTER TYPE "VehicleType" ADD VALUE 'Traditional Minibus';

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "businessLicenseNo" TEXT,
ADD COLUMN     "entityName" TEXT,
ADD COLUMN     "intendedUse" TEXT,
ADD COLUMN     "isBusiness" BOOLEAN,
ADD COLUMN     "tin" TEXT;
