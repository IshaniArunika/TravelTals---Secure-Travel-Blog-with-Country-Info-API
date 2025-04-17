import React, { useEffect, useState } from 'react';
import '../style/home.css';
import { fetchApiUsage, fetchCountryDetails } from '../api/countryApi';

const Home = () => {
  const [countryName, setCountryName] = useState('');
  const [countryDetails, setCountryDetails] = useState(null);
  const [error, setError] = useState('');
  const [usageData, setUsageData] = useState(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await fetchApiUsage();
        setUsageData(data);
      } catch (err) {
        console.error('Polling failed:', err.message);
      }
    };
  
    fetchUsage(); // Initial fetch
  
    const interval = setInterval(fetchUsage, 2000); 
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

  const handleSearch = async () => {
    try {
      const data = await fetchCountryDetails(countryName);
      setCountryDetails(data.country);
      setUsageData(data.usage);  
      setError('');
    } catch (err) {
      const usage = await fetchApiUsage(); // fallback
      setUsageData(usage);
      setCountryDetails(null);
  
      const status = err?.response?.status;
      if (status === 429) setError('API usage limit exceeded.');
      else if (status === 404) setError('Country not found.');
      else setError('Something went wrong.');
    }
  };
  

  const usagePercent = usageData ? Math.round((usageData.usageCount / usageData.limit) * 100) : 0;

  return (
    <div className="home-page">
      {/* API Usage Block */}
      <div className="api-usage-card">
        <h3>API Usage: {usagePercent}%</h3>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${usagePercent}%` }}></div>
        </div>
        <div className="usage-labels">
          <span>Used: {usageData?.usageCount || 0}</span>
          <span>Limit: {usageData?.limit || 0}</span>
        </div>
        <div className="usage-info">
          <h4>Usage Information</h4>
          <p>Your API usage resets every 24 hours.</p>
          <p>Premium users get increased API limits.</p>
        </div>
      </div>

      {/* Country Search Block */}
      <div className="search-card">
        <h3>Search Country</h3>
        <div className="search-input-wrapper">
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
            <h4>{countryDetails.name}</h4>
            <p><strong>Capital:</strong> {countryDetails.capital}</p>
            <p><strong>Currency:</strong> {countryDetails.currency}</p>
            <p><strong>Languages:</strong> {countryDetails.languages?.join(', ')}</p>
            <img src={countryDetails.flag} alt="Flag" width="100" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
