import { Provider, EnvironmentProviders, inject } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../interceptor/auth.interceptor';
import { AuthService } from './auth.service';

export function provideAuth(): Array<Provider | EnvironmentProviders> {
  return [

    // HttpClient + functional interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // Eagerly create AuthService at startup (recommended)
    {
      provide: 'AUTH_INIT',
      useFactory: () => {
        inject(AuthService); // <-- this triggers your constructor at boot
        return true;
      }
    }
  ];
}
