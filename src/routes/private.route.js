const express = require("express");
const {
  authenticate,
} = require("../middlewares/authentication.middlewares.js");
const userController = require("../controllers/user.controller.js");

const apiRoute = express.Router();
apiRoute.use(authenticate);
apiRoute.get("/api/v1/me", userController.data_user);
apiRoute.patch("/api/v2/me", userController.update_user);

module.exports = { apiRoute };
