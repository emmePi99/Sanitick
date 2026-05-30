import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserCoreService } from '../../../../core/user/service/user/user-core.service';
import { RegisterDto } from '../../dto/auth/register.dto';
import { LoginDto } from '../../dto/auth/login.dto';
import { User } from '../../../../core/user/entity/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userCoreService: UserCoreService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userCoreService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    return this.userCoreService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userCoreService.findOneByEmailWithPassword(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
       throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async impersonate(adminId: string, targetUserId: string): Promise<{ accessToken: string }> {
    const targetUser = await this.userCoreService.findOneById(targetUserId);
    if (!targetUser) {
      throw new ConflictException('Target user not found');
    }

    const payload = {
      sub: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      impersonatorId: adminId, // For audit/tracking
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
