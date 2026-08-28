import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="true">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div class="toast-item" [class]="'toast-' + toast.type">
          <span class="toast-dot"></span>
          <span class="toast-message">{{ toast.message }}</span>
          @if (toast.actionLabel) {
            <button type="button" class="toast-action" (click)="onAction(toast)">
              {{ toast.actionLabel }}
            </button>
          }
          <button type="button" class="toast-close" (click)="dismiss(toast.id)" aria-label="Dismiss notification">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      bottom: var(--space-3);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column-reverse;
      gap: var(--space-1);
      z-index: 9999;
      pointer-events: none;
      max-width: 90vw;
    }
    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      background-color: var(--brand-dark-navy);
      color: #ffffff;
      padding: 10px 16px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      font-size: 13px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      animation: slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUp {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .toast-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .toast-info .toast-dot { background-color: #38bdf8; }
    .toast-success .toast-dot { background-color: #22c55e; }
    .toast-warning .toast-dot { background-color: #f59e0b; }
    .toast-error .toast-dot { background-color: #ef4444; }

    .toast-message {
      font-weight: 450;
    }
    .toast-action {
      color: #38bdf8;
      font-weight: 600;
      font-size: 12px;
      padding: 2px 6px;
      margin-left: 4px;
      border-radius: var(--radius-xs);
    }
    .toast-action:hover {
      text-decoration: underline;
    }
    .toast-close {
      color: #94a3b8;
      display: flex;
      align-items: center;
      padding: 2px;
      border-radius: var(--radius-xs);
      margin-left: var(--space-0-5);
    }
    .toast-close:hover {
      color: #ffffff;
    }
  `]
})
export class ToastContainerComponent {
  constructor(public notificationService: NotificationService) {}

  dismiss(id: string) {
    this.notificationService.dismiss(id);
  }

  onAction(toast: any) {
    if (toast.actionCallback) toast.actionCallback();
    this.dismiss(toast.id);
  }
}
