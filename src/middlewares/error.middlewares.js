const { logger } = require("../apps/logging.js");
const { ResponseError } = require("../errors/response-error.js");
const multer = require('multer')

function errorMiddleware(err, req, res, next) {
    if (!err) {
        return next();
    }
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: true,
            message: `File upload error: ${err.message}`,
        });
    }
    if (err instanceof ResponseError) {
        logger.error({ message: err.message, errors: err.errors });
        return res.status(err.status).json({
            error: true,
            message: err.message,
            errors: err.errors || [],
        });
    }

    // Log the error details for further debugging
    logger.error({
        message: err.message || "Unknown error",
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
    });

    // Send the error message, along with more details if available
    res.status(500).json({
        error: true,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Show stack trace in dev mode
    });
}

module.exports = { errorMiddleware };
