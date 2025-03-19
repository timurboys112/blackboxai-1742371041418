import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, resolved
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Connect to WebSocket for real-time alerts
    const socket = io('http://localhost:5000');
    
    socket.on('new-alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
      toast.error(`New Alert: ${alert.message}`);
    });

    // Fetch initial alerts
    fetchAlerts();

    return () => socket.disconnect();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts');
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await axios.post(`http://localhost:5000/api/alerts/${alertId}/resolve`);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      ));
      toast.success('Alert marked as resolved');
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const filteredAlerts = alerts
    .filter(alert => {
      if (filter === 'active') return alert.status === 'active';
      if (filter === 'resolved') return alert.status === 'resolved';
      return true;
    })
    .filter(alert =>
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getAlertIcon = (type) => {
    switch (type) {
      case 'motion':
        return 'fas fa-running';
      case 'door':
        return 'fas fa-door-open';
      case 'temperature':
        return 'fas fa-thermometer-half';
      default:
        return 'fas fa-exclamation-triangle';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Security Alerts</h1>
        <button
          onClick={fetchAlerts}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <i className="fas fa-sync-alt mr-2"></i>
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md ${
              filter === 'active'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-md ${
              filter === 'resolved'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <i className="fas fa-check-circle text-4xl text-green-500 mb-2"></i>
            <p className="text-gray-500">No alerts found</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg shadow-sm p-4 ${getAlertColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`rounded-full p-3 ${
                    alert.status === 'resolved' ? 'bg-green-200' : 'bg-white'
                  }`}>
                    <i className={`${getAlertIcon(alert.type)} text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">{alert.message}</h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        {alert.location}
                      </p>
                      <p>
                        <i className="fas fa-clock mr-2"></i>
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;
