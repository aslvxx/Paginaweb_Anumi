import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import type { MailProvider } from '../interfaces/mail-provider.interface';
import type { PasswordResetEmail } from '../types/password-reset-email.type';

@Injectable()
export class ResendMailProvider implements MailProvider {
  private readonly logger = new Logger(ResendMailProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(email: PasswordResetEmail): Promise<void> {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');

    const fromName = this.configService.getOrThrow<string>('MAIL_FROM_NAME');

    const fromAddress =
      this.configService.getOrThrow<string>('MAIL_FROM_ADDRESS');

    const resend = new Resend(apiKey);
    const from = `${fromName} <${fromAddress}>`;

    const { data, error } = await resend.emails.send({
      from,
      to: email.to,
      subject: 'Restablece tu contraseña',
      html: this.buildPasswordResetHtml(email),
    });

    if (error) {
      this.logger.error(
        `No se pudo enviar el correo de recuperación a ${email.to}`,
        error,
      );

      throw new ServiceUnavailableException(
        'No fue posible enviar el correo de recuperación',
      );
    }

    this.logger.log(`Correo de recuperación enviado: ${data?.id}`);
  }

  private buildPasswordResetHtml(email: PasswordResetEmail): string {
    return `
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          >
          <title>Restablecer contraseña</title>
        </head>

        <body>
          <h1>Restablecer contraseña</h1>

          <p>Hola ${email.username},</p>

          <p>
            Recibimos una solicitud para restablecer
            la contraseña de tu cuenta.
          </p>

          <p>
            <a href="${email.resetUrl}">
              Restablecer contraseña
            </a>
          </p>

          <p>
            Este enlace expirará en
            ${email.expiresInMinutes} minutos.
          </p>

          <p>
            Si no solicitaste este cambio,
            puedes ignorar este correo.
          </p>
        </body>
      </html>
    `;
  }
}
