import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../../user-components/landing/landing.module').then((m) => m.LandingModule),
        data: { seoKey: 'landing' }         // <-- landing marketing/home
      },
      {
        path: 'affiliates',
        loadChildren: () =>
          import('../../user-components/affiliates/affiliates.module').then((m) => m.AffiliatesModule),
        data: { seoKey: 'affiliates' }
      },
      {
        path: 'contact-us',
        loadChildren: () => import('../../user-components/contact/contact.module').then((m) => m.ContactModule),
        data: { seoKey: 'contact' }
      },
      {
        path: 'exchange',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../user-components/exchange/exchange.module').then((m) => m.ExchangeModule),
        data: { seoKey: 'exchange' }
      },
      {
        path: 'my-order',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../user-components/my-order/my-order.module').then((m) => m.MyOrderModule),
        data: { seoKey: 'my-order' }
      },
      {
        path: 'my-profile',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../user-components/my-profile/my-profile.module').then((m) => m.MyProfileModule),
        data: { seoKey: 'my-profile' }
      },
      { path: 'news', loadChildren: () => import('../../user-components/news/news.module').then((m) => m.NewsModule), data: { seoKey: 'news' } },
      {
        path: 'rates',
        loadChildren: () => import('../../user-components/rates/rates.module').then((m) => m.RatesModule),
        data: { seoKey: 'rates' }
      },
      {
        path: 'reviews',
        loadChildren: () => import('../../user-components/reviews/reviews.module').then((m) => m.ReviewsModule),
        data: { seoKey: 'reviews' }
      },
      {
        path: 'settings',
        loadChildren: () => import('../../user-components/setting/setting.module').then((m) => m.SettingModule),
        data: { seoKey: 'settings' }
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserLayoutRoutingModule {}
