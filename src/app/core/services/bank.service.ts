import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { Bank } from '../models/bank';

@Injectable({ providedIn: 'root' })
export class BankService {
  private api = inject(WebApiService);
  bank = signal<Bank[]>([]);
  userReceivingDetails = signal('');
  loading = this.api.loading;
  error = this.api.error;

  getBank(): Observable<Bank[]> {
    return this.api.get<Bank[]>('api/Bank');
  }

loadBank() {
    this.getBank().subscribe({
      next: (data) => this.bank.set(data),
      error: (err) => {
        console.error('Failed to load Bank', err);
        this.bank.set([]); // fallback
      },
    });
  }

  createBank(dto: Bank): Observable<Bank> {
    return this.api.post<Bank>('api/Bank', dto);
  }

  updateCurrency(id: number, dto: Bank): Observable<Bank> {
    return this.api.put<Bank>(`api/Bank/${id}`, dto);
  }
}
