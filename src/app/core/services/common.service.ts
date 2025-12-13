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
  timeAgo(d: Date | undefined): string {
    if (!d) return '';
    const now = new Date();
    const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
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

  // Expected date format: "DD MM YYYY hh:mm AM/PM"
  // Returns a Date in local timezone.
  parseDate(s: string): Date {
    // Defensive parsing: split tokens
    // Example input: "06 12 2025 05:34 PM"
    try {
      const parts = s.trim().split(/\s+/); // ["06","12","2025","05:34","PM"]
      if (parts.length < 5) return new Date(s); // fallback
      const [dayStr, monthStr, yearStr, timeStr, ampm] = parts;
      const [hhStr, mmStr] = timeStr.split(':');
      let hh = parseInt(hhStr, 10);
      const mm = parseInt(mmStr, 10);
      const day = parseInt(dayStr, 10);
      // month in input appears numeric (e.g. 12 => December). If logos use US style, confirm.
      let month = parseInt(monthStr, 10); // 1-12
      // convert 12-hour to 24-hour
      if (/pm/i.test(ampm) && hh < 12) hh += 12;
      if (/am/i.test(ampm) && hh === 12) hh = 0;
      // Construct ISO string YYYY-MM-DDTHH:MM:00
      const iso = `${yearStr}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hh).padStart(
        2,
        '0',
      )}:${String(mm).padStart(2, '0')}:00`;
      const dt = new Date(iso);
      if (isNaN(dt.getTime())) return new Date(s); // fallback
      return dt;
    } catch {
      return new Date(s);
    }
  }
}
