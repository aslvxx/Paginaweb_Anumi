import { Injectable } from '@nestjs/common';
import type { MailProvider } from './interfaces/mail-provider.interface';
import type { PasswordResetEmail } from './types/password-reset-email.type';
import { ConfigService } from '@nestjs/config';
import { ConsoleMailProvider } from './providers/console-mail.provider';
import { ResendMailProvider } from './providers/resend-mail.provider';
import { SmtpMailProvider } from './providers/smtp-mail.provider';
import { MailProviderName } from './types/mail-provider-name.type';

@Injectable()
export class MailService {
  private readonly providers: Record<MailProviderName, MailProvider>;

  constructor(
    private readonly configService: ConfigService,
    consoleMailProvider: ConsoleMailProvider,
    resendMailProvider: ResendMailProvider,
    smtpMailProvider: SmtpMailProvider,
  ) {
    // 2. Se asigna aquí, dentro del constructor
    this.providers = {
      console: consoleMailProvider,
      resend: resendMailProvider,
      smtp: smtpMailProvider,
    };
  }

  async sendPasswordResetEmail(email: PasswordResetEmail): Promise<void> {
    const providerName =
      this.configService.get<MailProviderName>('MAIL_PROVIDER') ?? 'console';

    const provider = this.providers[providerName];

    if (!provider) {
      throw new Error(
        `El proveedor de correo "${providerName}" no está configurado`,
      );
    }
    await provider.sendPasswordResetEmail(email);
  }
}
