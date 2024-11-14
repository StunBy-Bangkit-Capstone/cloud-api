require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const rateLimiter = require("express-rate-limit");
const {errorMiddleware} = require('../middlewares/error.middlewares.js')
const {logMiddleware} = require('../middlewares/logging.middlewares.js')


const web = express();
const server = http.createServer(web);

// rate limiter

const limiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minutes
  max: 120, // limit each IP to 120 requests per windowMs
  handler: (req, res, next) => {
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const corsOptions = {
    credentials: true,
    origin: '*',
};

web.use(express.static(path.join(__dirname, "../../public")));
web.use(cors(corsOptions))
web.use(limiter);
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(cookieParser());
web.use(errorMiddleware);


web.use(logMiddleware);
web.use(errorMiddleware);

module.exports= {server}