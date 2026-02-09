import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaLightbulb, FaVideo, FaImage, FaBook, FaCog } from 'react-icons/fa';
import '../css/Sidebar.scss';

const Sidebar = () => {
  return (
    <nav className="app-sidebar" aria-label="التنقل الرئيسي">
      <div className="sidebar-brand">
        <div className="sidebar-logo">🎥</div>
        <div className="sidebar-title">
          <div>Video Script</div>
          <div className="sidebar-subtitle">Generator</div>
        </div>
      </div>

      <div className="sidebar-links">
        <NavLink to="/scripts" end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <FaLightbulb />
          <span>نصائح (Advice)</span>
        </NavLink>

        <NavLink to="/cartoon-images"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <FaImage />
          <span>مولد صور الكرتون</span>
        </NavLink>

        <NavLink to="/video-story"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <FaBook />
          <span>مولد قصص الفيديو</span>
        </NavLink>

        <NavLink to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <FaCog />
          <span>الإعدادات (Settings)</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <small>created by Keroles Monsef</small>
      </div>
    </nav>
  );
};

export default Sidebar;

