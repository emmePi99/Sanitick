import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserRole } from '@shared';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null if no token is present', () => {
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should decode valid token correctly', () => {
    const payload = {
      sub: '123',
      email: 'test@example.com',
      role: UserRole.PATIENT,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('accessToken', token);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.getUserRole()).toBe(UserRole.PATIENT);
  });

  it('should return false for expired token', () => {
    const payload = {
      sub: '123',
      email: 'test@example.com',
      role: UserRole.PATIENT,
      exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
    };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('accessToken', token);

    expect(service.isAuthenticated()).toBe(false);
  });
});
