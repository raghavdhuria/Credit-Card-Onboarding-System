import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

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
          <li className="nav-item">
            <button id='logoutbtn' onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;