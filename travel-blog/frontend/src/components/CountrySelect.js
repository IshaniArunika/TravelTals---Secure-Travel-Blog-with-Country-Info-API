import React, { useState } from 'react';
import '../styles/countrySelect.css';  

const CountrySelect = ({ value, onChange, countryList }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (name) => {
    onChange(name);
    setShowDropdown(false);
  };

  const filtered = countryList.filter(name =>
    name.toLowerCase().includes(value.trim().toLowerCase())
  ).slice(0, 50);

  return (
    <div className="autocomplete">
      <input
        type="text"
        placeholder="Filter by country"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
      />
      {showDropdown && filtered.length > 0 &&(
        <ul className="dropdown">
          {filtered.map((name, idx) => (
            <li key={idx} onMouseDown={() => handleSelect(name)}>
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySelect;