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

        let response_ml_measure
        try {
            response_ml_measure = await api.post("/measure-classify", {
                url: data.baby_photo_url,
                weight: data.weight,
                age: user_age,
                gender: user.gender
            });

        } catch (error) {
            throw new ResponseError(500, error)
        }
        if (!response_ml_measure) {
            logger.error('ML measure API response is empty or invalid');
            throw new ResponseError(400, 'ML measure API is not working');
        }

        logger.info('ML measure API response received successfully');
        logger.info(response_ml_measure);
        // 4. Panggil API untuk prediksi kebutuhan nutrisi bayi
        logger.info('Calling /predict_nutrition API for nutrition prediction');

        let response_predict_nutrition;
        try {
            response_predict_nutrition = await api.post("/predict-nutrition", {
                usia_bulan: user_age,
                gender: formatted_gender,
                berat_kg: data.weight,
                tinggi_cm: response_ml_measure.baby_length,
                aktivitas_level: data.level_activity,
                status_asi: data.status_asi
            });
        } catch (error) {
            throw new ResponseError(500, error)

        }

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

async function getMeasurements(userId, data) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { birth_day: true },
    });

    if (!user || !user.birth_day) {
        throw new ResponseError(404, "User atau tanggal lahir tidak ditemukan");
    }

    // const dateFilter = data.date
    //     ? {
    //         date_measure: {
    //             gte: user.birth_day,
    //             lte: data.date,
    //         },
    //     }
    //     : {
    //         date_measure: {
    //             gte: user.birth_day,
    //         },
    //     };

    let rangeEndDate;
    if (data.range !== undefined) {
        switch (data.range) {
            case 0:
                rangeEndDate = dayjs(user.birth_day).add(6, 'month').format('YYYY-MM-DD');
                break;
            case 1:
                rangeEndDate = dayjs(user.birth_day).add(12, 'month').format('YYYY-MM-DD');
                break;
            case 2:
                rangeEndDate = dayjs(user.birth_day).add(24, 'month').format('YYYY-MM-DD');
                break;
            default:
                rangeEndDate = data.date || dayjs().format('YYYY-MM-DD');
        }
    } else {
        rangeEndDate = data.date || dayjs().format('YYYY-MM-DD');
    }

    const dateFilter = {
        date_measure: {
            gte: user.birth_day,
            lte: rangeEndDate,
        },
    };

    logger.info(`Fetching measurements with date range: ${user.birth_day} to ${rangeEndDate}`);


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

async function getDetailMeasurement(data) {
    const { measure_id } = data

    const measure_data = await prisma.measurement.findUnique({
        where: {
            id: measure_id,
        },
        include: {
            measuremenet_result: true,
            IMT_Result: true
        }
    })
    if (!measure_data) {
        throw new ResponseError(400, "Data Not Found")
    }


    return measure_data

}

async function food_nutritions(user_id, data) {
    try {
        logger.info(`Starting food nutrition service for user: ${user_id}`);
        const {food_name, date, portion} = data;

        // Check user
        const user = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!user) {
            throw new ResponseError(400, "User not found");
        }

        // Get nutrition data from API
        logger.info("Calling food nutrition API");
        let food_nutrition;
        try {
            food_nutrition = await api.post("/add-food", {
                user_id,
                food_name,
                date,
                portion
            });
        } catch (error) {
            throw new ResponseError(400, `Failed to get food nutrition data: ${error.message}`);
        }

        // Validate API response
        if (!food_nutrition?.data?.nutrients) {
            throw new ResponseError(400, "Invalid response from nutrition API");
        }

        const {notes, nutrients} = food_nutrition.data;
        const {calcium, calories, carbohydrate, fat, proteins} = nutrients;

        // Save data using transaction
        let result;
        try {
            result = await prisma.$transaction(async (tx) => {
                const nutrition = await tx.nutrition.create({
                    data: {
                        user_id,
                        food_name,
                        date,
                        portion 
                    }
                });

                await tx.nutrition_Result.create({
                    data: {
                        nutrition_id: nutrition.id,
                        notes,
                        calciums: calcium,
                        calories,
                        carbohydrates: carbohydrate,
                        fats: fat,
                        proteins 
                    }
                });

                return await tx.nutrition.findFirst({
                    where: {
                        id: nutrition.id
                    },
                    include: {
                        Nutrition_Result: true
                    }
                });
            });

            logger.info(`Successfully saved nutrition data with ID: ${result.id}`);
            return result;

        } catch (error) {
            logger.error(`Failed to save nutrition data: ${error.message}`);
            throw new ResponseError(500, "Failed to save nutrition data");
        }

    } catch (error) {
        logger.error(`Error in food_nutritions: ${error.message}`);
        throw error;
    }
}


async function histories_food_nutrition(user_id) {
    try {
        logger.info(`Starting get histories food nutrition for user: ${user_id}`);

        const user = await prisma.user.findUnique({
            where: {
                id: user_id
            }
        });

        if (!user) {
            logger.error(`User with id ${user_id} not found`);
            throw new ResponseError(400, "User not found");
        }

        const nutrition_histories = await prisma.nutrition.findMany({
            where: {
                user_id: user_id
            },
            include: {
                Nutrition_Result: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        if (!nutrition_histories || nutrition_histories.length === 0) {
            logger.info(`No nutrition histories found for user: ${user_id}`);
            throw new ResponseError(404, "No nutrition histories found");
        }

        const total_nutrition = nutrition_histories.reduce((acc, curr) => {
            if (curr.Nutrition_Result) {
                acc.total_calories += curr.Nutrition_Result.calories || 0;
                acc.total_proteins += curr.Nutrition_Result.proteins || 0;
                acc.total_carbohydrates += curr.Nutrition_Result.carbohydrates || 0;
                acc.total_fats += curr.Nutrition_Result.fats || 0;
                acc.total_calciums += curr.Nutrition_Result.calciums || 0;
            }
            return acc;
        }, {
            total_calories: 0,
            total_proteins: 0,
            total_carbohydrates: 0,
            total_fats: 0,
            total_calciums: 0
        });

        const formatted_histories = nutrition_histories.map(item => ({
            id: item.id,
            food_name: item.food_name,
            date: item.date,
            portion: item.portion,
            created_at: item.created_at,
            nutrition_details: item.Nutrition_Result ? {
                notes: item.Nutrition_Result.notes,
                calciums: item.Nutrition_Result.calciums,
                calories: item.Nutrition_Result.calories,
                carbohydrates: item.Nutrition_Result.carbohydrates,
                fats: item.Nutrition_Result.fats,
                proteins: item.Nutrition_Result.proteins
            } : null
        }));

        logger.info(`Successfully retrieved nutrition histories for user: ${user_id}`);

        return {
            histories: formatted_histories,
            total_nutrition
        };

    } catch (error) {
        logger.error(`Error in histories_food_nutrition for user ${user_id}: ${error.message}`, { stack: error.stack });
        throw error;
    }
}


async function get_detail_nutrition(user_id, nutrition_id) {
    try {
        logger.info(`Starting get detail nutrition for user: ${user_id}, nutrition_id: ${nutrition_id}`);

        const nutrition_detail = await prisma.nutrition.findFirst({
            where: {
                id: nutrition_id,
                user_id: user_id // Memastikan nutrisi ini milik user yang request
            },
            include: {
                Nutrition_Result: true,
                User: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true
                    }
                }
            }
        });

        if (!nutrition_detail) {
            logger.error(`Nutrition with id ${nutrition_id} not found or not owned by user ${user_id}`);
            throw new ResponseError(404, "Nutrition data not found");
        }

        const formatted_detail = {
            id: nutrition_detail.id,
            food_name: nutrition_detail.food_name,
            date: nutrition_detail.date,
            portion: nutrition_detail.portion,
            created_at: nutrition_detail.created_at,
            updated_at: nutrition_detail.updated_at,
            nutrition_result: nutrition_detail.Nutrition_Result ? {
                id: nutrition_detail.Nutrition_Result.id,
                notes: nutrition_detail.Nutrition_Result.notes,
                calciums: nutrition_detail.Nutrition_Result.calciums,
                calories: nutrition_detail.Nutrition_Result.calories,
                carbohydrates: nutrition_detail.Nutrition_Result.carbohydrates,
                fats: nutrition_detail.Nutrition_Result.fats,
                proteins: nutrition_detail.Nutrition_Result.proteins,

            } : null
        };

        logger.info(`Successfully retrieved nutrition detail for id: ${nutrition_id}`);
        
        return formatted_detail;

    } catch (error) {
        logger.error(`Error in getDetailNutrition: ${error.message}`, { stack: error.stack });
        throw error;
    }
}

module.exports = { measurementBaby, get_detail_nutrition,histories_food_nutrition,getMeasurements, food_nutritions, getDetailMeasurement };
