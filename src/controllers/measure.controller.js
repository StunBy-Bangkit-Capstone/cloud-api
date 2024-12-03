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

        const imageUrl = `http://${req.get('host')}/images/${req.file.filename}`;
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

module.exports = { postMeasurement };
