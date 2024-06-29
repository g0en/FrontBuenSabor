import React, { useState } from 'react';
import { Card, CardHeader, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Delete } from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Promocion from '../../types/Promocion';

interface PromocionCardProps {
    promocion: Promocion;
}

const PromocionCard: React.FC<PromocionCardProps> = ({ promocion }) => {
    const { denominacion, fechaDesde, fechaHasta, imagenes, precioPromocional } = promocion;

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const isActiva = new Date(fechaHasta) > new Date();

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagenes.length) % imagenes.length);
    };

    return (
        <Card>
            <CardHeader
                title={denominacion}
                subheader={`Vigencia: ${fechaDesde} - ${fechaHasta}`}
            />
            {imagenes.length > 0 && (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <IconButton onClick={handlePreviousImage} disabled={imagenes.length <= 1}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <CardMedia
                        component="img"
                        height="200"
                        image={imagenes[currentImageIndex].url}
                        alt={denominacion}
                        style={{ maxWidth: '60%', marginTop: '10px', borderRadius: 8 }}
                    />
                    <IconButton onClick={handleNextImage} disabled={imagenes.length <= 1}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            )}
            <CardContent>
                <Typography variant="h6" color="text.primary">
                    ${precioPromocional}
                </Typography>
                <Typography variant="body2" sx={{
                    display: 'inline-block',
                    border: '1px solid',
                    backgroundColor: isActiva ? 'green' : 'red',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    color: 'white',
                }}>
                    {isActiva ? 'ACTIVA' : 'FINALIZADA'}
                </Typography>
                <IconButton aria-label="edit" color='primary'>
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" color='error'>
                    <Delete />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default PromocionCard;
