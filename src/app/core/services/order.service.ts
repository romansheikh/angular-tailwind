import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { Bank } from '../models/bank';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(WebApiService);
  bank = signal<Bank[]>([]);
  loading = this.api.loading;
  error = this.api.error;

  PlaceOrder(dto: Bank): Observable<Bank> {
    return this.api.post<Bank>('api/Orders/Place_Order', dto);
  }

  updateOrder(id: number, dto: Bank): Observable<Bank> {
    return this.api.put<Bank>(`api/Orders/${id}`, dto);
  }
}
