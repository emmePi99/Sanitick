import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '@shared';

const isUserRole = (val: unknown): val is UserRole => {
  for (const role of Object.values(UserRole)) {
    if (val === role) return true;
  }
  return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const rawRoles: unknown = route.data['roles'];
  
  const requiredRoles: UserRole[] = [];
  if (Array.isArray(rawRoles)) {
    for (const r of rawRoles) {
      if (isUserRole(r)) {
        requiredRoles.push(r);
      }
    }
  }

  const userRole = authService.getUserRole();

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  // Redirect to unauthorized or login page
  router.navigate(['/unauthorized']);
  return false;
};
