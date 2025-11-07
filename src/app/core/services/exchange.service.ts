

import { Injectable, inject, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { ExchangePair, ExchangeRate } from '../models/exchangeRate';


@Injectable({ providedIn: 'root' })
export class ExchangeService {
  private api = inject(WebApiService);

  rates = signal<ExchangeRate[]>([]);
  rate = signal<ExchangePair | null>(null);   // holds last fetched pair
  rateMap = new Map<string, ExchangePair>();  // cache for fromId-toId

  loading = this.api.loading;
  error = this.api.error;

  // 🔹 Fetch single rate (pair)
  getRatePairByCurrencyId(fromId: number, toId: number): Observable<ExchangePair> {
    return this.api.get<ExchangePair>(`api/ExchangeRate/rate?fromCurrencyId=${fromId}&toCurrencyId=${toId}`
    );
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

  // 🔹 Helper to get last active rate
  get currentRate(): ExchangePair | null {
    return this.rate();
  }
}
