import { useEffect, useState } from "react";
import { SucursalCreate, SucursalGetByEmpresaId, SucursalUpdate } from "../services/SucursalService";
import Sucursal from "../types/Sucursal";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardActions, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography, Checkbox, FormControlLabel } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const emptySucursal = {
    id: 0,
    eliminado: false,
    nombre: '',
    horarioApertura: '',
    horarioCierre: '',
    esCasaMatriz: false,
    domicilio: { id: 0, eliminado: false, calle: '', numero: 0, cp: 0, piso: 0, nroDpto: 0, localidad: null },
    empresa: null
};

function SucursalList() {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [open, setOpen] = useState(false);
    const [currentSucursal, setCurrentSucursal] = useState<Sucursal>({ ...emptySucursal });
    const [hasCasaMatriz, setHasCasaMatriz] = useState(false);
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

    useEffect(() => {
        getAllSucursal();
    }, []);

    const handleOpen = (sucursal?: Sucursal) => {
        if (sucursal) {
            setCurrentSucursal(sucursal);
        } else {
            setCurrentSucursal({ ...emptySucursal });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentSucursal({ ...emptySucursal });
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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setCurrentSucursal(prev => ({ ...prev, [name]: checked }));
    };

    const handleSave = () => {
        if (currentSucursal.id > 0) {
            updateSucursal(currentSucursal);
        } else {
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
                                <IconButton>
                                    <VisibilityIcon />
                                </IconButton>
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
