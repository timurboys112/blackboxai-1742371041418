import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Sensor related API calls
export const sensorApi = {
  getSensorData: () => apiClient.get('/sensors'),
  saveSensorData: (data) => apiClient.post('/sensors', data),
};

// Alert related API calls
export const alertApi = {
  getAlerts: () => apiClient.get('/alerts'),
  createAlert: (alert) => apiClient.post('/alerts', alert),
  resolveAlert: (alertId) => apiClient.post(`/alerts/${alertId}/resolve`),
};

// Camera related API calls
export const cameraApi = {
  getCameraFeeds: () => apiClient.get('/camera/feeds'),
  getVideoRecordings: () => apiClient.get('/camera/recordings'),
  startRecording: (cameraId) => apiClient.post(`/camera/${cameraId}/record/start`),
  stopRecording: (cameraId) => apiClient.post(`/camera/${cameraId}/record/stop`),
};

// Socket.IO event names
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  SENSOR_DATA: 'sensor-data',
  SENSOR_UPDATE: 'sensor-update',
  NEW_ALERT: 'new-alert',
};

export default {
  sensorApi,
  alertApi,
  cameraApi,
  SOCKET_EVENTS,
};
