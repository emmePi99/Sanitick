import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from 'src/modules/api/auth/service/auth/auth.service';
import { RegisterDto } from 'src/modules/api/auth/dto/auth/register.dto';
import { LoginDto } from 'src/modules/api/auth/dto/auth/login.dto';
import { JwtAuthGuard } from 'src/modules/api/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/api/auth/guard/roles.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    setPassword: jest.fn(),
    login: jest.fn(),
    impersonate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      const dto: RegisterDto = { email: 'test@test.com' } as any;
      await controller.register(dto);
      expect(authService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('setPassword', () => {
    it('should call authService.setPassword', async () => {
      const dto = { token: 'token', password: 'password' };
      await controller.setPassword(dto);
      expect(authService.setPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const dto: LoginDto = { email: 'test@test.com', password: 'password' };
      await controller.login(dto);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('impersonate', () => {
    it('should call authService.impersonate', async () => {
      const req = { user: { id: 'adminId' } };
      const targetUserId = 'targetId';
      await controller.impersonate(req, targetUserId);
      expect(authService.impersonate).toHaveBeenCalledWith(
        'adminId',
        targetUserId,
      );
    });
  });
});
