import { Component, inject, signal } from '@angular/core';
import { TableActionComponent } from "src/app/modules/uikit/pages/table/components/table-action/table-action.component";
import { TableFooterComponent } from "src/app/modules/uikit/pages/table/components/table-footer/table-footer.component";
import { ExchangeRowComponent } from '../exchange-row/exchange-row.component';
import { ExchangeService } from 'src/app/core/services/exchange.service';



@Component({
  selector: '[app-latest-exchanges]',
  imports: [ExchangeRowComponent],
  templateUrl: './latest-exchanges.component.html',
  styleUrl: './latest-exchanges.component.css'
})
export class LatestExchangesComponent {
exchange = inject(ExchangeService);

  ngOnInit() {
    this.exchange.loadLatestExchange();
  }

}
