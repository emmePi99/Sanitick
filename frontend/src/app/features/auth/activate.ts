import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="activation-container">
      <h1>Attivazione Account</h1>
      <mat-spinner *ngIf="loading"></mat-spinner>
      <p *ngIf="!loading && success">Account attivato con successo!</p>
      <p *ngIf="!loading && !success">Errore durante l'attivazione.</p>
    </div>
  `
})
export class Activate {
  loading = true;
  success = false;

  constructor(private route: ActivatedRoute) {
    const token = this.route.snapshot.paramMap.get('token');
    console.log('Activating with token:', token);
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      this.success = true;
    }, 2000);
  }
}
