/*
  Warnings:

  - Added the required column `notes` to the `Nutrition_Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nutrition_Result" ADD COLUMN     "notes" TEXT NOT NULL;
