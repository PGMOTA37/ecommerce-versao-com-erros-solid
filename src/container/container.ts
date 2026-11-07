import { Container } from 'inversify';
import { TYPES } from './types';

import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { NotificationService } from '../services/NotificationService';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { DebitCardPayment } from '../payments/DebitCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { ConsoleMailProvider } from '../providers/ConsoleMailProvider';
import { IMailProvider } from '../providers/IMailProvider';

const appEnv = process.env.APP_ENV ?? 'dev';

if (appEnv !== 'dev' && appEnv !== 'test') {
  throw new Error(`APP_ENV inválido: "${appEnv}". Use "dev" ou "test".`);
}

export const container = new Container();

container
  .bind<IProductRepository>(TYPES.ProductRepository)
  .to(PrismaProductRepository)
  .inSingletonScope();

if (appEnv === 'test') {
  container.bind<IMailProvider>(TYPES.MailProvider).to(ConsoleMailProvider).inSingletonScope();
  container
    .bind<IOrderRepository>(TYPES.OrderRepository)
    .to(InMemoryOrderRepository)
    .inSingletonScope();
} else {
  container.bind<IMailProvider>(TYPES.MailProvider).to(EtherealMailProvider).inSingletonScope();
  container
    .bind<IOrderRepository>(TYPES.OrderRepository)
    .to(PrismaOrderRepository)
    .inSingletonScope();
}

container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(CreditCardPayment).inSingletonScope();
container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(DebitCardPayment).inSingletonScope();
container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(PixPayment).inSingletonScope();

container
  .bind<PaymentMethodRegistry>(TYPES.PaymentMethodRegistry)
  .to(PaymentMethodRegistry)
  .inSingletonScope();
container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
container.bind<OrderService>(TYPES.OrderService).to(OrderService);
container.bind<OrderController>(TYPES.OrderController).to(OrderController);
