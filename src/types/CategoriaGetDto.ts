import Categoria from "./Categoria";
import CategoriaShortDto from "./CategoriaShortDto";
import Sucursal from "./Sucursal";

export default interface CategoriaGetDto{
    id: number | null,
    eliminado: boolean
    denominacion: string,
    esInsumo: boolean,
    sucursales: Sucursal[] | null,
    subCategorias: Categoria[] | null,
    categoriaPadre: CategoriaShortDto | null
}