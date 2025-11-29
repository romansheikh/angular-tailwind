import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class WebApiService {
  private http = inject(HttpClient);
  base = environment.apiBaseUrl;

  loading = signal(false);
  error = signal<string | null>(null);

private getHeader(): HttpHeaders {
  const token = sessionStorage.getItem('accessToken');
  console.log('Token from sessionStorage:', token); // ← ADD THIS LINE

  let header = new HttpHeaders({ 'Content-Type': 'application/json' });
  if (token) {
    header = header.set('Authorization', `Bearer ${token}`);
  } else {
    console.warn('No accessToken found in sessionStorage!');
  }
  return header;
}

 get<T>(url: string, params: any = null): Observable<T> {
  this.loading.set(true);
  console.log(this.getHeader());
  return this.http.get<T>(
    this.base + url,
    {
      headers: this.getHeader(),
      params: params
    }
  )
  .pipe(catchError(err => this.handleError(err)));
}

  post<T>(url: string, body: any): Observable<T> {
    this.loading.set(true);
    return this.http
      .post<T>(this.base + url, body ?? {}, { headers: this.getHeader() })
      .pipe(catchError(err => this.handleError(err)));
  }

  put<T>(url: string, body: any): Observable<T> {
    this.loading.set(true);
    return this.http
      .put<T>(this.base + url, body ?? {}, { headers: this.getHeader() })
      .pipe(catchError(err => this.handleError(err)));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    this.loading.set(false);
    this.error.set(error.message || 'Something went wrong!');
    return throwError(() => error);
  }
}
