import DataModel from "./DataModel";
import Imagenes from "./Imagenes";
import UnidadMedida from "./UnidadMedida";

interface ArticuloInsumo extends DataModel<ArticuloInsumo> {
    denominacion: string;
    precioVenta: number;
    imagenes: Imagenes [];
    unidadMedida: UnidadMedida;
    precioCompra: number;
    stockActual: number;
    stockMaximo: number;
    esParaElaborar: boolean;
  }

export default ArticuloInsumo;