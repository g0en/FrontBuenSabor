import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TipoPromocion } from '../../types/enums/TipoPromocion';
import Promocion from '../../types/Promocion';

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

const emptyPromocion = {
    id: 0, eliminado: false, denominacion: '', fechaDesde: '', fechaHasta: '', horaDesde: '', horaHasta: '', descripcionDescuento: '', precioPromocional: 0, tipoPromocion: null, imagenes: [], sucursales: [], promocionDetalle: [] }

interface AddPromocionModalProps {
    open: boolean;
    onClose: () => void;
}

const AddPromocionModal: React.FC<AddPromocionModalProps> = ({ open, onClose }) => {
    const [step, setStep] = useState(1);
    const [promocion, setPromocion] = useState<Promocion>(emptyPromocion);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);
    const handleClose = () => setStep(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPromocion({ ...promocion, [name]: value });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                    Agregar Promoción
                </Typography>
                {step === 1 && (
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="denominacion"
                                    value={promocion.denominacion}
                                    onChange={handleChange}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Tipo de Promoción"
                                    name="tipoPromocion"
                                    value={promocion.tipoPromocion}
                                    onChange={handleChange}
                                    margin="normal"
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value={TipoPromocion.HAPPY_HOUR}>Happy Hour</option>
                                    <option value={TipoPromocion.PROMOCION}>Promoción</option>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha Desde"
                                    type="date"
                                    name="fechaDesde"
                                    value={promocion.fechaDesde}
                                    onChange={handleChange}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha Hasta"
                                    type="date"
                                    name="fechaHasta"
                                    value={promocion.fechaHasta}
                                    onChange={handleChange}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Hora Desde"
                                    type="time"
                                    name="horaDesde"
                                    value={promocion.horaDesde}
                                    onChange={handleChange}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Hora Hasta"
                                    type="time"
                                    name="horaHasta"
                                    value={promocion.horaHasta}
                                    onChange={handleChange}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>


                        <Box mt={2}>
                            <Button variant="contained" onClick={handleNext}>
                                Siguiente
                            </Button>
                        </Box>
                    </>
                )}
                {step === 2 && (
                    <>
                        <TextField
                            fullWidth
                            label="Descripción"
                            name="descripcion"
                            value={promocion.descripcionDescuento}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button variant="contained" color='secondary' onClick={handleBack}>
                                Atrás
                            </Button>
                            <Button variant="contained" onClick={handleNext}>
                                Siguiente
                            </Button>
                        </Box>
                    </>
                )}
                {step === 3 && (
                    <>
                        <TextField
                            fullWidth
                            label="Buscar Artículos"
                            name="buscarArticulos"
                            onChange={handleChange}
                            margin="normal"
                        />
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button variant="contained" color='secondary' onClick={handleBack}>
                                Atrás
                            </Button>
                            <Button variant="contained" onClick={() => {
                                // Lógica para crear la promoción
                                handleClose();
                            }}>
                                Crear Promoción
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default AddPromocionModal;
