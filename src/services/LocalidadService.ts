import Localidad from "../types/Localidad";

export async function LocalidadGetAllByProvincia(id: number){
	const urlServer = 'http://localhost:8080/localidad/findByProvincia/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Localidad[];
}