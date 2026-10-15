import { NewOrder, Order } from '../domain/Order';

// Contrato: o serviço só precisa gravar um pedido.
export interface IOrderRepository {
  create(order: NewOrder): Promise<Order>;
}
