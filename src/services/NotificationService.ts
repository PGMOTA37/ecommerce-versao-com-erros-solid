import { Order } from '../domain/Order';
import { IMailProvider } from '../providers/IMailProvider';
import logger from '../lib/logger';

// Define O QUE enviar (assunto e corpo). COMO enviar é do IMailProvider.
export class NotificationService {
  constructor(private mailProvider: IMailProvider) {}

  async sendOrderConfirmation(order: Order): Promise<string | undefined> {
    const total = order.total.toFixed(2);

    const result = await this.mailProvider.sendMail({
      from: '"DevStore" <noreply@devstore.com>',
      to: order.customer,
      subject: `Confirmação do Pedido #${order.id}`,
      text: `Olá, seu pedido #${order.id} no valor de R$ ${total} foi confirmado.`,
      html: `
        <h1>Pedido Confirmado!</h1>
        <p>Olá, seu pedido <b>#${order.id}</b> foi processado com sucesso.</p>
        <p>Total: <strong>R$ ${total}</strong></p>
        <ul>
          ${order.items.map((item) => `<li>${item.name}</li>`).join('')}
        </ul>
      `,
    });

    logger.info(`Email enviado: ${result.previewUrl}`);
    return result.previewUrl;
  }
}
