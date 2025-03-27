-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_createdById_fkey";

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
