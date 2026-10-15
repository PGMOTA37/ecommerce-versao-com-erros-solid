export interface OrderItem {
  id: number;
  name: string;
  type: string;
  price: number;
  quantity: number;
}

// Pedido ainda não gravado (sem id).
export interface NewOrder {
  customer: string;
  items: OrderItem[];
  total: number;
  status: string;
}

export interface Order extends NewOrder {
  id: number;
}
