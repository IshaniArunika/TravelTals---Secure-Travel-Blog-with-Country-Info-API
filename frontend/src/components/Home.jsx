import React, { useState } from 'react';
import '../style/home.css';
import { fetchCountryDetails } from '../api/countryApi';

const Home = () => {
  const [countryName, setCountryName] = useState('');
  const [countryDetails, setCountryDetails] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const data = await fetchCountryDetails(countryName);
      setCountryDetails(data);
      setError('');
    } catch (err) {
      setCountryDetails(null);
      setError('Could not find country or server error');
    }
  };

  return (
    <div className="home-container">
      <h2>Search Country</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter country name..."
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {countryDetails && (
        <div className="country-details">
          <h3>{countryDetails.name}</h3>
          <p><strong>Capital:</strong> {countryDetails.capital}</p>
          <p><strong>Currency:</strong> {countryDetails.currency}</p>
          <p><strong>Languages:</strong> {countryDetails.languages?.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
