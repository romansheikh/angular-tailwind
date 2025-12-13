import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // don't intercept refresh or auth endpoints
  const url = req.url ?? '';
  const isAuthEndpoint = url.includes('/api/Auth/refresh') || url.includes('/api/Auth/login') || url.includes('/api/Auth/register');

  let authReq = req;

  if (!isAuthEndpoint && token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // If this is the refresh request (or other auth endpoints), don't try to handle 401 here
  if (isAuthEndpoint) {
    return next(authReq);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};


function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<any>> {

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshAccessToken().pipe(
      switchMap((newToken: string) => {
        isRefreshing = false;
        refreshTokenSubject.next(newToken);

        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          })
        );
      }),
      catchError(err => {
        isRefreshing = false;
        authService.signOut();
        return throwError(() => err);
      })
    );
  }

  // If refresh already in progress → wait for new token
  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    switchMap(token =>
      next(
        req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        })
      )
    )
  );
}
