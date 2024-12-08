const prisma = require("../configs/db.js");
const { logger } = require("../apps/logging.js");
const { ResponseError } = require("../errors/response-error.js");


async function getAllArticlesService() {
    try {
        logger.info('Getting all articles');

        const articles = await prisma.articles.findMany({
            orderBy: {
                created_at: 'desc'
            }
        });

        if (!articles || articles.length === 0) {
            logger.warn('No articles found');
            throw new ResponseError(404, 'No articles found');
        }

        logger.info(`Successfully retrieved ${articles.length} articles`);
        return articles;

    } catch (error) {
        logger.error('Error getting articles:', error);
        throw error;
    }
}

async function getArticleByIdService(id) {
    try {
        logger.info(`Getting article detail for ID: ${id}`);

        const article = await prisma.articles.findUnique({
            where: { id }
        });

        if (!article) {
            logger.warn(`Article with ID ${id} not found`);
            throw new ResponseError(404, 'Article not found');
        }

        logger.info('Successfully retrieved article detail');
        return article;

    } catch (error) {
        logger.error(`Error getting article detail: ${error.message}`);
        throw error;
    }
}

module.exports = { getAllArticlesService, getArticleByIdService };
