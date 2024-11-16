const userService = require("../services/user.service.js");
const validation = require("../validations/user.validation.js");
const { validate } = require("../utils/validation.js");

async function register(req, res, next) {
  try {
    const validated = validate(validation.registerSchema, req.body);
    const result = await userService.registerUser(validated);

    res.status(201).json({
      res_regis: {
        error: false,
        message: "Created account succes",
        data_regis: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const validated = validate(validation.loginSchema, req.body);
    const result = await userService.loginUser(validated);

    res.status(200).json({
      res_login: {
        error: false,
        message: "Login Success",
        dataLogin: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function data_user(req, res, next) {
  try {
    const { id } = req.user;

    const result = await userService.dataUser(id);

    res.status(200).json({
      resUserData: {
        error: false,
        message: "succes get data",
        dataUsers: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function update_user(req, res, next) {
  try {
    const { id } = req.user;

    const validated = validate(validation.editProfileSchema, req.body);
    const result = await userService.editUser(id, validated);

    res.status(200).json({
      resUpdateData: {
        error: false,
        message: "succes update data",
        dataUserUpdate: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, data_user,update_user };
