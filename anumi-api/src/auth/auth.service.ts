import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './types/jwt-payload.type';
import type { LoginResponse } from './types/login-response.type';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordResetService } from './password-reset.service';
import type { ForgotPasswordResponse } from './types/forgot-password-response.type';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { ResetPasswordResponse } from './types/reset-password-response.type';
import { MailService } from '../mail/mail.service';

const FORGOT_PASSWORD_RESPONSE_MESSAGE =
  'Si el correo está asociado a una cuenta activa, recibirás instrucciones para restablecer la contraseña.';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordResetService: PasswordResetService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.usersService.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException(
        'Nombre de usuario o contraseña incorrectos',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('La cuenta está desactivada');
    }

    const passwordMatches = await compare(loginDto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Nombre de usuario o contraseña incorrectos',
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const publicUser = await this.usersService.findPublicById(user.id);

    return {
      accessToken,
      user: publicUser,
    };
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.isActive) {
      return this.createForgotPasswordResponse();
    }

    const { token } = await this.passwordResetService.createForUser(user.id);

    const resetUrl = this.buildResetPasswordUrl(token);

    await this.mailService.sendPasswordResetEmail({
      to: user.email,
      username: user.username,
      resetUrl,
      expiresInMinutes: 15,
    });

    return this.createForgotPasswordResponse();
  }

  async resetPassword(dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    const { id: tokenId, userId } =
      await this.passwordResetService.validateToken(dto.token);

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const now = new Date();

    await this.prisma.$transaction(async (transaction) => {
      const consumedToken = await transaction.passwordResetToken.updateMany({
        where: {
          id: tokenId,
          userId,
          usedAt: null,
          expiresAt: {
            gt: now,
          },
          user: {
            isActive: true,
          },
        },
        data: {
          usedAt: now,
        },
      });

      if (consumedToken.count !== 1) {
        throw new BadRequestException(
          'El token de recuperación no es válido o ha expirado',
        );
      }

      const updatedUser = await transaction.user.updateMany({
        where: {
          id: userId,
          isActive: true,
        },
        data: {
          passwordHash,
          tokenVersion: {
            increment: 1,
          },
        },
      });

      if (updatedUser.count !== 1) {
        throw new BadRequestException(
          'El token de recuperación no es válido o ha expirado',
        );
      }
    });

    return {
      message: 'La contraseña se restableció correctamente.',
    };
  }

  private createForgotPasswordResponse(): ForgotPasswordResponse {
    return {
      message: FORGOT_PASSWORD_RESPONSE_MESSAGE,
    };
  }

  private buildResetPasswordUrl(token: string): string {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');

    const resetUrl = new URL('/reset-password', frontendUrl);

    resetUrl.searchParams.set('token', token);

    return resetUrl.toString();
  }
}
