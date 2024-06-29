import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails, IconButton, Typography, Box, Chip, Button, Modal, TextField, FormControlLabel, Checkbox, TableCell, TableBody, Table, TableContainer, TableRow, TableHead, Paper, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SideBar from "../components/common/SideBar";
import CategoriaGetDto from "../types/CategoriaGetDto";
import { CategoriaByEmpresaGetAll, CategoriaCreate, CategoriaUpdate, CategoriaBaja, CategoriaDelete } from "../services/CategoriaService";
import AddIcon from "@mui/icons-material/Add";
import Sucursal from "../types/Sucursal";
import Categoria from "../types/Categoria";
import { SucursalGetByEmpresaId } from "../services/SucursalService";

const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

function CategoriaList() {
    const [categorias, setCategorias] = useState<CategoriaGetDto[]>([]);
    const { idEmpresa, idSucursal } = useParams();
    const [currentCategoria, setCurrentCategoria] = useState<Categoria>({ ...emptyCategoria });
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [open, setOpen] = useState(false);

    const getAllCategoriaBySucursal = async () => {
        const categorias: CategoriaGetDto[] = await CategoriaByEmpresaGetAll(Number(idSucursal));
        setCategorias(categorias);
    };

    useEffect(() => {
        getAllCategoriaBySucursal();
        getAllSucursal();
    }, [idEmpresa, idSucursal]);

    const getAllSucursal = async () => {
        const sucursales: Sucursal[] = await SucursalGetByEmpresaId(Number(idEmpresa));
        setSucursales(sucursales);
    };

    const createCategoria = async (categoria: Categoria) => {
        await CategoriaCreate(categoria);
        getAllCategoriaBySucursal();
        setOpen(false); // Close the modal after creation
    };

    const updateCategoria = async (categoria: Categoria) => {
        await CategoriaUpdate(categoria);
        getAllCategoriaBySucursal();
        setOpen(false); // Close the modal after update
    };

    const bajaCategoria = async (idCategoria: number) => {
        await CategoriaBaja(idCategoria, Number(idSucursal));
        getAllCategoriaBySucursal();
        window.location.reload();
    };

    const deleteCategoria = async (idCategoria: number) => {
        await CategoriaDelete(idCategoria);
        getAllCategoriaBySucursal();
        window.location.reload();
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

    const handleEdit = (categoria: Categoria | CategoriaGetDto) => {
        setCurrentCategoria(categoria);
        setOpen(true);
    }

    const handleDelete = (categoria: Categoria | CategoriaGetDto) => {
        if (categoria.id !== null) {
            deleteCategoria(categoria.id);
        }
    }

    const handleBaja = (categoria: Categoria | CategoriaGetDto) => {
        if (categoria.id !== null) {
            bajaCategoria(categoria.id);
        }
    }

    const handleSubmit = () => {
        if (currentCategoria.id === null) {
            createCategoria(currentCategoria);
        } else {
            if (currentCategoria.subCategorias !== null) {
                let subcategorias: Categoria[] = currentCategoria.subCategorias;
                for (let i = 0; i < subcategorias.length; i++) {
                    subcategorias[i].sucursales = currentCategoria.sucursales;
                }
            }
            updateCategoria(currentCategoria);
        }


    };

    const handleOpen = () => {
        setCurrentCategoria(emptyCategoria);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentCategoria(emptyCategoria);
    };

    const filterSubCategoriasBySucursal = (subCategorias: CategoriaGetDto[] | null, idSucursal: number) => {
        return subCategorias ? subCategorias.filter(subCategoria =>
            subCategoria.sucursales?.some(sucursal => sucursal.id === idSucursal)
        ) : [];
    };

    const renderSubCategorias = (subCategorias: CategoriaGetDto[] | null) => {
        const filteredSubCategorias = filterSubCategoriasBySucursal(subCategorias, Number(idSucursal));
        return filteredSubCategorias.filter(subCategoria => !subCategoria.eliminado).map((subCategoria) => (
            <Box key={subCategoria.id} sx={{ paddingLeft: 1 }}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{subCategoria.denominacion}</Typography>
                        <Box sx={{ marginLeft: 'auto' }}>
                            <IconButton onClick={() => handleEdit(subCategoria)}><EditIcon /></IconButton>
                            <IconButton onClick={() => handleBaja(subCategoria)}><ArrowCircleDownIcon /></IconButton>
                            <IconButton onClick={() => handleDelete(subCategoria)}><DeleteIcon /></IconButton>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderSubCategorias(subCategoria.subCategorias)}
                    </AccordionDetails>
                </Accordion>
            </Box>
        ));
    };

    return (
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Categorías
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                    Agregar Categoría
                </Button>

                <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px', marginTop: '20px' }}>
                    <Table >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }}>Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categorias.filter(categoria => categoria.categoriaPadre === null && !categoria.eliminado).map((categoria) => (
                                <Accordion key={categoria.id}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>{categoria.denominacion}{
                                            categoria.esInsumo ?
                                                <Chip label="Insumo" size="small" color="secondary" sx={{ ml: 1 }} /> :
                                                <Chip label="Manufacturado" size="small" color="error" sx={{ ml: 1 }} />
                                        }</Typography>
                                        <Box sx={{ marginLeft: 'auto' }}>
                                            <IconButton onClick={() => handleEdit(categoria)} color="primary">{categoria.sucursales !== null && <EditIcon />}</IconButton>
                                            <IconButton onClick={() => handleBaja(categoria)} color="secondary"><ArrowCircleDownIcon /></IconButton>
                                            <IconButton onClick={() => handleDelete(categoria)} color="error"><DeleteIcon /></IconButton>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {renderSubCategorias(categoria.subCategorias)}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 700, maxHeight: '80vh', bgcolor: 'background.paper', boxShadow: 24, p: 4, overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>
                        {currentCategoria.id === null ? 'Crear Categoría' : 'Editar Categoría'}
                    </Typography>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                label="Denominación"
                                name="denominacion"
                                value={currentCategoria.denominacion}
                                onChange={handleCategoriaChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={4} container justifyContent="center" alignItems="center">
                            {currentCategoria.id !== null ?
                                <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={currentCategoria.esInsumo}
                                                onChange={handleEsInsumoChange}
                                                name="esInsumo"
                                                color="primary"
                                                disabled={currentCategoria.id !== null}
                                            />
                                        }
                                        label="Es Insumo"
                                    />
                                </div>
                                :
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
                            }
                        </Grid>
                    </Grid>

                    <Box mb={2}>
                        <Typography variant="subtitle1" gutterBottom>
                            Selecciona la/s sucursales:
                        </Typography>
                        {
                            currentCategoria.id !== null ?
                                <div>
                                    <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
                                        {sucursales.map(sucursal => (
                                            <FormControlLabel
                                                key={sucursal.id}
                                                control={
                                                    <Checkbox
                                                        checked={currentCategoria.sucursales?.some(s => s.id === sucursal.id) || false}
                                                        onChange={() => handleSucursalChange(sucursal.id)}
                                                        color="primary"
                                                        disabled={currentCategoria.sucursales?.some(s => s.id === sucursal.id) || false}
                                                    />
                                                }
                                                label={sucursal.nombre}
                                            />
                                        ))}
                                    </div>
                                </div>
                                :
                                <div>
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
                                </div>
                        }
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" gutterBottom>
                            Agregar Subcategorías
                        </Typography>
                        <Button variant="outlined" color="primary" onClick={handleAddSubCategoria} style={{ marginLeft: 10 }}>
                            Agregar
                        </Button>
                    </Box>
                    {currentCategoria.subCategorias && currentCategoria.subCategorias.map((subCategoria, index) => (
                        <Box key={index} display="flex" alignItems="center" mt={2}>
                            <TextField
                                label="Denominación"
                                value={subCategoria.denominacion}
                                onChange={(e) => handleSubCategoriaChange(index, e.target.value)}
                                margin="normal"
                            />
                            {
                                subCategoria.id === null &&
                                <IconButton color="secondary" onClick={() => handleRemoveSubCategoria(index)}>
                                    <CloseIcon />
                                </IconButton>
                            }
                        </Box>
                    ))}
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="error" onClick={handleClose} sx={{ mr: 2 }}>
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