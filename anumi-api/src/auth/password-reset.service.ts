import { Injectable, BadRequestException } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

const PASSWORD_RESET_TOKEN_BYTES = 32;
const PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES = 15;

export type CreatedPasswordResetToken = {
  token: string;
  expiresAt: Date;
};

export type ValidatedPasswordResetToken = {
  id: number;
  userId: number;
};

@Injectable()
export class PasswordResetService {
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(userId: number): Promise<CreatedPasswordResetToken> {
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = this.calculateExpirationDate();

    await this.prisma.$transaction(async (transaction) => {
      await transaction.passwordResetToken.deleteMany({
        where: {
          userId,
        },
      });

      await transaction.passwordResetToken.create({
        data: {
          tokenHash,
          expiresAt,
          userId,
        },
      });
    });

    return {
      token,
      expiresAt,
    };
  }

  async validateToken(token: string): Promise<ValidatedPasswordResetToken> {
    const tokenHash = this.hashToken(token);
    const now = new Date();

    const passwordResetToken = await this.prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
      select: {
        id: true,
        userId: true,
        usedAt: true,
        expiresAt: true,
        user: {
          select: {
            isActive: true,
          },
        },
      },
    });

    if (
      !passwordResetToken ||
      passwordResetToken.usedAt !== null ||
      passwordResetToken.expiresAt <= now ||
      !passwordResetToken.user.isActive
    ) {
      throw new BadRequestException(
        'El token de recuperación no es válido o ha expirado',
      );
    }

    return {
      id: passwordResetToken.id,
      userId: passwordResetToken.userId,
    };
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateToken(): string {
    return randomBytes(PASSWORD_RESET_TOKEN_BYTES).toString('hex');
  }

  private calculateExpirationDate(): Date {
    const expirationMilliseconds =
      PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES * 60 * 1000;

    return new Date(Date.now() + expirationMilliseconds);
  }
}
