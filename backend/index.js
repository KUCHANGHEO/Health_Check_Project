const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001; // 변경된 포트 번호
const { sequelize } = require('./models');
const servicesRouter = require('./routes/services');
const checkServiceStatus = require('./utils/statusCheck');
const cron = require('node-cron');

app.use(express.json());
app.use('/api', servicesRouter);

app.get('/', (req, res) => {
  res.send('Health Check Monitoring Service');
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.sync();
  console.log('Database synced');
  
  // 상태 체크 스케줄러 설정 (매 5분마다 실행)
  cron.schedule('*/5 * * * *', async () => {
    console.log('Checking service status...');
    await checkServiceStatus();
  });
});
