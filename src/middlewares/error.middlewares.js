const { logger } = require("../apps/logging.js");
const { ResponseError } = require("../errors/response-error.js");


async function errorMiddleware(err, req, res, next) {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        const body = {
            message: err.message,
        };

        if (err.errors) {
            body.errors = err.errors;
        }

        logger.error({ message: err.message, errors: err.errors });
        res.status(err.status).json(body);
    } else {
        logger.error(err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { errorMiddleware };
