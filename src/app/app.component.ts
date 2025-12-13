import { Component, inject, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleOneTapService } from './core/services/google/google-one-tap.service';
import { LoginPopupService } from './core/services/login-popup.service';
import { LoginPopupComponent } from './shared/components/login-popup/login-popup.component';
import { CommonModule } from '@angular/common';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { SeoService } from './core/services/seo.service';
import { filter } from 'rxjs';
import { SEO_PAGES, SEO_DEFAULTS } from './core/constants/seo';
import { mergeSeo } from './core/utils/seo.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    ResponsiveHelperComponent,
    ReactiveFormsModule,
    LoginPopupComponent,
    CommonModule,
    NgxSpinnerComponent,
  ],
})
export class AppComponent {
  private ngZone = inject(NgZone);
  private oneTap = inject(GoogleOneTapService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  popup = inject(LoginPopupService).popupOpen;
  title = 'Angular Tailwind';

  ngOnInit() {
    var token = localStorage.getItem('accessToken');
    if (token == 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    if (!token) {
      this.ngZone.run(() => {
        this.oneTap.initialize();
      });
    } else {
      this.oneTap.CheckExistingToken();
    }

    // --- SEO router listener ---
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }

      const data = route.snapshot.data || {};
      const seoKey: string | undefined = data['seoKey'];
      const seoParams = data['seoParams'] ?? {};

      const pageSeo = seoKey ? SEO_PAGES[seoKey] ?? {} : data['seo'] ?? {};
      const merged = mergeSeo(SEO_DEFAULTS, pageSeo, seoParams);

      this.seoService.apply(merged);
    });
  }
}
