export async function CloudinaryUpload(file: File){
	const urlServer = 'http://localhost:8080/imagenes/upload';
    const formData = new FormData();
    
    formData.append('uploads', file);
    formData.append('upload_presets', 'buenSabor');

	const response = await fetch(urlServer, {
		method: 'POST',
		body: formData,
        headers: {
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});

    if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
    }

	return await response.json();
}

export async function CloudinaryDelete(publicId: string) {
    const urlServer = `http://localhost:8080/cloudinary/delete?public_id=${publicId}`;

    const response = await fetch(urlServer, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
    }

    return await response.json();
}