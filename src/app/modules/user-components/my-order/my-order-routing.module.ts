import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyOrderComponent } from './my-order.component';

const routes: Routes = [
  {
    path: '',
    component: MyOrderComponent, // default component for /exchange
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyOrderRoutingModule {}
