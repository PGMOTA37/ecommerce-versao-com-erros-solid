// Formato "cru" do produto, como vem do banco.
export interface ProductData {
  id: number;
  name: string;
  type: string;
  price: number;
}

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly type: string;
  calculateFreight(): number;
}
