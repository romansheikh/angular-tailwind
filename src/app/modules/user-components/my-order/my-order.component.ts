import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Exchange } from 'src/app/core/models/exchange';
import { Order } from 'src/app/core/models/order';
import { CommonService } from 'src/app/core/services/common.service';
import { OrderService } from 'src/app/core/services/order.service';
import { AdminLayoutRoutingModule } from "../../layout/admin-layout/admin-layout-routing.module";

@Component({
  selector: 'app-my-order',
  imports: [CommonModule, AdminLayoutRoutingModule],
  templateUrl: './my-order.component.html',
  styleUrl: './my-order.component.css',
})
export class MyOrderComponent {
  common: CommonService = inject(CommonService);
  order = inject(OrderService);

  // handler placeholder for the Details action
  onDetails(item: Exchange) {
    console.log('details', item.OrderId);
    alert(`Details for ${item.OrderId} — implement handler`);
  }
}
