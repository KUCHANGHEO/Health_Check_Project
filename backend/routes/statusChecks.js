const express = require("express");
const router = express.Router();
const { Service, StatusCheck } = require("../models");
const checkServiceStatus = require("../utils/statusCheck");
const logger = require("../utils/logger");

// 상태 체크 수행
router.get("/check", async (req, res) => {
  try {
    const services = await Service.findAll();
    const results = [];

    for (const service of services) {
      const result = await checkServiceStatus(service);
      if (result.status !== "skipped") {
        await StatusCheck.create(result);
      }
      results.push(result);
    }

    res.status(200).json(results);
  } catch (error) {
    logger.error("Error checking service statuses:", error);
    res.status(500).json({ error: "Error checking service statuses" });
  }
});

// 특정 서비스 헬스 체크 수행
router.get("/services/:id/refresh", async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    if (service.server_status === "up" || service.server_status === "wait") {
      const statusCheck = await checkServiceStatus(service);
      await StatusCheck.create(statusCheck);
      await service.update({ server_status: statusCheck.status });
    }

    const updatedService = await Service.findByPk(req.params.id);
    res.status(200).json(updatedService);
  } catch (error) {
    logger.error("Error refreshing service status:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
