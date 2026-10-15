import { Product, ProductData } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';

type ProductBuilder = (data: ProductData) => Product;

// O "new" dos concretos fica reunido aqui. Um tipo novo (ex.: 'subscription')
// é só mais uma linha neste mapa; o OrderService não muda.
const builders = new Map<string, ProductBuilder>([
  ['physical', (d) => new PhysicalProduct(d.id, d.name, d.price)],
  ['digital', (d) => new DigitalProduct(d.id, d.name, d.price)],
]);

export class ProductFactory {
  static createProduct(data: ProductData): Product {
    const build = builders.get(data.type);
    if (!build) {
      throw new Error(`Tipo de produto desconhecido: ${data.type}`);
    }
    return build(data);
  }
}
