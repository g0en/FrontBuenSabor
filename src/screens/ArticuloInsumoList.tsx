import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Edit, Visibility, Delete, Check } from "@mui/icons-material";
import SideBar from "../components/common/SideBar";
import { CloudinaryUpload } from "../services/CloudinaryService";
import { CloudinaryDelete } from "../services/CloudinaryService";
import ArticuloInsumo from "../types/ArticuloInsumo";
import { ArticuloInsumoFindBySucursal } from "../services/ArticuloInsumoService";
import { useParams } from "react-router-dom";

function ArticuloInsumoList() {
    const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
    const { idSucursal } = useParams();
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [publicId, setPublicId] = useState<string | null>(null);

    const getAllArticuloInsumoBySucursal = async () => {
        const articulosInsumo: ArticuloInsumo[] = await ArticuloInsumoFindBySucursal(Number(idSucursal));
        setArticulosInsumo(articulosInsumo);
    };

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

    useEffect(() => {
        getAllArticuloInsumoBySucursal();
    }, []);

    return (
        <>
            <SideBar></SideBar>
            <h6>Articulos Insumos</h6>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio Compra</TableCell>
                            <TableCell>Precio Venta</TableCell>
                            <TableCell>Unidad de Medida</TableCell>
                            <TableCell>Stock Actual</TableCell>
                            <TableCell>Stock Mínimo</TableCell>
                            <TableCell>Stock Máximo</TableCell>
                            <TableCell>Para Elaborar</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {articulosInsumo.map((articulo) => (
                            <TableRow key={articulo.id}>
                                <TableCell>{articulo.denominacion}</TableCell>
                                <TableCell>{articulo.precioCompra}</TableCell>
                                <TableCell>{articulo.precioVenta}</TableCell>
                                <TableCell>{articulo.unidadMedida.denominacion}</TableCell>
                                <TableCell>{articulo.stockActual}</TableCell>
                                <TableCell>{articulo.stockMinimo}</TableCell>
                                <TableCell>{articulo.stockMaximo}</TableCell>
                                <TableCell>
                                    {articulo.esParaElaborar ? <Check color="success" /> : ""}
                                </TableCell>
                                <TableCell>{articulo.categoria.denominacion}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="edit">
                                        <Edit />
                                    </IconButton>
                                    <IconButton aria-label="view">
                                        <Visibility />
                                    </IconButton>
                                    <IconButton aria-label="delete">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadedUrl && (
                <div>
                    <img src={uploadedUrl} alt="Uploaded file" />
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </>
    );
}

export default ArticuloInsumoList;