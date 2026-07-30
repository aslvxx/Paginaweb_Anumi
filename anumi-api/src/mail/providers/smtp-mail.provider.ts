import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

import type { MailProvider } from '../interfaces/mail-provider.interface';
import type { PasswordResetEmail } from '../types/password-reset-email.type';

@Injectable()
export class SmtpMailProvider implements MailProvider {
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(email: PasswordResetEmail): Promise<void> {
    const transporter = this.getTransporter();

    const fromName = this.configService.getOrThrow<string>('MAIL_FROM_NAME');

    const fromAddress =
      this.configService.getOrThrow<string>('MAIL_FROM_ADDRESS');

    await transporter.sendMail({
      from: {
        name: fromName,
        address: fromAddress,
      },
      to: email.to,
      subject: 'Recuperación de contraseña',
      text: this.buildPasswordResetText(email),
      html: this.buildPasswordResetHtml(email),
    });
  }

  private getTransporter(): Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<number>('SMTP_PORT'),
      secure: this.configService.getOrThrow<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });

    return this.transporter;
  }

  async verifyConnection(): Promise<void> {
    const transporter = this.getTransporter();

    await transporter.verify();
  }

  private buildPasswordResetText(email: PasswordResetEmail): string {
    return [
      `Hola ${email.username},`,
      '',
      'Recibimos una solicitud para restablecer tu contraseña.',
      '',
      `Abre el siguiente enlace: ${email.resetUrl}`,
      '',
      `El enlace expirará en ${email.expiresInMinutes} minutos.`,
      '',
      'Si no solicitaste este cambio, puedes ignorar este correo.',
    ].join('\n');
  }

  private buildPasswordResetHtml(email: PasswordResetEmail): string {
    const username = escapeHtml(email.username);
    const resetUrl = escapeHtml(email.resetUrl);
    const expiresInMinutes = String(email.expiresInMinutes);

    return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Recuperación de contraseña</title>
      </head>

      <body>
        <p>Hola ${username},</p>

        <p>
          Recibimos una solicitud para restablecer
          tu contraseña.
        </p>

        <p>
          <a href="${resetUrl}">
            Restablecer contraseña
          </a>
        </p>

        <p>
          Este enlace expirará en
          ${expiresInMinutes} minutos.
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
