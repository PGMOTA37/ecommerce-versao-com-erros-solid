import { Product } from './IProduct';

export class DigitalProduct implements Product {
  readonly type = 'digital';

  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number
  ) {}

  calculateFreight(): number {
    return 0;
  }
}
