import { NewOrder, Order } from '../domain/Order';

// Contrato: o serviço só precisa gravar um pedido e buscá-lo pelo id.
export interface IOrderRepository {
  create(order: NewOrder): Promise<Order>;
  findById(id: number): Promise<Order | null>;
}
