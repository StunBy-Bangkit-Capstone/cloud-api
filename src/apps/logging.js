const { createLogger, format, transports } = require("winston");
const { combine, prettyPrint, timestamp } = format;


const logger = createLogger({
    format: combine(
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        prettyPrint()
    ),
    transports: [
        new transports.Console({
            level: "debug",
        }),
        new transports.File({
            filename: "./logs/api/info.log",
            level: "info",
        }),
        new transports.File({
            filename: "./logs/api/error.log",
            level: "error",
        }),
    ],
});

module.exports = { logger };