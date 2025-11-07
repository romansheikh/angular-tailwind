import { Injectable, signal } from '@angular/core';
import { Toast, ToastOptions } from '../models/toast.model';


@Injectable({ providedIn: 'root' })
export class ToasterService {
  // signal holding current toasts
  toasts = signal<Toast[]>([]);

  private defaultOptions = {
    duration: 3000,
    position: 'top-center' as const,
    type: 'info' as const,
    target: null,
    offsetX: 0,
    offsetY: 8,
  };

  private idCounter = 0;

  show(message: string, opts: ToastOptions = {}) {
    const options = { ...this.defaultOptions, ...opts } as Required<ToastOptions>;

    const id = `toast-${++this.idCounter}-${Date.now()}`;
    const toast: Toast = { id, message, options };

    // if near positioning and a target is supplied, compute coords now
    if (options.position === 'near' && options.target) {
      const rect = options.target.getBoundingClientRect();
      // position above the element by default (you can change logic)
      toast.top = window.scrollY + rect.top - options.offsetY;
      toast.left = window.scrollX + rect.left + rect.width / 2;
      // push a small default so it's visible above element
      toast.top = Math.max(8, toast.top - 40);
    }

    this.toasts.update((arr) => [...arr, toast]);

    // auto dismiss
    if (options.duration > 0) {
      setTimeout(() => this.remove(id), options.duration);
    }

    return id;
  }

  success(msg: string, opts: ToastOptions = {}) {
    return this.show(msg, { ...opts, type: 'success' });
  }
  info(msg: string, opts: ToastOptions = {}) {
    return this.show(msg, { ...opts, type: 'info' });
  }
  error(msg: string, opts: ToastOptions = {}) {
    return this.show(msg, { ...opts, type: 'error' });
  }
  warning(msg: string, opts: ToastOptions = {}) {
    return this.show(msg, { ...opts, type: 'warning' });
  }

  remove(id: string) {
    this.toasts.update((arr) => arr.filter((t) => t.id !== id));
  }

  clearAll() {
    this.toasts.set([]);
  }
}
