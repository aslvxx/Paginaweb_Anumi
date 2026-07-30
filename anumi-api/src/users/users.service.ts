import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { Prisma, type User } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { publicUserSelect } from './types/public-user-select';
import type { PublicUser } from './types/public-user.type';
import { normalizeEmail, normalizeUsername } from './utils/normalize-user-data';

@Injectable()
export class UsersService {
  private static readonly PASSWORD_SALT_ROUNDS = 12;

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    const username = normalizeUsername(createUserDto.username);
    const email = normalizeEmail(createUserDto.email);

    const passwordHash = await hash(
      createUserDto.password,
      UsersService.PASSWORD_SALT_ROUNDS,
    );

    try {
      return await this.prisma.user.create({
        data: {
          username,
          email,
          passwordHash,
        },
        select: publicUserSelect,
      });
    } catch (error: unknown) {
      this.handlePrismaUniqueConstraintError(error);
      throw error;
    }
  }

  async findAll(): Promise<PublicUser[]> {
    return this.prisma.user.findMany({
      select: publicUserSelect,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findPublicById(id: number): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: publicUserSelect,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const normalizedUsername = normalizeUsername(username);

    return this.prisma.user.findUnique({
      where: {
        username: normalizedUsername,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = normalizeEmail(email);

    return this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findActiveById(id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        isActive: true,
      },
    });
  }

  async updateStatus(
    id: number,
    isActive: boolean,
    authenticatedUserId: number,
  ): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (id === authenticatedUserId && !isActive) {
      throw new BadRequestException('No puedes desactivar tu propia cuenta');
    }

    if (!isActive && user.isActive) {
      const activeUsersCount = await this.prisma.user.count({
        where: {
          isActive: true,
        },
      });

      if (activeUsersCount <= 1) {
        throw new BadRequestException(
          'No se puede desactivar el único usuario activo',
        );
      }
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
      select: publicUserSelect,
    });
  }

  private handlePrismaUniqueConstraintError(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const fields = this.getUniqueConstraintFields(error.meta?.target);

      if (fields.includes('username')) {
        throw new ConflictException('El nombre de usuario ya está registrado');
      }

      if (fields.includes('email')) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }

      throw new ConflictException('Ya existe un usuario con esos datos');
    }
  }

  private getUniqueConstraintFields(target: unknown): string[] {
    if (Array.isArray(target)) {
      return target.filter(
        (field): field is string => typeof field === 'string',
      );
    }

    if (typeof target === 'string') {
      return [target];
    }

    return [];
  }
}
