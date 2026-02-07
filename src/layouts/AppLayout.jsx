import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/js/Sidebar.jsx';
import './AppLayout.scss';

const AppLayout = () => {
  return (
    <div className="layout-root">
      <div className="layout-main">
        <aside className="layout-left">
          <Sidebar />
        </aside>

        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;

