const { logger } = require("../apps/logging.js");
const { ResponseError } = require("../errors/response-error.js");

function errorMiddleware(err, req, res, next) {
    if (!err) {
        return next();
    }
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: true,
            message: err.message,
        });
    }
    if (err instanceof ResponseError) {
        logger.error({ message: err.message, errors: err.errors });
        return res.status(err.status).json({
            error: true,
            message: err.message,
            errors: err.errors,
        });
    }

    logger.error({
        message: err.message || "Unknown error",
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
    });

    res.status(500).json({
        error: true,
        message: "Internal Server Error",
    });
}

module.exports = { errorMiddleware };
