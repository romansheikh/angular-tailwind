import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { Bank } from '../models/bank';
import { Order } from '../models/order';
import { ApiResponseModel } from '../models/apiresponse';
import { Exchange } from '../models/exchange';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(WebApiService);
  bank = signal<Bank[]>([]);
  customer_order = signal<Exchange[]>([]);
  loading = this.api.loading;
  error = this.api.error;

  PlaceOrder(dto: Order): Observable<any> {
    return this.api.post<Bank>('api/Orders/place_order', dto);
  }

  GetUserOrders(): Observable<ApiResponseModel<Exchange[]>> {
    return this.api.get<ApiResponseModel<Exchange[]>>(`api/Orders/get_user_orders`);
  }

  loadUserOrders() {
    this.GetUserOrders().subscribe({
      next: (res: ApiResponseModel<Exchange[]>) => {
        if (res.Status == 200) {
          this.customer_order.set(res.Body!);
        }
      },
      error: (err) => console.error('Failed to load pair rate', err),
    });
  }

  updateOrder(id: number, dto: Bank): Observable<Bank> {
    return this.api.put<Bank>(`api/Orders/${id}`, dto);
  }



  SaveOrder(payload: Order) {
    this.PlaceOrder(payload).subscribe({
      next: () => {
        this.GetUserOrders();
        
      },
      error: (err) => console.error('Failed to load pair rate', err),
    });
  }


}
