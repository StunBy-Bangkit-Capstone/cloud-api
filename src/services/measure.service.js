const prisma = require("../configs/db.js");
const { logger } = require("../apps/logging.js");
const { ResponseError } = require("../errors/response-error.js");
const api = require("../utils/axios.js");
const dayjs = require("dayjs");

async function measurementBaby(user_id, data) {
    try {
        logger.info(`Starting measurement process for user: ${user_id}`);

        // 1. Cek apakah user ada di database
        const user = await prisma.user.findFirst({
            where: {
                id: user_id
            }
        });

        if (!user) {
            logger.error(`User with id ${user_id} not found`);
            throw new ResponseError(400, 'User not found');
        }

        logger.info(`User found: ${user.id}, calculating age`);

        // 2. Hitung usia bayi berdasarkan tanggal pengukuran
        const user_age = dayjs(data.date_measure).diff(dayjs(user.birth_day), 'month');
        logger.info(`User age calculated: ${user_age} months`);

        const formatted_gender = user.gender === 'male' ? 'L' : 'P';

        // 3. Panggil API untuk melakukan pengukuran menggunakan ML
        logger.info('Calling /measure-classify API for ML measure');
        const response_ml_measure = await api.post("/measure-classify", {
            url: data.baby_photo_url,
            weight: data.weight,
            age: user_age,
            gender: user.gender
        });

        if (!response_ml_measure) {
            logger.error('ML measure API response is empty or invalid');
            throw new ResponseError(400, 'ML measure API is not working');
        }

        logger.info('ML measure API response received successfully');

        // 4. Panggil API untuk prediksi kebutuhan nutrisi bayi
        logger.info('Calling /predict_nutrition API for nutrition prediction');
        const response_predict_nutrition = await api.post("/predict_nutrition", {
            usia_bulan: user_age,
            gender: formatted_gender,
            berat_kg: data.weight,
            tinggi_cm: response_ml_measure.baby_length,
            aktivitas_level: data.level_activity,
            status_asi: data.status_asi
        });

        if (!response_predict_nutrition) {
            logger.error('Nutrition prediction API response is empty or invalid');
            throw new ResponseError(400, 'Nutrition prediction API is not working');
        }

        logger.info('Nutrition prediction API response received successfully');

        // 5. Simpan data pengukuran baru ke dalam database
        logger.info('Creating new measurement record in database');
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

        logger.info(`New measurement created with ID: ${new_measurement.id}`);

        // 6. Simpan hasil IMT ke dalam database
        logger.info('Creating new iMT_Result record in database');
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

        logger.info('New iMT_Result record created successfully');

        // 7. Simpan hasil prediksi nutrisi ke dalam database
        logger.info('Creating new measurement_Result record in database');
        await prisma.measurement_Result.create({
            data: {
                measure_id: new_measurement.id,
                calories_needed: response_predict_nutrition.calories_needed,
                protein_needed: response_predict_nutrition.protein_needed,
                fat_needed: response_predict_nutrition.fat_needed,
                carbohydrate_needed: response_predict_nutrition.carbohydrate_needed
            }
        });

        logger.info('New measurement_Result record created successfully');

        // 8. Return hasil lengkap pengukuran, IMT, dan prediksi nutrisi
        logger.info('Returning measurement results');
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
        logger.error(`Error in measurementBaby for user ${user_id}: ${error.message}`, { stack: error.stack });
        throw error;
    }
}

module.exports = { measurementBaby };
