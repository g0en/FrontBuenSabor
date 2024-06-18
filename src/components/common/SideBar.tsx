import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Collapse, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CategoryIcon from "@mui/icons-material/Category";
import sizeConfigs from "../../configs/sizeConfig";
import colorConfigs from "../../configs/colorConfig";
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SpeedIcon from '@mui/icons-material/Speed';
import avatarImage from '../../assets/images/logo.png'

function SideBar() {
    const [openProducts, setOpenProducts] = useState(false);
    const [openEmpleados, setOpenEmpleados] = useState(false);

    const handleProductsClick = () => {
        setOpenProducts(!openProducts);
    };

    const handleEmpleadosClick = () => {
        setOpenEmpleados(!openEmpleados);
    };

    return (
        <>
            <Drawer variant="permanent"
                sx={{
                    width: sizeConfigs.sidebar.width,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: sizeConfigs.sidebar.width,
                        boxSizing: "border-box",
                        borderRight: "0px",
                        backgroundColor: colorConfigs.sidebar.bg,
                        color: colorConfigs.sidebar.color
                    }
                }}
            >
                <List disablePadding>
                    <Toolbar sx={{ marginBottom: "20px" }}>
                        <Stack
                            sx={{ width: "100%" }}
                            direction="row"
                            justifyContent="center"
                        >
                            <Avatar src={avatarImage} sx={{width: 100, height: 100}}/>
                        </Stack>
                    </Toolbar>
                    <ListItemButton component={Link} to="/dashboard">
                        <ListItemIcon sx={{
                            color: colorConfigs.sidebar.color
                        }}>
                            <StackedBarChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Estadisticas" />
                    </ListItemButton>
                    <ListItemButton onClick={handleProductsClick}>
                        <ListItemIcon sx={{
                            color: colorConfigs.sidebar.color
                        }}>
                            <FoodBankIcon />
                        </ListItemIcon>
                        <ListItemText primary="Productos" />
                        {openProducts ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openProducts} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton component={Link} to="/productos" sx={{ pl: 4 }}>
                                <ListItemIcon sx={{
                                    color: colorConfigs.sidebar.color
                                }}>
                                    <FastfoodIcon />
                                </ListItemIcon>
                                <ListItemText primary="Lista de Productos" />
                            </ListItemButton>
                            <ListItemButton component={Link} to="/categorias" sx={{ pl: 4 }}>
                                <ListItemIcon sx={{
                                    color: colorConfigs.sidebar.color
                                }}>
                                    <CategoryIcon />
                                </ListItemIcon>
                                <ListItemText primary="Categorías" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton component={Link} to="/promociones">
                        <ListItemIcon sx={{
                            color: colorConfigs.sidebar.color
                        }}>
                            <AttachMoneyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Promociones" />
                    </ListItemButton>
                    <ListItemButton onClick={handleEmpleadosClick}>
                        <ListItemIcon sx={{
                            color: colorConfigs.sidebar.color
                        }}>
                            <PeopleAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="Empleados" />
                        {openEmpleados ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openEmpleados} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton component={Link} to="/empleados" sx={{ pl: 4 }}>
                                <ListItemIcon sx={{
                                    color: colorConfigs.sidebar.color
                                }}>
                                    <FormatListBulletedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Lista de Empleados" />
                            </ListItemButton>
                            <ListItemButton component={Link} to="/roles" sx={{ pl: 4 }}>
                                <ListItemIcon sx={{
                                    color: colorConfigs.sidebar.color
                                }}>
                                    <AccountBoxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Roles" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton component={Link} to="/insumos">
                        <ListItemIcon sx={{
                            color: colorConfigs.sidebar.color
                        }}>
                            <ShoppingCartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Insumos" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/unidad-medida">
                        <ListItemIcon sx={{
                            color: colorConfigs.sidebar.color
                        }}>
                            <SpeedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Unidad de Medida" />
                    </ListItemButton>
                </List>
            </Drawer>
        </>
    )
}

export default SideBar;