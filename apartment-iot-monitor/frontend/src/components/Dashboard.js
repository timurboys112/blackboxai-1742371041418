import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

function Dashboard() {
  const [sensorData, setSensorData] = useState({
    temperature: '24°C',
    humidity: '65%',
    motion: 'No Movement',
    doors: 'All Secured'
  });
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [onlineCameras, setOnlineCameras] = useState(0);

  useEffect(() => {
    // Connect to WebSocket
    const socket = io('http://localhost:5000');

    // Listen for real-time sensor updates
    socket.on('sensor-update', (data) => {
      setSensorData(prevData => ({ ...prevData, ...data }));
    });

    // Fetch initial data
    const fetchData = async () => {
      try {
        const [sensorsRes, alertsRes, camerasRes] = await Promise.all([
          axios.get('http://localhost:5000/api/sensors'),
          axios.get('http://localhost:5000/api/alerts'),
          axios.get('http://localhost:5000/api/camera/feeds')
        ]);

        if (sensorsRes.data.length > 0) {
          setSensorData(sensorsRes.data[sensorsRes.data.length - 1]);
        }
        setActiveAlerts(alertsRes.data.filter(alert => alert.status === 'active').length);
        setOnlineCameras(camerasRes.data.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();

    return () => socket.disconnect();
  }, []);

  const StatusCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color}`}>
          <i className={`${icon} text-white text-2xl`}></i>
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Security Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Temperature"
          value={sensorData.temperature}
          icon="fas fa-thermometer-half"
          color="bg-red-500"
        />
        <StatusCard
          title="Humidity"
          value={sensorData.humidity}
          icon="fas fa-tint"
          color="bg-blue-500"
        />
        <StatusCard
          title="Motion Status"
          value={sensorData.motion}
          icon="fas fa-running"
          color="bg-yellow-500"
        />
        <StatusCard
          title="Door Status"
          value={sensorData.doors}
          icon="fas fa-door-closed"
          color="bg-green-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/alerts"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-red-100">
              <i className="fas fa-bell text-red-500 text-2xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-800 font-semibold">Active Alerts</h3>
              <p className="text-red-500 text-2xl font-bold">{activeAlerts}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/live-feed"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100">
              <i className="fas fa-video text-blue-500 text-2xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-800 font-semibold">Online Cameras</h3>
              <p className="text-blue-500 text-2xl font-bold">{onlineCameras}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/video-recorder"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-purple-100">
              <i className="fas fa-record-vinyl text-purple-500 text-2xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-800 font-semibold">Video Recording</h3>
              <p className="text-purple-500">Manage Recordings</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { time: '2 minutes ago', event: 'Motion detected in Lobby' },
            { time: '5 minutes ago', event: 'Temperature alert in Server Room' },
            { time: '10 minutes ago', event: 'Main entrance door opened' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center text-gray-600">
              <i className="fas fa-circle text-xs text-blue-500 mr-2"></i>
              <span className="text-sm font-medium mr-2">{activity.time}:</span>
              <span className="text-sm">{activity.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
