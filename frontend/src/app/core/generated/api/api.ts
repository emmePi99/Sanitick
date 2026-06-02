export * from './app.service';
import { AppService } from './app.service';
export * from './auth.service';
import { AuthService } from './auth.service';
export * from './booking.service';
import { BookingService } from './booking.service';
export * from './doctor.service';
import { DoctorService } from './doctor.service';
export const APIS = [AppService, AuthService, BookingService, DoctorService];
