-- AlterEnum
ALTER TYPE "ContributionCycle" ADD VALUE 'LATE';

-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "cycleActive" BOOLEAN,
ADD COLUMN     "member" TEXT;

-- AlterTable
ALTER TABLE "ContributionMember" ADD COLUMN     "agreedToTerms" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "forfeited" BOOLEAN,
ADD COLUMN     "penaltyAmount" INTEGER;
