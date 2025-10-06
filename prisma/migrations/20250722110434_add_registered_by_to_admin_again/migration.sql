-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "registeredById" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
