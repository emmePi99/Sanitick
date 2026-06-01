import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Booking } from '../models/booking.model';
export type { Booking };

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl.replace('/auth', '')}/booking`;

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getAvailableDates(doctorId: string, year: number, month: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/availability/${doctorId}/${year}/${month}`);
  }

  getAvailableSlots(doctorId: string, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/availability/${doctorId}/${date}`);
  }

  createBooking(bookingData: { doctorId: string; startTime: Date; endTime: Date }): Observable<void> {
    return this.http.post<void>(this.apiUrl, bookingData);
  }
}
