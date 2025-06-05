import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <p>© {new Date().getFullYear()} AWS Summit 2025. All rights reserved.</p>
  </footer>
);

export default Footer;