import axios from "axios";
import Cookies from "js-cookie";

import { trataErrorResponse } from "./helpers";
import { isLogged } from './helpers/authHandler';
import { ErrorType, LoginType, UFType } from "./types";

const http = axios.create({
  baseURL: 'http://localhost:3001'
});


export const api = {
  /**
   * Login
   * 
   * @param email 
   * @param password 
   * @returns 
   */
  async login(email: string, password: string) {
    let data: LoginType | ErrorType | any;
    try {
      const response = await http.post('/api/login', {email, password});
      data = response.data;
    } catch (e: any) {
      data = trataErrorResponse(e);
    }

    return data;
  },

  /**
   * Cadastre-se
   * 
   * @param name 
   * @param email 
   * @param stateLoc 
   * @param password 
   * @returns 
   */
  async register(name: string, email: string, stateLoc: string, password: string) {
    let data: LoginType | ErrorType | any;
    try {
      const response = await http.post('/api/register', {name, email, stateLoc, password});
      data = response.data;
    } catch (e: any) {
      data = trataErrorResponse(e);
    }

    return data;
  },

  /**
   * Logout
   */
  async logout() {
    try {
      await http.post('/api/logout', {}, {headers: {'Authorization': Cookies.get('token')}});
    } catch (e: any) {
      void 0;
    }
  },


  /**
   * Retorna os Estados
   * 
   * @returns 
   */
  async uf() {
    let data: any;
    try {
      const response = await http.get('/api/uf');
      data = response.data;
    } catch (e: any) {
      data = trataErrorResponse(e);
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
      data = trataErrorResponse(e);
    }

    return data;
  },

};