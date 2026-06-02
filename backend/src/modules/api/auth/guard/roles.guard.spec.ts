import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '@shared';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  function createMockContext(user: any): Partial<ExecutionContext> {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  it('should return false if no user is present', () => {
    const context = createMockContext(null);
    expect(guard.canActivate(context as ExecutionContext)).toBe(false);
  });

  it('should return true if user is SUPERADMIN', () => {
    const context = createMockContext({ role: UserRole.SUPERADMIN });
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('should return true if no roles are required', () => {
    const context = createMockContext({ role: UserRole.PATIENT });
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(null);
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('should return true if user has required role', () => {
    const context = createMockContext({ role: UserRole.DOCTOR });
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      UserRole.DOCTOR,
      UserRole.ADMIN,
    ]);
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('should return false if user does not have required role', () => {
    const context = createMockContext({ role: UserRole.PATIENT });
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      UserRole.DOCTOR,
      UserRole.ADMIN,
    ]);
    expect(guard.canActivate(context as ExecutionContext)).toBe(false);
  });
});
