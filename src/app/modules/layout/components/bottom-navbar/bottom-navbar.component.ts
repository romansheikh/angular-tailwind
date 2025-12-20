import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { AdminLayoutRoutingModule } from 'src/app/modules/layout/admin-layout/admin-layout-routing.module';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.css'],
  imports: [AngularSvgIconModule, AdminLayoutRoutingModule],
})
export class BottomNavbarComponent implements OnInit {
  menu = inject(MenuService);
  auth = inject(AuthService);
  constructor() {}

  ngOnInit(): void {}
}
