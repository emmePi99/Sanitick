import { TestBed } from '@angular/core/testing';
import { MainLayout } from './main-layout';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MainLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout, NoopAnimationsModule],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(MainLayout);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the toolbar', () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar')).toBeTruthy();
    expect(compiled.querySelector('mat-toolbar')?.textContent).toContain('Sanitick');
  });
});
