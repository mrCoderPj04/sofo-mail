import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { MailService } from '../../../core/services/mail.service';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal [isOpen]="true" title="Advanced Search" maxWidth="520px" (close)="close.emit()">
      <form (ngSubmit)="applySearch()" class="search-form">
        <div class="form-row">
          <label for="from">From</label>
          <input id="from" type="text" [(ngModel)]="from" name="from" placeholder="Sender name or email..." class="search-input" />
        </div>

        <div class="form-row">
          <label for="to">To</label>
          <input id="to" type="text" [(ngModel)]="to" name="to" placeholder="Recipient name or email..." class="search-input" />
        </div>

        <div class="form-row">
          <label for="subject">Subject</label>
          <input id="subject" type="text" [(ngModel)]="subject" name="subject" placeholder="Words in subject line..." class="search-input" />
        </div>

        <div class="form-row">
          <label for="hasWords">Has words</label>
          <input id="hasWords" type="text" [(ngModel)]="hasWords" name="hasWords" placeholder="Search keywords..." class="search-input" />
        </div>

        <div class="form-row checkbox-row">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="hasAttachment" name="hasAttachment" />
            <span>Has attachment</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="isUnreadOnly" name="isUnreadOnly" />
            <span>Unread only</span>
          </label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="reset()">Reset</button>
          <button type="submit" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search</span>
          </button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .search-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .form-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .form-row label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .search-input {
      background-color: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 8px 12px;
      font-size: 13px;
      color: var(--text-primary);
      outline: none;
    }
    .search-input:focus {
      border-color: var(--border-focus);
    }
    .checkbox-row {
      flex-direction: row;
      gap: var(--space-3);
      margin-top: 4px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-1);
      margin-top: var(--space-2);
      padding-top: var(--space-2);
      border-top: 1px solid var(--border-subtle);
    }
    .btn-secondary {
      padding: 8px 14px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 13px;
    }
    .btn-secondary:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 6px;
      background-color: var(--brand-primary);
      color: #ffffff;
      padding: 8px 18px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
    }
    .btn-primary:hover {
      background-color: var(--brand-primary-hover);
    }
  `]
})
export class AdvancedSearchComponent {
  @Output() close = new EventEmitter<void>();

  from = '';
  to = '';
  subject = '';
  hasWords = '';
  hasAttachment = false;
  isUnreadOnly = false;

  constructor(private mailService: MailService) {}

  applySearch() {
    const query = [this.from, this.to, this.subject, this.hasWords].filter(Boolean).join(' ');
    this.mailService.searchQuery.set(query);
    if (this.hasAttachment) {
      this.mailService.filterTab.set('attachments');
    } else if (this.isUnreadOnly) {
      this.mailService.filterTab.set('unread');
    }
    this.close.emit();
  }

  reset() {
    this.from = '';
    this.to = '';
    this.subject = '';
    this.hasWords = '';
    this.hasAttachment = false;
    this.isUnreadOnly = false;
    this.mailService.searchQuery.set('');
    this.mailService.filterTab.set('all');
  }
}
