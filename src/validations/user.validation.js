const Joi = require("joi");

module.exports = {
  registerSchema: Joi.object({
    email: Joi.string().email().required(),
    full_name: Joi.string().required(),
    gender: Joi.string().valid("male", "female").required(),
    birth_day: Joi.string().required(),
    password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  }),

  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  }),

  editProfileSchema: Joi.object({
    email: Joi.string().email().optional(),
    full_name: Joi.string().optional(),
    gender: Joi.string().valid("male", "female").optional(),
    birth_day: Joi.string().optional(),
    password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .optional()
    .messages({
      "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
    foto_url: Joi.string().optional(),
  }),
};
