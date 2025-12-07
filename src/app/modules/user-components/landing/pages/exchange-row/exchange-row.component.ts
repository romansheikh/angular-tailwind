import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exchange } from 'src/app/core/models/exchange';

// Define the shape of your data


@Component({
  selector: 'tr[app-exchange-row]', // Use an attribute selector to attach to a <tr>
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-row.component.html',
})
export class ExchangeRowComponent {
  @Input() exchange!: Exchange; 
}