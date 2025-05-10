import React, { useState } from 'react';
import '../styles/authForm.css';
import { registerUser } from '../services/authService';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Register = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirm) {
      alert('Please fill all fields');
      return;
    }
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await registerUser({ username, email, password });
      localStorage.setItem('user', JSON.stringify(res.user));
      alert('Registered successfully!');
      onClose(); // Close modal
      navigate('/')
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Registration failed. Try again.');
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <IoClose className="close-icon" onClick={() => onClose()} />
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <p>Already have an account? <span className="auth-switch" onClick={() => onClose('login')}>Login</span></p>
      </div>
    </div>
  );
};

export default Register;
