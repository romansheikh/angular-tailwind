// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { ApiResponseModel, LoginResponse } from '../models/apiresponse';
import { LoginPopupService } from '../services/login-popup.service';
import { UserService } from '../services/user.service';
import { WebApiService } from '../services/web-api-service';
import { AuthUtils } from './auth.utils';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;
  public _authenticated = false;

  private readonly http = inject(WebApiService);
  private readonly userService = inject(UserService);
  private readonly popup = inject(LoginPopupService);

  constructor() {
    this.loadTokens();
  }

  // ─────────────────────────────────────
  // Public Token Access
  // ─────────────────────────────────────
  getAccessToken(): string | null {
    return this._accessToken;
  }

  getRefreshToken(): string | null {
    return this._refreshToken;
  }

  // ─────────────────────────────────────
  // Token Storage
  // ─────────────────────────────────────
  private loadTokens() {
    const access = sessionStorage.getItem('accessToken');
    const refresh = sessionStorage.getItem('refreshToken');

    if (access && refresh && !AuthUtils.isTokenExpired(access)) {
    
      this._accessToken = access;
      this._refreshToken = refresh;
      this._authenticated = true;
      this.signInUsingAccessToken(access);

    } else {
      this.clearTokens();
    }
  }

  private saveTokens(access: string, refresh: string) {
    this._accessToken = access;
    this._refreshToken = refresh;
    sessionStorage.setItem('accessToken', access);
    sessionStorage.setItem('refreshToken', refresh);
    this._authenticated = true;
  }

  private clearTokens() {
    this._accessToken = null;
    this._refreshToken = null;
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    this._authenticated = false;
    this.userService.setUser(null);
  }

  signInUsingAccessToken(token: string) {
      const payload = AuthUtils.decodeToken(token);
      this.userService.updateUser({
        UserId: payload.sub,
        FullName: payload.given_name,
        Email: payload.email,
        Status: 'Online',
        Avatar: payload.picture,
      });
      this._authenticated = true;
    }  


  // ─────────────────────────────────────
  // Refresh Token (used by interceptor)
  // ─────────────────────────────────────
  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.signOut();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post('api/Auth/refresh', { refreshToken }).pipe(
      map((res: any) => {
        console.log(res);
        const body = res?.Body;
        if (!body?.AccessToken || !body?.RefreshToken) {
          throw new Error('Invalid refresh response');
        }
        this.saveTokens(body.AccessToken, body.RefreshToken);
        this.updateUserFromToken(body);
        return body.AccessToken;
      }),
      catchError(err => {
        this.signOut();
        return throwError(() => err);
      })
    );
  }


  // ─────────────────────────────────────
  // Login / Google / Normal
  // ─────────────────────────────────────
  handleCredentialResponse(response: any) {
    this.http.post(`api/Auth/google-login`, { token: response?.credential }).subscribe({
      next: (res: any) => this.processAuthResponse(res),
      error: (err) => console.error('Google login failed', err)
    });
  }

  processSignIndata(credentials: any): void {
    if (this._authenticated) return;

    this.signIn(credentials).subscribe({
      next: (res) => {
        if (res.Status === 200) {
          this.processAuthResponse(res);
          this.popup.close();
        }
      },
      error: (err) => console.error('Login failed', err)
    });
  }

  processSignUpdata(user: any) {
    this.signUp(user).subscribe({
      next: (res) => {
        if (res.Status === 200) {
          this.processAuthResponse(res);
          this.popup.close();
        }
      },
      error: (err) => console.error('Signup failed', err)
    });
  }

  // ─────────────────────────────────────
  // API Wrappers
  // ─────────────────────────────────────
  signIn(credentials: any): Observable<ApiResponseModel<LoginResponse>> {
    return this.http.post('api/Auth/login', credentials);
  }

  signUp(user: any): Observable<ApiResponseModel<LoginResponse>> {
    return this.http.post('api/Auth/register', user);
  }

  forgotPassword(email: string) {
    return this.http.post('api/Auth/forgot-password', { email });
  }

  resetPassword(password: string) {
    return this.http.post('api/Auth/reset-password', { password });
  }

  // ─────────────────────────────────────
  // Process Response (shared)
  // ─────────────────────────────────────
  processAuthResponse(res: ApiResponseModel<LoginResponse>) {
    if (res.Status !== 200 || !res.Body) {
      console.error('Auth failed:', res.Message);
      return;
    }

    const b = res.Body;
    this.saveTokens(b.AccessToken, b.RefreshToken);
    this.updateUserFromToken(b);
  }

  private updateUserFromToken(body: any) {
    this.userService.updateUser({
      UserId: body.UserId,
      FullName: body.FullName,
      Email: body.Email,
      Avatar: body.Avatar,
      Status: 'Online'
    });
  }

  // ─────────────────────────────────────
  // Sign Out
  // ─────────────────────────────────────
  signOut(): void {
    this.clearTokens();
   // this.popup.open();
    // or router.navigate(['/login'])
  }

  // ─────────────────────────────────────
  // Check Auth (for AuthGuard)
  // ─────────────────────────────────────
  check(): Observable<boolean> {
    if (this._authenticated && this._accessToken && !AuthUtils.isTokenExpired(this._accessToken)) {
      return of(true);
    }

    if (!this.getRefreshToken()) {
      return of(false);
    }

    return this.refreshAccessToken().pipe(
      map(token => !!token),
      catchError(() => of(false))
    );
  }
}