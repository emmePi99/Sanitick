import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  registrationSuccess = signal(false);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Italian Fiscal Code Regex
    const fiscalCodeRegex = /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/;

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fiscalCode: ['', [Validators.required, Validators.pattern(fiscalCodeRegex)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.registrationSuccess.set(true);
          this.isLoading.set(false);
        },
        error: (err: any) => {
          this.isLoading.set(false);
          // Mostra il messaggio di errore dal backend
          this.errorMessage.set(err?.error?.message || 'Si è verificato un errore durante la registrazione.');
          console.error('Registration failed', err);
        }
      });
    }
  }
}
