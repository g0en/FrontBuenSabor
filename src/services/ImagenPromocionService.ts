import Imagen from "../types/Imagen";

export async function CloudinaryPromocionUpload(file: File) {
    const urlServer = 'http://localhost:8080/imagen/promocion/upload';
    const formData = new FormData();

    formData.append('uploads', file);
    formData.append('upload_presets', 'buenSabor');

    const response = await fetch(urlServer, {
        method: 'POST',
        body: formData,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    return await response.json() as Imagen[];
}

export async function CloudinaryPromocionDelete(publicId: string, id: string) {
    const urlServer = `http://localhost:8080/imagen/promocion/deleteImg?publicId=${publicId}&id=${id}`;

    const response = await fetch(urlServer, {
        method: 'POST',
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