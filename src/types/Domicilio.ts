import Base from "./Base";
import Localidad from "./Localidad";

export default interface Domicilio extends Base{
    calle: string,
    numero: number,
    cp: number,
    piso: number,
    nroDpto: number,
    localidad: Localidad | null
}