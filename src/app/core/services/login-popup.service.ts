import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginPopupService {
  popupOpen = signal(false);

  open() {
    this.popupOpen.set(true);
  }

  close() {
    this.popupOpen.set(false);
  }
}
