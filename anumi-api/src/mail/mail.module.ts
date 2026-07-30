import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { MailProvider } from './interfaces/mail-provider.interface';
import { MAIL_PROVIDER } from './mail.constants';
import { MailService } from './mail.service';
import { ConsoleMailProvider } from './providers/console-mail.provider';
import { ResendMailProvider } from './providers/resend-mail.provider';
import type { MailProviderName } from './types/mail-provider-name.type';
import { SmtpMailProvider } from './providers/smtp-mail.provider';

@Module({
  providers: [
    MailService,
    ConsoleMailProvider,
    ResendMailProvider,
    SmtpMailProvider,
    {
      provide: MAIL_PROVIDER,
      inject: [ConfigService, ConsoleMailProvider, ResendMailProvider],
      useFactory: (
        configService: ConfigService,
        consoleMailProvider: ConsoleMailProvider,
        resendMailProvider: ResendMailProvider,
        smtpMailProvider: SmtpMailProvider,
      ): MailProvider => {
        const provider = configService.get<MailProviderName>(
          'MAIL_PROVIDER',
          'console',
        );

        switch (provider) {
          case 'console':
            return consoleMailProvider;

          case 'resend':
            return resendMailProvider;

          case 'smtp':
            return smtpMailProvider;

          default:
            throw new Error(
              `Proveedor de correo no válido: ${String(provider)}`,
            );
        }
      },
    },
  ],
  exports: [MailService],
})
export class MailModule {}
