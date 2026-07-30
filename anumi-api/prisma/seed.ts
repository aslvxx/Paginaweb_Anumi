import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { hash } from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';

const PASSWORD_SALT_ROUNDS = 12;

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`La variable ${name} es obligatoria`);
  }

  return value;
}

function getDatabasePort(): number {
  const value = getRequiredEnvironmentVariable('DATABASE_PORT');
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('DATABASE_PORT debe ser un puerto válido');
  }

  return port;
}

async function main(): Promise<void> {
  const adapter = new PrismaMariaDb({
    host: getRequiredEnvironmentVariable('DATABASE_HOST'),
    port: getDatabasePort(),
    user: getRequiredEnvironmentVariable('DATABASE_USER'),
    password: process.env.DATABASE_PASSWORD ?? '',
    database: getRequiredEnvironmentVariable('DATABASE_NAME'),
    connectionLimit: 1,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  try {
    const username = getRequiredEnvironmentVariable('INITIAL_ADMIN_USERNAME')
      .trim()
      .toLowerCase();

    const email = getRequiredEnvironmentVariable('INITIAL_ADMIN_EMAIL')
      .trim()
      .toLowerCase();

    const password = getRequiredEnvironmentVariable('INITIAL_ADMIN_PASSWORD');

    if (password.length < 10 || password.length > 72) {
      throw new Error(
        'INITIAL_ADMIN_PASSWORD debe tener entre 10 y 72 caracteres',
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (existingUser) {
      console.log('El administrador inicial ya existe:');
      console.log(existingUser);
      return;
    }

    const passwordHash = await hash(password, PASSWORD_SALT_ROUNDS);

    const createdUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });

    console.log('Administrador inicial creado correctamente:');
    console.log(createdUser);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('No se pudo ejecutar el seed');

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});
