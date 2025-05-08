import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import AddPost from '../components/AddPost';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-post" element={<AddPost />} />
    </Routes>
  );
};

export default AppRoutes;
