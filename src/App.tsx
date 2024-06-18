import { BrowserRouter, Route, Routes } from "react-router-dom";
import SideBar from "./components/common/SideBar";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./screens/Dashboard";
import Categoria from "./screens/CategoriaList";
import ArticuloManufacturado from "./screens/ArticuloManufacturadoList";
import Promocion from "./screens/PromocionList";
import Empleado from "./screens/EmpleadosList";
import Roles from "./screens/RolesList";
import ArticuloInsumo from "./screens/ArticuloInsumoList";
import UnidadMedida from "./screens/UnidadMedidaList";

function App() {
  return (
    <BrowserRouter>
      <SideBar />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productos" element={<ArticuloManufacturado />} />
          <Route path="categorias" element={<Categoria />} />
          <Route path="promociones" element={<Promocion />} />
          <Route path="empleados" element={<Empleado />} />
          <Route path="roles" element={<Roles />} />
          <Route path="insumos" element={<ArticuloInsumo />} />
          <Route path="unidad-medida" element={<UnidadMedida />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;