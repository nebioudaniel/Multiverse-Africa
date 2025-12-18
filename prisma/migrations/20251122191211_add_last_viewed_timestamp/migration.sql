-- DropIndex
DROP INDEX "public"."ActivityLog_createdAt_idx";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "lastViewedActivityTimestamp" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "grandfatherName" TEXT,
ADD COLUMN     "preferredVehicleType" TEXT,
ADD COLUMN     "vehicleQuantity" INTEGER;

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
