/*
  Warnings:

  - Added the required column `status_asi` to the `Measurement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Measurement" ADD COLUMN     "status_asi" TEXT NOT NULL;
