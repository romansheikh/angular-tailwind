import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoginPopupService } from '../../services/login-popup.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);
  const popup = inject(LoginPopupService);

  // Check the authentication status
  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          popup.open();
          return of(false);
        }
        return of(true);
      }),
    );
};
