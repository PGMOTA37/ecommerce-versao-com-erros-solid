import logger from '../lib/logger';
import { IPaymentMethod } from './IPaymentMethod';

export class DebitCardPayment implements IPaymentMethod {
  async process(amount: number, details?: Record<string, any>): Promise<void> {
    logger.info('Processando débito...');
    // Lógica de débito
  }
}
