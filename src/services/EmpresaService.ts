import Empresa from "../types/Empresa";

export async function EmpresaCreate(){
	const urlServer = 'http://localhost:8080/empresa';
	const response = await fetch(urlServer, {
		method: 'POST',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Empresa;
}

export async function EmpresaGetAll(){
	const urlServer = 'http://localhost:8080/empresa';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Empresa[];
}

export async function EmpresaGetById(id: number){
	const urlServer = 'http://localhost:8080/empresa/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Empresa;
}

export async function EmpresaUpdate(id: number){
	const urlServer = 'http://localhost:8080/empresa/' + id;
	const response = await fetch(urlServer, {
		method: 'PUT',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Empresa;
}