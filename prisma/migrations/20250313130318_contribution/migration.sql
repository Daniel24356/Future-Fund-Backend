/*
  Warnings:

  - Added the required column `maxMembers` to the `Contribution` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `cycle` on the `Contribution` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContributionCycle" AS ENUM ('WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "maxMembers" INTEGER NOT NULL,
DROP COLUMN "cycle",
ADD COLUMN     "cycle" "ContributionCycle" NOT NULL;
