import { HTTP_INTERCEPTORS, HttpHandler, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';

import { AuthService } from './auth.service';
import { AuthInterceptor } from '../interceptor/auth.interceptor';

import { withInterceptorsFromDi } from '@angular/common/http';

export const provideAuth = () => [
    provideHttpClient(withInterceptorsFromDi()),    
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    },
    {
        provide: ENVIRONMENT_INITIALIZER,
        useValue: () => inject(AuthService),
        multi: true,
    }
];

