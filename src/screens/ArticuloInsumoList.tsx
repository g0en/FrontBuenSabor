import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Modal, Box, TextField, MenuItem, FormControlLabel, Switch,
    Typography,
    Grid
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
import { CloudinaryUpload } from "../services/CloudinaryService";
import { CloudinaryDelete } from "../services/CloudinaryService";
import Imagen from "../types/Imagen";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import AddIcon from "@mui/icons-material/Add";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth0 } from "@auth0/auth0-react";

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };
const emptyArticuloInsumo = {
    id: 0, eliminado: false, denominacion: '', precioVenta: 0, habilitado: true, imagenes: [], unidadMedida: emptyUnidadMedida, categoria: emptyCategoria, sucursal: null, precioCompra: 0, stockActual: 0, stockMinimo: 0, stockMaximo: 0, esParaElaborar: false
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
<<<<<<< HEAD
=======
    const emptySucursal = { id: Number(idSucursal), eliminado: false, nombre: '' };
    const { getAccessTokenSilently } = useAuth0();
>>>>>>> 17165f60923ebac94b471c747d0e6c6c15ad962f

    const getAllArticuloInsumoBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
        const articulosInsumo: ArticuloInsumo[] = await ArticuloInsumoFindBySucursal(Number(idSucursal), token);
        setArticulosInsumo(articulosInsumo);
    };

    const getAllCategoriaByEmpresa = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
        const categorias: Categoria[] = await CategoriaByEmpresaGetAll(Number(idEmpresa), token);
        setCategorias(categorias);
    };

    const getAllUnidadMedida = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });

        const unidadMedidas: UnidadMedida[] = await UnidadMedidaGetAll(token);
        setUnidadMedidas(unidadMedidas);
    };

    const createArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
        return ArticuloInsumoCreate(articuloInsumo, token);
    };

    const updateArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });

        return ArticuloInsumoUpdate(articuloInsumo, token);
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
                    if (currentArticuloInsumo.id > 0) {
                        setArticuloImages(prevImages => [...prevImages, { id: 0, eliminado: false, url: newImage }]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        if (currentArticuloInsumo.id > 0) {
            setArticuloImages(articuloImages.filter(img => img.id !== index));
        } else {
            setImages(prevImages => prevImages.filter((_, i) => i !== index));
        }

    };

    const cloudinaryUpload = async (): Promise<Imagen[]> => {
        if (files.length === 0) return [];

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
              });

            const imagenes = await Promise.all(files.map(file => CloudinaryUpload(file, token)));
            return imagenes.flat(); // Aplana el array de arrays
        } catch (error) {
            console.error('Error uploading the files', error);
            return [];
        }
    };


    const cloudinaryDelete = async (publicId: string, id: number) => {

        if (!publicId) return;

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
              });

            await CloudinaryDelete(publicId, id.toString(), token);
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
        setArticuloImages([]);
        setImages([]);
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
        setFiles([]);
        setView(false);
    };

    const handleBaja = async (articulo: ArticuloInsumo) => {
        articulo.habilitado = false;
        try {
            const data = await updateArticuloInsumo(articulo);
            if (data.status !== 200) {
                articulo.habilitado = true;
                return;
            }

        } catch (error) {
            console.log("Error al dar de baja un articulo insumo");
        }
        
        try {
            await getAllArticuloInsumoBySucursal();
        } catch (error) {
            console.log("Error al cargar los insumos.");
        }
    }

    const handleAlta = async (articulo: ArticuloInsumo) => {
        articulo.habilitado = true;
        try {
            const data = await updateArticuloInsumo(articulo);
            if (data.status !== 200) {
                return;
            }

        } catch (error) {
            console.log("Error al dar de baja un articulo insumo");
        }
        try {
            await getAllArticuloInsumoBySucursal();
        } catch (error) {
            console.log("Error al cargar los insumos.");
        }
    }

<<<<<<< HEAD
    const handleDelete = async (articulo: ArticuloInsumo) => {
        //const imagenes: Imagen[] = articulo.imagenes;

        try {
            const data = await deleteArticuloInsumo(articulo.id);
            if (data.status !== 200) {
                return;
            }
        } catch (error) {
            console.log("Error al dar de baja un Articulo Insumo.");
        }

        /*try {
            await deleteImages(imagenes);
        } catch (error) {
            console.log("Error al subir las Imagenes.");
        }*/

        //window.location.reload();
    };

=======
>>>>>>> 17165f60923ebac94b471c747d0e6c6c15ad962f
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

        if (articuloImages !== null) {
            currentArticuloInsumo.imagenes = articuloImages;
        }

        if (currentArticuloInsumo.id > 0) {

            try {
                const data = await updateArticuloInsumo(currentArticuloInsumo);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    return;
                }

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
                <Typography variant="h5" component="h1" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Articulos Insumos
                </Typography>

                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>Agregar Insumo</Button>
                <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px', marginTop: '20px' }}>
                    <Table >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Precio Compra</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Precio Venta</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Unidad de Medida</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Stock Actual</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Stock Mínimo</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Stock Máximo</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Para Elaborar</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Categoría</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articulosInsumo.filter(articulo => articulo.eliminado === false)
                                .map((articulo) => (
                                    <TableRow sx={{ backgroundColor: articulo.habilitado ? "none" : "#B0B0B0" }} key={articulo.id}>
                                        <TableCell align="center">{articulo.denominacion}</TableCell>
                                        <TableCell align="center">{articulo.precioCompra}</TableCell>
                                        <TableCell align="center">{articulo.precioVenta}</TableCell>
                                        <TableCell align="center">{articulo.unidadMedida?.denominacion}</TableCell>
                                        <TableCell align="center">{articulo.stockActual}</TableCell>
                                        <TableCell align="center">{articulo.stockMinimo}</TableCell>
                                        <TableCell align="center">{articulo.stockMaximo}</TableCell>
                                        <TableCell align="center">
                                            {articulo.esParaElaborar ? <Check color="success" /> : <RemoveIcon color="error" />}
                                        </TableCell>
                                        <TableCell align="center">{articulo.categoria?.denominacion}</TableCell>
                                        <TableCell>

                                            {
                                                articulo.habilitado === true ?
                                                    <Box>
                                                        <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                                            <Visibility />
                                                        </IconButton>
                                                        <IconButton aria-label="edit" onClick={() => handleEdit(articulo)} color="primary">
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton aria-label="delete" onClick={() => handleBaja(articulo)} color="error">
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>
                                                    :
                                                    <Box>
                                                        <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                                            <Visibility />
                                                        </IconButton>
                                                        <IconButton aria-label="alta" onClick={() => handleAlta(articulo)} color="success">
                                                            <KeyboardDoubleArrowUpIcon />
                                                        </IconButton>
                                                    </Box>
                                            }


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
                        <Typography variant="h5" gutterBottom align="center">
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
                        <Box display="flex" alignItems="center" margin="normal">
                            <TextField
                                select
                                label="Unidad de Medida"
                                name="unidadMedida"
                                fullWidth
                                value={currentArticuloInsumo.unidadMedida.id || ''}
                                onChange={(e) => handleSelectChange(e, 'unidadMedida')}
                                style={{ flex: 1, marginRight: 8 }}
                            >
                                {unidadMedidas.filter(unidad => !unidad.eliminado).map((unidad) => (
                                    <MenuItem key={unidad.id} value={unidad.id}>
                                        {unidad.denominacion}
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
                                style={{ marginRight: 8 }}
                            />
                            <TextField
                                select
                                label="Categoría"
                                name="categoria"
                                fullWidth
                                value={currentArticuloInsumo.categoria?.id || ''}
                                onChange={(e) => handleSelectChange(e, 'categoria')}
                                style={{ flex: 1 }}
                            >
                                {categorias
                                    .filter(categoria => currentArticuloInsumo.esParaElaborar ? categoria.esInsumo : true)
                                    .filter(categoria => !categoria.eliminado)
                                    .map((categoria) => (
                                        <MenuItem key={categoria.id} value={categoria.id !== null ? Number(categoria.id) : 0}>
                                            {categoria.denominacion}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Box>
                        <Box mt={3} mb={3}>
                            <Box display="flex" alignItems="center">
                                <Typography variant="subtitle1" sx={{ marginRight: 2 }}>
                                    Seleccione imágenes:
                                </Typography>
                                <label htmlFor="upload-button">
                                    <input
                                        style={{ display: 'none' }}
                                        id="upload-button"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={cloudinaryFileChange}
                                    />
                                    <ImageSearchIcon sx={{ fontSize: '50px', cursor: 'pointer', '&:hover': { color: '#3B3B3B' } }} />
                                </label>
                            </Box>
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
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Precio de Compra"
                                    name="precioCompra"
                                    type="decimal"
                                    fullWidth
                                    margin="normal"
                                    value={currentArticuloInsumo.precioCompra}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Precio de Venta"
                                    name="precioVenta"
                                    type="decimal"
                                    disabled={currentArticuloInsumo.esParaElaborar}
                                    fullWidth
                                    margin="normal"
                                    value={currentArticuloInsumo.precioVenta}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mb={2}>
                            <Grid item xs={4}>
                                <TextField
                                    label="Stock Actual"
                                    name="stockActual"
                                    type="decimal"
                                    fullWidth
                                    margin="normal"
                                    value={currentArticuloInsumo.stockActual}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Stock Minimo"
                                    name="stockMinimo"
                                    type="decimal"
                                    fullWidth
                                    margin="normal"
                                    value={currentArticuloInsumo.stockMinimo}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Stock Maximo"
                                    name="stockMaximo"
                                    type="decimal"
                                    fullWidth
                                    margin="normal"
                                    value={currentArticuloInsumo.stockMaximo}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
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