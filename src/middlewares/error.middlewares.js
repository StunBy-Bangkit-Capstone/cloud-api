const { logger } = require("../apps/logging.js");
const { ResponseError } = require("../errors/response-error.js");
const multer = require('multer')

function errorMiddleware(err, req, res, next) {
    if (!err) {
        return next();
    }

    // Handling Multer error
    if (err instanceof multer.MulterError) {
        logger.error({
            message: `File upload error: ${err.message}`,
            path: req.originalUrl,
            method: req.method,
        });

        return res.status(400).json({
            error: true,
            message: `File upload error: ${err.message}`,
        });
    }

    // Handling ResponseError
    if (err instanceof ResponseError) {
        logger.error({
            message: err.message,
            errors: err.errors,
            path: req.originalUrl,
            method: req.method,
        });

        return res.status(err.status).json({
            error: true,
            message: err.message,
            errors: err.errors || [],
        });
    }

    // Handling unknown errors
    logger.error({
        message: err.message || "Unknown error",
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
    });

    res.status(500).json({
        error: true,
        message: "Internal Server Error",
        // Only include stack trace in development mode
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}

module.exports = { errorMiddleware };
