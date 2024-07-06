import { Box, IconButton, TableCell, TableRow } from "@mui/material";
import ArticuloInsumo from "../../../types/ArticuloInsumo";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Edit, Visibility, Check } from "@mui/icons-material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from "react";
import Imagen from "../../../types/Imagen";
import { ArticuloInsumoUpdate } from "../../../services/ArticuloInsumoService";
import { useAuth0 } from "@auth0/auth0-react";
import ArticuloInsumoViewModal from "./ArticuloInsumoViewModal";
import ArticuloInsumoAddModal from "./ArticuloInusmoAddModal";
import DesactivarComponent from "../Acciones/DesactivarComponent";
import ActivarComponent from "../Acciones/ActivarComponent";

interface ArticuloInsumoTableProps {
    onClose: () => void;
    articulo: ArticuloInsumo;
}

const ArticuloInsumoTable: React.FC<ArticuloInsumoTableProps> = ({ onClose, articulo }) => {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(false);
    const [openBaja, setOpenBaja] = useState(false);
    const [openAlta, setOpenAlta] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>(articulo.imagenes);
    const { getAccessTokenSilently } = useAuth0();

    const updateArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });

        return ArticuloInsumoUpdate(articuloInsumo, token);
    };

    const handleView = (articulo?: ArticuloInsumo) => {
        if (articulo) {
            setImages(articulo.imagenes.map(imagen => imagen.url));
        }

        setView(true);
    };

    const handleEdit = async (articulo?: ArticuloInsumo) => {
        if (articulo) {
            setImages(articulo.imagenes.map(imagen => imagen.url));
            setArticuloImages(articulo.imagenes);
        }

        setOpen(true);
    };

    const handleBaja = async (articulo: ArticuloInsumo) => {
        articulo.habilitado = false;
        try {
            const data = await updateArticuloInsumo(articulo);
            if (data.status !== 200) {
                articulo.habilitado = true;
                return;
            }

        } catch (error) {
            console.log("Error al dar de baja un articulo insumo");
        }

        handleClose();
        handleCloseDialog();
    }

    const handleAlta = async (articulo: ArticuloInsumo) => {
        articulo.habilitado = true;
        try {
            const data = await updateArticuloInsumo(articulo);
            if (data.status !== 200) {
                return;
            }

        } catch (error) {
            console.log("Error al dar de baja un articulo insumo");
        }

        handleClose();
        handleCloseDialog();
    }

    const handleClose = () => {
        setOpen(false);
        setView(false);
        onClose();
    }

    const handleOpenBaja = () => {
        setOpenBaja(true);
    }

    const handleOpenAlta = () => {
        setOpenAlta(true);
    }

    const handleCloseDialog = () => {
        setOpenBaja(false);
        setOpenAlta(false);
    }

    return (
        <>
            <TableRow sx={{ backgroundColor: articulo.habilitado ? "none" : "#B0B0B0" }} key={articulo.id}>
                        <TableCell align="center">{articulo.denominacion}</TableCell>
                        <TableCell align="center">{articulo.precioCompra}</TableCell>
                        <TableCell align="center">{articulo.precioVenta}</TableCell>
                        <TableCell align="center">{articulo.unidadMedida?.denominacion}</TableCell>
                        <TableCell align="center">{articulo.stockActual}</TableCell>
                        <TableCell align="center">{articulo.stockMinimo}</TableCell>
                        <TableCell align="center">{articulo.stockMaximo}</TableCell>
                        <TableCell align="center">
                            {articulo.esParaElaborar ? <Check color="success" /> : <RemoveIcon color="error" />}
                        </TableCell>
                        <TableCell align="center">{articulo.categoria?.denominacion}</TableCell>
                        <TableCell>

                            {
                                articulo.habilitado === true ?
                                    <Box>
                                        <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                            <Visibility />
                                        </IconButton>
                                        <IconButton aria-label="edit" onClick={() => handleEdit(articulo)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={handleOpenBaja} color="error">
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    </Box>
                                    :
                                    <Box>
                                        <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                            <Visibility />
                                        </IconButton>
                                        <IconButton aria-label="alta" onClick={handleOpenAlta} color="success">
                                            <KeyboardDoubleArrowUpIcon />
                                        </IconButton>
                                    </Box>
                            }
                        </TableCell>
                    </TableRow>
            <ArticuloInsumoViewModal view={view} onClose={handleClose} articulo={articulo} images={images}/>
            <ArticuloInsumoAddModal open={open} onClose={handleClose} articulo={articulo} imagenes={images} articuloImagenes={articuloImages}/>
            <DesactivarComponent openDialog={openBaja} onClose={handleCloseDialog} onConfirm={() => handleBaja(articulo)} tipo='el insumo' entidad={articulo}/>
            <ActivarComponent openDialog={openAlta} onClose={handleCloseDialog} onConfirm={() => handleAlta(articulo)} tipo='el insumo' entidad={articulo}/>
        </>
    )
};

export default ArticuloInsumoTable;