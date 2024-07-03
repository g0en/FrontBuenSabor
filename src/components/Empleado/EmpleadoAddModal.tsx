import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, IconButton, Modal, Box, Typography, Grid } from '@mui/material';
import Empleado from "../../types/Empleado";
import { Rol } from '../../types/enums/Rol';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import { EmpleadoCreate, EmpleadoUpdate } from '../../services/EmpleadoService';

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

interface EmpleadoTableProps {
    open: boolean;
    onClose: () => void;
    empleado: Empleado;
}

const EmpleadoAddModal: React.FC<EmpleadoTableProps> = ({ open, onClose, empleado }) => {
    const [step, setStep] = useState(1);
    const [currentEmpleado, setCurrentEmpleado] = useState<Empleado>(empleado);
    const { idSucursal } = useParams();
    const { getAccessTokenSilently } = useAuth0();

    const createEmpleado = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return await EmpleadoCreate(currentEmpleado, token);
    }

    const updateEmpleado = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return await EmpleadoUpdate(currentEmpleado, token);
    }

    useEffect(() => {
        setCurrentEmpleado(empleado);
    }, [empleado]);

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleClose = () => {
        onClose();
        setStep(1);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCurrentEmpleado(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUsuarioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCurrentEmpleado(prevState => ({
            ...prevState,
            usuario: {
                ...prevState.usuario,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        if (currentEmpleado.sucursal !== null) {
            currentEmpleado.sucursal.id = Number(idSucursal);
        }
        if (currentEmpleado.id !== null && currentEmpleado.id > 0) {
            try {
                const data = await updateEmpleado();
                if (data.status !== 200) {
                    return;
                }
            } catch (error) {
                console.log("Error al actualizar un empleado.");
            }
        } else {
            try {
                const data = await createEmpleado();
                if (data.status !== 200) {
                    return;
                }
            } catch (error) {
                console.log("Error al crear un empleado.");
            }
        }

        handleClose();
    }

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
                    {empleado.id !== null && empleado.id > 0 ?
                        <Typography variant="h6" gutterBottom>
                            Actualizar Empleado
                        </Typography>
                        :
                        <Typography variant="h6" gutterBottom>
                            Agregar Empleado
                        </Typography>
                    }

                    {step === 1 ? (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nombre"
                                        name="nombre"
                                        value={currentEmpleado.nombre}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Apellido"
                                        name="apellido"
                                        value={currentEmpleado.apellido}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Teléfono"
                                        name="telefono"
                                        value={currentEmpleado.telefono}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Fecha de Nacimiento"
                                        name="fechaNacimiento"
                                        value={currentEmpleado.fechaNacimiento}
                                        type="date"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button disabled onClick={handleBack} color="secondary" variant="contained">
                                    Atrás
                                </Button>
                                <Button onClick={handleNext} color="primary" variant="contained">
                                    Siguiente
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <TextField
                                label="Email"
                                name="email"
                                value={currentEmpleado.usuario.email}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                onChange={handleUsuarioChange}
                            />

                            <Grid container spacing={2} mb={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Username"
                                        name="userName"
                                        value={currentEmpleado.usuario.userName}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        onChange={handleUsuarioChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Rol"
                                        name="rol"
                                        value={currentEmpleado.usuario.rol}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        select
                                        onChange={handleUsuarioChange}
                                    >
                                        <MenuItem key={1} value={Rol.ADMIN}>
                                            Administrador
                                        </MenuItem>
                                        <MenuItem key={2} value={Rol.CAJERO}>
                                            Cajero
                                        </MenuItem>
                                        <MenuItem key={3} value={Rol.COCINERO}>
                                            Cocinero
                                        </MenuItem>
                                        <MenuItem key={4} value={Rol.DELIVERY}>
                                            Delivery
                                        </MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>

                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button onClick={handleBack} color="secondary" variant="contained">
                                    Atrás
                                </Button>
                                <Button onClick={handleSubmit} color="primary" variant="contained">
                                    {empleado.id !== null && empleado.id > 0 ? "Actualizar Empleado" : "Crear Empleado"}
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default EmpleadoAddModal;