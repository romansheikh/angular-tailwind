// auth.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const isAuthEndpoint = /\/api\/Auth\/(login|register|refresh|google-login)/.test(req.url);

  // Skip adding token or handling 401 for auth endpoints
  if (isAuthEndpoint) {
    return next(req);
  }

  let authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  // Use service-based subject for coordination
  return authService.refreshAccessToken().pipe(
    switchMap((newToken) => {
      authService.triggerRefreshComplete(newToken);
      return next(request.clone({
        setHeaders: { Authorization: `Bearer ${newToken}` }
      }));
    }),
    catchError((err) => {
      authService.triggerRefreshComplete(null); // Signal failure
      authService.signOut();
      return throwError(() => err);
    })
  );

  // If another refresh is already in progress, wait for it
  // This is now handled via the service's refreshTokenSubject
  // But we can improve further with a dedicated queue if needed.
}