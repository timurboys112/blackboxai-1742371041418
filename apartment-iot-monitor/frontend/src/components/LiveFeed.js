import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function LiveFeed() {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/camera/feeds');
      setCameras(response.data);
      if (response.data.length > 0) {
        setSelectedCamera(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
      toast.error('Failed to load camera feeds');
    }
  };

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Live Camera Feeds</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchCameras()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Camera List Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Cameras</h2>
          <div className="space-y-2">
            {cameras.map((camera) => (
              <button
                key={camera.id}
                onClick={() => handleCameraSelect(camera)}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  selectedCamera?.id === camera.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-video mr-2"></i>
                {camera.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Camera View */}
        <div className={`bg-white rounded-lg shadow ${isFullscreen ? 'lg:col-span-3' : 'lg:col-span-3'}`}>
          {selectedCamera ? (
            <div className="p-4">
              <div className="relative">
                {/* Camera Feed (Placeholder) */}
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <i className="fas fa-video text-4xl mb-2"></i>
                    <p>Live Feed: {selectedCamera.name}</p>
                    <p className="text-sm">{selectedCamera.url}</p>
                  </div>
                </div>

                {/* Camera Controls */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                  </button>
                  <button className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                    <i className="fas fa-camera"></i>
                  </button>
                  <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                    <i className="fas fa-record-vinyl"></i>
                  </button>
                </div>
              </div>

              {/* Camera Information */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedCamera.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-green-500">
                      <i className="fas fa-circle text-xs mr-1"></i>
                      Online
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resolution</p>
                    <p className="font-medium">1080p</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Frame Rate</p>
                    <p className="font-medium">30 FPS</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Motion</p>
                    <p className="font-medium">2 mins ago</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <i className="fas fa-video-slash text-4xl mb-2"></i>
              <p>No camera selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveFeed;
