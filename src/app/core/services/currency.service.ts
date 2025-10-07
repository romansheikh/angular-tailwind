import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { CreateUpdateCurrency, Currency } from '../models/currencies';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private api = inject(WebApiService);

  currencies = signal<Currency[]>([]);
  selectedSendCurrency = signal<Currency | undefined>(undefined);
  selectedGetCurrency = signal<Currency | undefined>(undefined);
  loading = this.api.loading;
  error = this.api.error;

  getCurrencies(): Observable<Currency[]> {
    return this.api.get<Currency[]>('api/Currencies');
  }

loadCurrencies() {
   this.getCurrencies().subscribe({
      next: (data) => this.currencies.set(data),
      error: (err) => {
        console.error('Failed to load currencies', err);
        this.currencies.set([]); // fallback
      },
    });
  }

  createCurrency(dto: CreateUpdateCurrency): Observable<Currency> {
    return this.api.post<Currency>('api/Currencies', dto);
  }

  updateCurrency(id: number, dto: CreateUpdateCurrency): Observable<Currency> {
    return this.api.put<Currency>(`api/Currencies/${id}`, dto);
  }
}
