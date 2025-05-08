import React from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import '../styles/header.css';

const Header = ({ onAuthClick, active }) => {
  return (
    <header className="header">
      <div className="logo">TravelJoy</div>
      <nav className="nav-links">
        <Link to="/" className={`nav-item ${active === 'home' ? 'active' : ''}`}>
          Home
        </Link>
        <span
          className={`nav-item ${active === 'login' ? 'active' : ''}`}
          onClick={() => onAuthClick('login')}
        >
          Login
        </span>
        <span
          className={`nav-item ${active === 'register' ? 'active' : ''}`}
          onClick={() => onAuthClick('register')}
        >
          Register
        </span>
        <Link to="/profile" className="profile-box" title="Profile">
          <MdAccountCircle className="profile-icon" />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
