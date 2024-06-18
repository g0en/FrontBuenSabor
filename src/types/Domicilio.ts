import Base from "./Base";

export default interface Domicilio extends Base{
    calle: string,
    numero: number,
    cp: number,
    piso: number,
    nroDpto: number,
    localidadId: number
}