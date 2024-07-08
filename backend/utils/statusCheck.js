const axios = require("axios");
const { StatusCheck } = require("../models");
const logger = require("../logger");

const checkServiceStatus = async (service) => {
  const startTime = new Date();
  try {
    const response = await axios.get(service.url);
    const endTime = new Date();

    const statusCheck = await StatusCheck.create({
      service_id: service.id,
      check_time: endTime,
      response_time: endTime - startTime,
      status_code: response.status,
    });

    logger.info(`Service ${service.name} is Healthy`);
    return statusCheck;
  } catch (error) {
    const endTime = new Date();

    const statusCode = error.response ? error.response.status : 500;
    const statusCheck = await StatusCheck.create({
      service_id: service.id,
      check_time: endTime,
      response_time: endTime - startTime,
      status_code: statusCode,
    });

    logger.error(
      `Service ${service.name} is Unhealthy: ${error.message} (status code: ${statusCode})`
    );
    return statusCheck;
  }
};

module.exports = checkServiceStatus;
