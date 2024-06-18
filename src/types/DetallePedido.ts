import DataModel from "./DataModel";
import ArticuloInsumo from "./ArticuloInsumo";
import ArticuloManufacturado from "./ArticuloManufacturado";

export interface DetallePedido extends DataModel<DetallePedido> {
  cantidad: number;
  subTotal: number;
  articulo: ArticuloManufacturado | ArticuloInsumo; // Relación ManyToOne.
}
