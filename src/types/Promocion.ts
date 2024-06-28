import Base from "./Base";
import Imagen from "./Imagen";
import PromocionDetalle from "./PromocionDetalle";
import Sucursal from "./Sucursal";
import { TipoPromocion } from "./enums/TipoPromocion";

export default interface Promocion extends Base{
    denominacion: string,
    fechaDesde: string,
    fechaHasta: string,
    horaDesde: string,
    horaHasta: string,
    descripcionDescuento: string,
    precioPromocional: number,
    tipoPromocion: TipoPromocion | null,
    imagenes: Imagen[],
    sucursal: Sucursal[] | null,
    promocionDetalle: PromocionDetalle[]
}