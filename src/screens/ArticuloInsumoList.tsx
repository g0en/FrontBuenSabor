import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Modal, Box, TextField, MenuItem, FormControlLabel, Switch,
    Typography
} from "@mui/material";
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
    const [file, setFile] = useState<File | null>(null);
    const [imagenSeleccionada, setImagenSeleccionada] = useState<string | ArrayBuffer | null>(null);

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
        await ArticuloInsumoCreate(articuloInsumo);
        await getAllArticuloInsumoBySucursal();
    };

    const updateArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
        await ArticuloInsumoUpdate(articuloInsumo);
        await getAllArticuloInsumoBySucursal();
    };

    const deleteArticuloInsumo = async (id: number) => {
        return ArticuloInsumoDelete(id);
    };

    const cloudinaryFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Obtener el primer archivo seleccionado
        if (event.target.files) {
            setFile(event.target.files[0]);
        }

        if (file) {
            // Crear un objeto URL temporal para mostrar la imagen
            const reader = new FileReader();
            reader.onload = () => {
                // Actualizar el estado de imagenSeleccionada con la URL base64
                setImagenSeleccionada(reader.result);
            };
            reader.readAsDataURL(file); // Leer el archivo como URL base64
        }
    };

    const cloudinaryUpload = async () => {
        if (!file) return;

        try {
            const imagenes: Imagen[] = await CloudinaryUpload(file);
            return imagenes;
        } catch (error) {
            console.error('Error uploading the file', error);
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
            setImagenSeleccionada(articulo.imagenes[0].url);
        }

        setView(true);
    }

    const handleEdit = (articulo?: ArticuloInsumo) => {
        if (articulo) {
            setCurrentArticuloInsumo(articulo);
            setImagenSeleccionada(articulo.imagenes[0].url);
        } else {
            setCurrentArticuloInsumo({ ...emptyArticuloInsumo });
        }

        setOpen(true);
    };

    const handleOpen = () => {
        setCurrentArticuloInsumo({ ...emptyArticuloInsumo });
        setImagenSeleccionada(null);
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
        setView(false);
    };

    const handleDelete = async (articulo: ArticuloInsumo) => {
        const imagenes = articulo.imagenes;

        try {
            deleteArticuloInsumo(articulo.id);

            for (let i = 0; i < imagenes.length; i++) {
                const match = imagenes[i].url.match(/.*\/([^/?]+).*$/);
                if (match) {
                    const publicId = match[1];
                    console.log(publicId);
                    await cloudinaryDelete(publicId, imagenes[i].id);
                }
            }

            window.location.reload();
        } catch (error) {
            console.log("Error al eliminar el articulo.")
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
        if (currentArticuloInsumo.id > 0) {
            if (currentArticuloInsumo.imagenes[0].url !== imagenSeleccionada) {
                /*const imagenes = currentArticuloInsumo.imagenes;

                try {
                    for (let i = 0; i < imagenes.length; i++) {
                        const match = imagenes[i].url.match(/.*\/([^/?]+).*$/);
                        if (match) {
                            const publicId = match[1];
                            console.log(publicId);
                            cloudinaryDelete(publicId, imagenes[i].id);
                        }
                    }
                } catch (error) {
                    console.log("Error al eliminar la imagen de cloudinary.")
                }

                const imagenesNuevas = await cloudinaryUpload();

                if (imagenesNuevas && imagenesNuevas?.length > 0) {
                    currentArticuloInsumo.imagenes = imagenesNuevas;
                }*/
            }

            await updateArticuloInsumo(currentArticuloInsumo);

        } else {
            const imagenes = await cloudinaryUpload();
            if (imagenes && imagenes?.length > 0) {
                currentArticuloInsumo.imagenes = imagenes;
            }

            await createArticuloInsumo(currentArticuloInsumo);
            setCurrentArticuloInsumo(emptyArticuloInsumo);
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
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {currentArticuloInsumo.denominacion}
                    </Typography>
                    {imagenSeleccionada && (
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={typeof imagenSeleccionada === 'string' ? imagenSeleccionada : URL.createObjectURL(new Blob([imagenSeleccionada as ArrayBuffer]))}
                                alt="Imagen seleccionada"
                                style={{ maxWidth: '40%', marginTop: '10px', borderRadius: 8 }} // Ajustes de estilo para la imagen
                            />
                        </div>
                    )}
                    <Button variant="contained" color="secondary" onClick={handleClose} sx={{ mr: 2 }}>
                        Cerrar
                    </Button>
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
                        <Typography variant="subtitle1">Seleccione una imagen:</Typography>
                        <label htmlFor="upload-button">
                            <input
                                style={{ display: 'none' }}
                                id="upload-button"
                                type="file"
                                accept="image/*"
                                onChange={cloudinaryFileChange}
                            />
                            <Button variant="contained" component="span">
                                Subir Imagen
                            </Button>
                        </label>
                        {imagenSeleccionada && (
                            <div>
                                <img src={typeof imagenSeleccionada === 'string' ? imagenSeleccionada : URL.createObjectURL(new Blob([imagenSeleccionada as ArrayBuffer]))} alt="Imagen seleccionada" style={{ maxWidth: '10%', marginTop: '10px' }} />
                            </div>
                        )}
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
        </>
    );
}

export default ArticuloInsumoList;