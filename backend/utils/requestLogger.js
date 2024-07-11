const logger = require("./logger");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl, params, query, body } = req;
    const { statusCode, statusMessage } = res;

    logger.info(`${method} ${originalUrl} ${statusCode} - ${duration}ms`, {
      request: {
        params,
        query,
        body,
      },
      response: {
        statusCode,
        statusMessage,
      },
    });
  });

  next();
};

module.exports = requestLogger;
