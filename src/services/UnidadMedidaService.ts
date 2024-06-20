import UnidadMedida from "../types/UnidadMedida";

export async function UnidadMedidaCreate(unidadMedida: UnidadMedida){
	const urlServer = 'http://localhost:8080/unidadMedida';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(unidadMedida),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as UnidadMedida;
}

export async function UnidadMedidaGetAll(){
	const urlServer = 'http://localhost:8080/unidadMedida';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as UnidadMedida[];
}

export async function UnidadMedidaGetById(id: number){
	const urlServer = 'http://localhost:8080/unidadMedida/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as UnidadMedida;
}

export async function UnidadMedidaUpdate(unidadMedida: UnidadMedida){
	const urlServer = 'http://localhost:8080/unidadMedida/' + unidadMedida.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(unidadMedida),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as UnidadMedida;
}

export async function UnidadMedidaDelete(id: number){
	const urlServer = 'http://localhost:8080/unidadMedida/' + id;
	const response = await fetch(urlServer, {
		method: 'DELETE',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as string;
}