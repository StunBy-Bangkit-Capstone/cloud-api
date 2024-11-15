const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  full_name: Joi.string().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  birth_day: Joi.date().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = { registerSchema, loginSchema };
