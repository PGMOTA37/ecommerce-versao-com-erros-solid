import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../container/types';
import { AppError } from '../errors/AppError';
import logger from '../lib/logger';
import { OrderService } from '../services/OrderService';


@injectable()
export class OrderController {
  constructor(@inject(TYPES.OrderService) private orderService: OrderService) {}

  // Arrow function para manter o "this" quando passada como handler do Express.
  processOrder = async (req: Request, res: Response) => {
    try {
      const result = await this.orderService.processOrder(req.body);

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.orderId,
        emailPreview: result.emailPreview,
      });
    } catch (error: any) {
      return this.handleError(error, res);
    }
  };

  getOrderById = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.getOrderById(Number(req.params.id));
      return res.json(order);
    } catch (error: any) {
      return this.handleError(error, res);
    }
  };

  // Erro esperado (AppError) vira o status dele; qualquer outro vira 500.
  private handleError(error: any, res: Response) {
    if (error instanceof AppError) {
      logger.error(`Pedido rejeitado: ${error.message}`);
      return res.status(error.statusCode).json({ error: error.message });
    }
    logger.error(`Erro ao processar pedido: ${error.message}`);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
