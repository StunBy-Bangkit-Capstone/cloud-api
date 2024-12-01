-- CreateEnum
CREATE TYPE "STATUS_RESULT" AS ENUM ('NORMAL', 'STUNTING', 'OBESITAS');

-- CreateTable
CREATE TABLE "Nutrition" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "food_name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "portion" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nutrition_Result" (
    "id" TEXT NOT NULL,
    "nutrition_id" TEXT NOT NULL,
    "calciums" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "fats" DOUBLE PRECISION NOT NULL,
    "carbohydrates" DOUBLE PRECISION NOT NULL,
    "proteins" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nutrition_Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date_measure" TEXT NOT NULL,
    "level_activity" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION,
    "status_asi" TEXT NOT NULL,
    "baby_photo_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement_Response" (
    "id" TEXT NOT NULL,
    "prediction_id" TEXT NOT NULL,
    "calories_needed" DOUBLE PRECISION NOT NULL,
    "protein_needed" DOUBLE PRECISION NOT NULL,
    "fat_needed" DOUBLE PRECISION NOT NULL,
    "carbohydrate_needed" DOUBLE PRECISION NOT NULL,
    "status_result" "STATUS_RESULT" NOT NULL,

    CONSTRAINT "Measurement_Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "constent" TEXT NOT NULL,
    "author" TEXT,
    "article_img_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nutrition_Result_nutrition_id_key" ON "Nutrition_Result"("nutrition_id");

-- CreateIndex
CREATE UNIQUE INDEX "Measurement_Response_prediction_id_key" ON "Measurement_Response"("prediction_id");

-- AddForeignKey
ALTER TABLE "Nutrition" ADD CONSTRAINT "Nutrition_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrition_Result" ADD CONSTRAINT "Nutrition_Result_nutrition_id_fkey" FOREIGN KEY ("nutrition_id") REFERENCES "Nutrition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement_Response" ADD CONSTRAINT "Measurement_Response_prediction_id_fkey" FOREIGN KEY ("prediction_id") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
