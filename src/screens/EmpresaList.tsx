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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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
        return MySwal.fire({
            title: 'Empresa creada',
            text: 'La empresa se ha creado correctamente',
            icon: 'success',
            showConfirmButton: true,
            timer: 2000,
            timerProgressBar: true,
        });
    };

    const updateEmpresa = async (empresa: Empresa) => {
        await EmpresaUpdate(empresa);
        return MySwal.fire({
            title: 'Empresa actualizada',
            text: 'La empresa se ha actualizado correctamente',
            icon: 'success',
            showConfirmButton: true,
            timer: 2000,
            timerProgressBar: true,
        });
    };

    const redirectSucursal = (id: number) => {
        navigate('/empresa/' + id);
    };

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

    const handleSave = async () => {
        let result;
        handleClose();  // Cerrar el modal antes de mostrar la animación
        if (currentEmpresa.id > 0) {
            result = await updateEmpresa(currentEmpresa);
        } else {
            result = await createEmpresa(currentEmpresa);
        }
        // Espera a que se cierre el pop-up antes de recargar la página
        if (result.isConfirmed || result.dismiss) {
            window.location.reload();
        }
    };

    useEffect(() => {
        getAllEmpresa();
    }, []);

    return (
    <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '8px' }}>
        <Typography 
            variant="h4" 
            component="h4" 
            align="center" 
            style={{ fontWeight: 'bold', marginBottom: '20px', color: 'black', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
        >
            Seleccione una Empresa
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                style={{ backgroundColor: '#334e77', color: 'white', marginBottom: '20px' }}
            >
                Crear Empresa
            </Button>
        </div>
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '16px', 
            marginTop: '16px',
            justifyContent: 'center',
            padding: '10px',
        }}>
            {empresas.map((empresa) => (
                <Card key={empresa.id} style={{ width: '250px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                    <CardHeader
                        title={empresa.nombre}
                        subheader={empresa.razonSocial}
                        titleTypographyProps={{ variant: 'h5', color: 'black'}}
                        subheaderTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                    />
                    <CardActions style={{ justifyContent: 'space-between' }}>
                        <Tooltip title="Editar">
                            <IconButton onClick={() => handleOpen(empresa)} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Sucursales">
                            <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{ height: "30px", width: "170px" }} 
                                onClick={() => redirectSucursal(empresa.id)}
                            >
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
                <Button onClick={handleClose} color="error">Cancelar</Button>
                <Button onClick={handleSave} color="primary">Guardar</Button>
            </DialogActions>
        </Dialog>
    </div>
)

}

export default EmpresaList;
