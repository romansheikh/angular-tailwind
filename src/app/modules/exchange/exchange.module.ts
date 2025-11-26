import { NgModule } from '@angular/core';
import { ExchangeRoutingModule } from './exchange-routing.module';
import { ExchangeComponent } from './exchange.component';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    ExchangeRoutingModule,
    ExchangeComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ExchangeModule {}
