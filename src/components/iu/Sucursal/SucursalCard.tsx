import { Button, Card, CardActions, CardHeader, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate, useParams } from "react-router-dom";
import SucursalModal from "./SucursalModal";
import Sucursal from "../../../types/Sucursal";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";

interface EmpresaCardProps {
    onClose: () => void;
    sucursal: Sucursal;
}

const SucursalCard: React.FC<EmpresaCardProps> = ({ onClose, sucursal }) => {
    const [editOpen, setEditOpen] = useState(false);
    const navigate = useNavigate();
    const { idEmpresa } = useParams();

    const redirectDashboard = (id: number) => {
        navigate('/dashboard/' + idEmpresa + "/" + id);
    }

    const handleOpen = () => {
        setEditOpen(true);
    };

    const handleClose = () => {
        setEditOpen(false);
        onClose();
    }

    const handleSuccess = () => {
        toast.success("Se actualizó correctamente", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            toastId: 'success-toast' // Asegura que el toast tenga un ID único
        });
    }

    const handleError = () => {
        toast.error("Error al actualizar la sucursal, intente más tarde", {
            position: "top-right",
            autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }

    return (
        <>
            <Card key={sucursal.id} style={{ width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                <CardHeader
                    title={sucursal.nombre}
                    subheader={`${sucursal.domicilio.calle} ${sucursal.domicilio.numero}, ${sucursal.domicilio.cp}, ${sucursal.domicilio.localidad?.nombre}, ${sucursal.domicilio.localidad?.provincia.nombre}`}
                    titleTypographyProps={{ variant: 'h6', color: 'Black', fontWeight: 'bold' }}
                    subheaderTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                />
                <CardActions style={{ justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        Casa Matriz: {sucursal.esCasaMatriz ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                    </span>
                    <div>
                        <Tooltip title="Editar">
                            <IconButton onClick={handleOpen} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Ver">
                            <Button variant="contained" color="success" sx={{ height: "30px", width: "90px" }} onClick={() => redirectDashboard(sucursal.id)}>
                                <VisibilityIcon /> Ver
                            </Button>
                        </Tooltip>
                    </div>
                </CardActions>
            </Card>

            <SucursalModal open={editOpen} onClose={handleClose} sucursal={sucursal} success={handleSuccess} error={handleError} />
        </>
    )
}

export default SucursalCard;