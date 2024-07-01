import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Button } from '@mui/material';
import SideBar from '../components/common/SideBar';
import Promocion from '../types/Promocion';
import { PromocionFindBySucursal } from '../services/PromocionService';
import PromocionCard from '../components/Promocion/PromocionCard';
import AddIcon from "@mui/icons-material/Add";
import AddPromocionModal from '../components/Promocion/AddPromocionModal';
import { useAuth0 } from '@auth0/auth0-react';

const emptyPromocion: Promocion = {
    id: null,
    eliminado: false,
    denominacion: '',
    fechaDesde: '',
    fechaHasta: '',
    horaDesde: '',
    horaHasta: '',
    descripcionDescuento: '',
    precioPromocional: 0,
    habilitado: true,
    tipoPromocion: null,
    imagenes: [],
    sucursales: [],
    promocionDetalles: [],
};

function PromocionList() {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const { idSucursal } = useParams();
    const [open, setOpen] = useState(false);
    const [currentPromocion, setCurrentPromocion] = useState<Promocion>({ ...emptyPromocion });
    const { getAccessTokenSilently } = useAuth0();

    const getAllPromocionesBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        const promociones: Promocion[] = await PromocionFindBySucursal(Number(idSucursal), token);
        setPromociones(promociones);
    }

    useEffect(() => {
        getAllPromocionesBySucursal();
    }, [idSucursal]);

    const handleOpenModal = () => {
        setCurrentPromocion({ ...emptyPromocion });
        setOpen(true);
    }

    const handleCloseModal = async () => {
        setOpen(false);
        await getAllPromocionesBySucursal();
        setCurrentPromocion({ ...emptyPromocion });
    }

    return (
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Promociones
                </Typography>
                <Box mb={2}>
                    <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={handleOpenModal}>
                        Agregar Promoción
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {promociones.map((promocion) => (
                        <Grid item xs={12} sm={6} md={4} key={promocion.id}>
                            <PromocionCard onClose={handleCloseModal} promocion={promocion} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <AddPromocionModal open={open} onClose={handleCloseModal} currentPromocion={currentPromocion} />
        </>
    )
}

export default PromocionList;