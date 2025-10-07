import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  convertUsdToBdt(ratePerBdt: number): number {
    if (ratePerBdt <= 0) {
      throw new Error('Invalid rate value');
    }

    const usdToBdt = 1 / ratePerBdt;
    return parseFloat(usdToBdt.toFixed(2));
  }

  amountRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') return null;

      const value = Number(control.value);
      if (isNaN(value)) return { invalidNumber: true };
      if (value < min) return { minAmount: true, minAmountValue: min };
      if (value > max) return { maxAmount: true, maxAmountValue: max };

      return null;
    };
  }

  
}
