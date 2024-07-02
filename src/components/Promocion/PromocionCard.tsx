import React, { useState } from 'react';
import { Card, CardHeader, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import Promocion from '../../types/Promocion';
import AddPromocionModal from './AddPromocionModal';
import Visibility from '@mui/icons-material/Visibility';
import ViewPromocionModal from './PromocionViewModal';
import { PromocionUpdate } from '../../services/PromocionService';
import { useAuth0 } from '@auth0/auth0-react';

interface PromocionCardProps {
    onClose: () => void;
    promocion: Promocion;
}

const PromocionCard: React.FC<PromocionCardProps> = ({ onClose, promocion }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const isActiva = new Date(promocion.fechaHasta) > new Date();

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % promocion.imagenes.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + promocion.imagenes.length) % promocion.imagenes.length);
    };

    const handleEdit = () => {
        setOpenEdit(true);
    }

    const handleCloseModal = async () => {
        setOpenEdit(false);
        onClose();
    }

    const handleView = () => {
        setOpenView(true);
    }

    const handleCloseViewModal = () => {
        setOpenView(false);
    }

    const handleBaja = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        if (promocion.id !== null) {
            promocion.habilitado = false;
            await PromocionUpdate(promocion, token);
        }

        onClose();
    }

    const handleAlta = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        if (promocion.id !== null) {
            promocion.habilitado = true;
            await PromocionUpdate(promocion, token);
        }

        onClose();
    }

    return (
        <Box>
            <Card sx={{ maxWidth: 300, margin: 'auto' }}>
                <CardHeader
                    title={promocion.denominacion}
                    subheader={`Vigencia: ${promocion.fechaDesde} - ${promocion.fechaHasta}`}
                    sx={{ padding: '8px 16px' }}
                    titleTypographyProps={{ variant: 'h6' }}
                    subheaderTypographyProps={{ variant: 'body2' }}
                />
                {promocion.imagenes.length > 0 && (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ padding: '8px 0' }}>
                        <IconButton onClick={handlePreviousImage} disabled={promocion.imagenes.length <= 1}>
                            <ArrowBackIosIcon fontSize="small" />
                        </IconButton>
                        <CardMedia
                            component="img"
                            height="150"
                            image={promocion.imagenes[currentImageIndex].url}
                            alt={promocion.denominacion}
                            sx={{ maxWidth: '100%', marginTop: '8px', borderRadius: 4 }}
                        />
                        <IconButton onClick={handleNextImage} disabled={promocion.imagenes.length <= 1}>
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
                <CardContent sx={{ padding: '8px 16px' }}>
                    <Typography variant="h6" color="text.primary" sx={{ marginBottom: '8px' }}>
                        ${promocion.precioPromocional}
                    </Typography>
                    {
                        promocion.habilitado ? <Typography variant="body2" sx={{
                            display: 'inline-block',
                            border: '1px solid',
                            backgroundColor: isActiva ? 'green' : 'red',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            color: 'white',
                            marginBottom: '8px'
                        }}>
                            {isActiva ? 'ACTIVA' : 'FINALIZADA'}
                        </Typography>
                            :
                            <Typography variant="body2" sx={{
                                display: 'inline-block',
                                border: '1px solid',
                                backgroundColor: 'orangered',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                color: 'white',
                                marginBottom: '8px'
                            }}>
                                DESACTIVADA
                            </Typography>
                    }
                    {
                        promocion.habilitado ?
                            <>
                                <IconButton aria-label="edit" color='primary' size="small" onClick={handleEdit}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton aria-label="view" color='secondary' size="small" onClick={handleView}>
                                    <Visibility />
                                </IconButton>
                                <IconButton aria-label="baja" color='error' size="small" onClick={handleBaja}>
                                    <RemoveCircleOutlineIcon fontSize="small" />
                                </IconButton>
                            </>
                            :
                            <>
                                <IconButton aria-label="view" color='secondary' size="small" onClick={handleView}>
                                    <Visibility />
                                </IconButton>
                                <IconButton aria-label="alta" color='success' size="small" onClick={handleAlta}>
                                    <KeyboardDoubleArrowUpIcon fontSize="small" />
                                </IconButton>
                            </>
                    }
                </CardContent>
            </Card>
            <AddPromocionModal open={openEdit} onClose={handleCloseModal} currentPromocion={promocion} />
            <ViewPromocionModal open={openView} onClose={handleCloseViewModal} promocion={promocion} />
        </Box>
    );
};

export default PromocionCard;