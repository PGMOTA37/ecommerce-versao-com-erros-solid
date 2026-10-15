// Contrato de pagamento (OCP): um meio novo é uma classe nova que implementa isto.
// Se o pagamento for recusado ou inválido, process() lança um AppError.
export interface IPaymentMethod {
  process(amount: number, details?: Record<string, any>): Promise<void>;
}
