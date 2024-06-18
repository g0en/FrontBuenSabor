import DataModel from "./DataModel";
import ImagenArticulo from "./ImagenArticulo"; // Asumiendo que existe esta interfaz.
import UnidadMedida from "./UnidadMedida"; // Asumiendo que existe esta interfaz.
import Categoria from "./Categoria"; // Asumiendo que existe esta interfaz.

export default interface Articulo extends DataModel<Articulo> {
  denominacion: string;
  precioVenta: number;
  imagenes: ImagenArticulo[]; // Relación OneToMany convertida a array en TypeScript.
  unidadMedida: UnidadMedida; // Relación ManyToOne.
  categoria: Categoria; // Relación ManyToOne con clave personalizada en categoria_id.
}
