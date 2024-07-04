import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, Modal, TextField, Typography } from "@mui/material";
import Categoria from "../../types/Categoria";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sucursal from "../../types/Sucursal";
import { useAuth0 } from "@auth0/auth0-react";
import { SucursalGetByEmpresaId } from "../../services/SucursalService";
import { CategoriaCreate, CategoriaUpdate } from "../../services/CategoriaService";

const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

interface CategoriaModalProps {
    open: boolean;
    onClose: () => void;
    categoria: Categoria;
}

const CategoriaModal: React.FC<CategoriaModalProps> = ({ open, onClose, categoria }) => {
    const [currentCategoria, setCurrentCategoria] = useState<Categoria>(categoria);
    const { idEmpresa } = useParams();
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    const getAllSucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
        const sucursales: Sucursal[] = await SucursalGetByEmpresaId(Number(idEmpresa), token);
        setSucursales(sucursales);
    };

    const createCategoria = async (categoria: Categoria) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
          
        await CategoriaCreate(categoria, token);
    };

    const updateCategoria = async (categoria: Categoria) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });

        await CategoriaUpdate(categoria, token);
    };

    useEffect(() => {
        getAllSucursal();
    }, [idEmpresa]);

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentCategoria({ ...currentCategoria, [e.target.name]: e.target.value });
    };

    const handleEsInsumoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentCategoria({ ...currentCategoria, esInsumo: e.target.checked });
    };

    const handleSucursalChange = (id: number) => {
        const sucursalesSeleccionadas = currentCategoria.sucursales || [];
        const sucursalExistente = sucursalesSeleccionadas.find(s => s.id === id);

        if (sucursalExistente) {
            setCurrentCategoria({
                ...currentCategoria,
                sucursales: sucursalesSeleccionadas.filter(s => s.id !== id)
            });
        } else {
            const sucursal = sucursales.find(s => s.id === id);
            if (sucursal) {
                setCurrentCategoria({
                    ...currentCategoria,
                    sucursales: [...sucursalesSeleccionadas, sucursal]
                });
            }
        }
    };
    
    const handleAddSubCategoria = () => {
        setCurrentCategoria({
            ...currentCategoria,
            subCategorias: [...(currentCategoria.subCategorias || []), { ...emptyCategoria }]
        });
    };

    const handleSubCategoriaChange = (index: number, denominacion: string) => {
        const subCategorias = [...(currentCategoria.subCategorias || [])];
        subCategorias[index].denominacion = denominacion;
        setCurrentCategoria({ ...currentCategoria, subCategorias });
    };

    const handleRemoveSubCategoria = (index: number) => {
        const subCategorias = [...(currentCategoria.subCategorias || [])];
        subCategorias.splice(index, 1);
        setCurrentCategoria({ ...currentCategoria, subCategorias });
    };

    const handleClose = () => {
        setCurrentCategoria(categoria);
        onClose();
    }

    const handleSubmit = async () => {
        if (currentCategoria.id === null) {
            try{
                await createCategoria(currentCategoria);
            }catch(error){
                console.log("No se pudo crear la categoria.");
            }
        } else {
            if (currentCategoria.subCategorias !== null) {
                let subcategorias: Categoria[] = currentCategoria.subCategorias;
                for (let i = 0; i < subcategorias.length; i++) {
                    subcategorias[i].sucursales = currentCategoria.sucursales;
                }
            }

            try {
                await updateCategoria(currentCategoria);
            } catch (error) {
                console.log("Error al cargar las categorias.");
            }

        }
        
        handleClose();
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 700, maxHeight: '80vh', bgcolor: 'background.paper', boxShadow: 24, p: 4, overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>
                        {currentCategoria.id === null ? 'Crear Categoría' : 'Editar Categoría'}
                    </Typography>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                label="Denominación"
                                name="denominacion"
                                value={currentCategoria.denominacion}
                                onChange={handleCategoriaChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={4} container justifyContent="center" alignItems="center">
                            {currentCategoria.id !== null ?
                                <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={currentCategoria.esInsumo}
                                                onChange={handleEsInsumoChange}
                                                name="esInsumo"
                                                color="primary"
                                                disabled={currentCategoria.id !== null}
                                            />
                                        }
                                        label="Es Insumo"
                                    />
                                </div>
                                :
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={currentCategoria.esInsumo}
                                            onChange={handleEsInsumoChange}
                                            name="esInsumo"
                                            color="primary"
                                        />
                                    }
                                    label="Es Insumo"
                                />
                            }
                        </Grid>
                    </Grid>

                    <Box mb={2}>
                        <Typography variant="subtitle1" gutterBottom>
                            Seleccione la/s sucursales:
                        </Typography>
                        {
                            currentCategoria.id !== null ?
                                <div>
                                    <div>
                                        {sucursales.map(sucursal => (
                                            <FormControlLabel
                                                key={sucursal.id}
                                                control={
                                                    <Checkbox
                                                        checked={currentCategoria.sucursales?.some(s => s.id === sucursal.id) || false}
                                                        onChange={() => handleSucursalChange(sucursal.id)}
                                                        color="primary"
                                                    />
                                                }
                                                label={sucursal.nombre}
                                            />
                                        ))}
                                    </div>
                                </div>
                                :
                                <div>
                                    {sucursales.map(sucursal => (
                                        <FormControlLabel
                                            key={sucursal.id}
                                            control={
                                                <Checkbox
                                                    checked={currentCategoria.sucursales?.some(s => s.id === sucursal.id) || false}
                                                    onChange={() => handleSucursalChange(sucursal.id)}
                                                    color="primary"
                                                />
                                            }
                                            label={sucursal.nombre}
                                        />
                                    ))}
                                </div>
                        }
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" gutterBottom>
                            Agregar Subcategorías
                        </Typography>
                        <Button variant="outlined" color="primary" onClick={handleAddSubCategoria} style={{ marginLeft: 10 }}>
                            Agregar
                        </Button>
                    </Box>
                    {currentCategoria.subCategorias && currentCategoria.subCategorias.map((subCategoria, index) => (
                        <Box key={index} display="flex" alignItems="center" mt={2}>
                            <TextField
                                label="Denominación"
                                value={subCategoria.denominacion}
                                onChange={(e) => handleSubCategoriaChange(index, e.target.value)}
                                margin="normal"
                            />
                            {
                                subCategoria.id === null &&
                                <IconButton color="secondary" onClick={() => handleRemoveSubCategoria(index)}>
                                    <CloseIcon />
                                </IconButton>
                            }
                        </Box>
                    ))}
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="error" onClick={handleClose} sx={{ mr: 2 }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {currentCategoria.id === null ? 'Crear' : 'Actualizar'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default CategoriaModal;