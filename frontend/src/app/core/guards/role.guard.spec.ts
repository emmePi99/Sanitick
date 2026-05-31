import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { roleGuard } from './role.guard';
import { UserRole } from '@shared';
import { vi } from 'vitest';

describe('roleGuard', () => {
  let authServiceSpy: { getUserRole: any };
  let routerSpy: { navigate: any };

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
    const route = { data: { roles: [UserRole.PATIENT] } } as unknown as ActivatedRouteSnapshot;
    
    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as any));
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
