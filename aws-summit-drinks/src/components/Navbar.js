import React from 'react';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar__logo">
      <img src="https://cdn.worldvectorlogo.com/logos/amazon-web-services-aws.svg" alt="AWS Logo" />
      <span>AWS Summit 2025</span>
    </div>
  </nav>
);

export default Navbar;