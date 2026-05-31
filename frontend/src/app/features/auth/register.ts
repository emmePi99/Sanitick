import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Registrazione Paziente</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nome</mat-label>
                <input matInput formControlName="firstName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Cognome</mat-label>
                <input matInput formControlName="lastName">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Codice Fiscale</mat-label>
              <input matInput formControlName="fiscalCode">
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid" class="full-width">Registrati</button>
            <div class="login-link">
              <span>Hai già un account?</span>
              <a routerLink="/login">Accedi qui</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 21px; background-color: #f5f5f5; }
    .register-card { width: 100%; max-width: 500px; padding: 21px; }
    .register-form { display: flex; flex-direction: column; gap: 13px; margin-top: 13px; }
    .form-row { display: flex; gap: 13px; }
    .form-row mat-form-field { flex: 1; }
    .full-width { width: 100%; }
    .login-link { margin-top: 13px; text-align: right; font-size: 14px; }
    .login-link a { color: #005b9f; text-decoration: none; margin-left: 5px; font-weight: bold; }
  `]
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fiscalCode: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => console.log('Registration successful'),
        error: (err) => console.error('Registration failed', err)
      });
    }
  }
}
