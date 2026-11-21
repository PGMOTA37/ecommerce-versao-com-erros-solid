import { injectable } from 'inversify';
import logger from '../lib/logger';
import { IPaymentMethod } from './IPaymentMethod';

@injectable()
export class DebitCardPayment implements IPaymentMethod {
  readonly name = 'debit_card';

  async process(amount: number, details?: Record<string, any>): Promise<void> {
    logger.info('Processando débito...');
    
  }
}
