import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserCoreService } from '../../../../core/user/service/user/user-core.service';
import { RegisterDto } from '../../dto/auth/register.dto';
import { LoginDto } from '../../dto/auth/login.dto';
import { User } from '../../../../core/user/entity/user/user.entity';
import { ChangePasswordDto } from '../../dto/auth/change-password.dto';
import { UpdateResult } from 'typeorm';
import dayjs from 'dayjs';
import { MailOrCfConflictException } from 'src/modules/api/auth/exception/mail-or-cf-conflict.exception';
import { InvalidCredentialException } from '../../exception/invalid-credential.exception';
import { buildAlreadyExistingUserFindOptionsWhere } from 'src/modules/core/user/util/user.util';
import { AccessTokenUser } from '../../model/access-token-user.model';
import { LoginResponseDto } from '../../dto/auth/login-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userCoreService: UserCoreService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const alreadyExisistingUserFIndOptionsWhere = buildAlreadyExistingUserFindOptionsWhere(registerDto.email, registerDto.fiscalCode);
    const existingUser = await this.userCoreService.findOneBy(alreadyExisistingUserFIndOptionsWhere);

    if (existingUser) {
      throw new MailOrCfConflictException();
    }

    await this.userCoreService.create(registerDto);
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<UpdateResult> {
    const user = await this.userCoreService.findOneBy({
      activationToken: changePasswordDto.token
    });
    
    if (!user) {
      throw new NotFoundException('Token non valido o già utilizzato');
    }

    const now = dayjs(); 
    const expirationDate = dayjs(user.activationTokenExpires);

    if (now.isAfter(expirationDate)) {
      throw new BadRequestException('Il link è scaduto. Richiedi una nuova email');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.password, 10);

    return await this.userCoreService.update(user.id, {
      password: hashedPassword,
      isActive: true,
      activationToken: null,
      activationTokenExpires: null,
    });
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userCoreService.findOneByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new InvalidCredentialException();
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialException();
    }

    const payload: AccessTokenUser = { 
      sub: user.id,
      email: user.email, 
      role: user.role 
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async impersonate(
    adminId: string,
    targetUserId: string,
  ): Promise<LoginResponseDto> {
    const targetUser = await this.userCoreService.findOneBy({
      id: targetUserId,
    });
    if (!targetUser) {
      throw new NotFoundException('Utente non trovato');
    }

    const payload: AccessTokenUser = {
      sub: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      impersonatorId: adminId
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
