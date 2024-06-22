import Articulo from "./Articulo";

export default interface ArticuloInsumo extends Articulo{
    precioCompra: number,
    stockActual: number,
    stockMaximo: number,
    stockMinimo: number,
    esParaElaborar: boolean
}