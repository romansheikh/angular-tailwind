import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';

type RawBodyItem = {
  OrderId: string;
  UserName: string;
  SendCurrency: string;
  SendCurrencyLogo: string;
  ReceiveCurrency: string;
  ReceiveCurrencyLogo: string;
  Status: string;
  Amount: string;
  Date: string; // e.g. "06 12 2025 05:34 PM"
};

type Tx = RawBodyItem & {
  dateObj: Date;
};
@Component({
  selector: 'app-my-order',
  imports: [CommonModule],
  templateUrl: './my-order.component.html',
  styleUrl: './my-order.component.css'
})
export class MyOrderComponent {
  common: CommonService = inject(CommonService);
 // handler placeholder for the Details action
 
// replace this rawBody with your API data
  private rawBody: RawBodyItem[] = [
    {
      OrderId: 'ORD12062334FD',
      UserName: 'Roman Sheikh',
      SendCurrency: 'Bkash',
      SendCurrencyLogo: 'https://freelogopng.com/images/all_img/1656235223bkash-logo.png',
      ReceiveCurrency: 'Tether (TRC20)',
      ReceiveCurrencyLogo: 'https://img.icons8.com/?size=100&id=U8V97McJaXmr&format=png&color=000000',
      Status: 'Pending',
      Amount: '1.00 USDT',
      Date: '06 12 2025 05:34 PM',
    },
    {
      OrderId: 'ORD1207164119',
      UserName: 'Roman Sheikh',
      SendCurrency: 'Bank Transfer',
      SendCurrencyLogo: 'https://img.icons8.com/?size=100&id=ekfhFWx8X7C3&format=png&color=000000',
      ReceiveCurrency: 'Tether (TRC20)',
      ReceiveCurrencyLogo: 'https://img.icons8.com/?size=100&id=U8V97McJaXmr&format=png&color=000000',
      Status: 'Pending',
      Amount: '100.00 USDT',
      Date: '07 12 2025 10:41 AM',
    },
  ];

  // parsed / normalized transactions (signal so you can replace later)
  items = signal<Tx[]>(this.rawBody.map((r) => ({ ...r, dateObj: this.common.parseDate(r.Date) })));

 

  // handler placeholder for the Details action
  onDetails(item: Tx) {
    // hook here: open modal / navigate / emit event
    console.log('details', item.OrderId);
    alert(`Details for ${item.OrderId} — implement handler`);
  }
}
