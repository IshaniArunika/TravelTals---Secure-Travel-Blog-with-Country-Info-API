import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/authForm.css';
import { registerUser } from '../api/authApi';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirm) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const data = await registerUser({ username, email, password });
      localStorage.setItem("user", JSON.stringify(data));
      navigate('/home');
    } catch (error) {
      alert("Registration failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Sign Up</h1>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-input"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

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

        <div className="form-group">
          <label htmlFor="confirm">Confirm Password</label>
          <input
            type="password"
            id="confirm"
            className="form-input"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button className="submit-button" onClick={handleRegister}>Register</button>

        <div className="register-link" style={{ marginTop: '15px', textAlign: 'center' }}>
          Already have an account? <a href="/">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
