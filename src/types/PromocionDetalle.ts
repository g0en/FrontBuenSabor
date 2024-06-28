import Articulo from "./Articulo";
import Base from "./Base";

export default interface PromocionDetalle extends Base{
    cantidad: number,
    articulo: Articulo
}