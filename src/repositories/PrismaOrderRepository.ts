import { injectable } from 'inversify';
import { prisma } from '../lib/prisma';
import { NewOrder, Order } from '../domain/Order';
import { IOrderRepository } from './IOrderRepository';

@injectable()
export class PrismaOrderRepository implements IOrderRepository {
  async create(order: NewOrder): Promise<Order> {
    const saved = await prisma.order.create({
      data: {
        customer: order.customer,
        items: JSON.stringify(order.items),
        total: order.total,
        status: order.status,
      },
    });
    return { ...order, id: saved.id };
  }
}
