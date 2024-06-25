import ArticuloManufacturado from "../types/ArticuloManufacturado";

export async function ArticuloManufacturadoCreate(articuloManufacturado: ArticuloManufacturado){
	const urlServer = 'http://localhost:8080/articuloManufacturado';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(articuloManufacturado),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	
	const responseData = await response.json() as ArticuloManufacturado;
	const status = response.status;
	return {
		status,
		responseData
	};
}

export async function ArticuloManufacturadoFindBySucursal(id: number){
	const urlServer = 'http://localhost:8080/articuloManufacturado/findBySucursal/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloManufacturado[];
}

export async function ArticuloManufacturadoGetAll(){
	const urlServer = 'http://localhost:8080/articuloManufacturado';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloManufacturado[];
}

export async function ArticuloManufacturadoGetById(id: number){
	const urlServer = 'http://localhost:8080/articuloManufacturado/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloManufacturado;
}

export async function ArticuloManufacturadoUpdate(articuloManufacturado: ArticuloManufacturado){
	const urlServer = 'http://localhost:8080/articuloManufacturado/' + articuloManufacturado.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(articuloManufacturado),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});

	const responseData = await response.json() as ArticuloManufacturado;
	const status = response.status;
	return {
		status,
		responseData
	};
}

export async function ArticuloManufacturadoDelete(id: number){
	const urlServer = 'http://localhost:8080/articuloManufacturado/' + id;
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