import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { GoogleAnalyticsService } from '../google-analaytics.service';
import { SharedService } from '../shared.service';


@Component({
  selector: 'app-cookie-dialog',
  templateUrl: './cookie-dialog.component.html',
  styleUrls: ['./cookie-dialog.component.css']
})
export class CookieDialogComponent implements OnInit, OnDestroy {
  closePopup = false;

  private readonly storageKey = 'cookies_consented';
  private readonly cookieDomain = environment.cookieDomain;
  private readonly gaCookieNames = environment.analytics.cookieNames;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private ga: GoogleAnalyticsService,
    public shared: SharedService,
    private title: Title
  ) {}

  /* ---------- lifecycle ---------- */

  ngOnInit(): void {
    this.getConsent() ? this.handleAccept(false) : this.handleDeny(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ---------- UI bindings ---------- */

  showCookieDialog(): void { this.closePopup = false; }
  deny(): void  { this.handleDeny(true); }
  accept(): void { this.handleAccept(true); }

  /* ---------- consent logic ---------- */

  private handleDeny(updateStore = true): void {
    this.shared.acceptedConsent = false;
    this.gaCookieNames.forEach(c => this.setCookie(c, '', -1));
    if (updateStore) this.setConsent(false);
    this.closePopup = true;
  }

  private handleAccept(updateStore = true): void {
    this.shared.acceptedConsent = true;
    this.ga.load();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(e =>
        this.ga.pageView(e.urlAfterRedirects, this.title.getTitle())
      );

    if (updateStore) this.setConsent(true);
    this.closePopup = true;
  }

  /* ---------- helpers ---------- */

  private getConsent(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  private setConsent(val: boolean): void {
    localStorage.setItem(this.storageKey, val ? 'true' : 'false');
  }

  private setCookie(name: string, value: string, days: number, path = '/'): void {
    const date = new Date(Date.now() + days * 86_400_000).toUTCString();
    document.cookie = `${name}=${value}; expires=${date}; path=${path}; domain=${this.cookieDomain}`;
  }
}
