import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Activate } from './activate';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Activate Component', () => {
  let component: Activate;
  let fixture: ComponentFixture<Activate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activate, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'test-token' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Activate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be loading initially', () => {
    expect(component.loading).toBeTrue();
  });
});
