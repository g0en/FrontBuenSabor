import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useAuth0 } from "@auth0/auth0-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Sucursal from "../../types/Sucursal";
import { SucursalCreate, SucursalUpdate } from "../../services/SucursalService";
import Provincia from "../../types/Provincia";
import Localidad from "../../types/Localidad";
import { ProvinciaGetAll } from "../../services/ProvinciaService";
import { LocalidadGetAllByProvincia } from "../../services/LocalidadService";
import { PaisGetAll } from "../../services/PaisService";
import Pais from "../../types/Pais";
import { EmpresaGetById } from "../../services/EmpresaService";
import Empresa from "../../types/Empresa";
import { useParams } from "react-router-dom";

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '750px',
    maxHeight: '90vh',
    overflowY: 'auto' as 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface EmpresaCardProps {
    open: boolean;
    onClose: () => void;
    sucursal: Sucursal;
}

const MySwal = withReactContent(Swal);

const SucursalModal: React.FC<EmpresaCardProps> = ({ open, onClose, sucursal }) => {
    const [currentSucursal, setCurrentSucursal] = useState<Sucursal>(sucursal);
    const [currentEmpresa, setCurrentEmpresa] = useState<Empresa>();
    const [paises, setPaises] = useState<Pais[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [selectedPais, setSelectedPais] = useState<number | null>(null);
    const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
    const [selectedLocalidad, setSelectedLocalidad] = useState<number | null>(null);
    const [estado, setEstado] = useState(currentSucursal.esCasaMatriz);
    const { idEmpresa } = useParams();

    const { getAccessTokenSilently } = useAuth0();

    const createSucursal = async (sucursal: Sucursal) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        await SucursalCreate(sucursal, token);
        return MySwal.fire({
            title: 'Empresa creada',
            text: 'La empresa se ha creado correctamente',
            icon: 'success',
            showConfirmButton: true,
            timer: 2000,
            timerProgressBar: true,
        });
    };

    const updateSucursal = async (sucursal: Sucursal) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        await SucursalUpdate(sucursal, token);
        return MySwal.fire({
            title: 'Empresa actualizada',
            text: 'La empresa se ha actualizado correctamente',
            icon: 'success',
            showConfirmButton: true,
            timer: 2000,
            timerProgressBar: true,
        });
    };

    const getAllProvincias = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        const provincias: Provincia[] = await ProvinciaGetAll(token);
        setProvincias(provincias);
    }

    const getLocalidadesByProvincias = async (id: number) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const localidades: Localidad[] = await LocalidadGetAllByProvincia(id, token);
        return localidades;
    }

    const getAllPaises = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const paises: Pais[] = await PaisGetAll(token);
        setPaises(paises);
    }

    const getEmpresaById = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        const empresa: Empresa = await EmpresaGetById(Number(idEmpresa), token);
        setCurrentEmpresa(empresa);
    }

    useEffect(() => {
        const fetchData = async () => {
            await getAllProvincias();
            await getAllPaises();
            if (sucursal.id > 0) {
                if (sucursal.domicilio.localidad) {
                    setSelectedPais(sucursal.domicilio.localidad.provincia.pais.id);
                    setSelectedProvincia(sucursal.domicilio.localidad.provincia.id);
                    const localidades: Localidad[] = await getLocalidadesByProvincias(sucursal.domicilio.localidad.provincia.id);
                    setLocalidades(localidades);
                    setSelectedLocalidad(sucursal.domicilio.localidad.id);
                }
            } else {
                await getEmpresaById();
                setSelectedProvincia(null);
                setSelectedLocalidad(null);
            }
        };

        fetchData();
    }, []);

    const handlePaisChange = async (e: SelectChangeEvent<number>) => {
        const paisId = e.target.value as number;
        setSelectedPais(paisId);
        setSelectedProvincia(null);
        setSelectedLocalidad(null);
        setCurrentSucursal(prev => ({
            ...prev,
            domicilio: { ...prev.domicilio, localidad: null }
        }));
    };

    const handleProvinciaChange = async (e: SelectChangeEvent<number>) => {
        const provinciaId = e.target.value as number;
        setSelectedProvincia(provinciaId);
        setSelectedLocalidad(null);
        const localidades: Localidad[] = await getLocalidadesByProvincias(provinciaId);
        setLocalidades(localidades);
        setCurrentSucursal(prev => ({
            ...prev,
            domicilio: { ...prev.domicilio, localidad: null }
        }));
    };

    const handleLocalidadChange = (e: SelectChangeEvent<number>) => {
        const localidadId = e.target.value as number;
        const localidad = localidades.find(l => l.id === localidadId) || null;
        setSelectedLocalidad(localidadId);
        setCurrentSucursal(prev => ({
            ...prev,
            domicilio: { ...prev.domicilio, localidad }
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setCurrentSucursal(prev => ({ ...prev, [name]: checked }));
    };

    const handleClose = () => {
        setCurrentSucursal(sucursal);
        setEstado(sucursal.esCasaMatriz);
        if (sucursal.id <= 0) {
            setSelectedPais(null);
            setSelectedLocalidad(null);
            setSelectedProvincia(null);
        }
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in currentSucursal.domicilio) {
            setCurrentSucursal(prev => ({
                ...prev,
                domicilio: { ...prev.domicilio, [name]: value }
            }));
        } else {
            setCurrentSucursal(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        if (currentSucursal.id > 0) {
            try {
                await updateSucursal(currentSucursal);
            } catch (error) {
                console.log("Error al actualizar la sucursal.");
            }
        } else {
            try {
                currentSucursal.empresa = currentEmpresa ?? null;
                await createSucursal(currentSucursal);
            } catch (error) {
                console.log("Error al crear la sucursal.");
            }
        }

        handleClose();
    };

    return (
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
                <Typography variant="h6" gutterBottom mb={2}>
                    {currentSucursal.id > 0 ? 'Actualizar Sucursal' : 'Crear Sucursal'}
                </Typography>
                <Box mb={2}>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        name="nombre"
                        fullWidth
                        value={currentSucursal.nombre}
                        onChange={handleChange}
                    />
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                label="Horario Apertura"
                                type="time"
                                name="horarioApertura"
                                fullWidth
                                value={currentSucursal.horarioApertura}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                label="Horario de Cierre"
                                name="horarioCierre"
                                type="time"
                                fullWidth
                                value={currentSucursal.horarioCierre}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="Calle"
                                name="calle"
                                fullWidth
                                value={currentSucursal.domicilio.calle}
                                onChange={handleChange}
                                disabled={!!currentSucursal.id}
                            />

                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin="dense"
                                label="Número"
                                name="numero"
                                fullWidth
                                value={currentSucursal.domicilio.numero}
                                onChange={handleChange}
                                disabled={!!currentSucursal.id}
                            />

                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin="dense"
                                label="Código Postal (CP)"
                                name="cp"
                                fullWidth
                                value={currentSucursal.domicilio.cp}
                                onChange={handleChange}
                                disabled={!!currentSucursal.id}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                label="Piso"
                                name="piso"
                                fullWidth
                                value={currentSucursal.domicilio.piso}
                                onChange={handleChange}
                                disabled={!!currentSucursal.id}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                label="Número de Departamento"
                                name="nroDpto"
                                fullWidth
                                value={currentSucursal.domicilio.nroDpto}
                                onChange={handleChange}
                                disabled={!!currentSucursal.id}
                            />
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={currentSucursal.esCasaMatriz}
                                        onChange={handleCheckboxChange}
                                        name="esCasaMatriz"
                                        disabled={!estado}
                                    />
                                }
                                label="Casa Matriz"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Select
                                fullWidth
                                value={selectedPais || ''}
                                onChange={handlePaisChange}
                                displayEmpty
                                disabled={!!currentSucursal.id}
                            >
                                <MenuItem value="" disabled>Seleccione un País</MenuItem>
                                {paises.map(pais => (
                                    <MenuItem key={pais.id} value={pais.id}>
                                        {pais.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <Select
                                fullWidth
                                value={selectedProvincia || ''}
                                onChange={handleProvinciaChange}
                                displayEmpty
                                disabled={!selectedPais || !!currentSucursal.id}
                            >
                                <MenuItem value="" disabled>Seleccione una Provincia</MenuItem>
                                {provincias.map(provincia => (
                                    <MenuItem key={provincia.id} value={provincia.id}>
                                        {provincia.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <Select
                                fullWidth
                                value={selectedLocalidad || ''}
                                onChange={handleLocalidadChange}
                                displayEmpty
                                disabled={!selectedProvincia || !!currentSucursal.id}
                            >
                                <MenuItem value="" disabled>Seleccione una Localidad</MenuItem>
                                {localidades.map(localidad => (
                                    <MenuItem key={localidad.id} value={localidad.id}>
                                        {localidad.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </Box>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button onClick={handleSave} variant="contained" color="primary">{sucursal.id > 0 ? 'Actualizar' : 'Guardar'}</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default SucursalModal;