import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserLayoutRoutingModule } from './user-layout-routing.module';
import { CommonModule } from '@angular/common';
import { ExchangeComponent } from '../../exchange/exchange.component';


@NgModule({ 
     imports: [UserLayoutRoutingModule, AngularSvgIconModule.forRoot(),CommonModule,ExchangeComponent], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class UserLayoutModule { }
