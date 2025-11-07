import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Toast } from 'src/app/core/models/toast.model';
import { ToasterService } from 'src/app/core/services/toaster.service';


@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
  imports: [CommonModule],
  // no special change detection required for signals
})
export class ToasterComponent {
  constructor(public toaster: ToasterService) {}

  // compute style for a toast (used in template)
  getStyle(t: Toast): { [k: string]: string } {
    if (t.options.position === 'near' && t.top !== undefined && t.left !== undefined) {
      // translate to center the toast horizontally
      return {
        position: 'absolute',
        top: `${t.top}px`,
        left: `${t.left}px`,
        transform: 'translateX(-50%)',
        zIndex: '1200',
      };
    }
    // for the stacked containers we rely on CSS classes; return empty
    return {};
  }

  close(t: Toast) {
    this.toaster.remove(t.id);
  }
}
