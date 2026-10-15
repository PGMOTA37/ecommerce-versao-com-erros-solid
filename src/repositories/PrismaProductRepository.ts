import { prisma } from '../lib/prisma';
import { ProductData } from '../domain/IProduct';
import { IProductRepository } from './IProductRepository';

export class PrismaProductRepository implements IProductRepository {
  async findById(id: number): Promise<ProductData | null> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
    };
  }
}
