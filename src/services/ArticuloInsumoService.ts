import ArticuloInsumo from "../types/ArticuloInsumo";

export async function ArticuloInsumoCreate(articuloInsumo: ArticuloInsumo){
	const urlServer = 'http://localhost:8080/articuloInsumo';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(articuloInsumo),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as ArticuloInsumo
	};
}

export async function ArticuloInsumoFindBySucursal(id: number){
	const urlServer = 'http://localhost:8080/articuloInsumo/findBySucursal/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloInsumo[];
}

export async function ArticuloInsumoGetAll(){
	const urlServer = 'http://localhost:8080/articuloInsumo';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloInsumo[];
}

export async function ArticuloInsumoGetById(id: number){
	const urlServer = 'http://localhost:8080/articuloInsumo/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloInsumo;
}

export async function ArticuloInsumoUpdate(articuloInsumo: ArticuloInsumo){
	const urlServer = 'http://localhost:8080/articuloInsumo/' + articuloInsumo.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(articuloInsumo),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	const responseData = await response.json() as ArticuloInsumo;
	const status = response.status;
	return {
		status,
		responseData
	};
}

export async function ArticuloInsumoDelete(id: number){
	const urlServer = 'http://localhost:8080/articuloInsumo/' + id;
	const response = await fetch(urlServer, {
		method: 'DELETE',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	const status = response.status;
    const data = await response.json();

    return { status, data };
}