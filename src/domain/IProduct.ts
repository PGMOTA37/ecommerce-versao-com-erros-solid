// Formato "cru" do produto, como vem do banco.
export interface ProductData {
  id: number;
  name: string;
  type: string;
  price: number;
}

// Contrato do produto. Quem usa um Product não sabe (nem precisa saber) se ele é físico ou digital.
// LSP: qualquer subtipo cumpre a promessa de calculateFreight() sem lançar erro e sem exigir mais.
export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly type: string;
  calculateFreight(): number;
}
