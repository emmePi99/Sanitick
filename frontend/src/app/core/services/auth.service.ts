import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserRole } from '@shared';

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp: number; // Expiration time in seconds
  impersonatorId?: string;
}

import { environment } from '../../../environments/environment';
// ...
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
      })
    );
  }

  register(data: { email: string; firstName: string; lastName: string; fiscalCode: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, data);
  }

  setPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/set-password`, { token, password });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

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
    } catch (_e) {
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
