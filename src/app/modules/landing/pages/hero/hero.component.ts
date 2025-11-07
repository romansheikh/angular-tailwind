import { Router } from '@angular/router';
import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { Currency } from 'src/app/core/models/currencies';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { AdminLayoutRoutingModule } from 'src/app/modules/layout/admin-layout/admin-layout-routing.module';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { BankService } from 'src/app/core/services/bank.service';
import { PaymentGatewayService } from 'src/app/core/services/paymentgateway.service';
import { ExchangeService } from 'src/app/core/services/exchange.service';

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
  exchangeService = inject(ExchangeService);
  constructor(private router: Router) {}

  currencyService = inject(CurrencyService);
  bankService = inject(BankService);
  paymentGatewayService = inject(PaymentGatewayService);

  // Signals are good and correct.
  dropdownSendOpen = signal(false);
  dropdownGetOpen = signal(false);

  // 4. Removed the redundant 'isDropdownOpen' signal and 'closeDropdown' method.

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe((currencies) => {
      this.currencyService.currencies.set(currencies);
      if (currencies.length > 1) {
        this.selectSendCurrency(currencies[0]);
        const firstAvailable = this.getList[0];
        if (firstAvailable) {
          this.selectGetCurrency(firstAvailable);
        }
        this.loadPairData();
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
    this.paymentGatewayService
      .getPaymentGateway(currency.Id)
      .subscribe((paymentGateway) => this.paymentGatewayService.paymentGateway.set(paymentGateway));
    // Refresh "You Get" selection
    const firstAvailable = this.getList[0];
    if (firstAvailable) {
      this.selectGetCurrency(firstAvailable);
    }
    this.loadPairData();
  }

  selectGetCurrency(currency: Currency) {
    this.currencyService.selectedGetCurrency.set(currency);
    this.dropdownGetOpen.set(false);
    if (currency.Type === 'Bank') {
      this.bankService.getBank().subscribe((bank) => this.bankService.bank.set(bank));
    } else {
      this.bankService.bank.set([]);
    }
    this.loadPairData();
  }

  get sendList() {
    return this.currencyService.currencies();
  }

  get getList() {
    const selected = this.currencyService.selectedSendCurrency();
    const allCurrencies = this.currencyService.currencies();
    if (!selected) return allCurrencies;
    if (selected.Type === 'MFS' || selected.Type === 'Bank') {
      return allCurrencies.filter((c) => c.Type !== 'MFS' && c.Type !== 'Bank');
    }
    return allCurrencies.filter((c) => c.Id !== selected.Id && c.Type !== selected.Type);
  }

  redirectExchange() {
    this.router.navigateByUrl('/exchange');
  }

  loadPairData() {
    var fromId = this.currencyService.selectedSendCurrency()?.Id;
    var toId = this.currencyService.selectedGetCurrency()?.Id;
    if (fromId && toId) {
      this.exchangeService.loadPairRate(fromId, toId);
      this.exchangeService.getRatePairByCurrencyId(fromId, toId).subscribe((pair) => {
        this.exchangeService.rate.set(pair);
      });
    }
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
