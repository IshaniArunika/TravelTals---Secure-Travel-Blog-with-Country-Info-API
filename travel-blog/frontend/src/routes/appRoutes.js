import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import AddPost from '../components/AddPost';
import ProfilePage from '../components/ProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-post" element={<AddPost />} />
      <Route path="/edit-post/:id" element={<AddPost />} />  
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default AppRoutes;
