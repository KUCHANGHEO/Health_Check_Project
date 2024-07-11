const express = require("express");
const router = express.Router();
const { Service, StatusCheck } = require("../models");
const logger = require("../utils/logger");
const checkServiceStatus = require("../utils/statusCheck");

// 서비스 등록
router.post("/services", async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    logger.error("Error creating service:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
});

// 서비스 조회
router.get("/services", async (req, res) => {
  logger.info("Fetching services");
  try {
    const services = await Service.findAll({
      include: [
        {
          model: StatusCheck,
          as: "StatusChecks",
          limit: 1,
          order: [["check_time", "DESC"]],
        },
      ],
    });

    const serviceData = services.map((service) => {
      const lastCheck = service.StatusChecks[0];
      const status = lastCheck
        ? lastCheck.status_code === 200
          ? "Healthy"
          : "Unhealthy"
        : "Unknown";
      return {
        id: service.id,
        name: service.name,
        status,
      };
    });

    logger.info("Services fetched successfully", { serviceData });

    res.status(200).json(serviceData);
  } catch (error) {
    logger.error("Error fetching services:", { message: error.message, stack: error.stack });
    res.status(500).json({ error: error.message });
  }
});

// 특정 서비스 상태 체크
router.get("/services/:id/check", async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const statusCheck = await checkServiceStatus(service);
    const status = statusCheck.status_code === 200 ? "Healthy" : "Unhealthy";

    res.status(200).json({ id: service.id, name: service.name, status });
  } catch (error) {
    logger.error("Error checking service status:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
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
      if (statusCheck.status !== "skipped") {
        await service.update({ server_status: statusCheck.status });
      }
    }

    const updatedService = await Service.findByPk(req.params.id);
    res.status(200).json(updatedService);  // 304 상태 코드 대신 200 상태 코드로 변경
  } catch (error) {
    logger.error("Error refreshing service status:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
});

// 특정 서비스 헬스 체크 로그 조회
router.get("/services/:id/logs", async (req, res) => {
  try {
    const logs = await StatusCheck.findAll({
      where: { service_id: req.params.id },
      order: [["check_time", "DESC"]],
    });
    res.status(200).json(logs);
  } catch (error) {
    logger.error("Error fetching service logs:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
});

// 상태 체크 결과 조회
router.get("/status", async (req, res) => {
  try {
    const statusChecks = await StatusCheck.findAll({
      include: [Service],
    });
    res.status(200).json(statusChecks);
  } catch (error) {
    logger.error("Error fetching status checks:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
});

// 특정 서비스 조회
router.get("/services/:id", async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    logger.error("Error fetching service:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
});

// 서비스 수정
router.put("/services/:id", async (req, res) => {
  try {
    const [updated] = await Service.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedService = await Service.findByPk(req.params.id);
      res.status(200).json(updatedService);
    } else {
      throw new Error("Service not found");
    }
  } catch (error) {
    logger.error("Error updating service:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
});

// 서비스 삭제
router.delete("/services/:id", async (req, res) => {
  try {
    const deleted = await Service.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error("Service not found");
    }
  } catch (error) {
    logger.error("Error deleting service:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
});

// 모든 서비스의 tags 가져오기
router.get("/filters", async (req, res) => {
  logger.info("Fetching filters");
  try {
    const services = await Service.findAll();
    const tagsSet = new Set();

    services.forEach(service => {
      if (service.tags) {
        service.tags.forEach(tag => tagsSet.add(tag));
      }
    });

    const filters = {
      tags: Array.from(tagsSet)
    };

    logger.info("Filters fetched successfully", { filters });

    res.status(200).json(filters);
  } catch (error) {
    logger.error("Error fetching filters:", { message: error.message, stack: error.stack });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
