import DataModel from "./DataModel";
import Domicilio from "./Domicilio";
import Localidad from "./Localidad";
import Pedido from "./Pedido";

export default interface Cliente  extends DataModel<Cliente>{
    domicilios: Domicilio[],
    pedidos: Pedido[]
  }