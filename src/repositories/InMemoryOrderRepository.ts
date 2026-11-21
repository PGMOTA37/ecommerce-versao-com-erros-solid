import { injectable } from 'inversify';
import { NewOrder, Order } from '../domain/Order';
import { IOrderRepository } from './IOrderRepository';

// Modo test: guarda os pedidos num array, sem banco de dados.
@injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = [];
  private nextId = 1;

  async create(order: NewOrder): Promise<Order> {
    const saved: Order = { ...order, id: this.nextId++ };
    this.orders.push(saved);
    return saved;
  }

  async findById(id: number): Promise<Order | null> {
    return this.orders.find((order) => order.id === id) ?? null;
  }
}
