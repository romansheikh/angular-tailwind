import { Injectable, Injector } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleOneTapService {
  constructor(private injector: Injector) {}

  initialize(): void {
    google.accounts.id.initialize({
      client_id: '834555597911-e03hvvmctncl6qkhq43na5ph7boen3fg.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      auto_select: true,
      cancel_on_tap_outside: false,
    });

    google.accounts.id.prompt();
  }

  private handleCredentialResponse(response: any): void {
    if (!response?.credential) {
      return;
    }
    // lazily get AuthGoogleService to avoid circular DI
    const auth = this.injector.get(AuthService);
    auth.handleCredentialResponse(response);
  }

  public CheckExistingToken(): void {
    const auth = this.injector.get(AuthService);
    auth.check();
  }

  // Reusable One Tap popup trigger
  public showOneTapPrompt(): void {
   
    google.accounts.id.prompt((moment: any) => {
      const type = moment.getMomentType();
      console.log("OneTap Moment:", type);

      // FedCM compatible tracking
      if (type === 'dismissed') {
        console.log("User dismissed One Tap");
      }
      if (type === 'skipped') {
        console.log("One Tap skipped");
      }
      if (type === 'displayed') {
        console.log("One Tap displayed");
      }
    });
  }
}
