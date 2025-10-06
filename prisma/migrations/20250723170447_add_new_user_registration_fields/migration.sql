-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acceptEpayment" BOOLEAN,
ADD COLUMN     "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "digitalSignatureUrl" TEXT,
ADD COLUMN     "driverFullName" TEXT,
ADD COLUMN     "driverLicenseNo" TEXT,
ADD COLUMN     "enableGpsTracking" BOOLEAN,
ADD COLUMN     "licenseCategory" TEXT,
ALTER COLUMN "isBusiness" SET DEFAULT false;
