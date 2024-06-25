import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Modal, Box, TextField, MenuItem, FormControlLabel, Switch,
    Typography
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Edit, Visibility, Delete } from "@mui/icons-material";
import SideBar from "../components/common/SideBar";
import ArticuloInsumo from "../types/ArticuloInsumo";
import { ArticuloInsumoFindBySucursal, ArticuloInsumoCreate, ArticuloInsumoUpdate, ArticuloInsumoDelete } from "../services/ArticuloInsumoService";
import { useParams } from "react-router-dom";
import Categoria from "../types/Categoria";
import { CategoriaByEmpresaGetAll } from "../services/CategoriaService";
import UnidadMedida from "../types/UnidadMedida";
import { UnidadMedidaGetAll } from "../services/UnidadMedidaService";
import { CloudinaryUpload, CloudinaryDelete } from "../services/CloudinaryService";
import Imagen from "../types/Imagen";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };
const emptyArticuloInsumo = {
    id: 0, eliminado: false, denominacion: '', precioVenta: 0, imagenes: [], unidadMedida: emptyUnidadMedida, categoria: emptyCategoria, precioCompra: 0, stockActual: 0, stockMinimo: 0, stockMaximo: 0, esParaElaborar: false
};

function ArticuloInsumoList() {
    const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
    const [currentArticuloInsumo, setCurrentArticuloInsumo] = useState<ArticuloInsumo>({ ...emptyArticuloInsumo });
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const { idSucursal, idEmpresa } = useParams();
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const getAllArticuloInsumoBySucursal = async () => {
        const articulosInsumo: ArticuloInsumo[] = await ArticuloInsumoFindBySucursal(Number(idSucursal));
        setArticulosInsumo(articulosInsumo);
    };

    const getAllCategoriaByEmpresa = async () => {
        const categorias: Categoria[] = await CategoriaByEmpresaGetAll(Number(idEmpresa));
        setCategorias(categorias);
    };

    const getAllUnidadMedida = async () => {
        const unidadMedidas: UnidadMedida[] = await UnidadMedidaGetAll();
        setUnidadMedidas(unidadMedidas);
    };

    const createArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
        try {
            await ArticuloInsumoCreate(articuloInsumo);
            await getAllArticuloInsumoBySucursal();
            toast.error('Error al crear el artículo insumo');
        } catch (error) {
            toast.error('Error al crear el artículo insumo');
        }
    };

    const updateArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
        try {
            await ArticuloInsumoUpdate(articuloInsumo);
            await getAllArticuloInsumoBySucursal();
            toast.success('Artículo insumo actualizado con éxito');
        } catch (error) {
            toast.error('Error al actualizar el artículo insumo');
        }
    };

    const deleteArticuloInsumo = async (id: number) => {
        return ArticuloInsumoDelete(id);
    };

    const cloudinaryFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            setFiles(prevFiles => [...prevFiles, ...newFiles]);

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                    setImages(prevImages => [...prevImages, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const cloudinaryUpload = async (): Promise<Imagen[]> => {
        if (files.length === 0) return [];

        try {
            const imagenes = await Promise.all(files.map(file => CloudinaryUpload(file)));
            return imagenes.flat(); // Aplana el array de arrays
        } catch (error) {
            console.error('Error uploading the files', error);
            return [];
        }
    };


    const cloudinaryDelete = async (publicId: string, id: number) => {

        if (!publicId) return;

        try {
            await CloudinaryDelete(publicId, id.toString());
        } catch (error) {
            console.error('Error deleting the file', error);
        }

        setView(true);
    };

    const handleView = (articulo?: ArticuloInsumo) => {
        if (articulo) {
            setCurrentArticuloInsumo(articulo);
            setImages(articulo.imagenes.map(imagen => imagen.url));
            setCurrentImageIndex(0); // Reset the current image index
        }

        setView(true);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleEdit = (articulo?: ArticuloInsumo) => {
        if (articulo) {
            setCurrentArticuloInsumo(articulo);
            setImages(articulo.imagenes.map(imagen => imagen.url));
        } else {
            setCurrentArticuloInsumo({ ...emptyArticuloInsumo });
        }

        setOpen(true);
    };

    const handleOpen = () => {
        setCurrentArticuloInsumo({ ...emptyArticuloInsumo });
        setImages([]);
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
        setView(false);
    };

    const handleDelete = async (articulo: ArticuloInsumo) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
            const imagenes: Imagen[] = articulo.imagenes;

            try {
                await deleteArticuloInsumo(articulo.id);
                deleteImages(imagenes);
                window.location.reload();
                toast.success('Artículo insumo eliminado con éxito');
            } catch (error) {
                toast.error('Error al eliminar el artículo insumo');
            }
        }
    };

    const deleteImages = async (imagenes: Imagen[]) => {
        try {
            for (let i = 0; i < imagenes.length; i++) {
                const match = imagenes[i].url.match(/.*\/([^/?]+).*$/);
                if (match) {
                    const publicId = match[1];
                    console.log(imagenes[i].url);
                    cloudinaryDelete(publicId, imagenes[i].id);
                }
            }
        } catch (error) {
            console.log("Error al eliminar las imagenes")
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentArticuloInsumo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentArticuloInsumo(prevState => ({
            ...prevState,
            esParaElaborar: e.target.checked
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>, name: string) => {
        const value = e.target.value as number; // Asumiendo que el valor es un número (id)

        if (name === 'unidadMedida') {
            const selectedUnidadMedida = unidadMedidas.find(um => um.id === value);
            setCurrentArticuloInsumo(prevState => ({
                ...prevState,
                unidadMedida: selectedUnidadMedida || emptyUnidadMedida
            }));
        } else if (name === 'categoria') {
            const selectedCategoria = categorias.find(c => c.id === value);
            setCurrentArticuloInsumo(prevState => ({
                ...prevState,
                categoria: selectedCategoria || emptyCategoria
            }));
        }
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const uploadedImages = await cloudinaryUpload();

        const articuloInsumo = {
            ...currentArticuloInsumo,
            imagenes: uploadedImages,
        };

        if (articuloInsumo.id === 0) {
            await createArticuloInsumo(articuloInsumo);
        } else {
            await updateArticuloInsumo(articuloInsumo);
        }

        setOpen(false);
        setCurrentArticuloInsumo({ ...emptyArticuloInsumo });
    };

    useEffect(() => {
        getAllArticuloInsumoBySucursal();
        getAllCategoriaByEmpresa();
        getAllUnidadMedida();
    }, []);

    return (
        <div>
            <ToastContainer />
            <SideBar/>
            <div className="container">
                <Button onClick={handleOpen} variant="contained" color="primary">
                    Crear Artículo Insumo
                </Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Denominación</TableCell>
                                <TableCell>Precio Venta</TableCell>
                                <TableCell>Stock Actual</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articulosInsumo.map(articulo => (
                                <TableRow key={articulo.id}>
                                    <TableCell>{articulo.denominacion}</TableCell>
                                    <TableCell>{articulo.precioVenta}</TableCell>
                                    <TableCell>{articulo.stockActual}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleView(articulo)}>
                                            <Visibility />
                                        </IconButton>
                                        <IconButton onClick={() => handleEdit(articulo)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(articulo)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={open} onClose={handleClose}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ ...modalStyle }}>
                        <Typography variant="h6" component="h2">
                            {currentArticuloInsumo.id === 0 ? 'Crear Artículo Insumo' : 'Editar Artículo Insumo'}
                        </Typography>
                        <TextField
                            label="Denominación"
                            name="denominacion"
                            value={currentArticuloInsumo.denominacion}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Precio Venta"
                            name="precioVenta"
                            type="number"
                            value={currentArticuloInsumo.precioVenta}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Precio Compra"
                            name="precioCompra"
                            type="number"
                            value={currentArticuloInsumo.precioCompra}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Stock Actual"
                            name="stockActual"
                            type="number"
                            value={currentArticuloInsumo.stockActual}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Stock Mínimo"
                            name="stockMinimo"
                            type="number"
                            value={currentArticuloInsumo.stockMinimo}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Stock Máximo"
                            name="stockMaximo"
                            type="number"
                            value={currentArticuloInsumo.stockMaximo}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            select
                            label="Unidad de Medida"
                            name="unidadMedida"
                            value={currentArticuloInsumo.unidadMedida?.id || 0}
                            onChange={(e) => handleSelectChange(e, 'unidadMedida')}
                            fullWidth
                            margin="normal"
                        >
                            {unidadMedidas.map((unidadMedida) => (
                                <MenuItem key={unidadMedida.id} value={unidadMedida.id}>
                                    {unidadMedida.denominacion}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Categoría"
                            name="categoria"
                            value={currentArticuloInsumo.categoria?.id || 0}
                            onChange={(e) => handleSelectChange(e, 'categoria')}
                            fullWidth
                            margin="normal"
                        >
                            {categorias.map((categoria) => (
                                <MenuItem key={categoria.id} value={categoria.id}>
                                    {categoria.denominacion}
                                </MenuItem>
                            ))}
                        </TextField>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={currentArticuloInsumo.esParaElaborar}
                                    onChange={handleSwitchChange}
                                    name="esParaElaborar"
                                />
                            }
                            label="¿Es para elaborar?"
                        />
                        <div>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={cloudinaryFileChange}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="contained" component="span">
                                    Subir Imágenes
                                </Button>
                            </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                            {images.map((url, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block', margin: 10 }}>
                                    <img src={url} alt={`Imagen ${index}`} style={{ width: 100, height: 100 }} />
                                    <IconButton
                                        onClick={() => removeImage(index)}
                                        style={{ position: 'absolute', top: 0, right: 0 }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            {currentArticuloInsumo.id === 0 ? 'Crear' : 'Guardar'}
                        </Button>
                    </Box>
                </Modal>

                <Modal open={view} onClose={handleClose}>
                    <Box sx={{ ...modalStyle }}>
                        <Typography variant="h6" component="h2">
                            {currentArticuloInsumo.denominacion}
                        </Typography>
                        <div>
                            <img src={images[currentImageIndex]} alt="Producto" style={{ width: '100%' }} />
                            <IconButton onClick={handlePreviousImage}>
                                <ArrowBackIosIcon />
                            </IconButton>
                            <IconButton onClick={handleNextImage}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </div>
                        <Typography>Precio Venta: {currentArticuloInsumo.precioVenta}</Typography>
                        <Typography>Precio Compra: {currentArticuloInsumo.precioCompra}</Typography>
                        <Typography>Stock Actual: {currentArticuloInsumo.stockActual}</Typography>
                        <Typography>Stock Mínimo: {currentArticuloInsumo.stockMinimo}</Typography>
                        <Typography>Stock Máximo: {currentArticuloInsumo.stockMaximo}</Typography>
                        <Typography>Unidad de Medida: {currentArticuloInsumo.unidadMedida?.denominacion}</Typography>
                        <Typography>Categoría: {currentArticuloInsumo.categoria?.denominacion}</Typography>
                        <Typography>Es para elaborar: {currentArticuloInsumo.esParaElaborar ? 'Sí' : 'No'}</Typography>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default ArticuloInsumoList;

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
