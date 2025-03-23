/*
  Warnings:

  - Added the required column `userEmail` to the `ContributionInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContributionInvitation" ADD COLUMN     "userEmail" TEXT NOT NULL;
