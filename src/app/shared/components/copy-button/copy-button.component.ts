import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
})
export class CopyButtonComponent {
  constructor(private toaster: ToastrService) {}
  @Input() valueToCopy!: string;

  copyToClipboard() {
    if (!this.valueToCopy) return;
    navigator.clipboard.writeText(this.valueToCopy);
    this.toaster.success(this.valueToCopy + ' copied!');
  }
}
