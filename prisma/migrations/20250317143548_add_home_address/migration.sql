-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "homeAddress" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "creditScore" INTEGER NOT NULL DEFAULT 200;
