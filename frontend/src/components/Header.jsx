import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaListUl } from 'react-icons/fa';
import '../style/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-container">
      <div className="logo">CountryAPI</div>

      <div className="menu-icon" onClick={toggleMenu}>
        <FaListUl />
      </div>

      <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/" className="sign-in">Sign In</Link></li>
          <li><Link to="/registerform" className="sign-up">Sign Up</Link></li>
          {isAdmin && <li><Link to="/adminpage">AdminPage</Link></li>}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
