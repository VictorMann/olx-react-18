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

/**
 * Formata data por extenso
 * 
 * @param d {string}
 * @returns {string} Exp.: 3 de março 2023
 */
export const formatLongDate = (d: string) => {
	let date: Date = new Date(d);
	let months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
	return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
};

/**
 * Delay de processo
 * 
 * @param time {number} tempo em segundos de espera, default 500ms
 * @returns {null}
 */
export const delay = async (time: number = 500) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(null), time);
	});
}