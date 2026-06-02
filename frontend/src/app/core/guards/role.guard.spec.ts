import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { roleGuard } from './role.guard';
import { UserRole } from '@shared';
import { vi, Mock } from 'vitest';

interface MockAuthService {
  getUserRole: Mock;
}

interface MockRouter {
  navigate: Mock;
}

describe('roleGuard', () => {
  let authServiceSpy: MockAuthService;
  let routerSpy: MockRouter;

  beforeEach(() => {
    authServiceSpy = { getUserRole: vi.fn() };
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should allow navigation if user has required role', () => {
    authServiceSpy.getUserRole.mockReturnValue(UserRole.PATIENT);
    const route = new ActivatedRouteSnapshot();
    route.data = { roles: [UserRole.PATIENT] };
    const state = { url: '/test' } as unknown as RouterStateSnapshot; // Snapshot is hard to mock
    
    const result = TestBed.runInInjectionContext(() => roleGuard(route, state));
    expect(result).toBe(true);
  });

  it('should redirect to unauthorized if user does not have required role', () => {
    authServiceSpy.getUserRole.mockReturnValue(UserRole.PATIENT);
    const route = { data: { roles: [UserRole.DOCTOR] } } as unknown as ActivatedRouteSnapshot;
    
    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as any));
    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
