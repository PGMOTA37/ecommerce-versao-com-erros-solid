import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import { getMailClient } from '../lib/mail';
import { IMailProvider, MailMessage, MailResult } from './IMailProvider';

@injectable()
export class EtherealMailProvider implements IMailProvider {
  async sendMail(message: MailMessage): Promise<MailResult> {
    const mailer = await getMailClient();
    const info = await mailer.sendMail(message);
    const url = nodemailer.getTestMessageUrl(info);
    return { previewUrl: url || undefined };
  }
}
