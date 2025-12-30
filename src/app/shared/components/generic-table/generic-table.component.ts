import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';

export interface TableColumn {
  key: string; // Key is still needed for property access or just unique ID
  header: string;
  type?: 'text' | 'image' | 'currency' | 'date' | 'boolean' | 'custom';
  template?: TemplateRef<any>; // Typed as TemplateRef
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() title: string = '';
  @Input() subtitle: string = ''; // Added subtitle
  @Input() isLoading: boolean = false;
  
  @Output() actionClick = new EventEmitter<{action: string, row: any}>();

  constructor() {

   }

  ngOnInit(): void {
        console.log(this.data);
  }

  onAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

  // Helper to get nested properties if needed (e.g. 'user.name')
  getProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : null, obj);
  }
}
