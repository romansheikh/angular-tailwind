import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-exchange-info',
  imports: [CommonModule],
  templateUrl: './exchange-info.component.html',
  styleUrl: './exchange-info.component.css'
})
export class ExchangeInfoComponent {
  reserveAmount = signal<number>(4980.85);
  reserveCurrency = signal<string>('USD');
  minAmount = signal<number>(120);
  minCurrency = signal<string>('BDT');
}
