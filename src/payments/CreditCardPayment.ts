import logger from '../lib/logger';
import { AppError } from '../errors/AppError';
import { IPaymentMethod } from './IPaymentMethod';

export class CreditCardPayment implements IPaymentMethod {
  async process(amount: number, details?: Record<string, any>): Promise<void> {
    if (!details?.cardNumber || !details?.cvv) {
      throw new AppError('Dados do cartão incompletos', 400);
    }
    logger.info(`Processando cartão final ${String(details.cardNumber).slice(-4)}`);
    // Simulação de gateway
    if (details.cvv === '000') {
      throw new AppError('Cartão recusado', 402);
    }
  }
}
