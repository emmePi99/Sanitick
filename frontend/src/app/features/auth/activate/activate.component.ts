import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss'
})
export class ActivateComponent {
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
