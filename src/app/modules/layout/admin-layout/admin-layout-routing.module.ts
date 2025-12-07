import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from '../../user-components/landing/landing.component';
import { AdminLayoutComponent } from './admin-layout.component';

const routes: Routes = [

  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    loadChildren: () => import('../../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'components',
    component: AdminLayoutComponent,
    loadChildren: () => import('../../uikit/uikit.module').then((m) => m.UikitModule),
  },
  
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminLayoutRoutingModule {}
