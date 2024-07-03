import { Box, Button, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import SideBar from "../components/common/SideBar";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EmpleadoTable from "../components/Empleado/EmpleadoTable";
import { useParams } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import Empleado from "../types/Empleado";
import { EmpleadoGetBySucursal } from "../services/EmpleadoService";
import EmpleadoAddModal from "../components/Empleado/EmpleadoAddModal";

const emptyEmpleado: Empleado = {
    id: null,
    eliminado: false,
    sucursal: {
        id: 0,
        eliminado: false,
        nombre: ""
    },
    nombre: "",
    apellido: "",
    telefono: "",
    fechaNacimiento: "",
    usuario: {
        id: null,
        eliminado: false,
        email: "",
        userName: "",
        rol: null
    },
}

function EmpleadosList() {
    const { idSucursal } = useParams();
    const [empleado, setEmpleado] = useState<Empleado>({ ...emptyEmpleado });
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [open, setOpen] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const getEmpleadosBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const empleados: Empleado[] = await EmpleadoGetBySucursal(Number(idSucursal), token);
        setEmpleados(empleados);
    }

    const handleOpen = () => {
        setEmpleado({ ...emptyEmpleado }); // Reset employee state when opening modal
        setOpen(true);
    }

    const handleClose = async () => {
        try{
            await getEmpleadosBySucursal();
        }catch(error){
            console.log("Error al traer los empleados.");
        }
        setOpen(false);
    }

    useEffect(() => {
        getEmpleadosBySucursal();
    }, [idSucursal]);

    return (
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Empleados
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                    Agregar Empleado
                </Button>
                {
                    empleados.length <= 0 ?
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
                            </Table>
                        </TableContainer>
                        :
                    empleados.map(empleado =>
                            <EmpleadoTable onClose={handleClose} empleado={empleado} />
                        )
                }
            </Box>
            <EmpleadoAddModal open={open} onClose={handleClose} empleado={empleado} />
        </>
    )
}

export default EmpleadosList;