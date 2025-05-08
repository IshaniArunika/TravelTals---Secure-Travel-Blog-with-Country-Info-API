import React from 'react';
import { MdAccountCircle } from 'react-icons/md';
import '../styles/header.css';

const Header = ({ onAuthClick, active }) => {
  return (
    <header className="header">
      <div className="logo">TravelJoy</div>
      <nav className="nav-links">
        <span 
          className={`nav-item ${active === 'home' ? 'active' : ''}`} 
          onClick={() => onAuthClick('home')}
        >
          Home
        </span>
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
        <div className="profile-box">
          <MdAccountCircle className="profile-icon" />
        </div>
      </nav>
    </header>
  );
};

export default Header;