import { Component } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { BottomNavbarComponent } from "../components/bottom-navbar/bottom-navbar.component";
import { NavbarUserComponent } from "../components/navbar-user/navbar-user.component";
import { ScrollingBannerComponent } from "../../landing/pages/scrolling-banner/scrolling-banner.component";

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, FooterComponent, BottomNavbarComponent, NavbarUserComponent, ScrollingBannerComponent],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

}
