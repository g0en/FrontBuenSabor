import { useEffect, useState } from "react";
import SideBar from "../components/common/SideBar";
import UnidadMedida from "../types/UnidadMedida";
import { UnidadMedidaGetAll, UnidadMedidaCreate, UnidadMedidaUpdate, UnidadMedidaDelete } from "../services/UnidadMedidaService";
import { Container, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };

function UnidadMedidaList(){
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const [currentUnidadMedida, setCurrentUnidadMedida] = useState<UnidadMedida>({...emptyUnidadMedida});
    const [isEditing, setIsEditing] = useState(false);

    const getAllUnidadMedida = async () => {
        const unidadMedidas: UnidadMedida[] = await UnidadMedidaGetAll();
        setUnidadMedidas(unidadMedidas);
    };

    const createUnidadMedida = async (unidadMedida: UnidadMedida) => {
        await UnidadMedidaCreate(unidadMedida);
        getAllUnidadMedida();
    };

    const updateUnidadMedida = async (unidadMedida: UnidadMedida) => {
        await UnidadMedidaUpdate(unidadMedida);
        getAllUnidadMedida();
    };

    const deleteUnidadMedida = async (id: number) => {
        await UnidadMedidaDelete(id);
        getAllUnidadMedida();
    };

    useEffect(() => {
        getAllUnidadMedida();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentUnidadMedida({ ...currentUnidadMedida, denominacion: event.target.value });
    };

    const handleSave = () => {
        createUnidadMedida(currentUnidadMedida);
        setCurrentUnidadMedida({ ...emptyUnidadMedida });
    };

    const handleUpdate = () => {
        updateUnidadMedida(currentUnidadMedida);
        setCurrentUnidadMedida({ ...emptyUnidadMedida });
        setIsEditing(false);
    };

    const handleEdit = (unidad: UnidadMedida) => {
        setCurrentUnidadMedida(unidad);
        setIsEditing(true);
    };

    return (
        <>
            <SideBar/>
            <Container>
                <Typography variant="h5" component="h1" gutterBottom>
                    Unidades de Medida
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                    <TextField
                        label="Denominación"
                        value={currentUnidadMedida.denominacion}
                        onChange={handleInputChange}
                        margin="normal"
                        style={{ marginRight: '8px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={isEditing ? handleUpdate : handleSave}
                    >
                        {isEditing ? "Actualizar" : "Crear"}
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {unidadMedidas.map((unidad) => (
                                <TableRow key={unidad.id}>
                                    <TableCell>{unidad.denominacion}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(unidad)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => deleteUnidadMedida(unidad.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
}

export default UnidadMedidaList;