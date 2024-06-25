import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, IconButton, Chip, Button, Modal, TextField, Checkbox, FormControlLabel, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from "../components/common/SideBar";
import Categoria from "../types/Categoria";
import { CategoriaByEmpresaGetAll, CategoriaCreate, CategoriaUpdate, CategoriaBaja } from "../services/CategoriaService";
import { SucursalGetByEmpresaId } from "../services/SucursalService";
import Sucursal from "../types/Sucursal";
import { CategoriaDelete } from "../services/CategoriaService";
import CategoriaGetDto from "../types/CategoriaGetDto";

const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

function CategoriaList() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [currentCategoria, setCurrentCategoria] = useState<Categoria>({ ...emptyCategoria });
    const [categoriaGet, setCategoriaGet] = useState<CategoriaGetDto[]>([]);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [open, setOpen] = useState(false);
    const { idEmpresa } = useParams();
    const { idSucursal } = useParams();

    const getAllCategoriaByEmpresa = async () => {
        try {
            const categorias: CategoriaGetDto[] = await CategoriaByEmpresaGetAll(Number(idEmpresa));
            setCategorias(categorias);
            setCategoriaGet(categorias);
        } catch (error) {
            toast.error('Error al obtener las categorías');
        }
    };

    const getAllSucursal = async () => {
        try {
            const sucursales: Sucursal[] = await SucursalGetByEmpresaId(Number(idEmpresa));
            setSucursales(sucursales);
        } catch (error) {
            toast.error('Error al obtener las sucursales');
        }
    };

    const createCategoria = async (categoria: Categoria) => {
        try {
            await CategoriaCreate(categoria);
            getAllCategoriaByEmpresa();
            setOpen(false);
            toast.success('Categoría creada exitosamente');
        } catch (error) {
            toast.error('Error al crear la categoría');
        }
    };

    const updateCategoria = async (categoria: Categoria) => {
        try {
            await CategoriaUpdate(categoria);
            getAllCategoriaByEmpresa();
            setOpen(false);
            toast.success('Categoría actualizada exitosamente');
        } catch (error) {
            toast.error('Error al actualizar la categoría');
        }
    };

    const bajaCategoria = async (idCategoria: number) => {
        try {
            await CategoriaBaja(idCategoria, Number(idSucursal));
            getAllCategoriaByEmpresa();
            window.location.reload();
            toast.success('Categoría dada de baja exitosamente');
        } catch (error) {
            toast.error('Error al dar de baja la categoría');
        }
    };

    const deleteCategoria = async (idCategoria: number) => {
        try {
            await CategoriaDelete(idCategoria);
            getAllCategoriaByEmpresa();
            window.location.reload();
            toast.success('Categoría eliminada exitosamente');
        } catch (error) {
            toast.error('Error al eliminar la categoría');
        }
    };

    useEffect(() => {
        getAllCategoriaByEmpresa();
        getAllSucursal();
    }, []);

    const handleOpen = (categoria?: Categoria) => {
        if (categoria) {
            setCurrentCategoria(categoria);
        } else {
            setCurrentCategoria({ ...emptyCategoria });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentCategoria({ ...currentCategoria, [e.target.name]: e.target.value });
    };

    const handleEsInsumoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentCategoria({ ...currentCategoria, esInsumo: e.target.checked });
    };

    const handleSucursalChange = (id: number) => {
        const sucursalesSeleccionadas = currentCategoria.sucursales || [];
        const sucursalExistente = sucursalesSeleccionadas.find(s => s.id === id);

        if (sucursalExistente) {
            setCurrentCategoria({
                ...currentCategoria,
                sucursales: sucursalesSeleccionadas.filter(s => s.id !== id)
            });
        } else {
            const sucursal = sucursales.find(s => s.id === id);
            if (sucursal) {
                setCurrentCategoria({
                    ...currentCategoria,
                    sucursales: [...sucursalesSeleccionadas, sucursal]
                });
            }
        }
    };

    const handleAddSubCategoria = () => {
        setCurrentCategoria({
            ...currentCategoria,
            subCategorias: [...(currentCategoria.subCategorias || []), { ...emptyCategoria }]
        });
    };

    const handleSubCategoriaChange = (index: number, denominacion: string) => {
        const subCategorias = [...(currentCategoria.subCategorias || [])];
        subCategorias[index].denominacion = denominacion;
        setCurrentCategoria({ ...currentCategoria, subCategorias });
    };

    const handleRemoveSubCategoria = (index: number) => {
        const subCategorias = [...(currentCategoria.subCategorias || [])];
        subCategorias.splice(index, 1);
        setCurrentCategoria({ ...currentCategoria, subCategorias });
    };

    const handleSubmit = () => {
        if (currentCategoria.id === null) {
            createCategoria(currentCategoria);
        } else {
            updateCategoria(currentCategoria);
        }
    };

    const renderCategorias = (categorias: Categoria[], level: number = 0) => {
        return categorias.filter(c => c.id !== null).map(categoria => (
            <React.Fragment key={categoria.id}>
                <Divider />
                <ListItem sx={{ pl: level * 2 }}>
                    <ListItemText>
                        <Typography variant="body1">
                            {categoria.denominacion}
                            {level === 0 && (
                                categoria.esInsumo ?
                                    <Chip label="Insumo" size="small" color="secondary" sx={{ ml: 1 }} /> :
                                    <Chip label="Manufacturado" size="small" color="error" sx={{ ml: 1 }} />
                            )}
                        </Typography>
                    </ListItemText>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(categoria)}>
                        <EditIcon />
                    </IconButton>
                    {level === 0 && (
                        <IconButton edge="end" aria-label="baja" onClick={() => categoria.id !== null && bajaCategoria(categoria.id)}>
                            <ArrowCircleDownIcon />
                        </IconButton>
                    )}
                    <IconButton edge="end" aria-label="delete" onClick={() => categoria.id !== null && deleteCategoria(categoria.id)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
                {categoria.subCategorias && categoria.subCategorias.length > 0 && (
                    <List sx={{ pl: 4 }}>
                        {renderCategorias(categoria.subCategorias, level + 1)}
                    </List>
                )}
            </React.Fragment>
        ));
    };

    return (
        <>
            <SideBar />
            <ToastContainer />
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom>
                    Categorías
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                    Agregar Categoría
                </Button>
                <List>
                    <ListItem>
                        <ListItemText>
                            <Typography variant="body2">Nombre</Typography>
                        </ListItemText>
                        <Typography variant="body2">Acciones</Typography>
                    </ListItem>
                    <Divider />
                    {renderCategorias(categorias)}
                </List>
            </Box>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 700, maxHeight: '80vh', bgcolor: 'background.paper', boxShadow: 24, p: 4, overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>
                        {currentCategoria.id === null ? 'Crear Categoría' : 'Editar Categoría'}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Denominación"
                        name="denominacion"
                        value={currentCategoria.denominacion}
                        onChange={handleCategoriaChange}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={currentCategoria.esInsumo}
                                onChange={handleEsInsumoChange}
                                name="esInsumo"
                                color="primary"
                            />
                        }
                        label="Es Insumo"
                    />
                    <Typography variant="subtitle1" gutterBottom>
                        Selecciona la/s sucursales:
                    </Typography>
                    {sucursales.map(sucursal => (
                        <FormControlLabel
                            key={sucursal.id}
                            control={
                                <Checkbox
                                    checked={currentCategoria.sucursales?.some(s => s.id === sucursal.id) || false}
                                    onChange={() => handleSucursalChange(sucursal.id)}
                                    color="primary"
                                />
                            }
                            label={sucursal.nombre}
                        />
                    ))}
                    <Typography variant="subtitle1" gutterBottom>
                        Agregar Subcategorías
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={handleAddSubCategoria}>
                        Agregar
                    </Button>
                    {currentCategoria.subCategorias && currentCategoria.subCategorias.map((subCategoria, index) => (
                        <Box key={index} display="flex" alignItems="center" mt={2}>
                            <TextField
                                label="Denominación"
                                value={subCategoria.denominacion}
                                onChange={(e) => handleSubCategoriaChange(index, e.target.value)}
                                margin="normal"
                            />
                            <IconButton color="secondary" onClick={() => handleRemoveSubCategoria(index)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleClose} sx={{ mr: 2 }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {currentCategoria.id === null ? 'Crear' : 'Actualizar'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default CategoriaList;
