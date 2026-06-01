import { TestBed } from '@angular/core/testing';
import { BookingSearchComponent } from './booking-search.component';

describe('BookingSearchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSearchComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BookingSearchComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
