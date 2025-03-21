/*
  Warnings:

  - A unique constraint covering the columns `[cursor]` on the table `Loan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "cursor" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Loan_cursor_key" ON "Loan"("cursor");
