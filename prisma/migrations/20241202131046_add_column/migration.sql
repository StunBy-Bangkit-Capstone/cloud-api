/*
  Warnings:

  - You are about to drop the column `height` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `status_asi` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the `Measurement_Response` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Measurement_Response" DROP CONSTRAINT "Measurement_Response_prediction_id_fkey";

-- AlterTable
ALTER TABLE "Measurement" DROP COLUMN "height",
DROP COLUMN "status_asi";

-- DropTable
DROP TABLE "Measurement_Response";

-- CreateTable
CREATE TABLE "IMT_Result" (
    "id" TEXT NOT NULL,
    "measure_id" TEXT NOT NULL,
    "baby_length" DOUBLE PRECISION NOT NULL,
    "z_score_bb_tb" DOUBLE PRECISION NOT NULL,
    "status_imt" TEXT NOT NULL,
    "imt" DOUBLE PRECISION NOT NULL,
    "z_score_length" DOUBLE PRECISION NOT NULL,
    "z_score_weight" DOUBLE PRECISION NOT NULL,
    "nitritional_status_weight" TEXT NOT NULL,
    "nitritional_status_length" TEXT NOT NULL,
    "status_bb_tb" TEXT NOT NULL,

    CONSTRAINT "IMT_Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement_Result" (
    "id" TEXT NOT NULL,
    "measure_id" TEXT NOT NULL,
    "calories_needed" DOUBLE PRECISION NOT NULL,
    "protein_needed" DOUBLE PRECISION NOT NULL,
    "fat_needed" DOUBLE PRECISION NOT NULL,
    "carbohydrate_needed" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Measurement_Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IMT_Result_measure_id_key" ON "IMT_Result"("measure_id");

-- CreateIndex
CREATE UNIQUE INDEX "Measurement_Result_measure_id_key" ON "Measurement_Result"("measure_id");

-- AddForeignKey
ALTER TABLE "IMT_Result" ADD CONSTRAINT "IMT_Result_measure_id_fkey" FOREIGN KEY ("measure_id") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement_Result" ADD CONSTRAINT "Measurement_Result_measure_id_fkey" FOREIGN KEY ("measure_id") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
