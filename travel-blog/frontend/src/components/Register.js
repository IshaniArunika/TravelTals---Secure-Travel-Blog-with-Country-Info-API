import React, { useState } from 'react';
import '../styles/authForm.css';
import { IoClose } from 'react-icons/io5';

const Register = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = () => {
    if (!username || !email || !password || !confirm) {
      alert('Please fill all fields');
      return;
    }
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    console.log('Registering', { username, email, password });
    onClose(); // Close modal after registration
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <IoClose className="close-icon" onClick={() => onClose()} />
        <h2>Register</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
        <p>Already have an account? <span className="auth-switch" onClick={() => onClose('login')}>Login</span></p>
      </div>
    </div>
  );
};

export default Register;
