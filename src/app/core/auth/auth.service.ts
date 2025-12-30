// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { ApiResponseModel, LoginResponseModel } from '../models/apiresponse';
import { LoginPopupService } from '../services/login-popup.service';
import { UserService } from '../services/user.service';
import { WebApiService } from '../services/web-api-service';
import { AuthUtils } from './auth.utils';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;
  public _authenticated = false;
private readonly route = inject(Router);
  private readonly http = inject(WebApiService);
  private readonly userService = inject(UserService);
  private readonly popup = inject(LoginPopupService);

  // Subject to notify when refresh completes (used by interceptor)
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
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

  // Refresh Token API
  refreshAccess(refreshToken: string): Observable<ApiResponseModel<LoginResponseModel>> {
    return this.http.post<ApiResponseModel<LoginResponseModel>>('api/Auth/refresh', { refreshToken });
  }

  // Refresh access token (returns Observable)
  refreshAccessToken(): Observable<ApiResponseModel<LoginResponseModel>> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.refreshAccess(refreshToken).pipe(
      tap((res) => {
        if (res.Status !== 200 || !res.Body) {
          throw new Error('Refresh token invalid');
        }

        // ✅ Tokens are stored HERE
        this.saveTokens(res.Body.AccessToken, res.Body.RefreshToken);

        this.updateUserFromToken(res.Body);
        this.popup.close();
      }),
    );
  }

  // Load tokens on app start
  private loadTokens(): void {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      this.clearTokens();
      return;
    }

    this._accessToken = accessToken;
    this._refreshToken = refreshToken;

    // Case 1: Access token still valid
    if (!AuthUtils.isTokenExpired(accessToken)) {
      this._authenticated = true;
      this.signInUsingAccessToken(accessToken);
      return;
    }

    // Case 2: Access token expired → refresh
    this._authenticated = false;

    this.refreshAccessToken().subscribe({
      next: (res) => {
        const newAccessToken = res.Body!.AccessToken;
        this._accessToken = newAccessToken;
        this._authenticated = true;
        this.signInUsingAccessToken(newAccessToken);
        alert('Token refreshed successfully');
        //  console.log('Access token refreshed successfully');
      },
      error: () => {
        console.warn('Refresh token expired or invalid');
        this.signOut();
      },
    });
  }

  // Save tokens
  private saveTokens(access: string, refresh: string): void {
    this._accessToken = access;
    this._refreshToken = refresh;

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);

    this._authenticated = true;
  }

  // Clear tokens
  private clearTokens(): void {
    this._accessToken = null;
    this._refreshToken = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    this._authenticated = false;
    this.userService.setUser(null);
    this.route.navigate(['/']);
  }

  // Sign in using access token
  signInUsingAccessToken(token: string): void {
    const payload = AuthUtils.decodeToken(token);

    if (!payload) {
      return;
    }

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
      }),
    );
  }
}
