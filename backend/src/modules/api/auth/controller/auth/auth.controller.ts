import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from '../../service/auth/auth.service';
import { RegisterDto } from '../../dto/auth/register.dto';
import { LoginDto } from '../../dto/auth/login.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../decorator/roles.decorator';
import { UserRole } from '@shared';
import { ChangePasswordDto } from '../../dto/auth/change-password.dto';
import type { AuthenticatedRequest } from '../../model/authenticated-request.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new patient' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully' })
  @ApiResponse({
    status: 409,
    description: 'Email or Codice Fiscale already exists',
  })
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }

  @Post('set-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set password for account activation' })
  @ApiResponse({ status: 200, description: 'Password set successfully' })
  async setPassword(
    @Body() setPasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.authService.setPassword(setPasswordDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('impersonate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Impersonate another user (Superadmin only)' })
  @ApiBody({ schema: { properties: { targetUserId: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Impersonation successful' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async impersonate(
    @Req() req: AuthenticatedRequest,
    @Body('targetUserId') targetUserId: string,
  ) {
    return this.authService.impersonate(req.user.id, targetUserId);
  }
}
