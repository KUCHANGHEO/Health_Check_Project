const axios = require("axios");
const { StatusCheck } = require("../models");

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

    return statusCheck;
  } catch (error) {
    const endTime = new Date();

    const statusCheck = await StatusCheck.create({
      service_id: service.id,
      check_time: endTime,
      response_time: endTime - startTime,
      status_code: error.response ? error.response.status : 500,
    });

    return statusCheck;
  }
};

module.exports = checkServiceStatus;
