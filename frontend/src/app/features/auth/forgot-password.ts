import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Recupera Password</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email">
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="forgotForm.invalid">Invia link di reset</button>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class ForgotPassword {
  forgotForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      console.log('Reset request for', this.forgotForm.value.email);
    }
  }
}
