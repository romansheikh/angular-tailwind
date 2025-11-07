import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject, Signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Currency } from 'src/app/core/models/currencies';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ExchangeService } from 'src/app/core/services/exchange.service';
import { FormErrorComponent } from 'src/app/shared/components/form-error/form-error.component';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  imports: [CommonModule, ReactiveFormsModule], // ✅ Add this
})
export class StepOneComponent implements OnInit {
  fb = inject(FormBuilder);
  currencyService = inject(CurrencyService);
  exchangeService = inject(ExchangeService);
  commonService = inject(CommonService);

  @Output() next = new EventEmitter<void>();

  formGroup: FormGroup;
  currentRate = 0 as number | null;

  sendCurrency = this.currencyService.selectedSendCurrency;
  getCurrency = this.currencyService.selectedGetCurrency;

  constructor() {
    this.formGroup = this.fb.group({
      AmountSend: [null, [Validators.required, Validators.pattern('^[0-9]*\\.?[0-9]*$'), Validators.min(1)]],
      AmountReceive: [{ value: '', disabled: true }],
      FromCurrencyId: [this.sendCurrency()?.Id || null, Validators.required],
      ToCurrencyId: [this.getCurrency()?.Id || null, Validators.required]
    });
    this.loadRateEffect();
  }

  ngOnInit() {
    this.formGroup.get('AmountSend')?.valueChanges.subscribe((AmountSend) => {
      if (AmountSend && this.currentRate) {
        const calculated = Number(AmountSend) * this.currentRate;
        this.formGroup.get('AmountReceive')?.setValue(calculated.toFixed(3), { emitEvent: false });
      } else {
        this.formGroup.get('AmountReceive')?.setValue('', { emitEvent: false });
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
          this.currentRate = pair.Rate;
          this.exchangeService.rate.set(pair);

          // Default AmountSend
          let defaultAmountSend = 1;
          if (pair.FromCurrency.Type === 'MFS') {
            defaultAmountSend = this.commonService.convertUsdToBdt(pair.Rate);
          }
          const sendControl = this.formGroup.get('AmountSend');
          sendControl?.setValue(defaultAmountSend, { emitEvent: false });
          sendControl?.setValidators([
            Validators.required,
            Validators.min(pair.MinAmount),
            Validators.max(pair.MaxAmount),
            Validators.pattern('^[0-9]*\\.?[0-9]*$'),
          ]);
          sendControl?.updateValueAndValidity();
        });
      }
    });
  }




  goNext() {
    this.next.emit();
  }
}
