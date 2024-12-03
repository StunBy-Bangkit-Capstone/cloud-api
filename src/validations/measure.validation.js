const Joi = require("joi");

module.exports = {
    post_measure: {
        date_measure: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
        level_activity: Joi.string().valid('Rendah', 'Sedang', 'Aktif', 'Sangat_Aktif').required(),
        weight: Joi.number().positive().required(),
        baby_photo_url: Joi.string().uri().required(),
        status_asi: Joi.string().valid("ASI_Eksklusif", "ASI+MPASI", "MPASI").required(),
    }
}