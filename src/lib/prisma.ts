import { PrismaClient } from '@prisma/client';

// Única instância do PrismaClient. Só a camada de repositórios importa este arquivo.
export const prisma = new PrismaClient();
