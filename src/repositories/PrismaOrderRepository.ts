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
        // A tabela guarda os itens como JSON string; esse detalhe fica só aqui.
        items: JSON.stringify(order.items),
        total: order.total,
        status: order.status,
      },
    });
    return { ...order, id: saved.id };
  }

  async findById(id: number): Promise<Order | null> {
    const saved = await prisma.order.findUnique({ where: { id } });
    if (!saved) return null;
    return {
      id: saved.id,
      customer: saved.customer,
      // Volta de JSON string para a lista de itens.
      items: JSON.parse(saved.items),
      total: saved.total,
      status: saved.status,
    };
  }
}
