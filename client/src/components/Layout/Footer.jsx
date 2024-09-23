import React from 'react';
import { Link } from 'react-router-dom';
import '../../public/Footer.css'

const Footer = () => {
  return (
    <div className="footer">
      <h1>All rights reserved &copy; Prabhu</h1>
      <p>
        <Link to='/about'>About</Link>
        <Link to='/contact'>Contact</Link>
        <Link to='/policy'>Policy</Link>
      </p>
    </div>
  );
}

export default Footer;
