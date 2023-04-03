import axios from "axios";
import Cookies from "js-cookie";

import { trataErrorResponse } from "./helpers";
import { isLogged } from './helpers/authHandler';
import { AdType, CategoryType, ErrorType, LoginType, UFType } from "./types";

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
    let data: UFType[] | ErrorType | any;
    try {
      const response = await http.get('/api/uf');
      data = response.data;
    } catch (e: any) {
      data = trataErrorResponse(e);
    }

    return data;
  },

  /**
   * Retorna a lista de Categorias
   * 
   * @returns 
   */
  async categoria() {
    let data: CategoryType[] | ErrorType | any;
    try {
      const response = await http.get('/api/categoria');
      data = response.data;
    } catch (e: any) {
      data = trataErrorResponse(e);
    }

    return data;
  },

  /**
   * Retorna a lista de Ads
   * 
   * @param filters {Object} filtros da pesquisa
   * @returns 
   */
  async ads(filters: Object) {
    let data: AdType[] | ErrorType | any;
    try {
      const response = await http.get('/api/ads', { params: filters });
      data = response.data;
    } catch (e: any) {
      data = trataErrorResponse(e);
    }

    return data;
  },

  /**
   * Retorna o Ad
   * 
   * @param id {number} ID do Ad
   * @param similares {boolean} opção para que no retorno traga os anúncio relacionados do mesmo proprietário do post
   * @returns 
   */
  async ad(id: number, similares: boolean = false) {
    let data: AdType & ErrorType;
    try {
      const response = await http.get('/api/ad/'+ id, { params: { s: similares ? 1 : 0 } });
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