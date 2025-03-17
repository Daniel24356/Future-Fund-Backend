/*
  Warnings:

  - Added the required column `escrowBalance` to the `Contribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trustPeriodActive` to the `Contribution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContributionInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
ALTER TYPE "DepositStatus" ADD VALUE 'LATE';

-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "escrowBalance" INTEGER NOT NULL,
ADD COLUMN     "trustPeriodActive" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "ContributionInvitation" (
    "id" TEXT NOT NULL,
    "contributionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ContributionInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributionInvitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContributionInvitation" ADD CONSTRAINT "ContributionInvitation_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionInvitation" ADD CONSTRAINT "ContributionInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
