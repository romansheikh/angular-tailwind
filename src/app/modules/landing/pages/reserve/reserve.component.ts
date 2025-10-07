import { Component, signal } from '@angular/core';

export interface Reserve {
  currency: string;
  amount: number;
  code: string;
  logo?: string;
}

@Component({
  selector: '[app-latest-reserve]',
  imports: [],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.css'
})


export class ReserveComponent {

   reserve = signal<Reserve[]>([
    {
      currency: 'BTC',
      amount: 2,
      code: 'BTC',
      logo: 'assets/cryptocurrency-icons/32/color/btc.png'  
    },
    {
      currency: 'ETH',
      amount: 5,
      code: 'ETH',
      logo: 'assets/cryptocurrency-icons/32/color/eth.png'
    },
    { currency: 'LTC',
      amount: 10,
      code: 'LTC',
      logo: 'assets/cryptocurrency-icons/32/color/ltc.png'
    },
    { currency: 'XRP',
      amount: 20,
      code: 'XRP',
      logo: 'assets/cryptocurrency-icons/32/color/xrp.png'
    },
    { currency: 'BCH',    
      amount: 15,
      code: 'BCH',
      logo: 'assets/cryptocurrency-icons/32/color/bch.png'
    },
    { currency: 'ADA',
      amount: 25,
      code: 'ADA',
      logo: 'assets/cryptocurrency-icons/32/color/ada.png'
    },
    { currency: 'DOT',
      amount: 30,
      code: 'DOT',
      logo: 'assets/cryptocurrency-icons/32/color/dot.png'
    },
    { currency: 'SOL',  
      amount: 12,
      code: 'SOL',
      logo: 'assets/cryptocurrency-icons/32/color/sol.png'
    }
  ]);
}
