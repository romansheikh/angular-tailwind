import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { Bank } from '../models/bank';
import { ApiResponseModel, Status } from '../models/apiresponse';

@Injectable({ providedIn: 'root' })
export class BankService {
  private api = inject(WebApiService);
  bank = signal<Bank[]>([]);
  userReceivingDetails = signal('');
  loading = this.api.loading;
  error = this.api.error;

  createBank(dto: Bank): Observable<Bank> {
    return this.api.post<Bank>('api/Bank', dto);
  }

  updateCurrency(id: number, dto: Bank): Observable<Bank> {
    return this.api.put<Bank>(`api/Bank/${id}`, dto);
  }

  getBank(): Observable<ApiResponseModel<Bank[]>> {
    return this.api.get<ApiResponseModel<Bank[]>>(`api/Bank`);
  }

  loadBank() {
    this.getBank().subscribe({
      next: (res) => {
        if (res.Status === Status.Success) {
          this.bank.set(res.Body ?? []);
        } else {
          console.warn('API returned error:', res.Message);
        }
      },
      error: (err) => console.error('Failed to load pair rate', err),
    });
  }
}
