import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import LiveFeed from './components/LiveFeed';
import Alerts from './components/Alerts';
import VideoRecorder from './components/VideoRecorder';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/live-feed" element={<LiveFeed />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/video-recorder" element={<VideoRecorder />} />
        </Routes>
      </main>
      <footer className="bg-white shadow mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2023 Apartment Security Monitoring. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
