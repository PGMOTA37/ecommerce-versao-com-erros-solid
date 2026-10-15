import { Product } from './IProduct';

export class DigitalProduct implements Product {
  readonly type = 'digital';

  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number
  ) {}

  // Produto digital não tem frete. Retorna 0 em vez de lançar erro: o cliente
  // trata físico e digital do mesmo jeito (LSP).
  calculateFreight(): number {
    return 0;
  }
}
