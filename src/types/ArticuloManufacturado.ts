import ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";
import DataModel from "./DataModel";
import Imagenes from "./Imagenes";
import UnidadMedida from "./UnidadMedida";

interface ArticuloManufacturado extends DataModel<ArticuloManufacturado>  {
    denominacion: string;
    precioVenta: number;
    imagenes:Imagenes [];
    unidadMedida: UnidadMedida;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[];
  }
  
  export default ArticuloManufacturado;