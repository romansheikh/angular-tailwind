export type ToastPosition = 'top-center' | 'bottom-center' | 'top-left' | 'near';

export interface ToastOptions {
  duration?: number;          // ms; default 3000
  position?: ToastPosition;   // default 'top-center'
  type?: 'info'|'success'|'warning'|'error';
  target?: HTMLElement | null; // for 'near' positioning
  offsetX?: number;           // tweak near position
  offsetY?: number;
}

export interface Toast {
  id: string;
  message: string;
  options: Required<ToastOptions>;
  // computed coords when position === 'near'
  top?: number;
  left?: number;
}
