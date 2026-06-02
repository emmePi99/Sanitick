import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';
import { vi, Mock } from 'vitest';

interface MockAuthService {
  isAuthenticated: Mock;
}

interface MockRouter {
  navigate: Mock;
}

describe('authGuard', () => {
  let authServiceSpy: MockAuthService;
  let routerSpy: MockRouter;

  beforeEach(() => {
    authServiceSpy = { isAuthenticated: vi.fn() };
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should allow navigation if authenticated', () => {
    authServiceSpy.isAuthenticated.mockReturnValue(true);
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = { url: '/test' } as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );
    expect(result).toBe(true);
  });

  it('should redirect to login if not authenticated', () => {
    authServiceSpy.isAuthenticated.mockReturnValue(false);
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = { url: '/test' } as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );
    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
