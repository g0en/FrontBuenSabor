import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Button, TableCell, TableBody, Table, TableContainer, TableRow, TableHead, Paper } from "@mui/material";
import SideBar from "../components/common/SideBar";
import CategoriaGetDto from "../types/CategoriaGetDto";
import { CategoriaByEmpresaGetAll } from "../services/CategoriaService";
import AddIcon from "@mui/icons-material/Add";
import Categoria from "../types/Categoria";
import { useAuth0 } from "@auth0/auth0-react";
import CategoriaTable from "../components/Categoria/CategoriaTable";
import CategoriaModal from "../components/Categoria/CategoriaModal";

const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

function CategoriaList() {
    const [categorias, setCategorias] = useState<CategoriaGetDto[]>([]);
    const { idSucursal } = useParams();
    const [currentCategoria, setCurrentCategoria] = useState<Categoria>({ ...emptyCategoria });
    const [open, setOpen] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const getAllCategoriaBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
        const categorias: CategoriaGetDto[] = await CategoriaByEmpresaGetAll(Number(idSucursal), token);
        setCategorias(categorias);
    };

    useEffect(() => {
        getAllCategoriaBySucursal();
    }, [idSucursal]);

    const handleOpen = () => {
        setCurrentCategoria(emptyCategoria);
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
        await getAllCategoriaBySucursal();
        setCurrentCategoria(emptyCategoria);
    };

    return (
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Categorías
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                    Agregar Categoría
                </Button>

                <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px', marginTop: '20px' }}>
                    <Table >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }}>Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categorias.filter(categoria => categoria.categoriaPadre === null && !categoria.eliminado).map((categoria) => (
                                <CategoriaTable onClose={handleClose} categoria={categoria} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box>
            <CategoriaModal open={open} onClose={handleClose} categoria={currentCategoria}/>
        </>
    );
}

export default CategoriaList;