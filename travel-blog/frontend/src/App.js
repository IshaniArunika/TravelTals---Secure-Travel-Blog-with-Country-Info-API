import React, { useState } from 'react';
import Header from './components/Header';
import AppRoutes from './routes/appRoutes';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
  const [activePage, setActivePage] = useState('home');

  const handleAuthClick = (type) => {
    setAuthModal(type);
    setActivePage(type);
  };

  const handleCloseModal = (switchTo = null) => {
    if (switchTo) {
      setAuthModal(switchTo);
      setActivePage(switchTo);
    } else {
      setAuthModal(null);
      setActivePage('home'); // ✅ Reset to Home
    }
  };

  return (
    <div className="App">
      <Header onAuthClick={handleAuthClick} active={activePage} />
      <AppRoutes />

      {authModal === 'login' && <Login onClose={handleCloseModal} />}
      {authModal === 'register' && <Register onClose={handleCloseModal} />}
    </div>
  );
}

export default App;
