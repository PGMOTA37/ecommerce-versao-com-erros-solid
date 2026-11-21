import { Container } from 'inversify';
import { TYPES } from './types';

// Este é o ÚNICO arquivo que importa classes concretas e decide o que injetar.
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

// Sem APP_ENV definido, usa o modo dev.
const appEnv = process.env.APP_ENV ?? 'dev';

if (appEnv !== 'dev' && appEnv !== 'test') {
  throw new Error(`APP_ENV inválido: "${appEnv}". Use "dev" ou "test".`);
}

export const container = new Container();

// Produtos continuam vindo do SQLite local nos dois modos (não precisa de internet).
container
  .bind<IProductRepository>(TYPES.ProductRepository)
  .to(PrismaProductRepository)
  .inSingletonScope();

// A única diferença entre os modos: e-mail e repositório de pedidos.
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

// Todas as formas de pagamento com o MESMO identificador: chegam ao registro via @multiInject.
// Para aceitar um novo meio de pagamento: criar a classe e adicionar um bind aqui.
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
