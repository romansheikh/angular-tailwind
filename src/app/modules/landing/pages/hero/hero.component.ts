import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { Currency } from 'src/app/core/models/currencies';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { AdminLayoutRoutingModule } from 'src/app/modules/layout/admin-layout/admin-layout-routing.module';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { BankService } from 'src/app/core/services/bank.service';

@Component({
  selector: 'app-hero',
  imports: [AdminLayoutRoutingModule],
  templateUrl: './hero.component.html',
  animations: [
    trigger('sendAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))]),
    ]),
  ],
})
// Component Class (TS)
export class HeroComponent implements OnInit {
  // Use 'inject' as before, this is correct.
  currencyService = inject(CurrencyService);
  bankService = inject(BankService);

  // Signals are good and correct.
  dropdownSendOpen = signal(false);
  dropdownGetOpen = signal(false);

  // 4. Removed the redundant 'isDropdownOpen' signal and 'closeDropdown' method.

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe((currencies) => {
      this.currencyService.currencies.set(currencies);

      if (currencies.length > 1) {
        // Select the first currency for "You Send"
        this.selectSendCurrency(currencies[0]);

        // Now select the first filtered currency for "You Get"
        const firstAvailable = this.getList[0];
        if (firstAvailable) {
          this.selectGetCurrency(firstAvailable);
        }
      }
    });
  }

  // 5. Improved UX: opening one closes the other.
  toggleSendDropdown() {
    this.dropdownSendOpen.update((open) => !open);
    if (this.dropdownSendOpen()) {
      this.dropdownGetOpen.set(false);
    }
  }

  toggleGetDropdown() {
    this.dropdownGetOpen.update((open) => !open);
    if (this.dropdownGetOpen()) {
      this.dropdownSendOpen.set(false);
    }
  }

  selectSendCurrency(currency: Currency) {
    this.currencyService.selectedSendCurrency.set(currency);
    this.dropdownSendOpen.set(false);

    // Refresh "You Get" selection
    const firstAvailable = this.getList[0];
    if (firstAvailable) {
      this.selectGetCurrency(firstAvailable);
    }
  }

  selectGetCurrency(currency: Currency) {
    this.currencyService.selectedGetCurrency.set(currency);
    this.dropdownGetOpen.set(false);
    if (currency.Name === 'Bank Transfer') {
      this.bankService.getBank().subscribe((bank) => this.bankService.bank.set(bank));
    } else {
      this.bankService.bank.set([]);
    }
  }

  get sendList() {
    return this.currencyService.currencies();
  }

  get getList() {
    const selected = this.currencyService.selectedSendCurrency();
    return this.currencyService.currencies().filter((c) => c.Id !== selected?.Id && c.Type !== selected?.Type);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Check if click is outside send dropdown
    if (!target.closest('.send-dropdown')) {
      this.dropdownSendOpen.set(false);
    }

    // Check if click is outside get dropdown
    if (!target.closest('.get-dropdown')) {
      this.dropdownGetOpen.set(false);
    }
  }
}
