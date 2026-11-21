import { ProductData } from '../domain/IProduct';

// Contrato: o serviço só precisa buscar um produto. Não sabe que o Prisma existe.
export interface IProductRepository {
  findById(id: number): Promise<ProductData | null>;
}
