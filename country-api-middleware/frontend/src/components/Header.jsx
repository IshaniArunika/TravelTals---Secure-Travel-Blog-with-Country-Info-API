import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaListUl, FaUserCircle } from 'react-icons/fa';
import '../style/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!storedUser);
    setIsAdmin(storedUser?.role === 'admin');
    setUser(storedUser);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          {isLoginOrRegisterPage && (
            <>
              <li><Link to="/">Sign In</Link></li>
              <li><Link to="/registerform">Sign Up</Link></li>
            </>
          )}

          {!isLoginOrRegisterPage && isLoggedIn && (
            <>
              {isAdmin ? (
                <li><Link to="/adminpage">AdminPage</Link></li>
              ) : (
                <li><Link to="/home">Home</Link></li>
              )}

              <li
                className="user-icon-wrapper"
                onMouseEnter={() => setShowProfile(true)}
                onMouseLeave={() => setShowProfile(false)}
              >
                <FaUserCircle className="user-icon" />
                {showProfile && user && (
                  <div className="user-dropdown">
                    <div className="user-info-box">
                      <p><strong>User:</strong> {user.username}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      {user.role !== 'admin' && (
                        <p><strong>Plan:</strong> {user.plan}</p>
                      )}
                    </div>
                    <div className="api-box">
                      <p><strong>API Key:</strong></p>
                      <p className="api-key-text">{user.api_key}</p>
                    </div>
                  </div>
                )}
              </li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
