import express from 'express';
import { container } from './container/container';
import { TYPES } from './container/types';
import type { OrderController } from './controllers/OrderController';

export function createApp() {
  const app = express();
  app.use(express.json());

  const orderController = container.get<OrderController>(TYPES.OrderController);
  app.post('/orders', orderController.processOrder);

  return app;
}
