import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { loaderInterceptor } from '../interceptor/loader.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { apiInterceptor } from '../interceptor/global.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      NgxSpinnerModule,
      AngularSvgIconModule.forRoot(),
    ),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withInterceptors([loaderInterceptor, apiInterceptor])),
  ],
};
