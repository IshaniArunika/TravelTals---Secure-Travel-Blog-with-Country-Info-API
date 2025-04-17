import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaListUl, FaUserCircle } from 'react-icons/fa';
import '../style/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!storedUser);
    setIsAdmin(storedUser?.role === 'admin');
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  const isLoginOrRegisterPage = location.pathname === '/' || location.pathname === '/registerform';

  return (
    <header className="header-container">
      <div className="logo">CountryAPI</div>

      <div className="menu-icon" onClick={toggleMenu}>
      <FaListUl />
      </div>

      <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          {/* Show only on Login and Register pages */}
          {isLoginOrRegisterPage && (
            <>
              <li><Link to="/">Sign In</Link></li>
              <li><Link to="/registerform">Sign Up</Link></li>
            </>
          )}

          {/* Show only after login */}
          {!isLoginOrRegisterPage && isLoggedIn && (
            <>
              <li><Link to="/home">Home</Link></li>
              {isAdmin && <li><Link to="/adminpage">AdminPage</Link></li>}
              <li><FaUserCircle size={22} style={{ marginRight: '8px' }} /></li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
