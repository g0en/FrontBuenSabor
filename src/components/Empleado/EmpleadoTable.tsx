import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Empleado from "../../types/Empleado";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from '@mui/icons-material/Visibility';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from "react";
import EmpleadoAddModal from "./EmpleadoAddModal";
import EmpleadoViewModal from "./EmpleadoViewModal";
import { EmpleadoUpdate } from "../../services/EmpleadoService";
import { useAuth0 } from "@auth0/auth0-react";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

interface EmpleadoTableProps {
    onClose: () => void;
    empleado: Empleado;
}

const EmpleadoTable: React.FC<EmpleadoTableProps> = ({ onClose, empleado }) => {
    const [view, setView] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const handleEdit = () => {
        setEditOpen(true);
    }

    const handleBaja = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        try {
            if (empleado.id !== null) {
                empleado.eliminado = true;
                await EmpleadoUpdate(empleado, token);
            }
        } catch (error) {
            console.log("Error al eliminar el empleado");
        }

        handleClose();
    }

    const handleAlta = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        try {
            if (empleado.id !== null) {
                empleado.eliminado = false;
                await EmpleadoUpdate(empleado, token);
            }
        } catch (error) {
            console.log("Error al eliminar el empleado");
        }

        handleClose();
    }

    const handleView = () => {
        setView(true);
    }

    const handleClose = () => {
        setEditOpen(false);
        setView(false);
        onClose();
    }

    return (
        <>
            <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px', marginTop: '20px' }}>
                <Table >
                    <TableHead >
                        <TableRow>
                            <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Nombre</TableCell>
                            <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Apellido</TableCell>
                            <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Rol</TableCell>
                            <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Estado</TableCell>
                            <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{ backgroundColor: !empleado.eliminado ? "none" : "#B0B0B0" }}>
                            <TableCell align="center">{empleado.nombre}</TableCell>
                            <TableCell align="center">{empleado.apellido}</TableCell>
                            <TableCell align="center">{empleado.usuario.rol}</TableCell>
                            <TableCell align="center">{empleado.eliminado ? 'Inactivo' : 'Activo'}</TableCell>
                            <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">
                                <Box sx={{ marginLeft: 'auto' }}>
                                    {
                                        !empleado.eliminado ?
                                            <>
                                                <IconButton onClick={handleEdit} color="primary"><EditIcon /></IconButton>
                                                <IconButton onClick={handleView} color="secondary"><Visibility /></IconButton>
                                                <IconButton onClick={handleBaja} color="error"><RemoveCircleOutlineIcon /></IconButton>
                                            </>
                                            :
                                            <>
                                                <IconButton onClick={handleView} color="secondary"><Visibility /></IconButton>
                                                <IconButton onClick={handleAlta} color="success"><KeyboardDoubleArrowUpIcon /></IconButton>
                                            </>
                                    }
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <EmpleadoAddModal open={editOpen} onClose={handleClose} empleado={empleado} />
                <EmpleadoViewModal open={view} onClose={handleClose} empleado={empleado} />
            </TableContainer>
        </>
    );
}

export default EmpleadoTable;