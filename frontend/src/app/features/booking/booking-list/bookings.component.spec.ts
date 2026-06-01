import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { BookingService } from '../../../core/services/booking.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let mockBookingService: { getBookings: any };

  beforeEach(async () => {
    mockBookingService = { getBookings: vi.fn().mockReturnValue(of([])) };
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: BookingService, useValue: mockBookingService }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render correct title', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Le tue prenotazioni');
  });
});
