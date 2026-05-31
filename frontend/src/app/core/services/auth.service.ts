import { Injectable } from '@angular/core';
import { UserRole } from '@shared';

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp: number; // Expiration time in seconds
  impersonatorId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'accessToken';

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getUserRole(): UserRole | null {
    const token = this.getToken();
    if (!token) return null;
    
    const payload = this.decodeToken(token);
    return payload?.role || null;
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;

    // Convert seconds to milliseconds
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate.getTime() < Date.now();
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded: unknown = JSON.parse(window.atob(base64));
      
      if (this.isJwtPayload(decoded)) {
        return decoded;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  private isJwtPayload(data: unknown): data is JwtPayload {
    return (
      typeof data === 'object' &&
      data !== null &&
      'sub' in data &&
      'role' in data &&
      'exp' in data
    );
  }
}
