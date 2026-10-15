import { Product } from './IProduct';

export class PhysicalProduct implements Product {
  readonly type = 'physical';
  // Frete fixo por item do pedido (mesma regra do código legado).
  private static readonly FREIGHT = 10;

  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number
  ) {}

  calculateFreight(): number {
    return PhysicalProduct.FREIGHT;
  }
}
