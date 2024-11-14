const { logger } = require("../apps/logging.js");

function maskingLog({ ...obj }) {
  const sensitiveKeys = [
    "password",
    "confirm_password",
    "new_password",
    "current_password",
    "token",
  ];

  // Filtering sensitive data
  for (const key of sensitiveKeys) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = "******";
    }
  }

  return obj;
}

const logMiddleware = (req, res, next) => {
  const { body, params, query, method, originalUrl } = req;

  logger.info({
    message: "Request received",
    method: method,
    url: originalUrl,
    params: maskingLog(params),
    query: maskingLog(query),
    body: maskingLog(body),
  });

      // Save the original response.send function
      const originalSend = res.send;

      // Override the response.send function to intercept the response body and log it
      res.send = function (body) {
          // Log the response data
          const { data, errors } = JSON.parse(body);
  
          const obj = {
              message: "Response sent",
              request: {
                  method: method,
                  url: originalUrl,
              },
              status: res.statusCode,
          };
  
          if (data) {
              if (Array.isArray(data)) {
                  temp = [];
                  for (const item of data) {
                      temp.push(maskingLog(item));
                  }
                  obj.data = temp;
              } else {
                  obj.data = maskingLog(data);
              }
          } else if (errors) {
              obj.errors = maskingLog(errors);
          }
  
          logger.info(obj);
  
          // Call the original response.send function
          originalSend.call(this, body);
      };
  
      next();
};

module.exports= {logMiddleware}
