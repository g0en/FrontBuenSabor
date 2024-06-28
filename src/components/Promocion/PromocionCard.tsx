import React from 'react';
import { Card, CardHeader, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Promocion from '../../types/Promocion';

interface PromocionCardProps {
    promocion: Promocion;
}

const PromocionCard: React.FC<PromocionCardProps> = ({ promocion }) => {
    const { denominacion, fechaDesde, fechaHasta, imagenes, precioPromocional } = promocion;

    const isActiva = new Date(fechaHasta) > new Date();

    return (
        <Card>
            <CardHeader
                title={denominacion}
                subheader={`Vigencia: ${fechaDesde} - ${fechaHasta}`}
            />
            {imagenes.length > 0 && (
                <CardMedia
                    component="img"
                    height="140"
                    image={imagenes[0].url}
                    alt={denominacion}
                />
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
                <IconButton aria-label="download" color='error'>
                    <ArrowCircleDownIcon />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default PromocionCard;
