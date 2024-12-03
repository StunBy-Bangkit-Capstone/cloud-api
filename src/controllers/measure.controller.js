const {validate} = require("../utils/validation.js")
const validation = require("../validations/measure.validation.js")
const measureService = require('../services/measure.service.js')


async function postMeasurement(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: true, message: 'Image file is required' });
        }
        const imageUrl = `http://${req.get('host')}/images/${req.file.filename}`

        req.body.baby_photo_url = imageUrl;

        const validated = await validate(validation.post_measure, req.body)

        const result = await measureService.measurementBaby(req.user.id, validated)

        res.status(201).json({
            error: false,
            message: "data created successful",
            data: result
        });

    } catch (error) {
        next(error)
    }
}


module.exports = { postMeasurement }



