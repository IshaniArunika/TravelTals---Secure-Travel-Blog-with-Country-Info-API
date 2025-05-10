import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import AddPost from '../components/AddPost';
import ProfilePage from '../components/ProfilePage';

const AppRoutes = ({ allCountries }) => {
  return (
    <Routes>
      <Route path="/" element={<Home allCountries={allCountries} />} />
      <Route path="/add-post" element={<AddPost allCountries={allCountries} />} />
      <Route path="/edit-post/:id" element={<AddPost allCountries={allCountries} />} />
      <Route path="/profile" element={<ProfilePage allCountries={allCountries} />} />
    </Routes>
  );
};

export default AppRoutes;
