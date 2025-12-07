import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ExchangeService } from 'src/app/core/services/exchange.service';
import { ReserveService } from 'src/app/core/services/reserve.service';

@Component({
  selector: 'app-exchange-info',
  imports: [CommonModule],
  templateUrl: './exchange-info.component.html',
  styleUrl: './exchange-info.component.css'
})
export class ExchangeInfoComponent {
  currency = inject(CurrencyService);
  reserve = inject(ReserveService);
  exchange = inject(ExchangeService);
  
  reserveAmount = this.reserve.reserve().find(e => e.CurrencyId === this.currency.selectedGetCurrency()?.Id)?.Amount ?? 0; 
  minAmount = `${this.exchange.rate()?.MinAmount ?? 0} ${this.currency.selectedSendCurrency()?.Symbol} `;
}
