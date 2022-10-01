import { Component, Input, OnInit } from '@angular/core';
import { CookieDialogComponent } from '../cookie-dialog/cookie-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  @Input()
  public cookieComponent!: CookieDialogComponent;

  showCookieDialog() {
    this.cookieComponent.showCookieDialog();
  }

}
