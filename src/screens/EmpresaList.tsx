import { Button, Card, CardActions, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { EmpresaGetAll } from "../services/EmpresaService";
import { EmpresaCreate } from "../services/EmpresaService";
import { EmpresaUpdate } from "../services/EmpresaService";
import Empresa from "../types/Empresa";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const emptyEmpresa = { id: 0, eliminado: false, nombre: '', razonSocial: '', cuil: 0 };

function EmpresaList() {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [open, setOpen] = useState(false);
    const [currentEmpresa, setCurrentEmpresa] = useState<Empresa>({ ...emptyEmpresa });
    const navigate = useNavigate();

    const getAllEmpresa = async () => {
        const empresas: Empresa[] = await EmpresaGetAll();
        setEmpresas(empresas);
    };

    const createEmpresa = async (empresa: Empresa) => {
        await EmpresaCreate(empresa);
    }

    const updateEmpresa = async (empresa: Empresa) => {
        await EmpresaUpdate(empresa);
    }

    const redirectSucursal = (id: number) => {
        navigate('/empresa/' + id);
    } 

    const handleOpen = (empresa?: Empresa) => {
        if (empresa) {
            setCurrentEmpresa(empresa);
        } else {
            setCurrentEmpresa({ ...emptyEmpresa });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentEmpresa({ ...emptyEmpresa });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentEmpresa(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (currentEmpresa.id > 0) {
            //UPDATE
            updateEmpresa(currentEmpresa);
            console.log("Guardando empresa:", currentEmpresa);
        } else {
            //CREATE
            createEmpresa(currentEmpresa);
            console.log("Creando nueva empresa");
        }
        handleClose();
        window.location.reload();
    };

    useEffect(() => {
        getAllEmpresa();
    }, []);

    return (
        <>
            <Typography variant="h4" component="h4">
                Seleccione una Empresa
            </Typography><br></br>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>Crear Empresa</Button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                {empresas.map((empresa) => (
                    <Card key={empresa.id} style={{ width: '250px' }}>
                        <CardHeader
                            title={empresa.nombre}
                            subheader={empresa.razonSocial}
                        />
                        <CardActions>
                            <Tooltip title="Editar">
                                <IconButton onClick={() => handleOpen(empresa)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Sucursales">
                                <Button variant="contained" color="success" sx={{height: "50px", width:"200px"}} onClick={() => redirectSucursal(empresa.id)}>
                                    <VisibilityIcon /> Ver Sucursales
                                </Button>
                            </Tooltip>
                        </CardActions>
                    </Card>
                ))}
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentEmpresa.id ? "Editar Empresa" : "Crear Empresa"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        name="nombre"
                        fullWidth
                        value={currentEmpresa.nombre}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Razón Social"
                        name="razonSocial"
                        fullWidth
                        value={currentEmpresa.razonSocial}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Cuil"
                        name="cuil"
                        fullWidth
                        value={currentEmpresa.cuil}
                        onChange={handleChange}
                        disabled={!!currentEmpresa.id}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancelar</Button>
                    <Button onClick={handleSave} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EmpresaList;