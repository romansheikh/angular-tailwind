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
      },
      {
        path: 'affiliates',
        loadChildren: () =>
          import('../../user-components/affiliates/affiliates.module').then((m) => m.AffiliatesModule),
      },
      {
        path: 'contact-us',
        loadChildren: () => import('../../user-components/contact/contact.module').then((m) => m.ContactModule),
      },
      {
        path: 'exchange',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../user-components/exchange/exchange.module').then((m) => m.ExchangeModule),
      },
      {
        path: 'my-order',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../user-components/my-order/my-order.module').then((m) => m.MyOrderModule),
      },
      {
        path: 'my-profile',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../user-components/my-profile/my-profile.module').then((m) => m.MyProfileModule),
      },
      { path: 'news', loadChildren: () => import('../../user-components/news/news.module').then((m) => m.NewsModule) },

      {
        path: 'rates',
        loadChildren: () => import('../../user-components/rates/rates.module').then((m) => m.RatesModule),
      },
      {
        path: 'reviews',
        loadChildren: () => import('../../user-components/reviews/reviews.module').then((m) => m.ReviewsModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('../../user-components/setting/setting.module').then((m) => m.SettingModule),
      },
      {
        path: 'video-compress',
        loadChildren: () =>
          import('../../user-components/video-tools/video-tools.module').then((m) => m.VideoToolsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserLayoutRoutingModule {}
