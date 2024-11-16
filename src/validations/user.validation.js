const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  full_name: Joi.string().required(),
  gender: Joi.string().valid("Male", "Female").required(),
  birth_day: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const editProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  full_name: Joi.string().optional(),
  gender: Joi.string().valid("Male", "Female").optional(),
  birth_day: Joi.string().optional(),
  password: Joi.string().min(8).optional(),
  foto_url: Joi.string().optional(),
});

module.exports = { registerSchema, loginSchema, editProfileSchema };
