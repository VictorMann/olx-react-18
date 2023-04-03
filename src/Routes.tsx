import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MyAccount from './pages/MyAccount';
import Ad from './pages/Ad';
import NotFound from './pages/NotFound';

import { privateRoute } from './helpers/authHandler';


export default () => (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/signin' element={<SignIn />} />
    <Route path='/signup' element={<SignUp />} />
    <Route path='/ad/:id' element={<Ad />} />
    <Route path='/my-account' element={privateRoute(<MyAccount />)} />
    <Route path='*' element={<NotFound />} />
  </Routes>
);
