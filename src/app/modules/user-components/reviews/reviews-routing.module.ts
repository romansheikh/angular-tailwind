import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatesComponent } from '../rates/rates.component';
import { ReviewsComponent } from './reviews.component';

const routes: Routes = [
    {
      path: '',
      component: ReviewsComponent, // default component for /exchange
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewsRoutingModule { }
