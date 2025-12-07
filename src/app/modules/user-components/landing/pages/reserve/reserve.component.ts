import { Component, inject, signal } from '@angular/core';
import { ReserveService } from 'src/app/core/services/reserve.service';

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
  styleUrl: './reserve.component.css',
})
export class ReserveComponent {
  reserve = inject(ReserveService);

  ngOnInit() {
    this.reserve.loadReserve();
  }
}
