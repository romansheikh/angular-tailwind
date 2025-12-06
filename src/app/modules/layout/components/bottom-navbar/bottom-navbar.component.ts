import { Component, inject, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.css'],
  imports: [AngularSvgIconModule],
})
export class BottomNavbarComponent implements OnInit {
    menu = inject(MenuService)
  constructor() {}
 
  ngOnInit(): void {}
}
