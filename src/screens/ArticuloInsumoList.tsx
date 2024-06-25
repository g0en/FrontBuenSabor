import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Modal, Box, TextField, MenuItem, FormControlLabel, Switch,
    Typography
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Edit, Visibility, Delete, Check } from "@mui/icons-material";
import SideBar from "../components/common/SideBar";
import ArticuloInsumo from "../types/ArticuloInsumo";
import { ArticuloInsumoFindBySucursal, ArticuloInsumoCreate } from "../services/ArticuloInsumoService";
import { useParams } from "react-router-dom";
import Categoria from "../types/Categoria";
import { CategoriaByEmpresaGetAll } from "../services/CategoriaService";
import UnidadMedida from "../types/UnidadMedida";
import { UnidadMedidaGetAll } from "../services/UnidadMedidaService";
import { ArticuloInsumoUpdate } from "../services/ArticuloInsumoService";
import { ArticuloInsumoDelete } from "../services/ArticuloInsumoService";
import { CloudinaryUpload } from "../services/CloudinaryService";
import { CloudinaryDelete } from "../services/CloudinaryService";
import Imagen from "../types/Imagen";

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
    const [articuloImages, setArticuloImages] = useState<Imagen[]>([]);

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
        return ArticuloInsumoCreate(articuloInsumo);
    };

    const updateArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
        return ArticuloInsumoUpdate(articuloInsumo);
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
                    const newImage = reader.result as string;
                    setImages(prevImages => [...prevImages, reader.result as string]);
                    setArticuloImages(prevImages => [...prevImages, { id: 0, eliminado: false, url: newImage }]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        if(currentArticuloInsumo.id > 0){
            setArticuloImages(articuloImages.filter(img => img.id !== index));
        }else{
            setImages(prevImages => prevImages.filter((_, i) => i !== index));
        }

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

    const handleEdit = async (articulo?: ArticuloInsumo) => {
        if (articulo) {
            setCurrentArticuloInsumo(articulo);
            setImages(articulo.imagenes.map(imagen => imagen.url));
            setArticuloImages(articulo.imagenes);
        } else {
            setCurrentArticuloInsumo({ ...emptyArticuloInsumo });
            setImages([]);
            setFiles([]);
            setArticuloImages([]);
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
        setFiles([]);
        setView(false);
    };

    const handleDelete = async (articulo: ArticuloInsumo) => {
        const imagenes: Imagen[] = articulo.imagenes;

        try {
            const data = await deleteArticuloInsumo(articulo.id);
            if (data.status !== 200) {
                return;
            }
        } catch (error) {
            console.log("Error al crear un Articulo Insumo.");
        }

        try {
            await deleteImages(imagenes);
        } catch (error) {
            console.log("Error al subir las Imagenes.");
        }

        window.location.reload();
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
            const unidadMedidaSeleccionada = unidadMedidas.find(u => u.id === value);
            setCurrentArticuloInsumo(prevState => ({
                ...prevState,
                unidadMedida: unidadMedidaSeleccionada || emptyUnidadMedida
            }));
        } else if (name === 'categoria') {
            const categoriaSeleccionada = categorias.find(c => c.id === value);
            setCurrentArticuloInsumo(prevState => ({
                ...prevState,
                categoria: categoriaSeleccionada || emptyCategoria
            }));
        }
    };

    const handleSubmit = async () => {
        const imagenes = await cloudinaryUpload();

        if (imagenes && imagenes?.length > 0) {
            imagenes.forEach(imagen => {
                articuloImages.push(imagen);
            });
        }

        currentArticuloInsumo.imagenes = articuloImages;

        if (currentArticuloInsumo.id > 0) {

            try {
                const data = await updateArticuloInsumo(currentArticuloInsumo);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    return;
                }

                //deleteImages(imagenesExistentes);
                setCurrentArticuloInsumo(emptyArticuloInsumo);
            } catch (error) {
                console.log("Error al actualizar un articulo insumo");
            }

        } else {

            try {
                const data = await createArticuloInsumo(currentArticuloInsumo);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    return;
                }

                setCurrentArticuloInsumo(emptyArticuloInsumo);
            } catch (error) {
                console.log("Error al crear un articulo insumo");
            }
        }

        try {
            await getAllArticuloInsumoBySucursal();
        } catch (error) {
            console.log("Error al cargar los insumos.");
        }

        handleClose();
    };

    useEffect(() => {
        getAllArticuloInsumoBySucursal();
        getAllCategoriaByEmpresa();
        getAllUnidadMedida();
    }, []);

    return (
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom>
                    Articulos Insumos
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>Agregar Insumo</Button>
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
                            {articulosInsumo
                                .filter(articulo => !articulo.eliminado)
                                .map((articulo) => (
                                    <TableRow key={articulo.id}>
                                        <TableCell>{articulo.denominacion}</TableCell>
                                        <TableCell>{articulo.precioCompra}</TableCell>
                                        <TableCell>{articulo.precioVenta}</TableCell>
                                        <TableCell>{articulo.unidadMedida?.denominacion}</TableCell>
                                        <TableCell>{articulo.stockActual}</TableCell>
                                        <TableCell>{articulo.stockMinimo}</TableCell>
                                        <TableCell>{articulo.stockMaximo}</TableCell>
                                        <TableCell>
                                            {articulo.esParaElaborar ? <Check color="success" /> : ""}
                                        </TableCell>
                                        <TableCell>{articulo.categoria?.denominacion}</TableCell>
                                        <TableCell>
                                            <IconButton aria-label="edit" onClick={() => handleEdit(articulo)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton aria-label="view" onClick={() => handleView(articulo)}>
                                                <Visibility />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => handleDelete(articulo)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={view} onClose={handleClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '40%', // Ancho del modal
                            maxWidth: 800, // Máximo ancho del modal
                            maxHeight: '80vh',
                            overflow: 'auto',
                            bgcolor: 'background.paper',
                            p: 4,
                            borderRadius: 8, // Borde redondeado del modal
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center">
                            {currentArticuloInsumo.denominacion}
                        </Typography>
                        {images.length > 0 && (
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <IconButton onClick={handlePreviousImage} disabled={images.length <= 1}>
                                    <ArrowBackIosIcon />
                                </IconButton>
                                <img
                                    src={images[currentImageIndex]}
                                    alt={`Imagen ${currentImageIndex}`}
                                    style={{ maxWidth: '40%', marginTop: '10px', borderRadius: 8 }} // Ajustes de estilo para la imagen
                                />
                                <IconButton onClick={handleNextImage} disabled={images.length <= 1}>
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </Box>
                        )}
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button variant="contained" color="secondary" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                <Modal open={open} onClose={handleClose}>
                    <Box sx={{ width: 800, maxHeight: '80vh', overflow: 'auto', p: 4, bgcolor: 'background.paper', m: 'auto', mt: '5%' }}>
                        <Typography variant="h6" gutterBottom>
                            {currentArticuloInsumo.id === 0 ? 'Crear Articulo Insumo' : 'Actualizar Articulo Insumo'}
                        </Typography>
                        <TextField
                            label="Denominacion"
                            name="denominacion"
                            fullWidth
                            margin="normal"
                            value={currentArticuloInsumo.denominacion}
                            onChange={handleInputChange}
                        />
                        <TextField
                            select
                            label="Unidad de Medida"
                            name="unidadMedida"
                            fullWidth
                            margin="normal"
                            value={currentArticuloInsumo.unidadMedida.id || ''}
                            onChange={(e) => handleSelectChange(e, 'unidadMedida')}
                        >
                            {unidadMedidas.map((unidad) => (
                                <MenuItem key={unidad.id} value={unidad.id}>
                                    {unidad.denominacion}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box display="flex" alignItems="center">
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
                            <TextField
                                select
                                label="Categoría"
                                name="categoria"
                                fullWidth
                                margin="normal"
                                value={currentArticuloInsumo.categoria?.id || ''}
                                onChange={(e) => handleSelectChange(e, 'categoria')}
                            >
                                {categorias
                                    .filter(categoria => currentArticuloInsumo.esParaElaborar ? categoria.esInsumo : true)
                                    .map((categoria) => (
                                        <MenuItem key={categoria.id} value={categoria.id !== null ? Number(categoria.id) : 0}>
                                            {categoria.denominacion}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Box>
                        <Box mt={3} mb={3}>
                            <Typography variant="subtitle1">Seleccione imágenes:</Typography>
                            <label htmlFor="upload-button">
                                <input
                                    style={{ display: 'none' }}
                                    id="upload-button"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={cloudinaryFileChange}
                                />
                                <Button variant="contained" component="span">
                                    Subir Imágenes
                                </Button>
                            </label>
                            {currentArticuloInsumo.id > 0 ? 
                            images.length > 0 && (
                                <Box mt={2} display="flex" flexDirection="row" flexWrap="wrap">
                                    {articuloImages.map((image, index) => (
                                        !image.eliminado && (
                                            <Box key={index} display="flex" alignItems="center" flexDirection="column" mr={2} mb={2}>
                                                <img src={image.url} alt={`Imagen ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                                <IconButton onClick={() => removeImage(image.id)} size="small">
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        )
                                    ))}
                                </Box>
                            )
                            : 
                            images.length > 0 && (
                                <Box mt={2} display="flex" flexDirection="row" flexWrap="wrap">
                                    {images.map((image, index) => (
                                        <Box key={index} display="flex" alignItems="center" flexDirection="column" mr={2} mb={2}>
                                            <img src={image} alt={`Imagen ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                            <IconButton onClick={() => removeImage(index)} size="small">
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )
                            }
                        </Box>
                        <TextField
                            label="Precio de Compra"
                            name="precioCompra"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={currentArticuloInsumo.precioCompra}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Precio de Venta"
                            name="precioVenta"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={currentArticuloInsumo.precioVenta}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Stock Actual"
                            name="stockActual"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={currentArticuloInsumo.stockActual}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Stock Minimo"
                            name="stockMinimo"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={currentArticuloInsumo.stockMinimo}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Stock Maximo"
                            name="stockMaximo"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={currentArticuloInsumo.stockMaximo}
                            onChange={handleInputChange}
                        />
                        <Button variant="contained" color="secondary" onClick={handleClose} sx={{ mr: 2 }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {currentArticuloInsumo.id === 0 ? 'Crear' : 'Actualizar'}
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </>
    );
}

export default ArticuloInsumoList;