import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/authForm.css';
import { loginUser } from '../api/authApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const data = await loginUser({ email, password });
      const userData = {
        ...data.user,        // copies: id, email, username
        api_key: data.apiKey // adds: api_key from response
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      navigate('/home');
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Login</h1>
        
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="submit-button" onClick={handleLogin}>Login</button>

        <div className="register-link" style={{ marginTop: '15px', textAlign: 'center' }}>
          Don’t have an account? <a href="/registerform">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
