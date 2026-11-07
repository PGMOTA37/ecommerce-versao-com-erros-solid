export interface IPaymentMethod {

  readonly name: string;
  process(amount: number, details?: Record<string, any>): Promise<void>;
}
