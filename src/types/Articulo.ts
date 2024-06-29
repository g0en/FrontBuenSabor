import Base from "./Base";
import Categoria from "./Categoria";
import Imagen from "./Imagen";
import SucursalShortDto from "./SucursalShortDto";
import UnidadMedida from "./UnidadMedida";

export default interface Articulo extends Base{
    denominacion: string,
    precioVenta: number,
    habilitado: boolean,
    imagenes: Imagen[],
    unidadMedida: UnidadMedida,
    categoria: Categoria | null,
    sucursal: SucursalShortDto | null
}