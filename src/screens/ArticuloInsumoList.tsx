import { useState } from "react";
import SideBar from "../components/common/SideBar";
import { CloudinaryUpload } from "../services/CloudinaryService";
import { CloudinaryDelete } from "../services/CloudinaryService";

function ArticuloInsumoList() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [publicId, setPublicId] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            const response = await CloudinaryUpload(file);
            setUploadedUrl(response.secure_url);
            setPublicId(response.public_id);
        } catch (error) {
            console.error('Error uploading the file', error);
        }
    };

    const handleDelete = async () => {
        if (!publicId) return;

        try {
            await CloudinaryDelete(publicId);
            setUploadedUrl(null);
            setPublicId(null);
        } catch (error) {
            console.error('Error deleting the file', error);
        }
    };

    return (

        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadedUrl && (
                <div>
                    <img src={uploadedUrl} alt="Uploaded file" />
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default ArticuloInsumoList;