const express = require("express");
const {
  authenticate,
} = require("../middlewares/authentication.middlewares.js");
const userController = require("../controllers/user.controller.js");
const measureController = require("../controllers/measure.controller.js")
const {uploadImage} = require("../middlewares/uploadImage.middleware.js")
const artikelController = require('../controllers/artikel.controller.js');
const { validateArtikel } = require('../validations/artikel.validation.js');

const apiRoute = express.Router();
apiRoute.use(authenticate);
apiRoute.get("/api/v1/me", userController.getUserData);
apiRoute.patch("/api/v2/me", userController.updateUser);

apiRoute.post("/api/v1/measure",uploadImage, measureController.postMeasurement)
apiRoute.get("/api/v1/measures", measureController.getMeasurements)
apiRoute.post("/api/v1/nutrition", measureController.food_nutrion)
apiRoute.get("/api/v1/measure/:measure_id", measureController.getDetailMeasurement)

// Api Artikel
apiRoute.get("/api/v1/articles", artikelController.getArtikels);
apiRoute.post("/api/v1/add-articles", validateArtikel, artikelController.addArtikel)
apiRoute.get("/api/v1/articles/:id", artikelController.getArtikelDetail);


module.exports = { apiRoute };
