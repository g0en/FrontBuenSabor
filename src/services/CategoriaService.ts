import Categoria from "../types/Categoria";
import CategoriaGetDto from "../types/CategoriaGetDto";

export async function CategoriaCreate(categoria: Categoria){
	const urlServer = 'http://localhost:8080/categoria';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(categoria),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Categoria
	};
}

export async function CategoriaByEmpresaGetAll(id: number){
	const urlServer = 'http://localhost:8080/categoria/findByEmpresa/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as CategoriaGetDto[];
}

export async function CategoriaGetAll(){
	const urlServer = 'http://localhost:8080/categoria';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Categoria[];
}

export async function CategoriaGetById(id: number){
	const urlServer = 'http://localhost:8080/categoria/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Categoria;
}

export async function CategoriaUpdate(categoria: Categoria){
	const urlServer = 'http://localhost:8080/categoria/' + categoria.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(categoria),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Categoria
	};
}

export async function CategoriaBaja(idCategoria: number, idSucursal: number){
	const urlServer = 'http://localhost:8080/categoria/baja/' + idCategoria + "/" + idSucursal;
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

export async function CategoriaDelete(idCategoria: number){
	const urlServer = 'http://localhost:8080/categoria/' + idCategoria;
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