import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('../../landing/landing.module').then(m => m.LandingModule) },
      { 
        path: 'exchange', 
        canActivate: [AuthGuard],  
        loadChildren: () => import('../../exchange/exchange.module').then(m => m.ExchangeModule) 
      },
        
      // { path: 'rates', loadChildren: () => import('../../rates/rates.module').then(m => m.RatesModule) },
      // { path: 'affiliates', loadChildren: () => import('../../affiliates/affiliates.module').then(m => m.AffiliatesModule) },
      // { path: 'reviews', loadChildren: () => import('../../reviews/reviews.module').then(m => m.ReviewsModule) },
      // { path: 'news', loadChildren: () => import('../../news/news.module').then(m => m.NewsModule) },
      // { path: 'contact', loadChildren: () => import('../../contact/contact.module').then(m => m.ContactModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ],
  exports: [RouterModule],
})
export class UserLayoutRoutingModule {}
