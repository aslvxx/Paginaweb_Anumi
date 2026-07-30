import { Injectable, Logger } from '@nestjs/common';

import type { MailProvider } from '../interfaces/mail-provider.interface';
import type { PasswordResetEmail } from '../types/password-reset-email.type';

@Injectable()
export class ConsoleMailProvider implements MailProvider {
  private readonly logger = new Logger(ConsoleMailProvider.name);

  sendPasswordResetEmail(email: PasswordResetEmail): Promise<void> {
    this.logger.log(`Correo de recuperación para: ${email.to}`);

    this.logger.debug(
      [
        '--- PASSWORD RESET EMAIL ---',
        `Usuario: ${email.username}`,
        `Correo: ${email.to}`,
        `URL: ${email.resetUrl}`,
        `Expira en: ${email.expiresInMinutes} minutos`,
        '----------------------------',
      ].join('\n'),
    );

    return Promise.resolve();
  }
}
