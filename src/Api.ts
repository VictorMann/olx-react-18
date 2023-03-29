import axios from "axios";
import Cookies from "js-cookie";

import { isLogged } from './helpers/authHandler';

const http = axios.create({
  baseURL: 'http://localhost:3001'
});

export type LoginType = {
  error?: string,
  token?: string,
};

export const api = {

  async logion(email: string, password: string) {
    let data: LoginType = {};
    try {
      const response = await http.post('/api/login', {email, password});
      data = response.data;
    } catch (e: any) {
      data = e.response.data;
    }

    return data;
  },

  async myCount() {
    let data: any = {};
    try {
      if (!isLogged()) return {error: 'Não está logado'}; 
      const response = await http.get('/protected', {headers: {'Authorization': Cookies.get('token')}});
      data = response.data;
    } catch (e: any) {
      data = e.response.data;
    }

    return data;
  },

};