import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

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
hasError(controlName: string, errorCode: string, formGroup: FormGroup) {
  const control = formGroup.get(controlName);
  return !!(control && (control.touched || control.dirty) && control.hasError(errorCode));
}  

passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('Password')?.value;
  const confirmPassword = control.get('ConfirmPassword')?.value;

  if (!password || !confirmPassword) return null;

  return password === confirmPassword ? null : { passwordMismatch: true };
}
}
