import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, single } from 'rxjs';
import { WebApiService } from './web-api-service';
import { Exchange, ExchangePair, ExchangeRate } from '../models/exchange';
import { ApiResponseModel, Status } from '../models/apiresponse';

@Injectable({ providedIn: 'root' })
export class ExchangeService {
  api = inject(WebApiService);
  rates = signal<ExchangeRate[]>([]);
  latestExchange = signal<Exchange[]>([]);
  rate = signal<ExchangePair | null>(null);
  // rateMap = new Map<string, ExchangePair>();

  loading = this.api.loading;
  error = this.api.error;

  getRatePairByCurrencyId(fromId: number, toId: number): Observable<ApiResponseModel<ExchangePair>> {
    return this.api.get<ApiResponseModel<ExchangePair>>(
      `api/ExchangePair/rate?fromCurrencyId=${fromId}&toCurrencyId=${toId}`,
    );
  }

  getLatestExchange(): Observable<ApiResponseModel<Exchange[]>> {
    return this.api.get<ApiResponseModel<Exchange[]>>(`api/Orders/latest`);
  }

  loadLatestExchange() {
    this.getLatestExchange().subscribe({
      next: (res) => {
        if (res.Status === Status.Success) {
          this.latestExchange.set(res.Body ?? []);
        } else {
          console.warn('API returned error:', res.Message);
        }
      },
      error: (err) => console.error('Failed to load pair rate', err),
    });
  }

  loadPairRate(fromId: number, toId: number) {
    const key = `${fromId}-${toId}`;
    this.getRatePairByCurrencyId(fromId, toId).subscribe({
      next: (res: ApiResponseModel<ExchangePair>) => {
        if (res.Status == 200) {
          this.rate.set(res.Body!);
          console.log(this.rate());
        }
        //  this.rateMap.set(key, res.Body!);
      },

      error: (err) => console.error('Failed to load pair rate', err),
    });
  }

  // ratePair(fromId: number, toId: number): ExchangePair | undefined {
  //   return this.rateMap.get(`${fromId}-${toId}`);
  // }

  get currentRate(): ExchangePair | null {
    return this.rate();
  }
}
