# Aplikasi Monitoring Keamanan Apartemen Berbasis IoT

A modern IoT-based security monitoring system for apartment complexes. This application provides real-time monitoring of security cameras, sensors, and alerts management through a user-friendly web interface.

## Features

- 🎥 Real-time camera monitoring
- 🚨 Alert management system
- 📹 Video recording capabilities
- 📊 Sensor data visualization
- 🔔 Real-time notifications
- 📱 Responsive design for all devices

## Tech Stack

### Backend
- Node.js
- Express.js
- Socket.IO for real-time communications
- RESTful API architecture

### Frontend
- React.js
- Tailwind CSS for styling
- Socket.IO client for real-time updates
- Chart.js for data visualization
- Font Awesome icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd apartment-iot-monitor
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

1. Backend configuration:
   - Copy `.env.example` to `.env`
   - Update environment variables as needed

2. Frontend configuration:
   - Update API endpoint in `src/services/api.js` if needed

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
apartment-iot-monitor/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## API Endpoints

### Sensors
- GET `/api/sensors` - Get all sensor data
- POST `/api/sensors` - Save new sensor data

### Alerts
- GET `/api/alerts` - Get all alerts
- POST `/api/alerts` - Create new alert
- POST `/api/alerts/:id/resolve` - Resolve an alert

### Cameras
- GET `/api/camera/feeds` - Get all camera feeds
- GET `/api/camera/recordings` - Get video recordings

## Real-time Events

The application uses Socket.IO for real-time updates:

- `sensor-data` - New sensor data
- `sensor-update` - Updated sensor readings
- `new-alert` - New security alert

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- Tailwind CSS for styling
- Chart.js for data visualization
