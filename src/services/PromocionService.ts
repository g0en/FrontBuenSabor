import Promocion from "../types/Promocion";

export async function PromocionCreate(promocion: Promocion){
	const urlServer = 'http://localhost:8080/promocion';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(promocion),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	
	const responseData = await response.json() as Promocion;
	const status = response.status;
	return {
		status,
		responseData
	};
}

export async function PromocionFindBySucursal(id: number){
	const urlServer = 'http://localhost:8080/promocion/findBySucursal/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Promocion[];
}

export async function PromocionGetAll(){
	const urlServer = 'http://localhost:8080/promocion';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Promocion[];
}

export async function PromocionGetById(id: number){
	const urlServer = 'http://localhost:8080/promocion/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Promocion;
}

export async function PromocionUpdate(promocion: Promocion){
	const urlServer = 'http://localhost:8080/promocion/' + promocion.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(promocion),
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});

	const responseData = await response.json() as Promocion;
	const status = response.status;
	return {
		status,
		responseData
	};
}

export async function PromocionDelete(id: number){
	const urlServer = 'http://localhost:8080/promocion/' + id;
	const response = await fetch(urlServer, {
		method: 'DELETE',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	const responseData = await response.json() as string;
	const status = response.status;
	return {
		status,
		responseData
	};
}