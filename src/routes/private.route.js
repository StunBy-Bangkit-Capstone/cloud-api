const express = require("express");
const {
  authenticate,
} = require("../middlewares/authentication.middlewares.js");
const userController = require("../controllers/user.controller.js");
const measureController = require("../controllers/measure.controller.js")
const {uploadImage} = require("../middlewares/uploadImage.middleware.js")


const apiRoute = express.Router();
apiRoute.use(authenticate);
apiRoute.get("/api/v1/me", userController.getUserData);
apiRoute.patch("/api/v2/me", userController.updateUser);

apiRoute.post("/api/v1/measure",uploadImage, measureController.postMeasurement)
apiRoute.get("/api/v1/measures", measureController.getMeasurements)
apiRoute.post("/api/v1/nutrition", measureController.food_nutrion)
apiRoute.get("/api/v1/nutritions", measureController.getNutritionHistories)
apiRoute.get("/api/v1/nutrition/:nutrition_id", measureController.getNutritionDetail)
apiRoute.get("/api/v1/measure/:measure_id", measureController.getDetailMeasurement)



module.exports = { apiRoute };
