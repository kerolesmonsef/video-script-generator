import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaLightbulb, FaVideo } from 'react-icons/fa';
import '../css/Sidebar.css';

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
        <NavLink to="/" end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <FaLightbulb />
          <span>نصائح (Advice)</span>
        </NavLink>

        <NavLink to="/scripts"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <FaVideo />
          <span>مولد السكريبتات</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <small>created by Keroles Monsef</small>
      </div>
    </nav>
  );
};

export default Sidebar;

