# Google Analytics Cookie Dialog for Angular 17

Reusable consent dialog that toggles Google Analytics (or any tag manager script) in Angular 17 projects.

## Features

* **Environment driven config**  
  `src/environments/environment.ts` holds the GA measurement ID, list of GA cookie names to purge and the cookie domain.
* **Lazy GA loader**  
  Loads `gtag.js` only after consent.
* **Auto page view tracking**  
  Subscribes to `NavigationEnd` and emits `page_view`.
* **Unit tested**  
  Jasmine / Karma spec proves accept and deny flows.
* **Single source of truth**  
  `SharedService.acceptedConsent` is accessible anywhere in the app.

## Screenshot

![Screenshot](./ClientApp/src/assets/Screenshot%20from%202023-07-28%2010-32-34.png)

## How it works

1. Dialog appears on first visit.  
2. **Accept**  
   * GA script loads  
   * `page_view` sent on every route change  
   * Consent state stored in `localStorage`  
3. **Deny**  
   * GA script never loads  
   * All GA cookies listed in `environment.analytics.cookieNames` are deleted  
   * Consent state stored as `false`

## Installation

```
ClientApp/
└─ src/
   ├─ app/
   │  ├─ cookie-dialog/            # component, template, styles
   │  ├─ services/
   │  │  ├─ google-analytics.service.ts
   │  │  └─ shared.service.ts
   │  └─ footer/                   # optional "Manage Cookies" link
   ├─ environments/
   │  ├─ environment.ts            # edit GA id, cookie names, domain
   │  └─ environment.prod.ts
   ├─ index.html                   # script loads lazily
   └─ polyfills.ts                 # ensure  import '@angular/localize/init';
```

Add `CookieDialogComponent` to a template, for example `app.component.html`:

```html
<app-cookie-dialog></app-cookie-dialog>
<router-outlet></router-outlet>
<app-footer></app-footer>
```

No module changes are required; the services use `providedIn: 'root'`.

## Configuring

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  analytics: {
    measurementId: 'G-XXXXXXX',      // your GA4 ID
    cookieNames: ['_ga', '_gid']     // cookies to delete on deny
  },
  cookieDomain:
    window.location.hostname === 'localhost'
      ? 'localhost'
      : '.example.com'               // change to your root domain
};
```

## Running tests

```bash
ng test --code-coverage
```

`cookie-dialog.component.spec.ts` covers accept, deny and default flows.

## License

MIT