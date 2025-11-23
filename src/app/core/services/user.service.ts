
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {

    private http = inject(HttpClient);

    // -------------------------------------------------------------------------
    // Signals
    // -------------------------------------------------------------------------

    /** User signal (null until loaded) */
    private readonly _user = signal<User | null>(null);

    /** Public readonly computed signal for components */
    readonly user = computed(() => this._user());

    /** Whether the user is loaded */
    readonly isLoaded = computed(() => this._user() !== null);

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /** Get the current user from API */
    get(): Observable<User> {
        return this.http.get<User>('api/common/user').pipe(
            tap(user => this._user.set(user))
        );
    }

    /** Update user and update signal */
    update(user: User): Observable<User> {
        return this.http.patch<User>('api/common/user', { user }).pipe(
            tap(updated => this._user.set(updated))
        );
    }

    /** Manual setter if needed */
    setUser(user: User | null): void {
        this._user.set(user);
    }
    /** Manual setter if needed */
    updateUser(user: User): void {
        this._user.update(u => ({ ...u, ...user }) as User);
    }

    /** Clear user on logout */
    clear(): void {
        this._user.set(null);
    }

  getUserInitials(name: string | undefined | null): string {
  if (!name) return '';

  const parts = name.split(' ');
  const first = parts[0]?.charAt(0) || '';
  const last = parts[1]?.charAt(0) || '';

  return (first + last).toUpperCase();
}

}
