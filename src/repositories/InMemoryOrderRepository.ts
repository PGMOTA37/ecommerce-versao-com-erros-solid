import { injectable } from 'inversify';
import { NewOrder, Order } from '../domain/Order';
import { IOrderRepository } from './IOrderRepository';

@injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = [];
  private nextId = 1;

  async create(order: NewOrder): Promise<Order> {
    const saved: Order = { ...order, id: this.nextId++ };
    this.orders.push(saved);
    return saved;
  }
}
