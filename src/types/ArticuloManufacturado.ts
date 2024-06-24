import Articulo from "./Articulo";
import ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";

export default interface ArticuloManufacturado extends Articulo{
    descripcion: string,
    tiempoEstimadoMinutos: number,
    preparacion: string,
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle | null
}