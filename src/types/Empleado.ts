import DataModel from "./DataModel";
import Pedido from "./Pedido"; // Asumiendo que existe esta interfaz.
import Sucursal from "./Sucursal"; // Asumiendo que existe esta interfaz.

export default interface Empleado extends DataModel<Empleado> {
  pedidos: Pedido[]; // OneToMany en Java se convierte en un arreglo de Pedidos.
  sucursal: Sucursal; // Relación ManyToOne.
}
