/*
  Warnings:

  - The `agreedToTerms` column on the `ContributionMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `member` on table `Contribution` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contribution" ALTER COLUMN "member" SET NOT NULL;

-- AlterTable
ALTER TABLE "ContributionMember" DROP COLUMN "agreedToTerms",
ADD COLUMN     "agreedToTerms" BOOLEAN;
