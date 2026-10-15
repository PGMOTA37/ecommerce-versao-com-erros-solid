import nodemailer from 'nodemailer';
import { getMailClient } from '../lib/mail';
import { IMailProvider, MailMessage, MailResult } from './IMailProvider';

// Único lugar das regras de negócio que conhece o nodemailer.
export class EtherealMailProvider implements IMailProvider {
  async sendMail(message: MailMessage): Promise<MailResult> {
    const mailer = await getMailClient();
    const info = await mailer.sendMail(message);
    const url = nodemailer.getTestMessageUrl(info);
    return { previewUrl: url || undefined };
  }
}
