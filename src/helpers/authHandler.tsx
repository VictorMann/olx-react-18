import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';


export const isLogged = () => {
  let token = Cookies.get('token');
  return token ? true : false;
};

export const doLogin = (token: string | undefined, rememberPassword: boolean = false) => {
  token = token ?? '';
  if (rememberPassword) Cookies.set('token', token, { expires: 999 });
  else Cookies.set('token', token);
};

export const doLogout = () => {
  Cookies.remove('token');
};

export const privateRoute = (children: JSX.Element): JSX.Element => {
  return isLogged()
  ? children
  : <Navigate to="/signin" />
};