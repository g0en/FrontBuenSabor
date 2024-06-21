import { useEffect, useState } from "react";
import { SucursalCreate, SucursalGetByEmpresaId, SucursalUpdate } from "../services/SucursalService";
import { ProvinciaGetAll } from "../services/ProvinciaService";
import { LocalidadGetAllByProvincia } from "../services/LocalidadService";
import { EmpresaGetById } from "../services/EmpresaService";
import Sucursal from "../types/Sucursal";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardActions, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography, Checkbox, FormControlLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Provincia from "../types/Provincia";
import Localidad from "../types/Localidad";
import Empresa from "../types/Empresa";

const emptyEmpresa = { id: 0, eliminado: false, nombre: '', razonSocial: '', cuil: 0 };

const emptySucursal = {
    id: 0,
    eliminado: false,
    nombre: '',
    horarioApertura: '',
    horarioCierre: '',
    esCasaMatriz: false,
    domicilio: { id: 0, eliminado: false, calle: '', numero: 0, cp: 0, piso: 0, nroDpto: 0, localidad: null },
    empresa: emptyEmpresa
};

function SucursalList() {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [open, setOpen] = useState(false);
    const [currentSucursal, setCurrentSucursal] = useState<Sucursal>({ ...emptySucursal });
    const [currentEmpresa, setCurrentEmpresa] = useState<Empresa>(emptyEmpresa);
    const [hasCasaMatriz, setHasCasaMatriz] = useState(false);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
    const [selectedLocalidad, setSelectedLocalidad] = useState<number | null>(null);
    const navigate = useNavigate();
    const { idEmpresa } = useParams();

    const getAllSucursal = async () => {
        const sucursales: Sucursal[] = await SucursalGetByEmpresaId(Number(idEmpresa));
        setSucursales(sucursales);
        setHasCasaMatriz(sucursales.some(sucursal => sucursal.esCasaMatriz));
    };

    const createSucursal = async (sucursal: Sucursal) => {
       await SucursalCreate(sucursal);
    }

    const updateSucursal = async (sucursal: Sucursal) => {
        await SucursalUpdate(sucursal);
    }

    const getAllProvincias = async() =>{
        const provincias: Provincia[] = await ProvinciaGetAll();
        setProvincias(provincias);
    }

    const getLocalidadesByProvincias = async (id:number) =>{
        const localidades: Localidad[] = await LocalidadGetAllByProvincia(id);
        return localidades;
    }

    const getEmpresaById = async (id:number) => {
        const empresa: Empresa = await EmpresaGetById(id);
        setCurrentEmpresa(empresa);
    }

    useEffect(() => {
        getAllSucursal();
        getEmpresaById(Number(idEmpresa));
    }, []);

    const redirectDashboard = (id: number) => {
        navigate('/dashboard/' + idEmpresa + "/" + id);
    } 

    const handleOpen = (sucursal?: Sucursal) => {
        if (sucursal) {
            setCurrentSucursal(sucursal);
            if (sucursal.domicilio.localidad) {
                setSelectedProvincia(sucursal.domicilio.localidad.provincia.id);
                getLocalidadesByProvincias(sucursal.domicilio.localidad.provincia.id);
                setSelectedLocalidad(sucursal.domicilio.localidad.id);
            }
        } else {
            setCurrentSucursal({ ...emptySucursal });
            setSelectedProvincia(null);
            setSelectedLocalidad(null);
        }
        getAllProvincias();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentSucursal({ ...emptySucursal });
        setSelectedProvincia(null);
        setSelectedLocalidad(null);
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

    const handleSave = () => {
        if (currentSucursal.id > 0) {
            updateSucursal(currentSucursal);
        } else {
            currentSucursal.empresa = currentEmpresa;
            createSucursal(currentSucursal);
        }
        handleClose();
        window.location.reload();
    };

    return (
        <>
            <Typography variant="h4" component="h4">
                Seleccione una Sucursal
            </Typography><br />
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>Agregar nueva Sucursal</Button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                {sucursales.map((sucursal) => (
                    <Card key={sucursal.id} style={{ width: '300px' }}>
                        <CardHeader
                            title={sucursal.nombre}
                            subheader={`${sucursal.domicilio.calle} ${sucursal.domicilio.numero}, ${sucursal.domicilio.cp}, ${sucursal.domicilio.localidad?.nombre}, ${sucursal.domicilio.localidad?.provincia.nombre}`}
                        />
                        <CardActions>
                            Casa Matriz: {sucursal.esCasaMatriz ? <CheckIcon /> : <CloseIcon />}
                            <Tooltip title="Editar">
                                <IconButton onClick={() => handleOpen(sucursal)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Ver">
                            <Button variant="contained" color="success" sx={{height: "40px", width:"50px"}} onClick={() => redirectDashboard(sucursal.id)}>
                                    <VisibilityIcon /> Ver
                                </Button>
                            </Tooltip>
                        </CardActions>
                    </Card>
                ))}
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentSucursal.id ? "Editar Sucursal" : "Crear Sucursal"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        name="nombre"
                        fullWidth
                        value={currentSucursal.nombre}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Horario de Apertura"
                        name="horarioApertura"
                        fullWidth
                        value={currentSucursal.horarioApertura}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Horario de Cierre"
                        name="horarioCierre"
                        fullWidth
                        value={currentSucursal.horarioCierre}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Calle"
                        name="calle"
                        fullWidth
                        value={currentSucursal.domicilio.calle}
                        onChange={handleChange}
                        disabled={!!currentSucursal.id}
                    />
                    <TextField
                        margin="dense"
                        label="Número"
                        name="numero"
                        fullWidth
                        value={currentSucursal.domicilio.numero}
                        onChange={handleChange}
                        disabled={!!currentSucursal.id}
                    />
                    <TextField
                        margin="dense"
                        label="Código Postal (CP)"
                        name="cp"
                        fullWidth
                        value={currentSucursal.domicilio.cp}
                        onChange={handleChange}
                        disabled={!!currentSucursal.id}
                    />
                    <TextField
                        margin="dense"
                        label="Piso"
                        name="piso"
                        fullWidth
                        value={currentSucursal.domicilio.piso}
                        onChange={handleChange}
                        disabled={!!currentSucursal.id}
                    />
                    <TextField
                        margin="dense"
                        label="Número de Departamento"
                        name="nroDpto"
                        fullWidth
                        value={currentSucursal.domicilio.nroDpto}
                        onChange={handleChange}
                        disabled={!!currentSucursal.id}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={currentSucursal.esCasaMatriz}
                                onChange={handleCheckboxChange}
                                name="esCasaMatriz"
                                disabled={hasCasaMatriz && !currentSucursal.esCasaMatriz}
                            />
                        }
                        label="Casa Matriz"
                    />
                    <Select
                        fullWidth
                        value={selectedProvincia || ''}
                        onChange={handleProvinciaChange}
                        displayEmpty
                        disabled={!!currentSucursal.id}
                    >
                        <MenuItem value="" disabled>Seleccione una Provincia</MenuItem>
                        {provincias.map(provincia => (
                            <MenuItem key={provincia.id} value={provincia.id}>
                                {provincia.nombre}
                            </MenuItem>
                        ))}
                    </Select>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancelar</Button>
                    <Button onClick={handleSave} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SucursalList;