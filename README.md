# Google Analytics Cookie Dialog for Angular17
Google Analytics Cookie Dialog for Angular 17

I implemented a cookie dialogue working with Google Analytics and other Cookies for my Angular 17 project with .net6.0, because I could not find a proper solution anywhere else.
I hope it helps somebody else!

## How it looks like

![Screenshot](./ClientApp/src/assets/Screenshot%20from%202023-07-28%2010-32-34.png)

## How it works

1. The user visits the page and the cookie dialog is shown
2. The user can accept or decline the cookies
3. If the user accepts the cookies, the Google Analytics script is loaded and the cookies are set
4. If the user declines the cookies, the Google Analytics script is not loaded and the cookies are not set

## How to use

1. Copy the following files and folders to your project:
    - ClientApp/src/app/cookie-dialog -> Here is the logic regarding the cookie dialog
    - ClientApp/src/app/footer -> The footer of the page where we can edit the cookies
    - ClientApp/src/app/app.module.ts -> Here we import the CookieDialogComponent
    - ClientApp/src/app/google-analaytics.service.ts -> The Angular implementation for Google Analytics
    - ClientApp/src/app/shared.service.ts -> Here the variable is shared between pages whether the Cookies were accepted or not
    - ClientApp/src/index.html -> Here we include the Google Analytics script
    - ClientApp/src/polyfills.ts -> import '@angular/localize/init'; // Needed for Angular 17

