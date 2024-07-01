import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./screens/Dashboard";
import Categoria from "./screens/CategoriaList";
import ArticuloManufacturado from "./screens/ArticuloManufacturadoList";
import Promocion from "./screens/PromocionList";
import Empleado from "./screens/EmpleadosList";
import ArticuloInsumo from "./screens/ArticuloInsumoList";
import UnidadMedida from "./screens/UnidadMedidaList";
import Empresa from "./screens/EmpresaList";
import Sucursal from "./screens/SucursalList";
import PreLayout from "./components/layout/PreLayout";
import PedidosList from "./screens/PedidosList";

function App() {
  return (
      <Routes>
        <Route element={<PreLayout />}>
          <Route path="/" element={<Empresa />} />
          <Route path="empresa/:idEmpresa" element={<Sucursal />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="dashboard/:idEmpresa/:idSucursal" element={<Dashboard />} />
          <Route path="productos/:idEmpresa/:idSucursal" element={<ArticuloManufacturado />} />
          <Route path="categorias/:idEmpresa/:idSucursal" element={<Categoria />} />
          <Route path="promociones/:idEmpresa/:idSucursal" element={<Promocion />} />
          <Route path="empleados/:idEmpresa/:idSucursal" element={<Empleado />} />
          <Route path="insumos/:idEmpresa/:idSucursal" element={<ArticuloInsumo />} />
          <Route path="unidad-medida/:idEmpresa/:idSucursal" element={<UnidadMedida />} />
          <Route path="pedidos/:idEmpresa/:idSucursal" element={<PedidosList />}/>
        </Route>
      </Routes>
  );
}

export default App;