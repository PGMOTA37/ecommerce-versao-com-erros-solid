import logger from '../lib/logger';
import { IPaymentMethod } from './IPaymentMethod';

// Exemplo da extensão (OCP): o Pix entrou sem editar nenhuma linha do OrderService.
export class PixPayment implements IPaymentMethod {
  async process(amount: number, details?: Record<string, any>): Promise<void> {
    logger.info(`Processando Pix de R$ ${amount.toFixed(2)}`);
    // Simulação: gerar cobrança Pix e aguardar confirmação
  }
}
