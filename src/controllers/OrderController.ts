import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../container/types';
import { AppError } from '../errors/AppError';
import logger from '../lib/logger';
import { OrderService } from '../services/OrderService';


@injectable()
export class OrderController {
  constructor(@inject(TYPES.OrderService) private orderService: OrderService) {}


  processOrder = async (req: Request, res: Response) => {
    try {
      const result = await this.orderService.processOrder(req.body);

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.orderId,
        emailPreview: result.emailPreview,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        logger.error(`Pedido rejeitado: ${error.message}`);
        return res.status(error.statusCode).json({ error: error.message });
      }
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
}
