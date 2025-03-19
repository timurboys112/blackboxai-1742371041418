import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function VideoRecorder() {
  const [recordings, setRecordings] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchCameras();
    fetchRecordings();

    // Cleanup recording timer
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
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
      toast.error('Failed to load cameras');
    }
  };

  const fetchRecordings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/camera/recordings');
      setRecordings(response.data);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
    }
  };

  const startRecording = () => {
    if (!selectedCamera) {
      toast.error('Please select a camera first');
      return;
    }
    setIsRecording(true);
    setRecordingDuration(0);
    toast.success('Recording started');
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.success('Recording saved');
    fetchRecordings(); // Refresh the recordings list
  };

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filterRecordings = (recordings) => {
    const now = new Date();
    switch (filter) {
      case 'today':
        return recordings.filter(rec => {
          const recDate = new Date(rec.timestamp);
          return recDate.toDateString() === now.toDateString();
        });
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return recordings.filter(rec => new Date(rec.timestamp) > weekAgo);
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return recordings.filter(rec => new Date(rec.timestamp) > monthAgo);
      default:
        return recordings;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Video Recorder</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchRecordings}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recording Controls */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4">
            {/* Camera Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Camera
              </label>
              <select
                value={selectedCamera?.id || ''}
                onChange={(e) => setSelectedCamera(cameras.find(c => c.id === Number(e.target.value)))}
                className="w-full p-2 border rounded-md"
                disabled={isRecording}
              >
                <option value="">Select a camera...</option>
                {cameras.map(camera => (
                  <option key={camera.id} value={camera.id}>
                    {camera.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Camera Preview */}
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
              {selectedCamera ? (
                <div className="text-center text-gray-400">
                  <i className="fas fa-video text-4xl mb-2"></i>
                  <p>Camera Preview: {selectedCamera.name}</p>
                  {isRecording && (
                    <div className="mt-2">
                      <span className="animate-pulse text-red-500">●</span>
                      <span className="ml-2">Recording: {formatDuration(recordingDuration)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <i className="fas fa-video-slash text-4xl mb-2"></i>
                  <p>No camera selected</p>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={!selectedCamera}
                  className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <i className="fas fa-record-vinyl mr-2"></i>
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-stop mr-2"></i>
                  Stop Recording
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recordings List */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recordings</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-md text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="space-y-3">
            {filterRecordings(recordings).map((recording) => (
              <div
                key={recording.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      Camera {recording.cameraId}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(recording.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {recording.duration}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                      onClick={() => window.open(recording.url, '_blank')}
                    >
                      <i className="fas fa-play"></i>
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"
                      onClick={() => {
                        // Download functionality would go here
                        toast.success('Download started');
                      }}
                    >
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filterRecordings(recordings).length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <i className="fas fa-video-slash text-4xl mb-2"></i>
                <p>No recordings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoRecorder;
