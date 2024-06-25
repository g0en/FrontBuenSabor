import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Typography, Button, Box, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import SideBar from "../components/common/SideBar";
import ArticuloManufacturado from "../types/ArticuloManufacturado";
import { ArticuloManufacturadoCreate, ArticuloManufacturadoFindBySucursal, ArticuloManufacturadoDelete } from "../services/ArticuloManufacturadoService";
import Categoria from "../types/Categoria";
import UnidadMedida from "../types/UnidadMedida";
import { Grid } from "@mui/material";
import { CategoriaByEmpresaGetAll } from "../services/CategoriaService";
import { UnidadMedidaGetAll } from "../services/UnidadMedidaService";
import { Delete } from "@mui/icons-material";
import Imagen from "../types/Imagen";
import { CloudinaryUpload } from "../services/CloudinaryService";
import { CloudinaryDelete } from "../services/CloudinaryService";
import ArticuloInsumo from "../types/ArticuloInsumo";
import { ArticuloInsumoFindBySucursal } from "../services/ArticuloInsumoService";
import ArticuloManufacturadoDetalle from "../types/ArticuloManufacturadoDetalle";
import { ArticuloManufacturadoUpdate } from "../services/ArticuloManufacturadoService";

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };
const emptyArticuloManufacturado = {
    id: 0, eliminado: false, denominacion: '', precioVenta: 0, imagenes: [], unidadMedida: emptyUnidadMedida, categoria: emptyCategoria, descripcion: '', tiempoEstimadoMinutos: 0, preparacion: '', articuloManufacturadoDetalles: null
};

function ArticuloManufacturadoList() {
    const [articulosManufacturados, setArticulosManufacturados] = useState<ArticuloManufacturado[]>([]);
    const [currentArticuloManufacturado, setCurrentArticuloManufacturado] = useState<ArticuloManufacturado>({ ...emptyArticuloManufacturado });
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const { idSucursal, idEmpresa } = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);
    const [search, setSearch] = useState("");

    const getAllArticuloManufacturadoBySucursal = async () => {
        const articulosManufacturados: ArticuloManufacturado[] = await ArticuloManufacturadoFindBySucursal(Number(idSucursal));
        setArticulosManufacturados(articulosManufacturados);
    };

    const getAllCategoriaByEmpresa = async () => {
        const categorias: Categoria[] = await CategoriaByEmpresaGetAll(Number(idEmpresa));
        setCategorias(categorias);
    };

    const getAllUnidadMedida = async () => {
        const unidadMedidas: UnidadMedida[] = await UnidadMedidaGetAll();
        setUnidadMedidas(unidadMedidas);
    };

    const createArticuloManufacturado = async (articulo: ArticuloManufacturado) => {
        return ArticuloManufacturadoCreate(articulo);
    };

    const updateArticuloManufacturado = async (articulo: ArticuloManufacturado) => {
        return ArticuloManufacturadoUpdate(articulo);
    };

    const deleteArticuloManufacturado = async (id: number) => {
        return ArticuloManufacturadoDelete(id);
    }

    const getAllArticuloInsumoBySucursal = async () => {
        const articulosInsumo: ArticuloInsumo[] = await ArticuloInsumoFindBySucursal(Number(idSucursal));
        setInsumos(articulosInsumo);
    };

    const searcher = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    let results = [];

    if (!search) {
        results = insumos;
    } else {
        results = insumos.filter((insumo) =>
            insumo.denominacion.toLowerCase().includes(search.toLocaleLowerCase()));
    }

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

    };

    useEffect(() => {
        getAllArticuloManufacturadoBySucursal();
        getAllCategoriaByEmpresa();
        getAllUnidadMedida();
    }, [idSucursal, idEmpresa]);

    const handleOpenModal = () => {
        setOpenModal(true);
        setModalStep(1);
        setImages([]);
        getAllArticuloInsumoBySucursal();
    };

    const handleOpenEditModal = async (articulo: ArticuloManufacturado) => {
        setCurrentArticuloManufacturado(articulo);
        if (articulo.articuloManufacturadoDetalles !== null) {
            setDetalles(articulo.articuloManufacturadoDetalles);
        }
        setImages(articulo.imagenes.map(imagen => imagen.url));

        const imageUrls = articulo.imagenes.map(imagen => imagen.url);
        const imageFiles = await Promise.all(imageUrls.map(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = url.split('/').pop();
            return new File([blob], filename || 'image.jpg', { type: blob.type });
        }));
        setFiles(imageFiles);
        setOpenModal(true);
        setModalStep(1);
        getAllArticuloInsumoBySucursal();
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentArticuloManufacturado({ ...emptyArticuloManufacturado });
        setInsumos([]);
        setDetalles([]);
        setFiles([]);
    };

    const handleNextStep = () => {
        setModalStep(modalStep + 1);
    };

    const handlePreviousStep = () => {
        setModalStep(modalStep - 1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentArticuloManufacturado({ ...currentArticuloManufacturado, [e.target.name]: e.target.value });
    };

    const handleAgregar = (insumo: ArticuloInsumo) => {
        const nuevoDetalle = {
            id: 0,
            eliminado: false,
            cantidad: 1,
            articuloInsumo: insumo
        };
        setDetalles([...detalles, nuevoDetalle]);
    };

    const handleCantidadChange = (index: number, cantidad: number) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index].cantidad = cantidad;
        setDetalles(nuevosDetalles);
    };

    const handleEliminar = (index: number) => {
        const nuevosDetalles = detalles.filter((_, i) => i !== index);
        setDetalles(nuevosDetalles);
    };

    const handleDelete = async (articulo: ArticuloManufacturado) => {
        const imagenes: Imagen[] = articulo.imagenes;

        try {
            const data = await deleteArticuloManufacturado(articulo.id);
            if (data.status !== 200) {
                return;
            }
        } catch (error) {
            console.log("Error al crear un Articulo Manufacturado.");
        }

        try {
            await deleteImages(imagenes);
        } catch (error) {
            console.log("Error al subir las Imagenes.");
        }

        window.location.reload();
    }

    const handleSubmit = async () => {
        const imagenes = await cloudinaryUpload();
        const imagenesExistentes = currentArticuloManufacturado.imagenes;
        if (imagenes && imagenes?.length > 0) {
            currentArticuloManufacturado.imagenes = imagenes;
        }

        if (currentArticuloManufacturado.id > 0) {
            try {
                const data = await updateArticuloManufacturado(currentArticuloManufacturado);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    return;
                }
                deleteImages(imagenesExistentes);
                setCurrentArticuloManufacturado(emptyArticuloManufacturado);
            } catch (error) {
                console.log("Error al actualizar un articulo manufacturado.");
            }

        } else {
            try {
                currentArticuloManufacturado.articuloManufacturadoDetalles = detalles;
                const data = await createArticuloManufacturado(currentArticuloManufacturado);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    return;
                }

                setCurrentArticuloManufacturado(emptyArticuloManufacturado);
            } catch (error) {
                console.log("Error al crear un articulo manufacturado.");
            }
        }

        try {
            await getAllArticuloManufacturadoBySucursal();
        } catch (error) {
            console.log("Error al cargar los manufacturados.");
        }

        handleCloseModal();
    }

    return (
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom>
                    Articulos Manufacturados
                </Typography>
                <Box mb={2}>
                    <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={handleOpenModal}>
                        Agregar Manufacturado
                    </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nombre</TableCell>
                                <TableCell align="center">Unidad de Medida</TableCell>
                                <TableCell align="center">Precio</TableCell>
                                <TableCell align="center">Tiempo (minutos)</TableCell>
                                <TableCell align="center">Categoria</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articulosManufacturados.filter(articulo => !articulo.eliminado)
                                .map((articulo) => (
                                    <TableRow key={articulo.id}>
                                        <TableCell align="center">{articulo.denominacion}</TableCell>
                                        <TableCell align="center">{articulo.unidadMedida.denominacion}</TableCell>
                                        <TableCell align="center">{articulo.precioVenta}</TableCell>
                                        <TableCell align="center">{articulo.tiempoEstimadoMinutos}</TableCell>
                                        <TableCell align="center">{articulo.categoria && articulo.categoria.denominacion}</TableCell>
                                        <TableCell align="center">
                                            <IconButton aria-label="edit" onClick={() => handleOpenEditModal(articulo)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="view">
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => handleDelete(articulo)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                {currentArticuloManufacturado.id > 0 ? <DialogTitle>Actualizar Articulo Manufacturado</DialogTitle> : <DialogTitle>Crear Articulo Manufacturado</DialogTitle>}
                <DialogContent dividers>
                    {modalStep === 1 && (
                        <Box>
                            <TextField
                                name="denominacion"
                                label="Denominacion"
                                fullWidth
                                margin="normal"
                                value={currentArticuloManufacturado.denominacion}
                                onChange={handleChange}
                            />
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            name="unidadMedidaId"
                                            label="Unidad de Medida"
                                            fullWidth
                                            margin="normal"
                                            value={currentArticuloManufacturado.unidadMedida.id}
                                            onChange={(e) => setCurrentArticuloManufacturado({
                                                ...currentArticuloManufacturado,
                                                unidadMedida: unidadMedidas.find((u) => u.id === Number(e.target.value)) || emptyUnidadMedida
                                            })}
                                        >
                                            {unidadMedidas.map((unidad) => (
                                                <MenuItem key={unidad.id} value={unidad.id}>
                                                    {unidad.denominacion}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            name="categoriaId"
                                            label="Categoria"
                                            fullWidth
                                            margin="normal"
                                            value={currentArticuloManufacturado.categoria?.id || ''}
                                            onChange={(e) => setCurrentArticuloManufacturado({
                                                ...currentArticuloManufacturado,
                                                categoria: categorias.find((c) => c.id === Number(e.target.value)) || emptyCategoria
                                            })}
                                        >
                                            {categorias.map((categoria) => (
                                                <MenuItem key={categoria.id} value={categoria.id ?? ''}>
                                                    {categoria.denominacion}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
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
                                {images.length > 0 && (
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
                                )}
                            </Box>
                            <TextField
                                name="precioVenta"
                                label="Precio de Venta"
                                fullWidth
                                margin="normal"
                                type="number"
                                value={currentArticuloManufacturado.precioVenta}
                                onChange={handleChange}
                            />
                            <TextField
                                name="tiempoEstimadoMinutos"
                                label="Tiempo Estimado (minutos)"
                                fullWidth
                                margin="normal"
                                type="number"
                                value={currentArticuloManufacturado.tiempoEstimadoMinutos}
                                onChange={handleChange}
                            />
                        </Box>
                    )}
                    {modalStep === 2 && (
                        <Box>
                            <TextField
                                name="descripcion"
                                label="Descripcion"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={3}
                                value={currentArticuloManufacturado.descripcion}
                                onChange={handleChange}
                            />
                            <TextField
                                name="preparacion"
                                label="Preparacion"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={5}
                                value={currentArticuloManufacturado.preparacion}
                                onChange={handleChange}
                            />
                        </Box>
                    )}
                    {modalStep === 3 && (
                        <Box>
                            <TextField
                                name="buscarInsumo"
                                label="Buscar Insumo"
                                fullWidth
                                margin="normal"
                                value={search}
                                onChange={searcher}
                            />
                            <Table>
                                <TableBody>
                                    {results.map((insumo) => (
                                        <TableRow key={insumo.id}>
                                            <TableCell>
                                                <img src={insumo.imagenes[0].url} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}></img>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1">{insumo.denominacion}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="success" onClick={() => handleAgregar(insumo)}>Agregar</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Detalles Agregados
                            </Typography>
                            <div>
                                {detalles.map((detalle, index) => (
                                    <div key={index}>
                                        <Typography variant="body1">Nombre: {detalle.articuloInsumo.denominacion}</Typography>
                                        <TextField
                                            type="number"
                                            value={detalle.cantidad}
                                            onChange={(e) => handleCantidadChange(index, Number(e.target.value))}
                                            label="Cantidad"
                                        />
                                        <Button variant="contained" color="error" onClick={() => handleEliminar(index)}>Eliminar</Button>
                                    </div>
                                ))}
                            </div>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    {modalStep > 1 && (
                        <Button variant="contained" color="secondary" onClick={handlePreviousStep}>Atras</Button>
                    )}
                    {modalStep < 3 && (
                        <Button variant="contained" color="primary" onClick={handleNextStep}>Siguiente</Button>
                    )}
                    {modalStep === 3 && (
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Crear Manufacturado</Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ArticuloManufacturadoList;