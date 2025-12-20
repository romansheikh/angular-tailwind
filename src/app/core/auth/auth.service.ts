// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { ApiResponseModel, LoginResponseModel } from '../models/apiresponse';
import { LoginPopupService } from '../services/login-popup.service';
import { UserService } from '../services/user.service';
import { WebApiService } from '../services/web-api-service';
import { AuthUtils } from './auth.utils';
import { HttpClient, HttpBackend, HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;
  public _authenticated = false;

  private readonly http = inject(WebApiService);
  private readonly userService = inject(UserService);
  private readonly popup = inject(LoginPopupService);

  // Http client that bypasses interceptors
  private readonly httpNoInterceptor: HttpClient;

  // Subject to notify when refresh completes (used by interceptor)
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.httpNoInterceptor = new HttpClient(inject(HttpBackend));
    this.loadTokens();
  }

  // Called by interceptor when waiting for refresh
  getRefreshTokenInProgress(): Observable<string | null> {
    return this.refreshTokenSubject.asObservable();
  }

  triggerRefreshComplete(token: string | null) {
    this.refreshTokenSubject.next(token);
  }

  // ─────────────────────────────────────
  // Refresh Token – MUST bypass interceptors!
  // ─────────────────────────────────────
  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    // CRITICAL: Use httpNoInterceptor to avoid infinite loop
    return this.httpNoInterceptor.post<ApiResponseModel<any>>('api/Auth/refresh', { refreshToken }).pipe(
      map((res: any) => {
        const body = res?.Body;
        if (!body?.AccessToken || !body?.RefreshToken) {
          throw new Error('Invalid refresh response');
        }
        this.saveTokens(body.AccessToken, body.RefreshToken);
        this.updateUserFromToken(body);
        return body.AccessToken;
      }),
      catchError((err) => {
        this.signOut();
        return throwError(() => err);
      })
    );
  }

  // ─────────────────────────────────────
  // Token Access
  // ─────────────────────────────────────
  getAccessToken(): string | null {
    return this._accessToken;
  }

  getRefreshToken(): string | null {
    return this._refreshToken;
  }

  isAuthenticated(): boolean {
    return this._authenticated && !!this._accessToken && !AuthUtils.isTokenExpired(this._accessToken);
  }

  // ─────────────────────────────────────
  // Token Storage
  // ─────────────────────────────────────
  private loadTokens() {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');

    if (!access || !refresh) {
      this._authenticated = false;
      return;
    }

    this._accessToken = access;
    this._refreshToken = refresh;

    if (AuthUtils.isTokenExpired(access)) {
      // Do NOT set authenticated yet
      this._authenticated = false;
      // Attempt silent refresh
      this.refreshAccessToken().subscribe({
        next: (newToken) => {
          this._authenticated = true;
          this.signInUsingAccessToken(newToken);
        },
        error: () => {
          this.signOut();
        }
      });
    } else {
      this._authenticated = true;
      this.signInUsingAccessToken(access);
    }
  }

  private saveTokens(access: string, refresh: string) {
    this._accessToken = access;
    this._refreshToken = refresh;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    this._authenticated = true;
  }

  private clearTokens() {
    this._accessToken = null;
    this._refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this._authenticated = false;
    this.userService.setUser(null);
  }

  signInUsingAccessToken(token: string) {
    const payload = AuthUtils.decodeToken(token);
    if (payload) {
      this.userService.updateUser({
        UserId: payload.sub,
        FullName: payload.given_name,
        Email: payload.email,
        Status: 'Online',
        Avatar: payload.picture,
      });
    }
    this._authenticated = true;
  }

  // ─────────────────────────────────────
  // Login / Google / Normal (unchanged mostly)
  // ─────────────────────────────────────
  handleCredentialResponse(response: any) {
    this.http.post(`api/Auth/google-login`, { token: response?.credential }).subscribe({
      next: (res: any) => this.processAuthResponse(res),
      error: (err) => console.error('Google login failed', err),
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
      error: (err) => console.error('Login failed', err),
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
      error: (err) => console.error('Signup failed', err),
    });
  }

  signIn(credentials: any): Observable<ApiResponseModel<LoginResponseModel>> {
    return this.http.post('api/Auth/login', credentials);
  }

  signUp(user: any): Observable<ApiResponseModel<LoginResponseModel>> {
    return this.http.post('api/Auth/register', user);
  }

  forgotPassword(email: string) {
    return this.http.post('api/Auth/forgot-password', { email });
  }

  resetPassword(password: string) {
    return this.http.post('api/Auth/reset-password', { password });
  }

  processAuthResponse(res: ApiResponseModel<LoginResponseModel>) {
    if (res.Status !== 200 || !res.Body) {
      console.error('Auth failed:', res.Message);
      return;
    }

    const b = res.Body;
    this.saveTokens(b.AccessToken, b.RefreshToken);
    this.updateUserFromToken(b);
    this.signInUsingAccessToken(b.AccessToken);
  }

  private updateUserFromToken(body: any) {
    this.userService.updateUser({
      UserId: body.UserId,
      FullName: body.FullName,
      Email: body.Email,
      Avatar: body.Avatar,
      Status: 'Online',
    });
  }

  signOut(): void {
    this.clearTokens();
    // Optionally redirect or open login
  }

  // For AuthGuard
  check(): Observable<boolean> {
    if (this.isAuthenticated()) {
      return of(true);
    }

    if (!this.getRefreshToken()) {
      return of(false);
    }

    return this.refreshAccessToken().pipe(
      map((token) => {
        this._authenticated = true;
        return true;
      }),
      catchError(() => {
        this.signOut();
        return of(false);
      })
    );
  }
}