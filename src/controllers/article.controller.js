const { logger } = require("../apps/logging.js");
const articleService = require("../services/article.service.js")

async function getAllArticles(req, res, next) {
    try {
        logger.info('Received request for all articles');

        const articles = await articleService.getAllArticlesService();

        res.status(200).json({
            error: false,
            message: 'Successfully retrieved all articles',
            data: articles
        });

    } catch (error) {
        logger.error('Error in getAllArticles controller:', error);
        next(error);
    }
}

async function getArticleDetail(req, res, next) {
    try {
        const { id } = req.params;
        logger.info(`Received request for article detail with id: ${id}`);

        const article = await articleService.getArticleByIdService(id);

        res.status(200).json({
            error: false,
            message: 'Successfully retrieved article detail',
            data: article
        });

    } catch (error) {
        logger.error('Error in getArticleDetail controller:', error);
        next(error);
    }
}

module.exports = { getAllArticles, getArticleDetail };