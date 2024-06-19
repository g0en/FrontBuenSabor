import Provincia from "../types/Provincia";

export async function ProvinciaGetAll(){
	const urlServer = 'http://localhost:8080/provincia';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Provincia[];
}