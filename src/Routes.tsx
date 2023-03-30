import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MyAccount from './pages/MyAccount';
import NotFound from './pages/NotFound';

import { routePrivate } from './helpers/authHandler';


export default () => (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/signin' element={<SignIn />} />
    <Route path='/signup' element={<SignUp />} />
    <Route path='/my-account' element={routePrivate(<MyAccount />)} />
    <Route path='*' element={<NotFound />} />
  </Routes>
);
