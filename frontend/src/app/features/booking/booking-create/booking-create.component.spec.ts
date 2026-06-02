import { TestBed } from '@angular/core/testing';
import { BookingCreateComponent } from './booking-create.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('BookingCreateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingCreateComponent],
      providers: [
        provideHttpClient(),
        provideAnimationsAsync()
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BookingCreateComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
