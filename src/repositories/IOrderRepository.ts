import { NewOrder, Order } from '../domain/Order';

export interface IOrderRepository {
  create(order: NewOrder): Promise<Order>;
}
