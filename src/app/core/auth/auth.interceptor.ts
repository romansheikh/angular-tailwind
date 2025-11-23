import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken = this.authService.accessToken;

    // Skip: Do NOT intercept refresh endpoint itself
    if (req.url.includes('Auth/refresh')) {
      return next.handle(req);
    }

    // Add Authorization header for all other requests
    let modifiedReq = req;
    if (accessToken) {
      modifiedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(modifiedReq).pipe(
      catchError(error => {
        // Handle 401 only
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401(modifiedReq, next);
        }

        return throwError(() => error);
      })
    );
  }

  // -----------------------------------------
  // HANDLE 401 → refresh token logic
  // ----------------------------------------
  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

    // If not currently refreshing → start refresh
    if (!this.isRefreshing) {

      this.isRefreshing = true;
      this.refreshSubject.next(null);

      return this.authService.signInUsingRefreshToken().pipe(
        switchMap((newAccessToken : any) => {

          this.isRefreshing = false;

          // If refresh failed → logout
          if (!newAccessToken) {
            this.authService.signOut();
            return throwError(() => new Error('Refresh failed'));
          }

          // Publish new token
          this.refreshSubject.next(newAccessToken);

          // Retry original request with new token
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` }
          });

          return next.handle(retryReq);
        }),

        catchError(err => {
          // Refresh failed
          this.isRefreshing = false;
          this.authService.signOut();
          return throwError(() => err);
        })
      );
    }

    // Already refreshing → queue requests here
    return this.refreshSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {

        const retryReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });

        return next.handle(retryReq);
      })
    );
  }
}
