import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the shape of your data
export interface Exchange {
  orderId: string;
  timeAgo: string;
  fromCurrency: { name: string; symbol: string; logo: string; amount: number; };
  toCurrency: { name: string; symbol: string; logo: string; amount: number; };
  status: 'confirmed' | 'pending' | 'canceled';
}

@Component({
  selector: 'tr[app-exchange-row]', // Use an attribute selector to attach to a <tr>
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-row.component.html',
})
export class ExchangeRowComponent {
  @Input() exchange!: Exchange; // Receive a single exchange object
}