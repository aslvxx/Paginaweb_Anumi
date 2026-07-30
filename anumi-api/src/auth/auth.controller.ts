import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedUser } from './types/authenticated-user.type';
import type { LoginResponse } from './types/login-response.type';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { ForgotPasswordResponse } from './types/forgot-password-response.type';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { ResetPasswordResponse } from './types/reset-password-response.type';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }

  @Public()
  @Throttle({
    default: {
      limit: 3,
      ttl: 15 * 60_000,
    },
  })
  @Post('forgot-password')
  forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(dto);
  }
}
