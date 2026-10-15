import express from 'express';
import { OrderController } from './controllers/OrderController';

// O app recebe o controller pronto: não cria nenhuma dependência concreta.
export function createApp(orderController: OrderController) {
  const app = express();
  app.use(express.json());

  app.post('/orders', orderController.processOrder);

  return app;
}
