import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/api/auth/service/auth/auth.service';
import { UserCoreService } from 'src/modules/core/user/service/user/user-core.service';
import { UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { MailOrCfConflictException } from 'src/modules/api/auth/exception/mail-or-cf-conflict.exception';
import { InvalidCredentialException } from 'src/modules/api/auth/exception/invalid-credential.exception';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { UserRole } from '@shared';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userCoreService: UserCoreService;
  let jwtService: JwtService;

  const mockUserCoreService = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    findOneByEmailWithPassword: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserCoreService, useValue: mockUserCoreService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userCoreService = module.get<UserCoreService>(UserCoreService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw MailOrCfConflictException if user exists', async () => {
      mockUserCoreService.findOneBy.mockResolvedValue({ id: '1' });
      await expect(service.register({ email: 'test@test.com', fiscalCode: 'FISC123' } as any))
        .rejects.toThrow(MailOrCfConflictException);
    });

    it('should create a user if not exists', async () => {
      mockUserCoreService.findOneBy.mockResolvedValue(null);
      mockUserCoreService.create.mockResolvedValue({ id: '1', email: 'test@test.com' });
      const result = await service.register({ email: 'test@test.com', fiscalCode: 'FISC123' } as any);
      expect(result).toBeUndefined();
      expect(mockUserCoreService.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw InvalidCredentialException if user not found', async () => {
      mockUserCoreService.findOneByEmailWithPassword.mockResolvedValue(null);
      await expect(service.login({ email: 'test@test.com', password: 'password' }))
        .rejects.toThrow(InvalidCredentialException);
    });

    it('should throw InvalidCredentialException if password invalid', async () => {
      mockUserCoreService.findOneByEmailWithPassword.mockResolvedValue({ id: '1', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login({ email: 'test@test.com', password: 'password' }))
        .rejects.toThrow(InvalidCredentialException);
    });

    it('should return access token on successful login', async () => {
      mockUserCoreService.findOneByEmailWithPassword.mockResolvedValue({ id: '1', email: 'test@test.com', password: 'hashed', role: UserRole.PATIENT });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token');
      const result = await service.login({ email: 'test@test.com', password: 'password' });
      expect(result).toEqual({ accessToken: 'token' });
    });
  });
describe('setPassword', () => {
  it('should throw NotFoundException if token is invalid', async () => {
    mockUserCoreService.findOneBy.mockResolvedValue(null);
    await expect(service.setPassword({ token: 'invalid', password: 'new' }))
      .rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if token is expired', async () => {
    mockUserCoreService.findOneBy.mockResolvedValue({
      id: '1',
      activationTokenExpires: dayjs().subtract(1, 'hour').toDate()
    });
    await expect(service.setPassword({ token: 'expired', password: 'new' }))
      .rejects.toThrow(BadRequestException);
  });

  it('should update password and return UpdateResult', async () => {
    mockUserCoreService.findOneBy.mockResolvedValue({
      id: '1',
      activationTokenExpires: dayjs().add(1, 'hour').toDate()
    });
    mockUserCoreService.update.mockResolvedValue({ affected: 1 });
    (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');

    const result = await service.setPassword({ token: 'valid', password: 'new' });
    expect(result).toEqual({ affected: 1 });
    expect(mockUserCoreService.update).toHaveBeenCalledWith('1', expect.objectContaining({
      password: 'newhashed',
      isActive: true,
      activationToken: null,
    }));
  });
});

  describe('impersonate', () => {
    it('should throw NotFoundException if target user not found', async () => {
      mockUserCoreService.findOneBy.mockResolvedValue(null);
      await expect(service.impersonate('adminId', 'targetId'))
        .rejects.toThrow(NotFoundException);
    });

    it('should return access token with impersonatorId', async () => {
      mockUserCoreService.findOneBy.mockResolvedValue({ id: 'targetId', email: 'target@test.com', role: UserRole.PATIENT });
      mockJwtService.signAsync.mockResolvedValue('impersonatedToken');
      
      const result = await service.impersonate('adminId', 'targetId');
      expect(result).toEqual({ accessToken: 'impersonatedToken' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(expect.objectContaining({
        sub: 'targetId',
        impersonatorId: 'adminId'
      }));
    });
  });
});
