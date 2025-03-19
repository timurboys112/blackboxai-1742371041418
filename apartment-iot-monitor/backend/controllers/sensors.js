// Mock data storage (replace with actual database in production)
let sensorData = [];
let alerts = [];
let cameraFeeds = [
  { id: 1, name: 'Main Entrance', url: 'rtsp://camera1.stream' },
  { id: 2, name: 'Parking Area', url: 'rtsp://camera2.stream' },
  { id: 3, name: 'Lobby', url: 'rtsp://camera3.stream' }
];

// Get sensor data
exports.getSensorData = async (req, res) => {
  try {
    res.json(sensorData);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching sensor data');
  }
};

// Save new sensor data
exports.saveSensorData = async (req, res) => {
  try {
    const newData = {
      id: Date.now(),
      timestamp: new Date(),
      ...req.body
    };
    sensorData.push(newData);
    res.status(201).json(newData);
  } catch (error) {
    res.status(400);
    throw new Error('Error saving sensor data');
  }
};

// Get alerts
exports.getAlerts = async (req, res) => {
  try {
    res.json(alerts);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching alerts');
  }
};

// Create new alert
exports.createAlert = async (req, res) => {
  try {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date(),
      status: 'active',
      ...req.body
    };
    alerts.push(newAlert);
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(400);
    throw new Error('Error creating alert');
  }
};

// Get camera feeds
exports.getCameraFeeds = async (req, res) => {
  try {
    res.json(cameraFeeds);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching camera feeds');
  }
};

// Get video recordings
exports.getVideoRecordings = async (req, res) => {
  try {
    // Mock video recordings data
    const recordings = [
      {
        id: 1,
        cameraId: 1,
        timestamp: new Date(),
        duration: '00:30:00',
        url: '/recordings/vid1.mp4'
      }
    ];
    res.json(recordings);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching video recordings');
  }
};
