const userService = require("../services/user.service.js");
const validation = require("../validations/user.validation.js");
const { validate } = require("../utils/validation.js");
const { logger } = require("../apps/logging.js");
const prisma = require("../configs/db.js");
const { encryptPassword, checkPassword } = require("../utils/bcrypt.js");
const { ResponseError } = require("../errors/response-error.js");


async function register(req, res, next) {
  try {
    const data= req.body
    // const validated = validate(validation.registerSchema, req.body);
    // const result = await userService.registerUser(validated);
    const isUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (isUser) {
      throw new ResponseError(400, "Account already exists");
    }

    const hashedPassword = await encryptPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        full_name: data.full_name,
        gender: data.gender,
        birth_day: data.birth_day,
        password: hashedPassword,
      },
    });

    logger.info(`User registered with ID: ${user.id}`);
    res.status(201).json({
      error: false,
      message: "Account created successfully",
      data: user,
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
