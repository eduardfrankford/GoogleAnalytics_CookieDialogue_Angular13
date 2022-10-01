import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

declare let gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = "Google Analytics Cookie Dialog for Angular 13";

  constructor(private router: Router) {}

  ngOnInit() {

  }

}
