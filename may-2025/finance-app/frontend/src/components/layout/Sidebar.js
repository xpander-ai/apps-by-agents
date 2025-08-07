import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaChartPie, 
  FaMoneyBillWave, 
  FaReceipt, 
  FaCog, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="sidebar-mobile-toggle" onClick={toggleMobileSidebar}>
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            <FaBars />
          </div>
        </div>

        <div className="sidebar-menu">
          <Link to="/" className={`sidebar-item ${isActive('/')}`} onClick={closeMobileSidebar}>
            <FaChartLine className="sidebar-icon" />
            <span className="sidebar-text">Dashboard</span>
          </Link>

          <Link to="/portfolio" className={`sidebar-item ${isActive('/portfolio')}`} onClick={closeMobileSidebar}>
            <FaChartPie className="sidebar-icon" />
            <span className="sidebar-text">Portfolio</span>
          </Link>

          <Link to="/budget" className={`sidebar-item ${isActive('/budget')}`} onClick={closeMobileSidebar}>
            <FaMoneyBillWave className="sidebar-icon" />
            <span className="sidebar-text">Budget</span>
          </Link>

          <Link to="/expenses" className={`sidebar-item ${isActive('/expenses')}`} onClick={closeMobileSidebar}>
            <FaReceipt className="sidebar-icon" />
            <span className="sidebar-text">Expenses</span>
          </Link>

          <div className="sidebar-divider"></div>

          <Link to="/settings" className={`sidebar-item ${isActive('/settings')}`} onClick={closeMobileSidebar}>
            <FaCog className="sidebar-icon" />
            <span className="sidebar-text">Settings</span>
          </Link>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobileSidebar}></div>}
    </>
  );
};

export default Sidebar;