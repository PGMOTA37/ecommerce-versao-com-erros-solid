import { createApp } from './app';
import { OrderController } from './controllers/OrderController';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { DebitCardPayment } from './payments/DebitCardPayment';
import { IPaymentMethod } from './payments/IPaymentMethod';
import { PixPayment } from './payments/PixPayment';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { NotificationService } from './services/NotificationService';
import { OrderService } from './services/OrderService';

// Composition root (o "main" da aula 05): único lugar que conhece as classes
// concretas e faz a injeção de dependência manual. A ordem importa: de baixo para cima.
const productRepository = new PrismaProductRepository();
const orderRepository = new PrismaOrderRepository();

const mailProvider = new EtherealMailProvider();
const notificationService = new NotificationService(mailProvider);

// Para aceitar um novo meio de pagamento: criar a classe e registrar aqui.
const paymentMethods = new Map<string, IPaymentMethod>([
  ['credit_card', new CreditCardPayment()],
  ['debit_card', new DebitCardPayment()],
  ['pix', new PixPayment()],
]);

const orderService = new OrderService(
  productRepository,
  orderRepository,
  paymentMethods,
  notificationService
);
const orderController = new OrderController(orderService);

const app = createApp(orderController);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});
