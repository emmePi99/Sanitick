import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { environment } from '../../../environments/environment';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService]
    });
    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch bookings', () => {
    const mockBookings = [{ id: '1', status: 'PENDING' }];
    service.getBookings().subscribe(bookings => {
      expect(bookings).toEqual(mockBookings);
    });

    const req = httpMock.expectOne(`${environment.apiUrl.replace('/auth', '')}/booking`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBookings);
  });
});
