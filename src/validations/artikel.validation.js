// validations/artikel.validation.js
const Joi = require('joi');

const validateArtikel = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(1).required().messages({
            'string.empty': 'Title is required',
            'any.required': 'Title is required',
        }),
        constent: Joi.string().min(1).required().messages({
            'string.empty': 'constent is required',
            'any.required': 'constent is required',
        }),
        author: Joi.string().min(1).required().messages({
            'string.empty': 'Author is required',
            'any.required': 'Author is required',
        }),
        article_img_url: Joi.string().uri().optional().messages({
            'string.uri': 'Article Image URL must be a valid URL',
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(err => ({
            message: err.message,
            path: err.path,
        }));
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = {
    validateArtikel,
};
