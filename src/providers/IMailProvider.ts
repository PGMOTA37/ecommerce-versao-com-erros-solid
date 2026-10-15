export interface MailMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface MailResult {
  // Link para visualizar o e-mail (existe no Ethereal, usado em testes).
  previewUrl?: string;
}

// Contrato mínimo (ISP): o negócio só precisa mandar um e-mail.
export interface IMailProvider {
  sendMail(message: MailMessage): Promise<MailResult>;
}
