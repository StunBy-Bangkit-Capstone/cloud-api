const userService = require("../services/user.service.js");
const validation = require("../validations/user.validation.js");
const { validate } = require("../utils/validation.js");
const { logger } = require("../apps/logging.js");

async function register(req, res, next) {
  try {
    const validated = validate(validation.registerSchema, req.body);
    const result = await userService.registerUser(validated);

    logger.info(`User registered with ID: ${result.id}`);
    res.status(201).json({
      error: false,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const validated = validate(validation.loginSchema, req.body);
    const result = await userService.loginUser(validated);

    logger.info(`User logged in with email: ${validated.email}`);
    res.status(200).json({
      error: false,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getUserData(req, res, next) {
  try {
    const result = await userService.dataUser(req);

    logger.info(`User data retrieved for user ID: ${req.user.id}`);
    res.status(200).json({
      error: false,
      message: "Successfully retrieved user data",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const validated = validate(validation.editProfileSchema, req.body);
    const result = await userService.editUser(req, validated);

    logger.info(`User data updated for user ID: ${req.user.id}`);
    res.status(200).json({
      error: false,
      message: "User data updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getUserData, updateUser };
