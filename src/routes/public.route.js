const express = require("express");
const publicRouter = express.Router();
const userController = require('../controllers/user.controller.js')
const articleController = require('../controllers/article.controller.js');


publicRouter.get("/", (req, res) => {
    res.json({ message: "API is ready for you" });
});

publicRouter.post("/api/v1/register",userController.register)
publicRouter.post("/api/v1/login",userController.login)

publicRouter.get("/api/articles", articleController.getAllArticles);
publicRouter.get("/api/articles/:id", articleController.getArticleDetail);

module.exports = { publicRouter };
