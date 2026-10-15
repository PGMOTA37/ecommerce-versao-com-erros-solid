import { prisma } from '../lib/prisma';
import { NewOrder, Order } from '../domain/Order';
import { IOrderRepository } from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  async create(order: NewOrder): Promise<Order> {
    const saved = await prisma.order.create({
      data: {
        customer: order.customer,
        // A tabela guarda os itens como JSON string; esse detalhe fica só aqui.
        items: JSON.stringify(order.items),
        total: order.total,
        status: order.status,
      },
    });
    return { ...order, id: saved.id };
  }
}
