import { Component, inject } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NavbarMenuComponent } from '../navbar/navbar-menu/navbar-menu.component';
import { ProfileMenuComponent } from '../navbar/profile-menu/profile-menu.component';
import { NavbarMobileComponent } from '../navbar/navbar-mobile/navbar-mobilecomponent';
import { AdminLayoutRoutingModule } from '../../../exchange/admin-layout/admin-layout-routing.module';
import { UserService } from 'src/app/core/services/user.service';
import { GoogleOneTapService } from 'src/app/core/services/google/google-one-tap.service';

@Component({
  selector: 'app-navbar-user',
  imports: [
    AngularSvgIconModule,
    NavbarMenuComponent,
    ProfileMenuComponent,
    NavbarMobileComponent,
    AdminLayoutRoutingModule,
  ],
  templateUrl: './navbar-user.component.html',
  styleUrl: './navbar-user.component.css',
})
export class NavbarUserComponent {
  constructor(private menuService: MenuService) {}
onetap = inject(GoogleOneTapService)
  ngOnInit(): void {}
  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
}
