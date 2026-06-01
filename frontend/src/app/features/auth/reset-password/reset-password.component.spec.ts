import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, ReactiveFormsModule, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
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
