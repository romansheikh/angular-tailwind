import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, single } from 'rxjs';
import { WebApiService } from './web-api-service';
import { Exchange, ExchangePair, ExchangeRate } from '../models/exchange';
import { ApiResponse, Status } from '../models/apiresponse';

@Injectable({ providedIn: 'root' })
export class ExchangeService {
  private api = inject(WebApiService);
  rates = signal<ExchangeRate[]>([]);
  latestExchange = signal<Exchange[]>([]);
  rate = signal<ExchangePair | null>(null);
  rateMap = new Map<string, ExchangePair>();

  loading = this.api.loading;
  error = this.api.error;

  // 🔹 Fetch single rate (pair)
  getRatePairByCurrencyId(fromId: number, toId: number): Observable<ExchangePair> {
    return this.api.get<ExchangePair>(`api/ExchangePair/rate?fromCurrencyId=${fromId}&toCurrencyId=${toId}`);
  }

  getLatestExchange(): Observable<ApiResponse<Exchange[]>> {
    return this.api.get<ApiResponse<Exchange[]>>(`api/Orders/latest`);
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

  // 🔹 Load & cache rate pair
  loadPairRate(fromId: number, toId: number) {
    const key = `${fromId}-${toId}`;
    this.getRatePairByCurrencyId(fromId, toId).subscribe({
      next: (res) => {
        this.rate.set(res);
        this.rateMap.set(key, res);
      },
      error: (err) => console.error('Failed to load pair rate', err),
    });
  }

  // 🔹 Get cached rate
  ratePair(fromId: number, toId: number): ExchangePair | undefined {
    return this.rateMap.get(`${fromId}-${toId}`);
  }

  get currentRate(): ExchangePair | null {
    return this.rate();
  }
}
