import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaSignOutAlt, FaUser } from 'react-icons/fa';
import AuthContext from '../../context/auth/authContext';
import './Navbar.css';

const Navbar = () => {
  const { logout, user, theme, setTheme } = useContext(AuthContext);

  const onLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>FinanceDash</h1>
        </Link>
      </div>
      
      <div className="navbar-menu">
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </div>
        
        {user && (
          <div className="user-menu">
            <div className="user-info">
              <FaUser className="user-icon" />
              <span>{user.name}</span>
            </div>
            
            <div className="dropdown-menu">
              <Link to="/settings" className="dropdown-item">
                Settings
              </Link>
              <div className="dropdown-divider"></div>
              <a href="#!" onClick={onLogout} className="dropdown-item">
                <FaSignOutAlt className="icon-margin-right" /> Logout
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;