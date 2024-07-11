const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const { sequelize, Service } = require("./models");
const servicesRouter = require("./routes/services");
const checkServiceStatus = require("./utils/statusCheck");
const cron = require("node-cron");
const logger = require("./utils/logger");
const requestLogger = require("./utils/requestLogger");

app.use(express.json());
app.use(requestLogger);
app.use("/api", servicesRouter);

app.get("/", (req, res) => {
  res.send("Health Check Monitoring Service");
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.sync();
  console.log("Database synced");

  // 상태 체크 스케줄러 설정 (매 5분마다 실행)
  cron.schedule("*/5 * * * *", async () => {
    console.log("Checking service status...");
    const services = await Service.findAll();
    services.forEach((service) => {
      checkServiceStatus(service);
    });
  });
});
