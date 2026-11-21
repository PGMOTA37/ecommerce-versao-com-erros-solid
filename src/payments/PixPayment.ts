import { injectable } from 'inversify';
import logger from '../lib/logger';
import { IPaymentMethod } from './IPaymentMethod';


@injectable()
export class PixPayment implements IPaymentMethod {
  readonly name = 'pix';

  async process(amount: number, details?: Record<string, any>): Promise<void> {
    logger.info(`Processando Pix de R$ ${amount.toFixed(2)}`);

  }
}
