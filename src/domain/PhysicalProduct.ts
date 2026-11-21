import { Product } from './IProduct';

export class PhysicalProduct implements Product {
  readonly type = 'physical';

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
