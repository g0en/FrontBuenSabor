import DataModel from "./DataModel";
import { FormaPago } from "./Pedido";

export default interface Factura extends DataModel<Factura> {
  fechaFacturacion: string; // LocalDate se convierte en string (YYYY-MM-DD).
  mpPaymentId: number;
  mpMerchantOrderId: number;
  mpPreferenceId: string;
  mpPaymentType: string;
  formaPago: FormaPago; // Enum importado de algún lugar.
  totalVenta: number;
}
