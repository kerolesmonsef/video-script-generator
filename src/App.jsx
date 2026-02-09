import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import AdvicesPage from './pages/AdvicesPage.jsx';
import CartoonImagesPage from './pages/CartoonImagesPage.jsx';
import VideoStoryPage from './pages/VideoStoryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<AdvicesPage />} />
        <Route path="/scripts" element={<AdvicesPage />} />
        <Route path="/cartoon-images" element={<CartoonImagesPage />} />
        <Route path="/video-story" element={<VideoStoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

