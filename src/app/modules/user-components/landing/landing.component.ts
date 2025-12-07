import { Component } from '@angular/core';
import { HeroComponent } from "./pages/hero/hero.component";
import { ScrollingBannerComponent } from "./pages/scrolling-banner/scrolling-banner.component";
import { LatestExchangesComponent } from "./pages/latest-exchanges/latest-exchanges.component";
import { TableFooterComponent } from "../../uikit/pages/table/components/table-footer/table-footer.component";
import { ReserveComponent } from "./pages/reserve/reserve.component";

@Component({
  selector: 'app-landing',
  imports: [HeroComponent, LatestExchangesComponent, ReserveComponent, ScrollingBannerComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
