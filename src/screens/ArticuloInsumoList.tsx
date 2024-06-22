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
    const [imagenes, setImagenes] = useState<Imagen[]>([]);
    const { idSucursal, idEmpresa } = useParams();
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string>('');
    const [publicId, setPublicId] = useState<string>('');

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
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const cloudinaryUpload = async () => {
        if (!file) return;

        try {
            const response = await CloudinaryUpload(file);
            setUploadedUrl(response.urls[0]);
            console.log("creado url: " + uploadedUrl);
            setPublicId(response.public_id);
            console.log("creado pid: " + publicId);
        } catch (error) {
            console.error('Error uploading the file', error);
        }
    };


    const cloudinaryDelete = async (id: number) => {
        
        if (!publicId) return;

        try {
            await CloudinaryDelete(publicId, id);
            setUploadedUrl('');
            setPublicId('');
        } catch (error) {
            console.error('Error deleting the file', error);
        }
    };

    const handleEdit = (articulo?: ArticuloInsumo) => {
        if (articulo) {
            setCurrentArticuloInsumo(articulo);
        } else {
            setCurrentArticuloInsumo({ ...emptyArticuloInsumo });
        }
        setOpen(true);
    };

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleDelete = async (articulo: ArticuloInsumo) => {
        await deleteArticuloInsumo(articulo.id);
        //await cloudinaryDelete(articulo.id);
        //window.location.reload();
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
            await updateArticuloInsumo(currentArticuloInsumo);
        } else {
            cloudinaryUpload();
            const img: Imagen = { id: 0, eliminado: false, url: uploadedUrl };
            setImagenes([...imagenes, img]);
            currentArticuloInsumo.imagenes = imagenes;
            await createArticuloInsumo(currentArticuloInsumo);
            setImagenes([]);
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
                                        <IconButton aria-label="view">
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
                        <input type="file" accept="image/*" onChange={cloudinaryFileChange} />
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