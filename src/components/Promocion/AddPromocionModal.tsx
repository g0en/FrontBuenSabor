import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Grid, TableContainer, Table, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TipoPromocion } from '../../types/enums/TipoPromocion';
import Promocion from '../../types/Promocion';
import { PromocionCreate } from '../../services/PromocionService';
import { Delete } from "@mui/icons-material";
import Imagen from '../../types/Imagen';
import { CloudinaryPromocionUpload, CloudinaryPromocionDelete } from '../../services/ImagenPromocionService';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { useParams } from 'react-router-dom';
import Articulo from '../../types/Articulo';
import { ArticuloManufacturadoFindBySucursal } from '../../services/ArticuloManufacturadoService';
import { ArticuloInsumoGetAllParaVender } from '../../services/ArticuloInsumoService';
import ArticuloManufacturado from '../../types/ArticuloManufacturado';
import ArticuloInsumo from '../../types/ArticuloInsumo';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const emptyPromocion: Promocion = {
    id: 0,
    eliminado: false,
    denominacion: '',
    fechaDesde: '',
    fechaHasta: '',
    horaDesde: '',
    horaHasta: '',
    descripcionDescuento: '',
    precioPromocional: 0,
    tipoPromocion: null,
    imagenes: [],
    sucursal: null,
    promocionDetalle: [],
};

interface AddPromocionModalProps {
    open: boolean;
    onClose: () => void;
}

const AddPromocionModal: React.FC<AddPromocionModalProps> = ({ open, onClose }) => {
    const [step, setStep] = useState(1);
    const [promocion, setPromocion] = useState<Promocion>(emptyPromocion);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const { idSucursal } = useParams();
    const [search, setSearch] = useState("");
    const [manufacturados, setManufacturados] = useState<ArticuloManufacturado[]>([]);
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const emptySucursal = { id: Number(idSucursal), eliminado: false, nombre: '' }

    const createPromocion = async (promocion: Promocion) => {
        return PromocionCreate(promocion);
    };

    const getAllArticuloInsumoParaVender = async () => {
        const insumos: ArticuloInsumo[] = await ArticuloInsumoGetAllParaVender(Number(idSucursal));
        setInsumos(insumos);
    };

    const getAllArticuloManufacturadoBySucursal = async () => {
        const manufacturados: ArticuloManufacturado[] = await ArticuloManufacturadoFindBySucursal(Number(idSucursal));
        setManufacturados(manufacturados);
    };

    const searcher = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    let results:  Articulo[] = [];

    if (!search) {
        results = [];
    } else {
        results = articulos.filter((articulo) =>
            articulo.denominacion.toLowerCase().includes(search.toLocaleLowerCase()));
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
                    if (promocion.id > 0) {
                        setArticuloImages(prevImages => [...prevImages, { id: 0, eliminado: false, url: newImage }]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        if (promocion.id > 0) {
            setArticuloImages(articuloImages.filter(img => img.id !== index));
        } else {
            setImages(prevImages => prevImages.filter((_, i) => i !== index));
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

    const cloudinaryUpload = async (): Promise<Imagen[]> => {
        if (files.length === 0) return [];

        try {
            const imagenes = await Promise.all(files.map(file => CloudinaryPromocionUpload(file)));
            return imagenes.flat(); // Aplana el array de arrays
        } catch (error) {
            console.error('Error uploading the files', error);
            return [];
        }
    };

    const cloudinaryDelete = async (publicId: string, id: number) => {

        if (!publicId) return;

        try {
            await CloudinaryPromocionDelete(publicId, id.toString());
        } catch (error) {
            console.error('Error deleting the file', error);
        }

    };

    useEffect(() => {
        getAllArticuloManufacturadoBySucursal();
        getAllArticuloInsumoParaVender();
    }, [idSucursal]);

    useEffect(() => {
        setArticulos([...insumos, ...manufacturados]);
    }, [insumos, manufacturados]);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleClose = () => {
        setStep(1);
        setPromocion(emptyPromocion);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPromocion({ ...promocion, [name]: value });
    };

    const handleSubmit = async () => {
        const imagenes = await cloudinaryUpload();

        if (imagenes && imagenes?.length > 0) {
            imagenes.forEach(imagen => {
                articuloImages.push(imagen);
            });
        }

        if (articuloImages !== null) {
            promocion.imagenes = articuloImages;
        }

        //promocion.detalles = detalles

        if (promocion.id > 0) {

        } else {
            try {
                /*if (promocion.sucursal === null) {
                promocion.sucursal = emptySucursal;
            }*/
                const data = await createPromocion(promocion);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    return;
                }

                setPromocion(emptyPromocion);
            } catch (error) {
                console.log("Error al actualizar un articulo manufacturado.");
            }

        }

        handleClose();
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                    Agregar Promoción
                </Typography>
                {step === 1 && (
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="denominacion"
                                    value={promocion.denominacion}
                                    onChange={handleChange}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Tipo de Promoción"
                                    name="tipoPromocion"
                                    value={promocion.tipoPromocion}
                                    onChange={handleChange}
                                    margin="normal"
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value={TipoPromocion.HAPPY_HOUR}>Happy Hour</option>
                                    <option value={TipoPromocion.PROMOCION}>Promoción</option>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha Desde"
                                    type="date"
                                    name="fechaDesde"
                                    value={promocion.fechaDesde}
                                    onChange={handleChange}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha Hasta"
                                    type="date"
                                    name="fechaHasta"
                                    value={promocion.fechaHasta}
                                    onChange={handleChange}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Hora Desde"
                                    type="time"
                                    name="horaDesde"
                                    value={promocion.horaDesde}
                                    onChange={handleChange}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Hora Hasta"
                                    type="time"
                                    name="horaHasta"
                                    value={promocion.horaHasta}
                                    onChange={handleChange}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>


                        <Box mt={2}>
                            <Button variant="contained" onClick={handleNext}>
                                Siguiente
                            </Button>
                        </Box>
                    </>
                )}
                {step === 2 && (
                    <>
                        <TextField
                            fullWidth
                            label="Descripción"
                            name="descripcionDescuento"
                            value={promocion.descripcionDescuento}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={4}
                        />
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
                            {promocion.id > 0 ?
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
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button variant="contained" color='secondary' onClick={handleBack}>
                                Atrás
                            </Button>
                            <Button variant="contained" onClick={handleNext}>
                                Siguiente
                            </Button>
                        </Box>
                    </>
                )}
                {step === 3 && (
                    <>
                        <TextField
                            fullWidth
                            label="Buscar Artículos"
                            name="buscarArticulos"
                            value={search}
                            onChange={searcher}
                            margin="normal"
                        />
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {results.filter(articulo => articulo.habilitado === true)
                                        .map((articulo) => (
                                            <TableRow key={articulo.id}>
                                                <TableCell>
                                                    <img src={articulo.imagenes.length > 0 ? articulo.imagenes[0].url : ''} alt={`Imagen de ${articulo.denominacion}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1">{articulo.denominacion}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="success">Agregar</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                            Detalles de la Promoción
                        </Typography>
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button variant="contained" color='secondary' onClick={handleBack}>
                                Atrás
                            </Button>
                            <Button variant="contained" onClick={() => { handleSubmit(); }}>
                                Crear Promoción
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default AddPromocionModal;