import { injectable } from 'inversify';
import logger from '../lib/logger';
import { AppError } from '../errors/AppError';
import { IPaymentMethod } from './IPaymentMethod';

@injectable()
export class CreditCardPayment implements IPaymentMethod {
  readonly name = 'credit_card';

  async process(amount: number, details?: Record<string, any>): Promise<void> {
    if (!details?.cardNumber || !details?.cvv) {
      throw new AppError('Dados do cartão incompletos', 400);
    }
    logger.info(`Processando cartão final ${String(details.cardNumber).slice(-4)}`);
    if (details.cvv === '000') {
      throw new AppError('Cartão recusado', 402);
    }
  }
}
