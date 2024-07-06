import { useEffect, useState } from "react";
import { Button, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from "@mui/material";
import SideBar from "../components/common/SideBar";
import ArticuloInsumo from "../types/ArticuloInsumo";
import { ArticuloInsumoFindBySucursal } from "../services/ArticuloInsumoService";
import { useParams } from "react-router-dom";
import Imagen from "../types/Imagen";
import AddIcon from "@mui/icons-material/Add";
import { useAuth0 } from "@auth0/auth0-react";
import ArticuloInsumoTable from "../components/iu/ArticuloInsumo/ArticuloInsumoTable";
import ArticuloInsumoAddModal from "../components/iu/ArticuloInsumo/ArticuloInusmoAddModal";

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };
const emptyArticuloInsumo = {
    id: 0, eliminado: false, denominacion: '', precioVenta: 0, habilitado: true, imagenes: [], unidadMedida: emptyUnidadMedida, categoria: emptyCategoria, sucursal: null, precioCompra: 0, stockActual: 0, stockMinimo: 0, stockMaximo: 0, esParaElaborar: false
};

function ArticuloInsumoList() {
    const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
    const [currentArticuloInsumo, setCurrentArticuloInsumo] = useState<ArticuloInsumo>({ ...emptyArticuloInsumo });
    const { idSucursal } = useParams();
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    const getAllArticuloInsumoBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        const articulosInsumo: ArticuloInsumo[] = await ArticuloInsumoFindBySucursal(Number(idSucursal), token);
        setArticulosInsumo(articulosInsumo);
    };

    const handleOpen = () => {
        setCurrentArticuloInsumo({ ...emptyArticuloInsumo });
        setArticuloImages([]);
        setImages([]);
        setOpen(true)
    };

    const handleClose = async () => {
        await getAllArticuloInsumoBySucursal();
        setOpen(false);
    };

    useEffect(() => {
        getAllArticuloInsumoBySucursal();
    }, []);

    return (
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" component="h1" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Articulos Insumos
                </Typography>

                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>Agregar Insumo</Button>
                <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px', marginTop: '20px' }}>
                    <Table >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Precio Compra</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Precio Venta</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Unidad de Medida</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Stock Actual</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Stock Mínimo</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Stock Máximo</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Para Elaborar</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Categoría</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articulosInsumo.filter(articulo => articulo.eliminado === false)
                                .map((articulo) => (
                                    <ArticuloInsumoTable onClose={handleClose} articulo={articulo} />
                                )
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <ArticuloInsumoAddModal open={open} onClose={handleClose} articulo={currentArticuloInsumo} imagenes={images} articuloImagenes={articuloImages} />
            </Box>
        </>
    );
}

export default ArticuloInsumoList;