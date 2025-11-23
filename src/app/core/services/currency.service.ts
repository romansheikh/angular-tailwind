import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { CreateUpdateCurrency, Currency } from '../models/currencies';
import { ApiResponseModel, Status } from '../models/apiresponse';
import { PaymentGatewayService } from './paymentgateway.service';
import { ExchangeService } from './exchange.service';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private api = inject(WebApiService);
  private payment = inject(PaymentGatewayService);
  private exchange = inject(ExchangeService);

  currencies = signal<Currency[]>([]);
  selectedSendCurrency = signal<Currency | undefined>(undefined);
  selectedGetCurrency = signal<Currency | undefined>(undefined);
  loading = this.api.loading;
  error = this.api.error;

  createCurrency(dto: CreateUpdateCurrency): Observable<Currency> {
    return this.api.post<Currency>('api/Currencies', dto);
  }

  getCurrencies(): Observable<ApiResponseModel<Currency[]>> {
    return this.api.get<ApiResponseModel<Currency[]>>(`api/Currencies`);
  }
  updateCurrency(id: number, dto: CreateUpdateCurrency): Observable<Currency> {
    return this.api.put<Currency>(`api/Currencies/${id}`, dto);
  }

  loadCurrencies() {
    this.getCurrencies().subscribe({
      next: (res) => {
        if (res.Status === Status.Success) {
          this.currencies.set(res.Body ?? []);
          this.selectedSendCurrency.set(this.currencies()[0]);
          this.selectedGetCurrency.set(
            this.currencies().filter(
              (c) => c.Id !== this.selectedSendCurrency()?.Id && c.Type !== this.selectedSendCurrency()?.Type,
            )[0],
          );
          this.payment.loadPaymentGateway(this.selectedGetCurrency()?.Id ?? 0);
          this.exchange.loadPairRate(this.selectedSendCurrency()?.Id ?? 0, this.selectedGetCurrency()?.Id ?? 0);

        } else {
          console.warn('API returned error:', res.Message);
        }
      },
      error: (err) => console.error('Failed to load pair rate', err),
    });
  }
}
