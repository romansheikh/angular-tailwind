import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, inject, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentGateway } from 'src/app/core/models/paymetngateway';
import { PaymentGatewayService } from 'src/app/core/services/paymentgateway.service';

import { BankService } from 'src/app/core/services/bank.service';
import { CopyButtonComponent } from 'src/app/shared/components/copy-button/copy-button.component';
import { CommonService } from 'src/app/core/services/common.service';
import { AdminLayoutRoutingModule } from '../admin-layout/admin-layout-routing.module';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  imports: [CommonModule, ReactiveFormsModule, CopyButtonComponent, AdminLayoutRoutingModule], // ✅ Add this
})
export class StepThreeComponent {
  copied = signal(false);
  gatewayData: PaymentGateway;
  formGroup!: FormGroup;
  common: CommonService = inject(CommonService);
  @Output() back = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  gatewayService = inject(PaymentGatewayService);
  bank = inject(BankService);

  fileName!: string;
  filePreview!: string
  constructor(private fb: FormBuilder, private sanitizer:DomSanitizer) {
    this.gatewayData = this.gatewayService.paymentGateway()[0];
    this.formGroup = this.fb.group({
      TransactionProof: ['', Validators.required],
      PaymentDetailsId: [this.gatewayData.PaymentDetailsId || null, Validators.required],
      PaymentProofImageUrl: [''],
    });
  }

  confrim() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      console.log(this.formGroup.value);
      return;
    } else {
      this.confirm.emit();
    }
  }

 
onFileChanged(event: any): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const result = reader.result;
    if (typeof result === 'string') {
      const base64 = result.split(',')[1];
      this.fileName = `${file.name} (${file.type})`;
      this.filePreview = `data:${file.type};base64,${base64}`;
      this.formGroup.patchValue({ PaymentProofImageUrl: this.filePreview });
    }
  };

  reader.readAsDataURL(file);
}



 sanitize(url: string) {
    //return url;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
