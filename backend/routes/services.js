const express = require('express');
const router = express.Router();
const { Service, StatusCheck } = require('../models');

// 서비스 등록
router.post('/services', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 서비스 조회
router.get('/services', async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 서비스 조회
router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 서비스 수정
router.put('/services/:id', async (req, res) => {
  try {
    const [updated] = await Service.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedService = await Service.findOne({ where: { id: req.params.id } });
      res.status(200).json(updatedService);
    } else {
      throw new Error('Service not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 서비스 삭제
router.delete('/services/:id', async (req, res) => {
  try {
    const deleted = await Service.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error('Service not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 상태 체크 결과 조회
router.get('/status', async (req, res) => {
  try {
    const statusChecks = await StatusCheck.findAll({
      include: [Service]
    });
    res.status(200).json(statusChecks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
