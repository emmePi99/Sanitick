import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { DoctorService, Doctor } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatSelectModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatFormFieldModule, 
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './booking-create.component.html',
  styleUrl: './booking-create.component.scss'
})
export class BookingCreateComponent implements OnInit {
  searchForm: FormGroup;
  doctors = signal<Doctor[]>([]);

  constructor(private fb: FormBuilder, private doctorService: DoctorService) {
    this.searchForm = this.fb.group({
      doctorId: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors.set(data),
      error: (err) => console.error('Error fetching doctors', err)
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      console.log('Search criteria:', this.searchForm.value);
      // Navigate to slot selection component
    }
  }
}
