const { validate } = require("../utils/validation.js");
const validation = require("../validations/measure.validation.js");
const measureService = require('../services/measure.service.js');
const { logger } = require("../apps/logging.js");

async function postMeasurement(req, res, next) {
    try {
        logger.info('Received request for postMeasurement');

        if (!req.file) {
            logger.warn('No image file uploaded');
            return res.status(400).json({ error: true, message: 'Image file is required' });
        }

        logger.info('Image file received, processing upload');

        const imageUrl = `https://${req.get('host')}/images/${req.file.filename}`;
        req.body.baby_photo_url = imageUrl;

        logger.info('Validating request body');
        const validated = await validate(validation.post_measure, req.body);

        logger.info('Validation successful, proceeding with measurement service');

        const result = await measureService.measurementBaby(req.user.id, validated);

        logger.info('Measurement service executed successfully');

        return res.status(201).json({
            error: false,
            message: "data created successfully",
            data: result
        });

    } catch (error) {
        logger.error(`Error in postMeasurement: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

async function getMeasurements(req, res, next) {
    try {
        const userId = req.user.id;
        const validated = await validate(validation.sort_date, req.query)
        const data = await measureService.getMeasurements(userId, validated);

        res.status(200).json({
            status: "success",
            message: "data get successfully",
            data,
        });

    } catch (err) {
        next(err)
    }
}

async function getDetailMeasurement(req, res, next) {
    try {

        const validated = await validate(validation.detail_schema, req.params)

        const result = await measureService.getDetailMeasurement(validated)

        return res.status(200).json({
            error: false,
            message: "get detail data successfully",
            data: result
        });

    } catch (error) {
        next(error)
    }
}


async function food_nutrion(req, res, next) {
    try {
        const user_id = req.user.id

        const validated = await validate(validation.nutrition_schema, req.body)

        const result = await measureService.food_nutritions(user_id, validated)

        // res.status(201).json({
        //     succes: "false",
        //     message: "Data successfully created",
        //     data: result
        // })

    } catch (error) {
        next(error)
    }
}

module.exports = { postMeasurement, getMeasurements, food_nutrion ,getDetailMeasurement};
