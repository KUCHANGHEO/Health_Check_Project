const axios = require("axios");
const logger = require("./logger");
const { Service } = require("../models");

const FAILURE_THRESHOLD = 3; // 실패 허용 횟수

const checkServiceStatus = async (service) => {
  if (service.server_status !== "up" && service.server_status !== "wait") {
    logger.info(
      `Skipping health check for service ${service.name} as it is not up or wait.`
    );
    return {
      service_id: service.id,
      check_time: new Date(),
      response_time: null,
      status_code: null,
      status: "skipped",
    };
  }

  const startTime = new Date();
  try {
    const response = await axios.get(service.url);
    const endTime = new Date();
    await service.update({ fail_count: 0 }); // 성공 시 실패 횟수 초기화
    const newStatus = service.server_status === "wait" ? "up" : "up";
    return {
      service_id: service.id,
      check_time: endTime,
      response_time: endTime - startTime,
      status_code: response.status,
      status: newStatus,
    };
  } catch (error) {
    const endTime = new Date();
    const newFailCount = service.fail_count + 1;
    const newStatus = service.server_status === "wait" ? "wait" : "down";
    if (newFailCount >= FAILURE_THRESHOLD && service.server_status !== "wait") {
      await service.update({ fail_count: newFailCount, server_status: "down" });
    } else {
      await service.update({ fail_count: newFailCount });
    }
    return {
      service_id: service.id,
      check_time: endTime,
      response_time: endTime - startTime,
      status_code: error.response ? error.response.status : 500,
      status: newStatus,
    };
  }
};

module.exports = checkServiceStatus;
