import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatesComponent } from './rates.component';

const routes: Routes = [
    {
      path: '',
      component: RatesComponent, // default component for /exchange
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatesRoutingModule { }
