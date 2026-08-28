import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="'badge-' + variant">
      @if (dot) {
        <span class="badge-dot"></span>
      }
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-0-5);
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 500;
      border-radius: var(--radius-full);
      line-height: 1.3;
      white-space: nowrap;
    }
    .badge-neutral {
      background-color: var(--badge-bg-neutral);
      color: var(--badge-text-neutral);
    }
    .badge-brand {
      background-color: var(--brand-primary-subtle);
      color: var(--brand-primary);
    }
    .badge-success {
      background-color: var(--status-success-bg);
      color: var(--status-success);
    }
    .badge-warning {
      background-color: var(--status-warning-bg);
      color: var(--status-warning);
    }
    .badge-error {
      background-color: var(--status-error-bg);
      color: var(--status-error);
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }
  `]
})
export class BadgeComponent {
  @Input() variant: 'neutral' | 'brand' | 'success' | 'warning' | 'error' = 'neutral';
  @Input() dot = false;
}
