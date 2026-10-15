import { Order, OrderItem } from '../domain/Order';
import { ProductFactory } from '../domain/ProductFactory';
import { AppError } from '../errors/AppError';
import logger from '../lib/logger';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { NotificationService } from './NotificationService';

export interface CreateOrderInput {
  customer: string;
  items: { productId: number; quantity: number }[];
  paymentMethod: string;
  paymentDetails?: Record<string, any>;
}

export interface CreateOrderResult {
  orderId: number;
  emailPreview?: string;
}

// Orquestra o fluxo: valida -> calcula -> paga -> salva -> notifica.
// Só depende de abstrações; quem entrega os objetos concretos é o server.ts (DIP).
export class OrderService {
  constructor(
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository,
    private paymentMethods: Map<string, IPaymentMethod>,
    private notificationService: NotificationService
  ) {}

  async processOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const { customer, items, paymentMethod, paymentDetails } = input;

    this.validate(customer, items);

    const { orderItems, total } = await this.buildItems(items);

    const payment = this.paymentMethods.get(paymentMethod);
    if (!payment) {
      throw new AppError('Método de pagamento não suportado', 400);
    }
    await payment.process(total, paymentDetails);

    const order: Order = await this.orderRepository.create({
      customer,
      items: orderItems,
      total,
      status: 'confirmed',
    });

    const emailPreview = await this.notificationService.sendOrderConfirmation(order);

    return { orderId: order.id, emailPreview };
  }

  private validate(customer: string, items: CreateOrderInput['items']): void {
    if (!items || items.length === 0) {
      logger.error('Tentativa de pedido sem itens');
      throw new AppError('Carrinho vazio', 400);
    }
    if (!customer) {
      throw new AppError('Cliente (e-mail) é obrigatório', 400);
    }
    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new AppError('Quantidade inválida', 400);
      }
    }
  }

  private async buildItems(items: CreateOrderInput['items']) {
    let total = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const data = await this.productRepository.findById(item.productId);
      if (!data) {
        throw new AppError(`Produto ${item.productId} não encontrado`, 400);
      }

      // Polimorfismo no lugar do if (product.type === ...): cada produto sabe seu frete.
      const product = ProductFactory.createProduct(data);
      total += product.price * item.quantity + product.calculateFreight();

      orderItems.push({
        id: product.id,
        name: product.name,
        type: product.type,
        price: product.price,
        quantity: item.quantity,
      });
    }

    return { orderItems, total };
  }
}
