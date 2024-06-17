import { BrowserRouter, Route, Routes } from "react-router-dom";
import SideBar from "./components/common/SideBar";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./screens/Dashboard";
import Categoria from "./screens/CategoriaList";

function App() {
  return(
    <>
    <SideBar></SideBar>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout></MainLayout>}>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/categorias" element={<Categoria/>}></Route>
      </Route>
    </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App;