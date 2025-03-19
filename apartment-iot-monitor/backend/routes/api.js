const express = require('express');
const router = express.Router();
const { 
  getSensorData,
  saveSensorData,
  getAlerts,
  createAlert,
  getCameraFeeds,
  getVideoRecordings
} = require('../controllers/sensors');

// Sensor routes
router.get('/sensors', getSensorData);
router.post('/sensors', saveSensorData);

// Alert routes
router.get('/alerts', getAlerts);
router.post('/alerts', createAlert);

// Camera routes
router.get('/camera/feeds', getCameraFeeds);
router.get('/camera/recordings', getVideoRecordings);

module.exports = router;
