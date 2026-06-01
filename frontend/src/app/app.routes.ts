import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'booking', pathMatch: 'full' },
      { path: 'booking', loadComponent: () => import('./features/booking/booking-list/bookings.component').then(m => m.BookingsComponent) },
      { path: 'booking/new', loadComponent: () => import('./features/booking/booking-create/booking-create.component').then(m => m.BookingCreateComponent) }
    ],
  },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'set-password/:token', loadComponent: () => import('./features/auth/set-password/set-password.component').then(m => m.SetPasswordComponent) }
];
