import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const host = configService.getOrThrow<string>('DATABASE_HOST');

    const portValue = configService.getOrThrow<number>('DATABASE_PORT');

    const port = Number(portValue);

    if (Number.isNaN(port)) {
      throw new Error('DATABASE_PORT debe ser un numero valido');
    }

    const user = configService.getOrThrow<string>('DATABASE_USER');

    const password = configService.getOrThrow<string>('DATABASE_PASSWORD');

    const database = configService.getOrThrow<string>('DATABASE_NAME');

    const adapter = new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 5,
      ssl: false,
      connectTimeout: 5_000,
      acquireTimeout: 20_000,
      allowPublicKeyRetrieval: true,
    });

    super({
      adapter,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();

      await this.$queryRaw`SELECT 1`;

      this.logger.log('Conexión con MySQL comprobada correctamente');
    } catch (error: unknown) {
      this.logger.error('No se pudo conectar o consultar MySQL');

      if (error instanceof Error) {
        this.logger.error(error.message);
      }

      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Conexion con MySQL cerrada');
  }
}
