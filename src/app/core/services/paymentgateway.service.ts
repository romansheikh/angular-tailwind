import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { PaymentGateway } from '../models/paymetngateway';
import { ApiResponse, Status } from '../models/apiresponse';


@Injectable({ providedIn: 'root' })
export class PaymentGatewayService {
  private api = inject(WebApiService);

  paymentGateway = signal<PaymentGateway[]>([]);
  selectedSendCurrency = signal<PaymentGateway | undefined>(undefined);
  selectedGetCurrency = signal<PaymentGateway | undefined>(undefined);
  loading = this.api.loading;
  error = this.api.error;

    getPaymentGateway(toCurrency_id: Number): Observable<ApiResponse<PaymentGateway[]>> {
      return this.api.get<ApiResponse<PaymentGateway[]>>(`api/PaymentGateways?currency_id=${toCurrency_id}`);
    }
  
    loadPaymentGateway(toCurrency_id: number) {
      this.getPaymentGateway(toCurrency_id).subscribe({
        next: (res) => {
          if (res.Status === Status.Success) {
            this.paymentGateway.set(res.Body ?? []);
          } else {
            console.warn('API returned error:', res.Message);
          }
        },
        error: (err) => console.error('Failed to load pair rate', err),
      });
    }



  createPaymentGateway(dto: any): Observable<PaymentGateway> {
    return this.api.post<PaymentGateway>('api/Currencies', dto);
  }

  updatePaymentGateway(id: number, dto: any): Observable<PaymentGateway> {
    return this.api.put<PaymentGateway>(`api/Currencies/${id}`, dto);
  }
}
