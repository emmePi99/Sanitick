import { TestBed } from '@angular/core/testing';
import { BookingsComponent } from './bookings.component';
import { BookingService } from '@core/services/booking.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('BookingsComponent', () => {
  let mockBookingService: any;

  beforeEach(async () => {
    mockBookingService = { getBookings: vi.fn().mockReturnValue(of([])) };
    await TestBed.configureTestingModule({
      imports: [BookingsComponent],
      providers: [
        provideHttpClient(),
        { provide: BookingService, useValue: mockBookingService }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(BookingsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render correct title', () => {
    const fixture = TestBed.createComponent(BookingsComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Le tue prenotazioni');
  });
});
