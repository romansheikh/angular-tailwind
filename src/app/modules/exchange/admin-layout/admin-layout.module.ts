import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AdminLayoutRoutingModule } from './admin-layout-routing.module';

@NgModule({ imports: [AdminLayoutRoutingModule, AngularSvgIconModule.forRoot()], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AdminLayoutModule {}
