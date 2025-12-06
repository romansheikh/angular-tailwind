import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { loaderInterceptor } from '../interceptor/loader.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { apiInterceptor } from '../interceptor/global.interceptor';
import { authInterceptor } from '../interceptor/auth.interceptor';
import { provideAuth } from '../auth/auth.provider';


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
      AngularSvgIconModule.forRoot(),
    ),
    provideAnimations(),
    provideToastr(), provideAuth(),
    provideHttpClient(withInterceptors([loaderInterceptor, apiInterceptor, authInterceptor])),
  ],
};
