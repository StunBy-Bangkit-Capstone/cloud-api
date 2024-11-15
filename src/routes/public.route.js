const express = require("express");
const publicRouter = express.Router();
const userController = require('../controllers/user.controller.js')

publicRouter.get("/", ( res) => {
    res.json({ message: "API is ready for you" });
});


publicRouter.post("/api/v1/register",userController.register)
publicRouter.post("/api/v1/login",userController.login)


module.exports = { publicRouter };
