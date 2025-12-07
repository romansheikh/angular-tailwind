import { Component, inject, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToasterComponent } from './shared/toaster/toaster.component';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { GoogleOneTapService } from './core/services/google/google-one-tap.service';
import { LoginPopupService } from './core/services/login-popup.service';
import { LoginPopupComponent } from './shared/components/login-popup/login-popup.component';
import { CommonModule } from '@angular/common';
import { NgxSpinnerComponent } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    ResponsiveHelperComponent,
    ReactiveFormsModule,
    ToasterComponent,
    LoginPopupComponent,
    CommonModule,
    NgxSpinnerComponent
],
})
export class AppComponent {
  private ngZone = inject(NgZone);
  private oneTap = inject(GoogleOneTapService);
  popup = inject(LoginPopupService).popupOpen;
  title = 'Angular Tailwind';

  ngOnInit() {
    var token = localStorage.getItem('accessToken');
    if (token == 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    if (!token) {
      this.ngZone.run(() => {
        this.oneTap.initialize();
      });
    } else {
      this.oneTap.CheckExistingToken();
    }
  }

  // handleCredentialResponse(response: CredentialResponse) {
  // // Decoding  JWT token...
  //   let decodedToken: any | null = null;
  //   try {
  //     decodedToken = JSON.parse(atob(response?.credential.split('.')[1]));
  //   } catch (e) {
  //     console.error('Error while trying to decode token', e);
  //   }
  //   console.log('decodedToken', decodedToken);
  // }

  // private oneTap = inject(GoogleOneTapService);
  // ngOnInit() {
  //   this.oneTap.initialize();
  // @ts-ignore
  // window.onGoogleLibraryLoad = () => {
  //   console.log('Google\'s One-tap sign in script loaded!');

  //   // @ts-ignore
  //   google.accounts.id.initialize({
  //     // Ref: https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
  //     client_id: '834555597911-e03hvvmctncl6qkhq43na5ph7boen3fg.apps.googleusercontent.com',
  //     callback: this.handleCredentialResponse.bind(this), // Whatever function you want to trigger...
  //     auto_select: true,
  //     cancel_on_tap_outside: false
  //   });

  //   // OPTIONAL: In my case I want to redirect the user to an specific path.
  //   // @ts-ignore
  //   google.accounts.id.prompt((notification: PromptMomentNotification) => {
  //     console.log('Google prompt event triggered...');

  //     if (notification.getDismissedReason() === 'credential_returned') {
  //       this.ngZone.run(() => {
  //        // this.router.navigate(['myapp/somewhere'], { replaceUrl: true });
  //         console.log('Welcome back!');
  //       });
  //     }
  //   });
  // };
  // }
}
