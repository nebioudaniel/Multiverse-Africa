-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registeredById" TEXT;

-- CreateIndex
CREATE INDEX "User_registeredById_idx" ON "User"("registeredById");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
