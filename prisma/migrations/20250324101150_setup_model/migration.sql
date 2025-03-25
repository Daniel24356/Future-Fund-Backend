/*
  Warnings:

  - You are about to drop the column `otpExpiry` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otpExpiry",
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3);
