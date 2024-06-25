import { useEffect, useState } from "react";
import SideBar from "../components/common/SideBar";
import UnidadMedida from "../types/UnidadMedida";
import { UnidadMedidaGetAll, UnidadMedidaCreate, UnidadMedidaUpdate, UnidadMedidaDelete } from "../services/UnidadMedidaService";
import { Container, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const MySwal = withReactContent(Swal);

function UnidadMedidaList() {
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const [currentUnidadMedida, setCurrentUnidadMedida] = useState<UnidadMedida>({ ...emptyUnidadMedida });
    const [isEditing, setIsEditing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [unidadToDelete, setUnidadToDelete] = useState<UnidadMedida | null>(null);

    const getAllUnidadMedida = async () => {
        const unidadMedidas: UnidadMedida[] = await UnidadMedidaGetAll();
        setUnidadMedidas(unidadMedidas);
    };

    const createUnidadMedida = async (unidadMedida: UnidadMedida) => {
        try {
            await UnidadMedidaCreate(unidadMedida);
            MySwal.fire({
                title: 'Creado!',
                text: 'Unidad de medida creada con éxito',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            getAllUnidadMedida();
        } catch (error) {
            toast.error('Error al crear la unidad de medida');
        }
    };

    const updateUnidadMedida = async (unidadMedida: UnidadMedida) => {
        try {
            await UnidadMedidaUpdate(unidadMedida);
            MySwal.fire({
                title: 'Actualizado!',
                text: 'Unidad de medida actualizada con éxito',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            getAllUnidadMedida();
        } catch (error) {
            toast.error('Error al actualizar la unidad de medida');
        }
    };

    const deleteUnidadMedida = async (id: number) => {
        try {
            await UnidadMedidaDelete(id);
            MySwal.fire({
                title: 'Eliminado!',
                text: 'Unidad de medida eliminada con éxito',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            getAllUnidadMedida();
        } catch (error) {
           console.log('Error al eliminar la unidad de medida');
        }
    };

    useEffect(() => {
        getAllUnidadMedida();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentUnidadMedida({ ...currentUnidadMedida, denominacion: event.target.value });
    };

    const handleSave = () => {
        if (!currentUnidadMedida.denominacion.trim()) {
            toast.error('Este campo no puede estar vacío');
            return;
        }
        createUnidadMedida(currentUnidadMedida);
        setCurrentUnidadMedida({ ...emptyUnidadMedida });
    };

    const handleUpdate = () => {
        if (!currentUnidadMedida.denominacion.trim()) {
            toast.error('Este campo no puede estar vacío');
            return;
        }
        updateUnidadMedida(currentUnidadMedida);
        setCurrentUnidadMedida({ ...emptyUnidadMedida });
        setIsEditing(false);
    };

    const handleEdit = (unidad: UnidadMedida) => {
        setCurrentUnidadMedida(unidad);
        setIsEditing(true);
    };

    const handleOpenDialog = (unidad: UnidadMedida) => {
        setUnidadToDelete(unidad);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setUnidadToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (unidadToDelete) {
                await deleteUnidadMedida(unidadToDelete.id);
                await getAllUnidadMedida(); // Asegúrate de actualizar la lista después de la eliminación
                toast.success('Unidad de medida eliminada correctamente');
        }
        handleCloseDialog();
    };

    return (
        <>
            <SideBar />
            <Container>
                <Typography variant="h5" component="h1" gutterBottom>
                    Unidades de Medida
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                    <TextField
                        label="Denominación"
                        value={currentUnidadMedida.denominacion}
                        onChange={handleInputChange}
                        margin="normal"
                        style={{ marginRight: '8px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={isEditing ? handleUpdate : handleSave}
                    >
                        {isEditing ? "Actualizar" : "Crear"}
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {unidadMedidas.map((unidad) => (
                                <TableRow key={unidad.id}>
                                    <TableCell>{unidad.denominacion}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(unidad)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDialog(unidad)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <ToastContainer />

            {/* Dialog de confirmación */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro que desea eliminar esta unidad de medida?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UnidadMedidaList;