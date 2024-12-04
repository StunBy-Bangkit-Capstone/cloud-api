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

        logger.info(`Calling /measure-classify with URL: ${data.baby_photo_url} and data: ${JSON.stringify(data)}`);

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
        logger.info(response_ml_measure);
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
        logger.info(response_predict_nutrition);

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

        logger.info(`New measurement created with ID: ${new_measurement}`);

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
        logger.info(response_predict_nutrition);
        await prisma.measurement_Result.create({
            data: {
                measure_id: new_measurement.id,
                calories_needed: response_predict_nutrition.data.calories_needed,
                protein_needed: response_predict_nutrition.data.proteins_needed,
                fat_needed: response_predict_nutrition.data.fat_needed,
                carbohydrate_needed: response_predict_nutrition.data.carbohydrate_needed
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
                calories_needed: response_predict_nutrition.data.calories_needed,
                protein_needed: response_predict_nutrition.data.proteins_needed,
                fat_needed: response_predict_nutrition.data.fat_needed,
                carbohydrate_needed: response_predict_nutrition.data.carbohydrate_needed
            }
        };

    } catch (error) {
        logger.error(`Error in measurementBaby for user ${user_id}: ${error.message}`, { stack: error.stack });
        throw error;
    }
}

async function getMeasurements(userId, data ) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { birth_day: true },
    });

    if (!user || !user.birth_day) {
        throw new ResponseError(404, "User atau tanggal lahir tidak ditemukan");
    }

    const dateFilter = data.date
        ? {
              date_measure: {
                  gte: user.birth_day, 
                  lte: data.date,          
              },
          }
        : {
              date_measure: {
                  gte: user.birth_day, 
              },
          };

    // Query measurement dengan filter yang sesuai
    const measurements = await prisma.measurement.findMany({
        where: {
            user_id: userId,
            ...dateFilter,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    full_name: true,
                    gender: true,
                    birth_day: true,
                    foto_url: true,
                },
            },
            measuremenet_result: true,
            IMT_Result: true,
        },
        orderBy: {
            date_measure: "desc",
        },
    });

    if (!measurements || measurements.length === 0) {
        throw new ResponseError(404, "Data measurement tidak ditemukan");
    }

    return measurements;
}

async function food_nutritions(user_id,data) {
    
}

module.exports = { measurementBaby, getMeasurements ,food_nutritions};
