import { CreateUpdateCurrency } from '../../../../core/models/currencies';

import { Component, Input, Output, EventEmitter, OnInit, inject, Signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ExchangeService } from 'src/app/core/services/exchange.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  imports: [ReactiveFormsModule], // ✅ Add this
})
export class StepOneComponent implements OnInit {
  fb = inject(FormBuilder);
  currencyService = inject(CurrencyService);
  exchangeService = inject(ExchangeService);
  commonService = inject(CommonService);

  @Output() next = new EventEmitter<void>();

  formGroup!: FormGroup;
  currentRate = 0 as number | null;

  sendCurrency = this.currencyService.selectedSendCurrency;
  getCurrency = this.currencyService.selectedGetCurrency;

  constructor() {
    this.CreateFrom()
    this.loadRateEffect();
  }

  ngOnInit() {
    this.bindFormValueChanges();
  }

  private CreateFrom(){
      this.formGroup = this.fb.group({
      AmountSend: [null, [Validators.required, Validators.pattern('^[0-9]*\\.?[0-9]*$'), Validators.min(1)]],
      AmountReceive: [{ value: '' }],
      FromCurrencyId: [this.sendCurrency()?.Id || null, Validators.required],
      ToCurrencyId: [this.getCurrency()?.Id || null, Validators.required],
    });
  }

  
private bindFormValueChanges() {
  const amountSendCtrl = this.formGroup.get('AmountSend');
  const amountReceiveCtrl = this.formGroup.get('AmountReceive');

  if (!amountSendCtrl || !amountReceiveCtrl) return;


  amountSendCtrl.valueChanges.subscribe((sendValue) => {
    if (!this.currentRate) return;
    const receiveValue = Number(sendValue) * this.currentRate;

    if (Number(amountReceiveCtrl.value) !== Number(receiveValue.toFixed(2))) {
      amountReceiveCtrl.setValue(receiveValue.toFixed(2), { emitEvent: false });
    }
  });


  amountReceiveCtrl.valueChanges.subscribe((receiveValue) => {
    if (!this.currentRate) return;
    const sendValue = Number(receiveValue) / this.currentRate;

    if (Number(amountSendCtrl.value) !== Number(sendValue.toFixed(2))) {
      amountSendCtrl.setValue(sendValue.toFixed(2), { emitEvent: false });
    }
  });
}


  private loadRateEffect() {
    effect(() => {
      const fromId = this.sendCurrency()?.Id;
      const toId = this.getCurrency()?.Id;

      if (fromId && toId) {
        this.exchangeService.loadPairRate(fromId, toId);

        this.exchangeService.getRatePairByCurrencyId(fromId, toId).subscribe((pair) => {
          this.currentRate = pair.Body?.Rate!;
          this.exchangeService.rate.set(pair.Body!);

          // Default AmountSend
          let defaultAmountSend = 1;
          if (pair.Body?.FromCurrency.Type === 'MFS' || pair.Body?.FromCurrency.Type === 'Bank') {
            defaultAmountSend = this.commonService.convertUsdToBdt(pair.Body?.Rate);
          }
          const sendControl = this.formGroup.get('AmountSend');
          sendControl?.setValue(defaultAmountSend, { emitEvent: false });
          sendControl?.setValidators([
            Validators.required,
            Validators.min(pair.Body?.MinAmount!),
            Validators.max(pair.Body?.MaxAmount!),
            Validators.pattern('^[0-9]*\\.?[0-9]*$'),
          ]);
          sendControl?.updateValueAndValidity();
        });
      }
    });
  }

  onNext() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    } else {
      this.next.emit();
    }
  }
}
