import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, IconButton, Chip, Button, Modal, TextField, Checkbox, FormControlLabel, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SideBar from "../components/common/SideBar";
import Categoria from "../types/Categoria";
import { CategoriaByEmpresaGetAll, CategoriaCreate, CategoriaUpdate, CategoriaDelete } from "../services/CategoriaService";
import { SucursalGetByEmpresaId } from "../services/SucursalService";
import Sucursal from "../types/Sucursal";

const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

function CategoriaList() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [currentCategoria, setCurrentCategoria] = useState<Categoria>({ ...emptyCategoria });
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [open, setOpen] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const { idEmpresa } = useParams();
    const { idSucursal } = useParams();

    const getAllCategoriaByEmpresa = async () => {
        const categorias: Categoria[] = await CategoriaByEmpresaGetAll(Number(idEmpresa));
        setCategorias(categorias);
    };

    const getAllSucursal = async () => {
        const sucursales: Sucursal[] = await SucursalGetByEmpresaId(Number(idEmpresa));
        setSucursales(sucursales);
    };

    const createCategoria = async (categoria: Categoria) => {
        await CategoriaCreate(categoria);
        getAllCategoriaByEmpresa(); // Refresh categories after adding new one
        setOpen(false); // Close the modal after creation
    };

    const updateCategoria = async (categoria: Categoria) => {
        await CategoriaUpdate(categoria);
        getAllCategoriaByEmpresa();
    };

    const deleteCategoria = async (idCategoria: number) => {
        await CategoriaDelete(idCategoria, Number(idSucursal));
        getAllCategoriaByEmpresa();
        window.location.reload();
    };

    useEffect(() => {
        getAllCategoriaByEmpresa();
        getAllSucursal();
    }, []);

    const handleOpen = () => {
        setCurrentCategoria({ ...emptyCategoria });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenEditModal = (categoria: Categoria) => {
        setCurrentCategoria({ ...categoria });
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
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
        createCategoria(currentCategoria);
    };

    const handleUpdateCategoria = () => {
        updateCategoria(currentCategoria);
        setOpenEditModal(false);
    };

    const renderCategorias = (categorias: Categoria[], level: number = 0) => {
        return categorias.map(categoria => (
            <React.Fragment key={categoria.id}>
                <Divider />
                <ListItem sx={{ pl: level * 2 }}>
                    <ListItemText>
                        <Typography variant="body1">
                            {categoria.denominacion}
                            {categoria.esInsumo && <Chip label="Es Insumo" size="small" color="secondary" sx={{ ml: 1 }} />}
                        </Typography>
                    </ListItemText>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditModal(categoria)}>
                        <EditIcon />
                    </IconButton>
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
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom>
                    Categorías
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen} sx={{ mb: 2 }}>
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
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%', maxWidth: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Crear Categoría
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
                            Crear
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={openEditModal} onClose={handleCloseEditModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%', maxWidth: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Editar Categoría
                    </Typography>
                    <TextField
                        fullWidth
                        label="Denominación"
                        name="denominacion"
                        value={currentCategoria.denominacion}
                        onChange={handleCategoriaChange}
                        margin="normal"
                    />
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleCloseEditModal} sx={{ mr: 2 }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleUpdateCategoria}>
                            Actualizar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default CategoriaList;
