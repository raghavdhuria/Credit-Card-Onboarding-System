import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/chatbot" className="navbar-brand">Credit Card Onboarding</Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/chatbot" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/apply" className="nav-link">Apply</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
