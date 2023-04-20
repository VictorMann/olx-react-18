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

/**
 * Verifica se o tipo do arquivo corresponde a uma imagem
 * 
 * @param type {string}
 * @returns {boolean}
 */
export const onlyTypesOfImages = (type: string): boolean => {
	const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp'];
	return allowed.some(a => a === type);
};

/**
 * Retorna o próprio dado, caso seja null|undefined retorna '' (string vazia)
 * passagem do segunda parâmetro possibilita converter o dado 
 * 
 * @param data {any} dado ser verificado
 * @param type {string|null} (opcional) converte o dado caso ele exista  
 * @param defalut {any} (opcional) valor default
 * @returns {any}
 */
export const get = (data: any, type: string|null = null, defalut: any = '') => {
	if (['Null', 'Undefined'].indexOf(classOf(data)) !== -1) return defalut;
	if (type) {
		switch (type) {
			case 'string': return String(data);
			case 'number': return Number(data);
		}
	}
	return data;
};

/**
 * Converte valor moeda em número
 * 
 * @param moeda {stirng|number} valor moeda a ser convertido 
 * @returns {number}
 */
export const formatNumber = (moeda: string|number) => {
	return Number(String(moeda).replaceAll('.', '$').replaceAll(',','.').replaceAll('$', '')); 
};

/**
 * Converte valor número em moeda
 * 
 * @param number {string|number} número a ser convertido
 * @returns {number}
 */
export const formatMoeda = (number: string|number) => {
	return String(number).replaceAll('.', ',');
};