const axios = require('axios');
const { StatusCheck, Service } = require('../models');

const checkServiceStatus = async () => {
  const services = await Service.findAll();

  for (const service of services) {
    try {
      const startTime = new Date().getTime();
      const response = await axios.get(service.url);
      const endTime = new Date().getTime();

      const status = response.data.status === 'success' ? 200 : 500;

      await StatusCheck.create({
        service_id: service.id,
        check_time: new Date(),
        response_time: endTime - startTime,
        status_code: status
      });
    } catch (error) {
      await StatusCheck.create({
        service_id: service.id,
        check_time: new Date(),
        response_time: null,
        status_code: error.response ? error.response.status : 500
      });
    }
  }
};

module.exports = checkServiceStatus;
