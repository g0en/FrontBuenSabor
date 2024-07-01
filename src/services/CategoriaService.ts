import Categoria from "../types/Categoria";
import CategoriaGetDto from "../types/CategoriaGetDto";

export async function CategoriaCreate(categoria: Categoria, token: string){
	const urlServer = 'http://localhost:8080/categoria';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(categoria),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Categoria
	};
}

export async function CategoriaByEmpresaGetAll(id: number, token: string){
	const urlServer = 'http://localhost:8080/categoria/findByEmpresa/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as CategoriaGetDto[];
}

export async function CategoriaGetAll(token: string){
	const urlServer = 'http://localhost:8080/categoria';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Categoria[];
}

export async function CategoriaGetById(id: number, token: string){
	const urlServer = 'http://localhost:8080/categoria/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Categoria;
}

export async function CategoriaUpdate(categoria: Categoria, token: string){
	const urlServer = 'http://localhost:8080/categoria/' + categoria.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(categoria),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Categoria
	};
}

export async function CategoriaBaja(idCategoria: number, idSucursal: number, token: string){
	const urlServer = 'http://localhost:8080/categoria/baja/' + idCategoria + "/" + idSucursal;
	const response = await fetch(urlServer, {
		method: 'DELETE',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as string
	};
}

export async function CategoriaDelete(idCategoria: number, token: string){
	const urlServer = 'http://localhost:8080/categoria/' + idCategoria;
	const response = await fetch(urlServer, {
		method: 'DELETE',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as string
	};
}