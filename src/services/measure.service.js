const prisma = require("../configs/db.js");
const { logger } = require("../apps/logging.js");
const { ResponseError } = require("../errors/response-error.js");
const api = require("../utils/axios.js");
const dayjs = require("dayjs");

async function measurementBaby(user_id, data) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: user_id
            }
        });

        if (!user) {
            throw new ResponseError(400, 'User not found');
        }

        const user_age = dayjs(data.date_measure).diff(dayjs(user.birth_day), 'month');

        const formatted_gender = user.gender === 'male' ? 'L' : 'P';

        const response_ml_measure = await api.post("/measure-classify", {
            url: data.baby_photo_url,
            weight: data.weight,
            age: user_age,
            gender: user.gender
        });

        if (!response_ml_measure) {
            throw new ResponseError(400, 'ML measure API is not working');
        }

        const response_predict_nutrition = await api.post("/predict_nutrition", {
            usia_bulan: user_age,
            gender: formatted_gender,
            berat_kg: data.weight,
            tinggi_cm: response_ml_measure.baby_length,
            aktivitas_level: data.level_activity,
            status_asi: data.status_asi
        });

        if (!response_predict_nutrition) {
            throw new ResponseError(400, 'Nutrition prediction API is not working');
        }

        const new_measurement = await prisma.measurement.create({
            data: {
                user_id: user_id,
                date_measure: data.date_measure,
                level_activity: data.level_activity,
                weight: data.weight,
                baby_photo_url: data.baby_photo_url,
                status_asi: data.status_asi
            }
        });

        await prisma.iMT_Result.create({
            data: {
                measure_id: new_measurement.id,
                baby_length: response_ml_measure.baby_length,
                z_score_bb_tb: response_ml_measure.z_score_bb_tb,
                status_imt: response_ml_measure.status_imt,
                imt: response_ml_measure.imt,
                z_score_length: response_ml_measure.z_score_length,
                z_score_weight: response_ml_measure.z_score_weight,
                nitritional_status_weight: response_ml_measure.nutritional_status_weight,
                nitritional_status_length: response_ml_measure.nutritional_status_length,
                status_bb_tb: response_ml_measure.status_bb_tb
            }
        });

        await prisma.measurement_Result.create({
            data: {
                measure_id: new_measurement.id,
                calories_needed: response_predict_nutrition.calories_needed,
                protein_needed: response_predict_nutrition.protein_needed,
                fat_needed: response_predict_nutrition.fat_needed,
                carbohydrate_needed: response_predict_nutrition.carbohydrate_needed
            }
        });

        return {
            measurement: {
                id: new_measurement.id,
                user_id: new_measurement.user_id,
                date_measure: new_measurement.date_measure,
                level_activity: new_measurement.level_activity,
                weight: new_measurement.weight,
                baby_photo_url: new_measurement.baby_photo_url,
                status_asi: new_measurement.status_asi
            },
            imt_result: {
                baby_length: response_ml_measure.baby_length,
                z_score_bb_tb: response_ml_measure.z_score_bb_tb,
                status_imt: response_ml_measure.status_imt,
                imt: response_ml_measure.imt,
                z_score_length: response_ml_measure.z_score_length,
                z_score_weight: response_ml_measure.z_score_weight,
                nitritional_status_weight: response_ml_measure.nutritional_status_weight,
                nitritional_status_length: response_ml_measure.nutritional_status_length,
                status_bb_tb: response_ml_measure.status_bb_tb
            },
            measurement_result: {
                calories_needed: response_predict_nutrition.calories_needed,
                protein_needed: response_predict_nutrition.protein_needed,
                fat_needed: response_predict_nutrition.fat_needed,
                carbohydrate_needed: response_predict_nutrition.carbohydrate_needed
            }
        };

    } catch (error) {
        logger.error(error);
        throw new ResponseError(500, error.message || 'Internal Server Error');
    }
}


module.exports = {measurementBaby}