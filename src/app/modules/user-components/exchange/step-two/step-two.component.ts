import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankService } from 'src/app/core/services/bank.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ExchangeService } from 'src/app/core/services/exchange.service';
import { UserService } from 'src/app/core/services/user.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './step-two.component.html',
})
export class StepTwoComponent {
  private readonly fb = inject(FormBuilder);
  exchange = inject(ExchangeService);
  bankService = inject(BankService);

  readonly common = inject(CommonService);
  readonly user = inject(UserService).user();

  @Output() formDataChange = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Input() data: any;

  formGroup: FormGroup;

  get cleanInstruction(): string {
    const instruction = this.exchange.rate()?.ToCurrency?.PaymentInstruction || '';
    return instruction.replace(/^Enter your\s*/i, '');
  }

  get isBankTransfer(): boolean {
    return this.exchange.rate()?.ToCurrency?.Name === 'Bank Transfer';
  }

  constructor() {
    this.formGroup = this.buildStepTwoForm();
  }

  private buildStepTwoForm(): FormGroup {
    const form = this.fb.group({
      Name: [this.user?.FullName, Validators.required],
      Email: [this.user?.Email, [Validators.required, Validators.email]],
      Phone: [this.user?.Phone, [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      UserReceivingDetails: ['', Validators.required],
      AcceptTerm: [false, Validators.requiredTrue],
      BankName: [''],
      AccountHolderName: [''],
      Branch: [''],
    });

    this.applyBankTransferValidation(form);

    form.valueChanges.subscribe((value) => {
      this.formDataChange.emit(value);
    });

    return form;
  }

  private applyBankTransferValidation(form: FormGroup): void {
    const bankNameCtrl = form.get('BankName');
    const accountHolderCtrl = form.get('AccountHolderName');
    const branchCtrl = form.get('Branch');

    if (this.isBankTransfer) {
      bankNameCtrl?.setValidators([Validators.required]);
      accountHolderCtrl?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]);
      branchCtrl?.setValidators([Validators.required]);
    } else {
      bankNameCtrl?.clearValidators();
      accountHolderCtrl?.clearValidators();
      branchCtrl?.clearValidators();
    }

    bankNameCtrl?.updateValueAndValidity({ emitEvent: false });
    accountHolderCtrl?.updateValueAndValidity({ emitEvent: false });
    branchCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  onNext(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const receivingDetails = this.formGroup.get('UserReceivingDetails')?.value || '';
    this.bankService.userReceivingDetails.set(receivingDetails);
    this.next.emit();
  }
}
