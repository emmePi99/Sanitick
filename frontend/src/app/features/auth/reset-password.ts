import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Imposta Nuova Password</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Nuova Password</mat-label>
            <input matInput formControlName="password" type="password">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Conferma Password</mat-label>
            <input matInput formControlName="confirmPassword" type="password">
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="resetForm.invalid">Reset Password</button>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class ResetPassword {
  resetForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }

  onSubmit() {
    if (this.resetForm.valid) {
      console.log('Resetting password');
    }
  }
}
