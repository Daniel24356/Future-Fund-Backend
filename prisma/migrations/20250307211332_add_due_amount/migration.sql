/*
  Warnings:

  - Added the required column `dueAmount` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "dueAmount" DOUBLE PRECISION NOT NULL;
