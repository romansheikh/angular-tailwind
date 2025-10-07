import { Component, signal } from '@angular/core';
import { TableActionComponent } from "src/app/modules/uikit/pages/table/components/table-action/table-action.component";
import { TableFooterComponent } from "src/app/modules/uikit/pages/table/components/table-footer/table-footer.component";
import { ExchangeRowComponent } from '../exchange-row/exchange-row.component';

export interface Exchange {
  orderId: string;
  timeAgo: string;
  fromCurrency: { name: string; symbol: string; logo: string; amount: number; };
  toCurrency: { name: string; symbol: string; logo: string; amount: number; };
  status: 'confirmed' | 'pending' | 'canceled';
}

@Component({
  selector: '[app-latest-exchanges]',
  imports: [ExchangeRowComponent],
  templateUrl: './latest-exchanges.component.html',
  styleUrl: './latest-exchanges.component.css'
})
export class LatestExchangesComponent {
 exchanges = signal<Exchange[]>([
    {
      orderId: '983965256',
      timeAgo: '1 hour ago',
      fromCurrency: { name: 'Nagad', symbol: 'BDT', logo: '/assets/logos/nagad.png', amount: 165 },
      toCurrency: { name: 'Binance ID', symbol: 'USD', logo: '/assets/logos/binance.png', amount: 1.2692 },
      status: 'confirmed'
    },
    {
      orderId: '255975563',
      timeAgo: '1 hour ago',
      fromCurrency: { name: 'Litecoin', symbol: 'USD', logo: '/assets/logos/litecoin.png', amount: 2 },
      toCurrency: { name: 'Nagad', symbol: 'BDT', logo: '/assets/logos/nagad.png', amount: 246 },
      status: 'confirmed'
    },
    {
      orderId: '255975564',
      timeAgo: '1 hour ago',
      fromCurrency: { name: 'Litecoin', symbol: 'USD', logo: '/assets/logos/litecoin.png', amount: 2 },
      toCurrency: { name: 'Nagad', symbol: 'BDT', logo: '/assets/logos/nagad.png', amount: 246 },
      status: 'confirmed'
    },
    {
      orderId: '255975565',
      timeAgo: '1 hour ago',
      fromCurrency: { name: 'Litecoin', symbol: 'USD', logo: '/assets/logos/litecoin.png', amount: 2 },
      toCurrency: { name: 'Nagad', symbol: 'BDT', logo: '/assets/logos/nagad.png', amount: 246 },
      status: 'confirmed'
    },
    {
      orderId: '255975566',
      timeAgo: '1 hour ago',
      fromCurrency: { name: 'Litecoin', symbol: 'USD', logo: '/assets/logos/litecoin.png', amount: 2 },
      toCurrency: { name: 'Nagad', symbol: 'BDT', logo: '/assets/logos/nagad.png', amount: 246 },
      status: 'confirmed'
    },
    {
      orderId: '255975567',
      timeAgo: '1 hour ago',
      fromCurrency: { name: 'Litecoin', symbol: 'USD', logo: '/assets/logos/litecoin.png', amount: 2 },
      toCurrency: { name: 'Nagad', symbol: 'BDT', logo: '/assets/logos/nagad.png', amount: 246 },
      status: 'confirmed'
    },
    {
      orderId: '255975568',
      timeAgo: '1 hour ago',
      fromCurrency: { name: 'Litecoin', symbol: 'USD', logo: '/assets/logos/litecoin.png', amount: 2 },
      toCurrency: { name: 'Nagad', symbol: 'BDT', logo: '/assets/logos/nagad.png', amount: 246 },
      status: 'confirmed'
    },
    {
      orderId: '255975569',
      timeAgo: '1 hour ago',
      fromCurrency: { name: 'Litecoin', symbol: 'USD', logo: '/assets/logos/litecoin.png', amount: 2 },
      toCurrency: { name: 'Nagad', symbol: 'BDT', logo: '/assets/logos/nagad.png', amount: 246 },
      status: 'confirmed'
    }
  ]);

}
