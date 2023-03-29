import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';


export default () => (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/signin' element={<SignIn />} />
    <Route path='*' element={<NotFound />} />
  </Routes>
);
