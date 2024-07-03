import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import Empresa from "../../types/Empresa";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { EmpresaCreate, EmpresaUpdate } from "../../services/EmpresaService";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

interface EmpresaCardProps {
    open: boolean;
    onClose: () => void;
    empresa: Empresa;
}

const MySwal = withReactContent(Swal);

const EmpresaModal: React.FC<EmpresaCardProps> = ({ open, onClose, empresa }) => {
    const [currentEmpresa, setCurrentEmpresa] = useState<Empresa>(empresa);
    const { getAccessTokenSilently } = useAuth0();

    const createEmpresa = async (empresa: Empresa) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        await EmpresaCreate(empresa, token);
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
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        await EmpresaUpdate(empresa, token);
        return MySwal.fire({
            title: 'Empresa actualizada',
            text: 'La empresa se ha actualizado correctamente',
            icon: 'success',
            showConfirmButton: true,
            timer: 2000,
            timerProgressBar: true,
        });
    };

    const handleClose = () => {
        setCurrentEmpresa(empresa);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentEmpresa(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (currentEmpresa.id > 0) {
            try{
                await updateEmpresa(currentEmpresa);
            }catch(error){
                console.log("Error al actualizar la empresa.");
            }
        } else {
            try{
                await createEmpresa(currentEmpresa);
            }catch(error){
                console.log("Error al crear la empresa.");
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
                {
                    currentEmpresa.id > 0 ?
                        <Typography variant="h6" gutterBottom>
                            Actualizar Empresa
                        </Typography>
                        :
                        <Typography variant="h6" gutterBottom>
                            Crear Empresa
                        </Typography>
                }
                <Box mb={2}>
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
                        type="decimal"
                        value={currentEmpresa.cuil}
                        onChange={handleChange}
                        disabled={!!currentEmpresa.id}
                    />
                </Box>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default EmpresaModal;