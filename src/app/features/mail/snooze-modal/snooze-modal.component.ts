import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-snooze-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal [isOpen]="true" title="Snooze Conversation" maxWidth="380px" (close)="cancel.emit()">
      <div class="snooze-options">
        <p class="hint-text">Select when this message should return to your inbox:</p>

        <button type="button" class="snooze-option-btn" (click)="selectSnooze('Later today, 6:00 PM')">
          <div class="option-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="option-details">
            <span class="option-title">Later today</span>
            <span class="option-time">6:00 PM</span>
          </div>
        </button>

        <button type="button" class="snooze-option-btn" (click)="selectSnooze('Tomorrow, 8:00 AM')">
          <div class="option-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="option-details">
            <span class="option-title">Tomorrow morning</span>
            <span class="option-time">8:00 AM</span>
          </div>
        </button>

        <button type="button" class="snooze-option-btn" (click)="selectSnooze('Next Monday, 8:00 AM')">
          <div class="option-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
          <div class="option-details">
            <span class="option-title">Next week</span>
            <span class="option-time">Monday, 8:00 AM</span>
          </div>
        </button>
      </div>
    </app-modal>
  `,
  styles: [`
    .snooze-options {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    .hint-text {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: var(--space-1);
    }
    .snooze-option-btn {
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      padding: 12px 14px;
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      text-align: left;
      transition: all var(--transition-fast);
      color: var(--text-primary);
    }
    .snooze-option-btn:hover {
      background-color: var(--bg-surface-selected);
      border-color: var(--brand-primary);
    }
    .option-icon {
      color: var(--brand-primary);
      display: flex;
      align-items: center;
    }
    .option-details {
      display: flex;
      flex-direction: column;
    }
    .option-title {
      font-size: 13px;
      font-weight: 600;
    }
    .option-time {
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class SnoozeModalComponent {
  @Output() snooze = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  selectSnooze(time: string) {
    this.snooze.emit(time);
  }
}
