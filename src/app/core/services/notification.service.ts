import { Injectable, signal } from '@angular/core';

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  actionLabel?: string;
  actionCallback?: () => void;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly toasts = signal<ToastNotification[]>([]);

  show(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', actionLabel?: string, actionCallback?: () => void, durationMs = 3500) {
    const id = 'tst-' + Math.random().toString(36).substring(2, 9);
    const notification: ToastNotification = {
      id,
      type,
      message,
      actionLabel,
      actionCallback,
      durationMs
    };

    this.toasts.update(list => [...list, notification]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }
    return id;
  }

  success(message: string, actionLabel?: string, actionCallback?: () => void) {
    return this.show(message, 'success', actionLabel, actionCallback, 3000);
  }

  info(message: string) {
    return this.show(message, 'info', undefined, undefined, 2500);
  }

  warning(message: string) {
    return this.show(message, 'warning', undefined, undefined, 4000);
  }

  error(message: string) {
    return this.show(message, 'error', undefined, undefined, 5000);
  }

  showSuccess(message: string) {
    return this.success(message);
  }

  showInfo(message: string) {
    return this.info(message);
  }

  showError(message: string) {
    return this.error(message);
  }

  dismiss(id: string) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
