import Sucursal from "../types/Sucursal";

export async function SucursalCreate(sucursal: Sucursal){
	const urlServer = 'http://localhost:8080/sucursal';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(sucursal),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Sucursal;
}

export async function SucursalGetByEmpresaId(id: number){
	const urlServer = 'http://localhost:8080/sucursal/empresa/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Sucursal[];
}

export async function SucursalGetAll(){
	const urlServer = 'http://localhost:8080/sucursal';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Sucursal[];
}

export async function SucursalGetById(id: number){
	const urlServer = 'http://localhost:8080/sucursal/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Sucursal;
}

export async function SucursalUpdate(sucursal: Sucursal){
	const urlServer = 'http://localhost:8080/sucursal/' + sucursal.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(sucursal),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Sucursal;
}