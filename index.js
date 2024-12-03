require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { errorMiddleware } = require("./src/middlewares/error.middlewares.js");
const { logMiddleware } = require("./src/middlewares/logging.middlewares.js");
const { publicRouter } = require("./src/routes/public.route.js");
const { apiRoute } = require("./src/routes/private.route.js");
const { logger } = require("./src/apps/logging.js");

const web = express();
const server = http.createServer(web);

const corsOptions = {
  credentials: true,
  origin: "*",
};

if (!process.env.DATABASE_URL || !process.env.SECRET_KEY) {
  throw new Error(
    "DATABASE_URL and SECRET_KEY must be defined in the environment"
  );
}

const DATABASE_URL = process.env.DATABASE_URL;
const SECRET_KEY = process.env.SECRET_KEY;

web.use(helmet());
web.use(express.static(path.join(__dirname, "../../public")));
web.use(cors(corsOptions));
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(cookieParser());

web.use('/images', express.static(path.join(__dirname, 'public/images')));
web.use(logMiddleware);
web.use(publicRouter);
web.use(apiRoute);
web.use(errorMiddleware);

web.use((req, res, next) => {
  res.status(404).json({
    error: true,
    message: "Resource not found",
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = { server };
