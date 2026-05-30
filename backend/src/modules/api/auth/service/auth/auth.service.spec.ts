import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserCoreService } from '../../../../core/user/service/user/user-core.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userCoreService: UserCoreService;

  const mockUserCoreService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if user exists', async () => {
      mockUserCoreService.findOneByEmail.mockResolvedValue({ id: '1' });
      await expect(service.register({ email: 'test@test.com' } as any))
        .rejects.toThrow(ConflictException);
    });
  });
});
