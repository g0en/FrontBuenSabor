import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Typography, Button, Box, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Card, CardContent, CardActions,
    Modal
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };
const emptyArticuloManufacturado = {
    id: 0, eliminado: false, denominacion: '', precioVenta: 0, habilitado: true, imagenes: [], unidadMedida: emptyUnidadMedida, categoria: emptyCategoria, sucursal: null, descripcion: '', tiempoEstimadoMinutos: 0, preparacion: '', articuloManufacturadoDetalles: null
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
    const [articuloImages, setArticuloImages] = useState<Imagen[]>([]);
    const [view, setView] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [text, setText] = useState("Crear");

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

    let results: ArticuloInsumo[] = [];

    if (!search) {
        results = [];
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
                    const newImage = reader.result as string;
                    setImages(prevImages => [...prevImages, reader.result as string]);
                    if (currentArticuloManufacturado.id > 0) {
                        setArticuloImages(prevImages => [...prevImages, { id: 0, eliminado: false, url: newImage }]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        if (currentArticuloManufacturado.id > 0) {
            setArticuloImages(articuloImages.filter(img => img.id !== index));
        } else {
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

    useEffect(() => {
        getAllArticuloManufacturadoBySucursal();
        getAllCategoriaByEmpresa();
        getAllUnidadMedida();
    }, [idSucursal, idEmpresa]);

    const handleView = (articulo?: ArticuloManufacturado) => {
        if (articulo) {
            setCurrentArticuloManufacturado(articulo);
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

    const handleOpenModal = () => {
        setOpenModal(true);
        setModalStep(1);
        setImages([]);
        getAllArticuloInsumoBySucursal();
    };

    const handleOpenEditModal = async (articulo: ArticuloManufacturado) => {
        if (articulo) {
            setCurrentArticuloManufacturado(articulo);
            if (articulo.articuloManufacturadoDetalles !== null) {
                setDetalles(articulo.articuloManufacturadoDetalles);
            }
            setImages(articulo.imagenes.map(imagen => imagen.url));
            setArticuloImages(articulo.imagenes);
        } else {
            setCurrentArticuloManufacturado({ ...emptyArticuloManufacturado });
            setImages([]);
            setFiles([]);
            setArticuloImages([]);
        }

        setOpenModal(true);
        setModalStep(1);
        setText("Actualizar");
        getAllArticuloInsumoBySucursal();
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentArticuloManufacturado({ ...emptyArticuloManufacturado });
        setInsumos([]);
        if (currentArticuloManufacturado.id > 0) {
            setDetalles(JSON.parse(JSON.stringify(currentArticuloManufacturado.articuloManufacturadoDetalles)));
        } else {
            setDetalles([]);
        }

        setFiles([]);
        setSearch("");
        setText("Crear");
        setView(false);
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

    const handleBaja = async (articulo: ArticuloManufacturado) => {
        articulo.habilitado = false;
        try {
            const data = await updateArticuloManufacturado(articulo);
            if (data.status !== 200) {
                articulo.habilitado = true;
                return;
            }

        } catch (error) {
            console.log("Error al dar de baja un articulo manufacturado");
        }

        try {
            await getAllArticuloManufacturadoBySucursal();
        } catch (error) {
            console.log("Error al cargar los insumos.");
        }

    }

    const handleAlta = async (articulo: ArticuloManufacturado) => {
        articulo.habilitado = true;
        try {
            const data = await updateArticuloManufacturado(articulo);
            if (data.status !== 200) {
                articulo.habilitado = false;
                return;
            }

        } catch (error) {
            console.log("Error al dar de baja un articulo manufacturado");
        }

        try {
            await getAllArticuloManufacturadoBySucursal();
        } catch (error) {
            console.log("Error al cargar los insumos.");
        }
    }

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
        //const imagenes: Imagen[] = articulo.imagenes;

        try {
            const data = await deleteArticuloManufacturado(articulo.id);
            if (data.status !== 200) {
                return;
            }
        } catch (error) {
            console.log("Error al crear un Articulo Manufacturado.");
        }

        /*try {
            await deleteImages(imagenes);
        } catch (error) {
            console.log("Error al subir las Imagenes.");
        }*/

        window.location.reload();
    }

    const handleSubmit = async () => {
        const imagenes = await cloudinaryUpload();

        if (imagenes && imagenes?.length > 0) {
            imagenes.forEach(imagen => {
                articuloImages.push(imagen);
            });
        }

        if (articuloImages !== null) {
            currentArticuloManufacturado.imagenes = articuloImages;
        }

        currentArticuloManufacturado.articuloManufacturadoDetalles = detalles;

        if (currentArticuloManufacturado.id > 0) {
            try {
                const data = await updateArticuloManufacturado(currentArticuloManufacturado);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    return;
                }

                setCurrentArticuloManufacturado(emptyArticuloManufacturado);
            } catch (error) {
                console.log("Error al actualizar un articulo manufacturado.");
            }

        } else {
            try {

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
                <Typography variant="h5" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Articulos Manufacturados
                </Typography>
                <Box mb={2}>
                    <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={handleOpenModal}>
                        Agregar Manufacturado
                    </Button>
                </Box>
                <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px', marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Unidad de Medida</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Precio</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Tiempo (minutos)</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Categoria</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articulosManufacturados.filter(articulo => articulo.eliminado === false)
                                .map((articulo) => (
                                    <TableRow sx={{ backgroundColor: articulo.habilitado === true ? "none" : "#B0B0B0" }} key={articulo.id}>
                                        <TableCell align="center">{articulo.denominacion}</TableCell>
                                        <TableCell align="center">{articulo.unidadMedida.denominacion}</TableCell>
                                        <TableCell align="center">{articulo.precioVenta}</TableCell>
                                        <TableCell align="center">{articulo.tiempoEstimadoMinutos}</TableCell>
                                        <TableCell align="center">{articulo.categoria && articulo.categoria.denominacion}</TableCell>
                                        {
                                            articulo.habilitado === true ?
                                                <TableCell align="center">
                                                    <IconButton aria-label="edit" onClick={() => handleOpenEditModal(articulo)} color="primary">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => handleBaja(articulo)} color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                                :
                                                <TableCell>
                                                    <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="alta" onClick={() => handleAlta(articulo)} color="success">
                                                        <KeyboardDoubleArrowUpIcon />
                                                    </IconButton>
                                                </TableCell>

                                        }
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Modal open={view} onClose={handleCloseModal}>
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
                        {currentArticuloManufacturado.denominacion}
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
                    <Typography variant="h6" gutterBottom>
                        Descripcion:
                    </Typography>
                    <Typography variant="body2" gutterBottom mb={3}>
                        {currentArticuloManufacturado.descripcion}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Preparación:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {currentArticuloManufacturado.preparacion}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="contained" color="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </Modal>

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
                                            value={currentArticuloManufacturado.unidadMedida?.id || ''}
                                            onChange={(e) => setCurrentArticuloManufacturado({
                                                ...currentArticuloManufacturado,
                                                unidadMedida: unidadMedidas.find((u) => u.id === Number(e.target.value)) || emptyUnidadMedida
                                            })}
                                        >
                                            {unidadMedidas.filter(unidad => !unidad.eliminado)
                                            .map((unidad) => (
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
                                            {categorias.filter(categoria => !categoria.esInsumo)
                                            .filter(categoria => !categoria.eliminado)
                                            .map((categoria) => (
                                                <MenuItem key={categoria.id} value={categoria.id ?? ''}>
                                                    {categoria.denominacion}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
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
                                {currentArticuloManufacturado.id > 0 ?
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
                                        name="precioVenta"
                                        label="Precio de Venta"
                                        fullWidth
                                        margin="normal"
                                        type="decimal"
                                        value={currentArticuloManufacturado.precioVenta}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="tiempoEstimadoMinutos"
                                        label="Tiempo Estimado (minutos)"
                                        fullWidth
                                        margin="normal"
                                        type="decimal"
                                        value={currentArticuloManufacturado.tiempoEstimadoMinutos}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
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
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {results.filter(insumo => insumo.eliminado === false && insumo.esParaElaborar === true)
                                            .map((insumo) => (
                                                <TableRow key={insumo.id}>
                                                    <TableCell>
                                                        <img src={insumo.imagenes.length > 0 ? insumo.imagenes[0].url : ''} alt={`Imagen de ${insumo.denominacion}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
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
                            </TableContainer>
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Detalles Agregados
                            </Typography>
                            <Grid container spacing={2}>
                                {detalles.map((detalle, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="body1" gutterBottom mb={2}>
                                                    {detalle.articuloInsumo.denominacion}
                                                </Typography>
                                                <TextField
                                                    type="decimal"
                                                    value={detalle.cantidad}
                                                    onChange={(e) => handleCantidadChange(index, Number(e.target.value))}
                                                    label="Cantidad"
                                                    fullWidth
                                                />
                                            </CardContent>
                                            <CardActions>
                                                <Button variant="contained" color="error" onClick={() => handleEliminar(index)} fullWidth>
                                                    Eliminar
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
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
                        <Button variant="contained" color="primary" onClick={handleSubmit}>{text} Manufacturado</Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ArticuloManufacturadoList;