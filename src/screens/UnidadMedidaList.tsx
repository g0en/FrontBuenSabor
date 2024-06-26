import React, { useEffect, useState } from "react";
import SideBar from "../components/common/SideBar";
import UnidadMedida from "../types/UnidadMedida";
import { UnidadMedidaGetAll, UnidadMedidaCreate, UnidadMedidaUpdate, UnidadMedidaDelete } from "../services/UnidadMedidaService";
import {
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth0 } from "@auth0/auth0-react";

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };

function UnidadMedidaList() {
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const [currentUnidadMedida, setCurrentUnidadMedida] = useState<UnidadMedida>({ ...emptyUnidadMedida });
    const [isEditing, setIsEditing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [unidadToDelete, setUnidadToDelete] = useState<UnidadMedida | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    const getAllUnidadMedida = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
        try {
            const unidadMedidas: UnidadMedida[] = await UnidadMedidaGetAll(token);
            setUnidadMedidas(unidadMedidas);
        } catch (error) {
            console.log('Error al obtener las unidades de medida', error);
            toast.error('Error al obtener las unidades de medida');
        }
    };

    const createUnidadMedida = async (unidadMedida: UnidadMedida) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
              });
            await UnidadMedidaCreate(unidadMedida, token);
            toast.success('Unidad de medida creada correctamente');
        } catch (error) {
            console.log('Error al crear la unidad de medida', error);
            toast.error('Error al crear la unidad de medida');
        }

        try{
            await getAllUnidadMedida();
        }catch(error){
            console.log("Error al traer las unidades de medida.");
        }
    };

    const updateUnidadMedida = async (unidadMedida: UnidadMedida) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
              });
            await UnidadMedidaUpdate(unidadMedida, token);
            toast.success('Unidad de medida actualizada correctamente');
        } catch (error) {
            console.log('Error al actualizar la unidad de medida', error);
            toast.error('Error al actualizar la unidad de medida');
        }

        try{
            await getAllUnidadMedida();
        }catch(error){
            console.log("Error al traer las unidades de medida.");
        }
    };

    const deleteUnidadMedida = async (id: number) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
              });
            await UnidadMedidaDelete(id, token);
            toast.success('Unidad de medida eliminada correctamente');
            getAllUnidadMedida();
        } catch (error) {
            console.log('Error al eliminar la unidad de medida', error);
            //toast.error('Error al eliminar la unidad de medida');
        }

        try{
            await getAllUnidadMedida();
        }catch(error){
            console.log("Error al traer las unidades de medida.");
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
            handleCloseDialog();
        }
    };

    return (
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" component="h1" gutterBottom fontWeight={'bold'}>
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
                        color="info"
                        onClick={isEditing ? handleUpdate : handleSave}
                    >
                        {isEditing ? "Actualizar" : "Crear"}
                    </Button>
                </Box>

                <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold', maxWidth: '200px' }}>Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold', width: '120px' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {unidadMedidas.map((unidad) => (
                                <TableRow key={unidad.id}>
                                    <TableCell>{unidad.denominacion}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(unidad)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDialog(unidad)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
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
                    <Button onClick={handleCloseDialog} color="error">
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
