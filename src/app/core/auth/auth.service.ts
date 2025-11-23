import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { WebApiService } from '../services/web-api-service';
import { AuthUtils } from './auth.utils';
import { UserService } from '../services/user.service';
import { LoginPopupService } from '../services/login-popup.service';
import { ApiResponseModel, LoginResponse } from '../models/apiresponse';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public _authenticated = false;
  private popup = inject(LoginPopupService);
  private _httpClient = inject(WebApiService);
  private _userService = inject(UserService);
  injector: any;

  constructor() {}

  // ------------------------------------------------------------
  // TOKENS
  // ------------------------------------------------------------
  set accessToken(token: string) {
    sessionStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return sessionStorage.getItem('accessToken') ?? '';
  }

  get refreshToken(): string {
    return sessionStorage.getItem('refreshToken') ?? '';
  }

  // ------------------------------------------------------------
  // AUTH API CALLS
  // ------------------------------------------------------------

  handleCredentialResponse(response: any) {
    this._httpClient.post(`api/Auth/google-login`, { token: response?.credential }).subscribe({
      next: (res: any) => {
        this.processAuthResponse(res);
      },
      error: (err) => console.error('Google login verify failed', err),
    });
  }

  // ------------------------------------------------------------
  // REFRESH TOKEN (Optimized)
  // ------------------------------------------------------------
  signInUsingAccessToken() {
    const token = this.accessToken;
    if (token && !AuthUtils.isTokenExpired(token)) {
      const payload = AuthUtils.decodeToken(token);
      this._userService.updateUser({
        UserId: payload.sub,
        FullName: payload.given_name,
        Email: payload.email,
        Status: 'Online',
        Avatar: payload.picture,
      });
      this._authenticated = true;
    }
  }

  signInUsingRefreshToken(): Observable<boolean> {
    const refreshToken = this.refreshToken;

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token found'));
    }
    return this._httpClient
      .post('api/Auth/refresh', {
        refreshToken: refreshToken,
      })
      .pipe(
        tap((response: any) => {
          this.processAuthResponse(response);
        }),

        map((response: any) => {
          const access = response?.Body?.AccessToken;
          return access ? access : false;
        }),

        catchError((error) => {
          console.error('Refresh error:', error);
          this.signOut();
          return of(false);
        }),
      );
  }

  private processAuthResponse(res: ApiResponseModel<LoginResponse>) {
    if (res.Status == 200) {
      const body = res?.Body;

      if (!body) {
        console.error('API did not return Body property');
        return null;
      }

      // Store tokens
      this.accessToken = body.AccessToken;
      sessionStorage.setItem('refreshToken', body.RefreshToken);

      this._authenticated = true;

      // Build user object
      const user = {
        UserId: body.UserId,
        FullName: body.FullName,
        Email: body.Email,
        Status: 'Online',
        Avatar: body.Avatar,
      };

      this._userService.updateUser(user);

      return {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        user,
      };
    } else {
      return {
        Status: res.Status,
        Message: res.Message,
      };
    }
  }

  // ------------------------------------------------------------
  // CHECK SIGNED IN (Optimized)
  // ------------------------------------------------------------
  check(): Observable<boolean> {
    if (this._authenticated) return of(true);

    if (!this.accessToken) return of(false);

    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return this.signInUsingRefreshToken().pipe(
        switchMap((newToken) => {
          if (!newToken) return of(false);
          this._authenticated = true;
          return of(true);
        }),
        catchError(() => of(false)),
      );
    }

    this.signInUsingAccessToken();
    return of(true);
  }

  // ------------------------------------------------------------
  // SIGN OUT
  // ------------------------------------------------------------
  signOut(): Observable<any> {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    this._authenticated = false;
    this._userService.setUser(null);
    return of(true);
  }

  // ------------------------------------------------------------
  // OTHER API WRAPPERS
  // ------------------------------------------------------------

  forgotPassword(email: string): Observable<ApiResponseModel<LoginResponse>> {
    return this._httpClient.post('api/Auth/forgot-password', email);
  }

  resetPassword(password: string): Observable<ApiResponseModel<LoginResponse>> {
    return this._httpClient.post('api/Auth/reset-password', password);
  }

  signUp(user: any): Observable<ApiResponseModel<LoginResponse>> {
    return this._httpClient.post('api/Auth/register', user);
  }
  signIn(credentials: any): Observable<ApiResponseModel<LoginResponse>> {
    return this._httpClient.post('api/Auth/login', credentials);
  }

  processSignUpdata(user: ApiResponseModel<LoginResponse>) {
    this.signUp(user).subscribe({
      next: (res) => {
        if (res.Status == 200) {
          this.processAuthResponse(res);
          this.popup.close();
        }
      },
      error: (err) => console.error('Failed to load pair rate', err),
    });
  }
  processSignIndata(credentials: any): void {
    if (this._authenticated) {
      console.error('Already logged in.');
      return;
    }

    this.signIn(credentials).subscribe({
      next: (res) => {
        console.log('Login response:', res);

        // SUCCESS
        if (res.Status === 200) {
          this.processAuthResponse(res);
          this.popup.close();
          return;
        }

        // ERROR (401, 400, 500)
        // Swal will be shown automatically by your interceptor
      },

      error: (err) => {
        console.error('Login failed:', err);
      },
    });
  }

  unlockSession(credentials: any): Observable<any> {
    return this._httpClient.post('api/auth/unlock-session', credentials);
  }
}
