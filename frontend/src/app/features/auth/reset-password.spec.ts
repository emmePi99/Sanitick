import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPassword } from './reset-password';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ResetPassword Component', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPassword, ReactiveFormsModule, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate the form when passwords do not match', () => {
    component.resetForm.setValue({
      password: 'password123',
      confirmPassword: 'password456'
    });
    expect(component.resetForm.valid).toBeFalse();
  });

  it('should validate the form when passwords match', () => {
    component.resetForm.setValue({
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(component.resetForm.valid).toBeTrue();
  });
});
