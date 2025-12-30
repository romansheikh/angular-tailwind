import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent, TableColumn } from 'src/app/shared/components/generic-table/generic-table.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, AngularSvgIconModule],
  templateUrl: './rates.component.html',
  styleUrl: './rates.component.css'
})
export class RatesComponent implements OnInit {
  
  // Define data properties
  data: any[] = [];
  columns: TableColumn[] = [];

  // Get templates from view
  @ViewChild('sendTemplate', { static: true }) sendTemplate!: TemplateRef<any>;
  @ViewChild('receiveTemplate', { static: true }) receiveTemplate!: TemplateRef<any>;
  @ViewChild('rateTemplate', { static: true }) rateTemplate!: TemplateRef<any>;
  @ViewChild('feeTemplate', { static: true }) feeTemplate!: TemplateRef<any>;

  ngOnInit() {
    this.initData();
    this.initColumns();
  }

  initData() {
    this.data = [
      {
        send: {
            symbol: 'USDT',
            network: 'TRC20 Network',
            icon: '₮',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-700'
        },
        receive: {
            name: 'Nagad',
            colorClass: 'bg-rose-50 text-rose-700'
        },
        rate: {
            amount: 109.50,
            badge: 'Best',
            badgeClass: 'bg-emerald-100 text-emerald-700'
        },
        fee: 0
      },
      {
        send: {
            symbol: 'USDT',
            network: 'TRC20 Network',
            icon: '₮',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-700'
        },
        receive: {
            name: 'Bkash',
            colorClass: 'bg-pink-50 text-pink-700'
        },
        rate: {
            amount: 108.80,
            badge: null
        },
        fee: 0
      }
    ];
  }

  initColumns() {
    setTimeout(() => { // ensure templates are available if not static: true
        this.columns = [
            { key: 'send', header: 'Send', type: 'custom', template: this.sendTemplate },
            { key: 'receive', header: 'Receive', type: 'custom', template: this.receiveTemplate },
            { key: 'rate', header: 'Rate', type: 'custom', template: this.rateTemplate },
            { key: 'fee', header: 'Fee', type: 'custom', template: this.feeTemplate },
        ];
    });
  }
}
