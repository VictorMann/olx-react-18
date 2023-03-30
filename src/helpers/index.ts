import { ErrorType } from "../types";


/**
 * Retorna a classe do dado passado: String, Number, Object
 * 
 * @param data {any}
 * @returns {string}
 */
export const classOf = (data: any) => {
	if (data === null) return "Null";
	if (data === undefined) return "Undefined";
	return Object.prototype.toString.call(data).slice(8,-1);
};

/**
 * Reposta de erro, verifica se o data da response é um objeto, caso não, retorna statusText 
 * 
 * @param response {AxiosError}
 * @returns {object}
 */
export const trataErrorResponse = (err: any): ErrorType => {
	if (err.response) {
		if (classOf(err.response?.data) === 'Object') return err.response.data;
		return {error: err.response?.statusText};
	}

	return {error: `${err.message}\n${err.config?.baseURL}${err.config?.url}`};
};
