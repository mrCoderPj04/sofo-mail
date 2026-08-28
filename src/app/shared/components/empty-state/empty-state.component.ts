import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state-wrapper">
      <div class="icon-circle">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          @if (icon === 'inbox') {
            <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          } @else if (icon === 'search') {
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          } @else if (icon === 'trash') {
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          } @else if (icon === 'contacts') {
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          } @else {
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          }
        </svg>
      </div>
      <h3 class="headline">{{ headline }}</h3>
      <p class="description">{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-6) var(--space-3);
      text-align: center;
      height: 100%;
      min-height: 280px;
    }
    .icon-circle {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-full);
      background-color: var(--bg-surface-hover);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-2);
      border: 1px solid var(--border-subtle);
    }
    .headline {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-0-5);
    }
    .description {
      font-size: 13px;
      color: var(--text-muted);
      max-width: 320px;
      line-height: 1.5;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: 'inbox' | 'search' | 'trash' | 'contacts' | 'default' = 'inbox';
  @Input() headline = "You're all caught up.";
  @Input() description = 'No conversations to review at this moment.';
}
