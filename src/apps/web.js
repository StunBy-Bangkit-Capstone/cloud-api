require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { errorMiddleware } = require("../middlewares/error.middlewares.js");
const { logMiddleware } = require("../middlewares/logging.middlewares.js");
const { publicRouter } = require("../routes/public.route.js");
const {apiRoute} = require('../routes/private.route.js')

const web = express();
const server = http.createServer(web);

const corsOptions = {
  credentials: true,
  origin: "*",
};

web.use(express.static(path.join(__dirname, "../../public")));
web.use(cors(corsOptions));
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(cookieParser());


web.use(publicRouter);
web.use(logMiddleware);
web.use(errorMiddleware);
web.use(apiRoute)

module.exports = { server };
