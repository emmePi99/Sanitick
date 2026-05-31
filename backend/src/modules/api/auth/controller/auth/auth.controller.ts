import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';
import { RegisterDto } from '../../dto/auth/register.dto';
import { LoginDto } from '../../dto/auth/login.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../decorator/roles.decorator';
import { UserRole } from '@shared';
import { ChangePasswordDto } from '../../dto/auth/change-password.dto';
import { UpdateResult } from 'typeorm';
import type { AuthenticatedRequest } from '../../model/authenticated-request.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<UpdateResult> {
    return await this.authService.changePassword(changePasswordDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('impersonate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  async impersonate(
    @Req() req: AuthenticatedRequest,
    @Body('targetUserId') targetUserId: string,
  ) {
    return this.authService.impersonate(req.user.id, targetUserId);
  }
}
