import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import AdminPage from '../components/AdminPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registerform" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/adminpage" element={<AdminPage />} />
    </Routes>
  );
};

export default AppRoutes;
