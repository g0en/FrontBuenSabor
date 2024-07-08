import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoriaGetDto from '../../../types/CategoriaGetDto';
import { useParams } from 'react-router-dom';
import Categoria from '../../../types/Categoria';
import { CategoriaBaja, CategoriaDelete } from '../../../services/CategoriaService';
import CategoriaModal from './CategoriaModal';
import EliminarComponent from '../Advertencias/EliminarComponent';

interface CategoriaTableProps {
    onClose: () => void;
    categoria: CategoriaGetDto;
}

const CategoriaTable: React.FC<CategoriaTableProps> = ({ onClose, categoria }) => {
    const { getAccessTokenSilently } = useAuth0();
    const { idSucursal } = useParams();
    const [open, setOpen] = useState(false);
    const [openEliminar, setOpenEliminar] = useState(false);
    const [categoriaUpdate, setCategoriaUpdate] = useState<Categoria>(categoria);

    const bajaCategoria = async (idCategoria: number) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
        await CategoriaBaja(idCategoria, Number(idSucursal), token);
    };

    const deleteCategoria = async (idCategoria: number) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });

        await CategoriaDelete(idCategoria, token);
    };

    const handleEdit = (categoria: Categoria | CategoriaGetDto) => {
        setCategoriaUpdate(categoria);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        onClose();
    }

    const handleDelete = async (categoria: Categoria | CategoriaGetDto) => {
        if (categoria.id !== null) {
            try{
                await deleteCategoria(categoria.id);
            }catch(error){
                console.log("Error al eliminar la categoria.");
            }
        }

        handleClose();
        handleCloseDialog();
    }

    const handleBaja = async (categoria: Categoria | CategoriaGetDto) => {
        if (categoria.id !== null) {
            try{
                await bajaCategoria(categoria.id);
            }catch(error){
                console.log("Error al dar de baja la categoria.");
            }
        }

        handleClose();
    }

    const handleCloseDialog = () => {
        setOpenEliminar(false);
    }

    const handleOpenElimarDialog = () => {
        setOpenEliminar(true);
    }

    const filterSubCategoriasBySucursal = (subCategorias: CategoriaGetDto[] | null, idSucursal: number) => {
        return subCategorias ? subCategorias.filter(subCategoria =>
            subCategoria.sucursales?.some(sucursal => sucursal.id === idSucursal)
        ) : [];
    };

    const renderSubCategorias = (subCategorias: CategoriaGetDto[] | null) => {
        const filteredSubCategorias = filterSubCategoriasBySucursal(subCategorias, Number(idSucursal));
        return filteredSubCategorias.filter(subCategoria => !subCategoria.eliminado).map((subCategoria) => (
            <Box key={subCategoria.id} sx={{ paddingLeft: 1 }}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{subCategoria.denominacion}</Typography>
                        <Box sx={{ marginLeft: 'auto' }}>
                            <IconButton onClick={() => handleEdit(subCategoria)} color="primary"><EditIcon /></IconButton>
                            <IconButton onClick={() => handleBaja(subCategoria)} color="secondary"><ArrowCircleDownIcon /></IconButton>
                            <IconButton onClick={handleOpenElimarDialog} color="error"><DeleteIcon /></IconButton>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderSubCategorias(subCategoria.subCategorias)}
                    </AccordionDetails>
                </Accordion>
                <EliminarComponent openDialog={openEliminar} onClose={handleCloseDialog} onConfirm={() => handleDelete(subCategoria)} tipo='la categoría' entidad={subCategoria} />
            </Box>
            
        ));
    };

    return (
        <>
            <Accordion key={categoria.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{categoria.denominacion}{
                        categoria.esInsumo ?
                            <Chip label="Insumo" size="small" color="secondary" sx={{ ml: 1 }} /> :
                            <Chip label="Manufacturado" size="small" color="error" sx={{ ml: 1 }} />
                    }</Typography>
                    <Box sx={{ marginLeft: 'auto' }}>
                        <IconButton onClick={() => handleEdit(categoria)} color="primary">{categoria.sucursales !== null && <EditIcon />}</IconButton>
                        <IconButton onClick={() => handleBaja(categoria)} color="secondary"><ArrowCircleDownIcon /></IconButton>
                        <IconButton onClick={handleOpenElimarDialog} color="error"><DeleteIcon /></IconButton>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {renderSubCategorias(categoria.subCategorias)}
                </AccordionDetails>
            </Accordion>
            <CategoriaModal open={open} onClose={handleClose} categoria={categoriaUpdate}/>
            <EliminarComponent openDialog={openEliminar} onClose={handleCloseDialog} onConfirm={() => handleDelete(categoria)} tipo='la categoría' entidad={categoria} />
        </>
    )
};

export default CategoriaTable;