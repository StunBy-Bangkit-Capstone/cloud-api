const Joi = require("joi");

module.exports = {
    post_measure: Joi.object({
        date_measure: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
        level_activity: Joi.string().valid('Rendah', 'Sedang', 'Aktif', 'Sangat_Aktif').required(),
        weight: Joi.number().positive().required(),
        baby_photo_url: Joi.string().uri().required(),
        status_asi: Joi.string().valid("ASI_Eksklusif", "ASI+MPASI", "MPASI").required(),
    }),
    sort_date: Joi.object({
        date: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .message("Date must follow the format YYYY-MM-DD")
            .optional(),
        range: Joi.number()
            .valid(0, 1, 2)
            .messages({
                'number.base': 'Range harus berupa angka',
                'any.only': 'Range harus 0 (0-6 bulan), 1 (0-12 bulan), atau 2 (0-24 bulan)'
            })
            .optional()
    }),

    nutrition_schema: Joi.object({
        food_name: Joi.string().required(),
        date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
        portion: Joi.number().required()
    }),

    detail_schema: Joi.object({
        measure_id: Joi.string().required()
    }),
    detail_nutrition_schema: Joi.object({
        nutrition_id: Joi.string().required()
    })

}