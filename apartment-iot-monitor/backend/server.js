const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // HTTP request logger

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle sensor data updates
  socket.on('sensor-data', (data) => {
    // Broadcast the sensor data to all connected clients
    io.emit('sensor-update', data);
  });

  // Handle alert events
  socket.on('alert', (alert) => {
    io.emit('new-alert', alert);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
