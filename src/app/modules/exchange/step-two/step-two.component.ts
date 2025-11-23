import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankService } from 'src/app/core/services/bank.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ExchangeService } from 'src/app/core/services/exchange.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './step-two.component.html',
})
export class StepTwoComponent {
  formGroup: FormGroup;
  common: CommonService = inject(CommonService);
  fb: FormBuilder = inject(FormBuilder);
  @Output() formDataChange = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Input() data: any; //
  exchangeService = inject(ExchangeService);
  bankService = inject(BankService);
  instruction = this.exchangeService.rate()?.ToCurrency?.PaymentInstruction || '';
  cleanInstruction = this.instruction.replace(/^Enter your\s*/i, '');
  userReceivingDetails = signal('');
  constructor() {
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
    this.formGroup.valueChanges.subscribe((value) => {
      this.formDataChange.emit(value);
    });
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
        Validators.pattern(/^[a-zA-Z\s]+$/), // optional pattern
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

  // getter for values
  get value() {
    return this.formGroup.value;
  }

  onNext() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched(); // ✅ Best practice here
      return;
    } else {
      this.bankService.userReceivingDetails.set(this.formGroup.get('UserReceivingDetails')?.value || '');
      this.next.emit();
    }
    // go next
  }
}
