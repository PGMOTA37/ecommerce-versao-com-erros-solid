import { injectable } from 'inversify';
import { IMailProvider, MailMessage, MailResult } from './IMailProvider';

// Modo test: imprime o e-mail no console. Não usa rede nem internet.
@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(message: MailMessage): Promise<MailResult> {
    console.log('----- E-MAIL (ConsoleMailProvider) -----');
    console.log(`De:      ${message.from}`);
    console.log(`Para:    ${message.to}`);
    console.log(`Assunto: ${message.subject}`);
    console.log(message.text);
    console.log('----------------------------------------');
    return {};
  }
}
