import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { PaymentGateway } from '../models/paymetngateway';


@Injectable({ providedIn: 'root' })
export class PaymentGatewayService {
  private api = inject(WebApiService);

  paymentGateway = signal<PaymentGateway[]>([]);
  selectedSendCurrency = signal<PaymentGateway | undefined>(undefined);
  selectedGetCurrency = signal<PaymentGateway | undefined>(undefined);
  loading = this.api.loading;
  error = this.api.error;

    getPaymentGateway(toCurrency_id: number): Observable<PaymentGateway[]> {
      return this.api.get<PaymentGateway[]>(
        `api/PaymentGateways?currency_id=${toCurrency_id}`
      );
    }


loadPaymentGateway(currency_id : number) {
   this.getPaymentGateway(currency_id).subscribe({
      next: (data) => this.paymentGateway.set(data),
      error: (err) => {
        console.error('Failed to load currencies', err);
        this.paymentGateway.set([]); // fallback
      },
    });
  }

  createPaymentGateway(dto: any): Observable<PaymentGateway> {
    return this.api.post<PaymentGateway>('api/Currencies', dto);
  }

  updatePaymentGateway(id: number, dto: any): Observable<PaymentGateway> {
    return this.api.put<PaymentGateway>(`api/Currencies/${id}`, dto);
  }
}
