import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import AppRoutes from './routes/appRoutes';
import Login from './components/Login';
import Register from './components/Register';
import { loginToMiddleware, getAllCountries } from './services/countryService';

function App() {
  const [authModal, setAuthModal] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    const init = async () => {
      await loginToMiddleware();
      const res = await getAllCountries();
      setAllCountries(res.countries);
    };
    init();
  }, []);

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
      setActivePage('home');
    }
  };

  return (
    <div className="App">
      <Header onAuthClick={handleAuthClick} active={activePage} />
      <AppRoutes allCountries={allCountries} />
      {authModal === 'login' && <Login onClose={handleCloseModal} />}
      {authModal === 'register' && <Register onClose={handleCloseModal} />}
    </div>
  );
}

export default App;
