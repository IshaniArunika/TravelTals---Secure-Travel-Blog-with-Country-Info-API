import React, { useState } from 'react';
import '../styles/authForm.css';
import { IoClose } from 'react-icons/io5';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter all fields');
      return;
    }
    console.log('Login with', { email, password });
    onClose(); // Close modal after successful login
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <IoClose className="close-icon" onClick={() => onClose()} />
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>Don’t have an account? <span className="auth-switch" onClick={() => onClose('register')}>Register</span></p>
      </div>
    </div>
  );
};

export default Login;
