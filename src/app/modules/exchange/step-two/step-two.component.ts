import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankService } from 'src/app/core/services/bank.service';
import { ExchangeService } from 'src/app/core/services/exchange.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';


@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './step-two.component.html',
})
export class StepTwoComponent {
onStatusChange($event: Event) {
throw new Error('Method not implemented.');
}
  formGroup: FormGroup;
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  exchangeService = inject(ExchangeService);
  bankService = inject(BankService);
  instruction = this.exchangeService.rate()?.ToCurrency?.PaymentInstruction || '';
  cleanInstruction = this.instruction.replace(/^Enter your\s*/i, '');

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      UserReceivingDetails: ['', Validators.required],
      AcceptTerm: [false, Validators.requiredTrue],
      BankName: [''],
      AccountHolderName: [''],
      Branch: [''],
    });
  this.checkBankTransferValidation();
  }

checkBankTransferValidation() {
  const toCurrency = this.exchangeService.rate()?.ToCurrency?.Name;

  const bankNameCtrl = this.formGroup.get('BankName');
  const accountHolderCtrl = this.formGroup.get('AccountHolderName');
  const branchCtrl = this.formGroup.get('Branch');

  if (toCurrency === 'Bank Transfer') {
    bankNameCtrl?.setValidators([Validators.required]);
    accountHolderCtrl?.setValidators([
      Validators.required,
      Validators.pattern(/^[a-zA-Z\s]+$/) // optional pattern
    ]);
    branchCtrl?.setValidators([Validators.required]);
  } else {
    bankNameCtrl?.clearValidators();
    accountHolderCtrl?.clearValidators();
    branchCtrl?.clearValidators();
  }

  // revalidate the controls after changes
  bankNameCtrl?.updateValueAndValidity();
  accountHolderCtrl?.updateValueAndValidity();
  branchCtrl?.updateValueAndValidity();
}


  hasError(controlName: string, errorCode: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!(control && control.touched && control.hasError(errorCode));
  }

  // getter for values
  get value() {
    return this.formGroup.value;
  }

  onNext() {
    if (this.formGroup.valid) {
      this.next.emit();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
