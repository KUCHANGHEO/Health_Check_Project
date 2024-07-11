// backend/requestLogger.js
const logger = require('./logger');

const requestLogger = (req, res, next) => {
  const { method, url } = req;
  const startTime = new Date().getTime();

  res.on('finish', () => {
    const { statusCode } = res;
    const responseTime = new Date().getTime() - startTime;
    logger.info(`${method} ${url} ${statusCode} - ${responseTime}ms`);
  });

  next();
};

module.exports = requestLogger;
