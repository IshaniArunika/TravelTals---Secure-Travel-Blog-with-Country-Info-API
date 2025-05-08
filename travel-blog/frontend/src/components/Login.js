import React, { useState } from 'react';
import '../styles/authForm.css';
import { loginUser } from '../services/authService';
import { IoClose } from 'react-icons/io5';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter all fields');
      return;
    }

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('user', JSON.stringify(res.user));
      alert('Login successful!');
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
      alert('Login failed. Check your credentials.');
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <IoClose className="close-icon" onClick={() => onClose()} />
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p>Don’t have an account? <span className="auth-switch" onClick={() => onClose('register')}>Register</span></p>
      </div>
    </div>
  );
};

export default Login;
