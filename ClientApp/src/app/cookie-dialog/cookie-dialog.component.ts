import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GoogleAnalyticsService } from '../google-analaytics.service';
import { SharedService } from '../shared.service';
import {Title} from "@angular/platform-browser";

declare let gtag: Function;

@Component({
  selector: 'app-cookie-dialog',
  templateUrl: './cookie-dialog.component.html',
  styleUrls: ['./cookie-dialog.component.css'],
  providers: [GoogleAnalyticsService]
})
export class CookieDialogComponent implements OnInit {

  constructor(private router: Router, private googleAnalyticsService: GoogleAnalyticsService, public sharedService: SharedService, private titleService:Title) { }
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
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZZ7HCE7DX4';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  public deny(): void {
    this.sharedService.acceptedConsent = false;
    this.deleteCookie("_ga");
    this.deleteCookie("_ga_ZZ7HCE7DX4");
    this.setConsent(false);
    this.closePopup = true;
  }

  public accept(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (typeof gtag !== 'undefined') {
          gtag('config', 'G-ZZ7HCE7DX4', {
            page_title: event.urlAfterRedirects,
            page_location: event.urlAfterRedirects,
            page_path: event.urlAfterRedirects,
          });
        }
      }
    });
    this.loadScript();
    this.googleAnalyticsService.eventEmitter(this.titleService.getTitle(), window.location.href, "Visit", 'Visit', 1);
    this.sharedService.acceptedConsent = true;
    this.setConsent(true);
    this.closePopup = true;
  }

  public contactFormUsed() {
    if(this.getConsent()) {
      this.googleAnalyticsService.eventEmitter('Contact', 'Contact', "Contact", 'Contact', 1);}
  }

  public getConsent(): boolean {

    return localStorage.getItem('cookies_consented') === 'true';

  }

  public setConsent(value: boolean): void {
    localStorage.setItem('cookies_consented', value ? 'true' : 'false');
  }

  private deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }

  private setCookie(name: string, value: string, expireDays: number, path: string = 'path=/;') {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let domain : string = "localhost";
    if(window.location.hostname != "localhost")
        {
          domain = ".frankford-it.at";
        }

    let cpath: string = path ? `; path=${path}; domain=${domain}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

}
