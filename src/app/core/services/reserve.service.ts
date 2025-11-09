import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api-service';
import { ApiResponse, Status } from '../models/apiresponse';
import { Reserve } from '../models/reserve';

@Injectable({ providedIn: 'root' })
export class ReserveService {
  private api = inject(WebApiService);
  reserve = signal<Reserve[]>([]);

  getReserve(): Observable<ApiResponse<Reserve[]>> {
    return this.api.get<ApiResponse<Reserve[]>>(`api/Reserve`);
  }

  loadReserve() {
    this.getReserve().subscribe({
      next: (res) => {
        if (res.Status === Status.Success) {
          this.reserve.set(res.Body ?? []);
        } else {
          console.warn('API returned error:', res.Message);
        }
      },
      error: (err) => console.error('Failed to load pair rate', err),
    });
  }

}
