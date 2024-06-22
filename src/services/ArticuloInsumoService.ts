import ArticuloInsumo from "../types/ArticuloInsumo";

export async function CategoriaCreate(articuloInsumo: ArticuloInsumo){
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
	return await response.json() as ArticuloInsumo;
}

export async function CategoriaGetAll(){
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

export async function CategoriaGetById(id: number){
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

export async function CategoriaUpdate(articuloInsumo: ArticuloInsumo){
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
	return await response.json() as ArticuloInsumo;
}