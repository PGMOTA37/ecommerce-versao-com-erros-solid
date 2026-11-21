// Erro esperado, causado pelo cliente (dados inválidos, pagamento recusado...).
// O controller converte para o status HTTP correto; qualquer outro erro vira 500.
export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
  }
}
