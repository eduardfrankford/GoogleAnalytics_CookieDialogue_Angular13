import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { CookieDialogComponent } from './cookie-dialog.component';
import { SharedService } from '../shared.service';

// provide a noop gtag function for tests
declare const window: any;
window.gtag = () => {};

describe('CookieDialogComponent', () => {
  let component: CookieDialogComponent;
  let fixture: ComponentFixture<CookieDialogComponent>;
  let sharedService: SharedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookieDialogComponent ],
      imports: [RouterTestingModule],
      providers: [SharedService, Title]
    })
    .compileComponents();
  });

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(CookieDialogComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.inject(SharedService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dialog when no consent is stored', () => {
    expect(component.closePopup).toBeFalse();
    expect(sharedService.acceptedConsent).toBeFalse();
  });

  it('should hide dialog when consent is stored', () => {
    localStorage.setItem('cookies_consented', 'true');
    const fixture2 = TestBed.createComponent(CookieDialogComponent);
    const comp = fixture2.componentInstance;
    fixture2.detectChanges();
    expect(comp.closePopup).toBeTrue();
    expect(comp.sharedService.acceptedConsent).toBeTrue();
  });

  it('accept() should store consent and close popup', () => {
    component.accept();
    expect(localStorage.getItem('cookies_consented')).toBe('true');
    expect(sharedService.acceptedConsent).toBeTrue();
    expect(component.closePopup).toBeTrue();
    const script = document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=G-ZZ7HCE7DX4"]');
    expect(script).withContext('script tag added').not.toBeNull();
  });

  it('deny() should store negative consent and close popup', () => {
    component.deny();
    expect(localStorage.getItem('cookies_consented')).toBe('false');
    expect(sharedService.acceptedConsent).toBeFalse();
    expect(component.closePopup).toBeTrue();
  });

  it('showCookieDialog() should open the dialog', () => {
    component.closePopup = true;
    component.showCookieDialog();
    expect(component.closePopup).toBeFalse();
  });
});
