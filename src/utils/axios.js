const axios = require('axios')
require("dotenv").config();
const { logger } = require("../apps/logging.js");

const api = axios.create({
    baseURL: process.env.BASE_API, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            logger.error('Error response:', error.response);
        } else if (error.request) {
            logger.error('No response received:', error.request);
        } else {
            logger.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

module.exports= api;
