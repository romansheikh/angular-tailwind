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
  
  // Basic 12-hour "time ago" helper (keeps it small & dependency-free).
  // For production, you might want dayjs/date-fns for localization and accuracy.
timeAgo(d: string | Date | undefined): string {
  if (!d) return '';

  let date: Date | null;

  if (d instanceof Date) {
    date = d;
  } else {
    date = this.parseDate(d);
  }

  if (!date || isNaN(date.getTime())) return '';

  const now = new Date();
  const sec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (sec < 10) return 'just now';
  if (sec < 60) return `${sec} s ago`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} h ago`;

  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} d ago`;

  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon} mo ago`;

  return `${Math.floor(mon / 12)} y ago`;
}


parseDate(dateStr: string): Date | null {
  // "06 12 2025 05:34 PM"
  const parts = dateStr.match(
    /^(\d{2})[\/\s](\d{2})[\/\s](\d{4})\s(\d{1,2}):(\d{2})\s(AM|PM)$/i
  );

  if (!parts) return null;

  let [, dd, mm, yyyy, hh, min, period] = parts;

  let hour = Number(hh);
  if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
  if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

  return new Date(
    Number(yyyy),
    Number(mm) - 1,
    Number(dd),
    hour,
    Number(min)
  );
}

}
