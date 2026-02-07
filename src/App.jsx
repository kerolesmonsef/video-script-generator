import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import ScriptsPage from './pages/ScriptsPage.jsx';
import CartoonImagesPage from './pages/CartoonImagesPage.jsx';
import VideoStoryPage from './pages/VideoStoryPage.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ScriptsPage />} />
        <Route path="/scripts" element={<ScriptsPage />} />
        <Route path="/cartoon-images" element={<CartoonImagesPage />} />
        <Route path="/video-story" element={<VideoStoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

