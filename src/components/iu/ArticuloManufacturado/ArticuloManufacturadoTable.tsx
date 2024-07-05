import ArticuloManufacturado from "../../../types/ArticuloManufacturado";
import { useState } from "react";
import Imagen from "../../../types/Imagen";
import { useAuth0 } from "@auth0/auth0-react";
import { IconButton, TableCell, TableRow } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ArticuloManufacturadoDetalle from "../../../types/ArticuloManufacturadoDetalle";
import { ArticuloManufacturadoUpdate } from "../../../services/ArticuloManufacturadoService";
import ArticuloManufacturadoViewModal from "./ArticuloManufacturadoViewModal";
import ArticuloManufacturadoAddModal from "./ArticuloManufacturadoAddModal";

interface ArticuloManufacturadoTableProps {
    onClose: () => void;
    articulo: ArticuloManufacturado;
}

const ArticuloManufacturadoTable: React.FC<ArticuloManufacturadoTableProps> = ({ onClose, articulo }) => {
    const [view, setView] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>(articulo.imagenes);
    const [openModal, setOpenModal] = useState(false);
    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    const updateArticuloManufacturado = async (articulo: ArticuloManufacturado) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
        return ArticuloManufacturadoUpdate(articulo, token);
    };


    const handleOpenEditModal = async (articulo: ArticuloManufacturado) => {
        if (articulo) {
            if (articulo.articuloManufacturadoDetalles !== null) {
                setDetalles(articulo.articuloManufacturadoDetalles);
            }
            setImages(articulo.imagenes.map(imagen => imagen.url));
            setArticuloImages(articulo.imagenes);
        }

        setOpenModal(true);
    }

    const handleView = (articulo?: ArticuloManufacturado) => {
        if (articulo) {
            setImages(articulo.imagenes.map(imagen => imagen.url));
        }

        setView(true);
    };

    
    const handleBaja = async (articulo: ArticuloManufacturado) => {
        articulo.habilitado = false;
        try {
            const data = await updateArticuloManufacturado(articulo);
            if (data.status !== 200) {
                articulo.habilitado = true;
                return;
            }

        } catch (error) {
            console.log("Error al dar de baja un articulo manufacturado");
        }

        handleClose();

    }

    const handleAlta = async (articulo: ArticuloManufacturado) => {
        articulo.habilitado = true;
        try {
            const data = await updateArticuloManufacturado(articulo);
            if (data.status !== 200) {
                articulo.habilitado = false;
                return;
            }

        } catch (error) {
            console.log("Error al dar de baja un articulo manufacturado");
        }

        handleClose();
    }

    const handleClose = () => {
        setOpenModal(false);
        setView(false);
        onClose();
    }
    

    return (
        <>
            <TableRow sx={{ backgroundColor: articulo.habilitado === true ? "none" : "#B0B0B0" }} key={articulo.id}>
                <TableCell align="center">{articulo.denominacion}</TableCell>
                <TableCell align="center">{articulo.unidadMedida.denominacion}</TableCell>
                <TableCell align="center">{articulo.precioVenta}</TableCell>
                <TableCell align="center">{articulo.tiempoEstimadoMinutos}</TableCell>
                <TableCell align="center">{articulo.categoria && articulo.categoria.denominacion}</TableCell>
                {
                    articulo.habilitado === true ?
                        <TableCell align="center">
                            <IconButton aria-label="edit" onClick={() => handleOpenEditModal(articulo)} color="primary">
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                <VisibilityIcon />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => handleBaja(articulo)} color="error">
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        </TableCell>
                        :
                        <TableCell>
                            <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                <VisibilityIcon />
                            </IconButton>
                            <IconButton aria-label="alta" onClick={() => handleAlta(articulo)} color="success">
                                <KeyboardDoubleArrowUpIcon />
                            </IconButton>
                        </TableCell>
                }
            </TableRow>

            <ArticuloManufacturadoViewModal view={view} onClose={handleClose} articulo={articulo} images={images}/>
            <ArticuloManufacturadoAddModal open={openModal} onClose={handleClose} articulo={articulo} imagenes={images} articuloImagenes={articuloImages} articuloDetalles={detalles}/>
        </>
    )
};

export default ArticuloManufacturadoTable;