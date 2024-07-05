import { Box, Button, FormControlLabel, Grid, IconButton, MenuItem, Modal, Switch, TextField, Typography } from "@mui/material";
import ArticuloInsumo from "../../../types/ArticuloInsumo";
import { useEffect, useState } from "react";
import Imagen from "../../../types/Imagen";
import { useAuth0 } from "@auth0/auth0-react";
import { CategoriaByEmpresaGetAll } from "../../../services/CategoriaService";
import Categoria from "../../../types/Categoria";
import UnidadMedida from "../../../types/UnidadMedida";
import { UnidadMedidaGetAll } from "../../../services/UnidadMedidaService";
import { useParams } from "react-router-dom";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { Delete } from "@mui/icons-material";
import { CloudinaryDelete, CloudinaryUpload } from "../../../services/CloudinaryService";
import { ArticuloInsumoCreate, ArticuloInsumoUpdate } from "../../../services/ArticuloInsumoService";
import CloseIcon from '@mui/icons-material/Close';

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

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

interface ArticuloInsumoAddModalProps {
    open: boolean;
    onClose: () => void;
    articulo: ArticuloInsumo;
    imagenes: string[];
    articuloImagenes: Imagen[];
}

const ArticuloInsumoAddModal: React.FC<ArticuloInsumoAddModalProps> = ({ open, onClose, articulo, imagenes, articuloImagenes }) => {
    const [currentArticuloInsumo, setCurrentArticuloInsumo] = useState<ArticuloInsumo>(articulo);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>(imagenes);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>(articuloImagenes);
    const { idEmpresa } = useParams();
    const { getAccessTokenSilently } = useAuth0();

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

    useEffect(() => {
        getAllCategoriaByEmpresa();
        getAllUnidadMedida();
    }, []);

    useEffect(() => {
        if (open) {
            setImages(imagenes);
            setArticuloImages(articuloImagenes);
        }
    }, [open, imagenes, articuloImagenes]);

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

    const removeImage = (index: number) => {
        if (currentArticuloInsumo.id > 0) {
            setArticuloImages(articuloImages.filter(img => img.id !== index));
        } else {
            setImages(prevImages => prevImages.filter((_, i) => i !== index));
        }

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

    const handleClose = () => {
        setCurrentArticuloInsumo(articulo);
        setFiles([]);
        setImages(imagenes);
        setArticuloImages(articuloImagenes);
        onClose();
    }

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

            } catch (error) {
                console.log("Error al crear un articulo insumo");
            }
        }

        handleClose();
    };

    return (
        <>
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
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {currentArticuloInsumo.id === 0 ? 'Crear' : 'Actualizar'}
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default ArticuloInsumoAddModal;