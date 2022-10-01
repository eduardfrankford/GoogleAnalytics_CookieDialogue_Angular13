import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GoogleAnalyticsService } from '../google-analaytics.service';
import { SharedService } from '../shared.service';

declare let gtag: Function;

@Component({
  selector: 'app-cookie-dialog',
  templateUrl: './cookie-dialog.component.html',
  styleUrls: ['./cookie-dialog.component.css'],
  providers: [GoogleAnalyticsService]
})
export class CookieDialogComponent implements OnInit {

  constructor(private router: Router, private googleAnalyticsService: GoogleAnalyticsService, public sharedService: SharedService) { }
  public closePopup = false;


  ngOnInit() {
    if (this.getConsent()) {

      this.accept();
    }
    else {
      //delete all cookies from this page
      this.deny();
      this.sharedService.acceptedConsent = false;
      this.closePopup = false;
    }
  }

  public showCookieDialog() {
    this.closePopup = false;
  }


  public loadScript() {
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=ENTER TAG';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
}

  public deny(): void {
    this.sharedService.acceptedConsent = false;
    this.deleteCookie("_ga");
    this.deleteCookie("_ga_ZZ7HCE7DX4");
    this.setConsent( false );
    this.closePopup = true;
  }

  public accept(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (typeof gtag !== 'undefined') {
          gtag('config', 'ENTER TAG', {
            page_path: event.urlAfterRedirects,
          });
        }
      }

    });
    this.loadScript();
    this.googleAnalyticsService.eventEmitter('TEST', 'User visited page', "User visited page" , 'accept dialog', 1);
    this.sharedService.acceptedConsent = true;
    this.setConsent(true);
    this.closePopup = true;
  }

  public getConsent(): boolean {

    return localStorage.getItem('cookies_consented') === 'true';

  }

  public setConsent(value: boolean): void {
    localStorage.setItem('cookies_consented', value ? 'true' : 'false');
  }



  private getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  private deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }

  private setCookie(name: string, value: string, expireDays: number, path: string = '') {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }


}
