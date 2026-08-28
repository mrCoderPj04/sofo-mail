import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailService } from '../../../core/services/mail.service';
import { EmailMessage } from '../../../core/models/mail.model';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { MailThreadComponent } from '../mail-thread/mail-thread.component';
import { SnoozeModalComponent } from '../snooze-modal/snooze-modal.component';

@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    BadgeComponent,
    EmptyStateComponent,
    MailThreadComponent,
    SnoozeModalComponent
  ],
  template: `
    <div class="mail-view-container" [class.has-selection]="!!mailService.selectedMessage()">
      <!-- Left / Center: Mail List Pane -->
      <section class="mail-list-pane" aria-label="Email message list">
        <!-- List Header -->
        <div class="mail-list-header">
          <div class="header-main">
            <h1 class="folder-title">{{ mailService.currentFolder().displayName }}</h1>
            @if (mailService.currentFolder().unreadCount > 0) {
              <app-badge variant="brand">{{ mailService.currentFolder().unreadCount }} unread</app-badge>
            }
          </div>

          <!-- Filter Tabs -->
          <div class="filter-tabs" role="tablist">
            <button
              type="button"
              class="filter-tab"
              [class.active]="mailService.filterTab() === 'all'"
              (click)="mailService.filterTab.set('all')"
              role="tab"
            >
              All
            </button>
            <button
              type="button"
              class="filter-tab"
              [class.active]="mailService.filterTab() === 'unread'"
              (click)="mailService.filterTab.set('unread')"
              role="tab"
            >
              Unread
            </button>
            <button
              type="button"
              class="filter-tab"
              [class.active]="mailService.filterTab() === 'starred'"
              (click)="mailService.filterTab.set('starred')"
              role="tab"
            >
              Starred
            </button>
            <button
              type="button"
              class="filter-tab"
              [class.active]="mailService.filterTab() === 'attachments'"
              (click)="mailService.filterTab.set('attachments')"
              role="tab"
            >
              Attachments
            </button>
          </div>
        </div>

        <!-- Bulk Action Toolbar -->
        <div class="mail-toolbar">
          <div class="toolbar-left">
            <label class="select-all-checkbox" title="Select all messages">
              <input
                type="checkbox"
                [checked]="isAllSelected()"
                [indeterminate]="isIndeterminate()"
                (change)="mailService.toggleSelectAll()"
                aria-label="Select all conversations"
              />
            </label>

            @if (mailService.selectedMessageIds().length > 0) {
              <div class="bulk-actions-group">
                <button type="button" class="toolbar-btn" (click)="mailService.performBatchAction('read')" title="Mark as read" aria-label="Mark selected as read">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12l5 5L20 4"></path>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" (click)="mailService.performBatchAction('archive')" title="Archive selected" aria-label="Archive selected">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8"></polyline>
                    <rect x="1" y="3" width="22" height="5"></rect>
                    <line x1="10" y1="12" x2="14" y2="12"></line>
                  </svg>
                </button>
                <button type="button" class="toolbar-btn" (click)="mailService.performBatchAction('trash')" title="Move to trash" aria-label="Trash selected">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
                <span class="selected-count-label">{{ mailService.selectedMessageIds().length }} selected</span>
              </div>
            }
          </div>

          <div class="toolbar-right">
            <span class="message-count-summary">{{ mailService.filteredMessages().length }} messages</span>
          </div>
        </div>

        <!-- Email Messages List -->
        <div class="mail-rows-container" role="list">
          @if (mailService.filteredMessages().length === 0) {
            <app-empty-state
              [icon]="getEmptyStateIcon()"
              [headline]="getEmptyStateHeadline()"
              [description]="getEmptyStateDescription()"
            ></app-empty-state>
          } @else {
            @for (msg of mailService.filteredMessages(); track msg.id) {
              <div
                class="mail-row"
                [class.unread]="msg.isUnread"
                [class.selected]="mailService.selectedMessageId() === msg.id"
                [class.checked]="mailService.selectedMessageIds().includes(msg.id)"
                (click)="onMessageClick(msg)"
                role="listitem"
                tabindex="0"
                (keydown.enter)="onMessageClick(msg)"
              >
                <!-- Row Selection Checkbox -->
                <div class="row-checkbox" (click)="$event.stopPropagation()">
                  <input
                    type="checkbox"
                    [checked]="mailService.selectedMessageIds().includes(msg.id)"
                    (change)="mailService.toggleSelectMessage(msg.id, $event)"
                    aria-label="Select message"
                  />
                </div>

                <!-- Star Toggle Button -->
                <button
                  type="button"
                  class="star-toggle"
                  [class.starred]="msg.isStarred"
                  (click)="mailService.toggleStar(msg.id, $event)"
                  aria-label="Star conversation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" [attr.fill]="msg.isStarred ? '#eab308' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </button>

                <!-- Sender Avatar -->
                <div class="row-avatar">
                  <app-avatar [name]="msg.senderName" size="sm"></app-avatar>
                </div>

                <!-- Sender Name -->
                <div class="row-sender">
                  <span class="sender-text" [title]="msg.senderEmail">{{ msg.senderName }}</span>
                  @if (msg.priority === 'HIGH' || msg.priority === 'URGENT') {
                    <span class="priority-indicator" title="High priority message">!</span>
                  }
                </div>

                <!-- Message Snippet & Subject -->
                <div class="row-content">
                  <span class="row-subject">{{ msg.subject }}</span>
                  <span class="row-separator">—</span>
                  <span class="row-snippet">{{ msg.snippet }}</span>
                </div>

                <!-- Indicators & Timestamp / Quick Actions -->
                <div class="row-meta">
                  @if (msg.hasAttachments) {
                    <span class="attachment-icon" title="Has attachment">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                      </svg>
                    </span>
                  }

                  <span class="row-timestamp">{{ msg.sentAt || 'Today' }}</span>
                </div>

                <!-- Hover Quick Actions Bar -->
                <div class="row-hover-actions" (click)="$event.stopPropagation()">
                  <button type="button" class="quick-btn" (click)="mailService.archiveMessage(msg.id, $event)" title="Archive" aria-label="Archive message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8"></polyline>
                      <rect x="1" y="3" width="22" height="5"></rect>
                      <line x1="10" y1="12" x2="14" y2="12"></line>
                    </svg>
                  </button>
                  <button type="button" class="quick-btn" (click)="toggleReadStatus(msg, $event)" [title]="msg.isUnread ? 'Mark as read' : 'Mark as unread'" aria-label="Toggle read state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      @if (msg.isUnread) {
                        <path d="M2 12l5 5L20 4"></path>
                      } @else {
                        <circle cx="12" cy="12" r="8"></circle>
                      }
                    </svg>
                  </button>
                  <button type="button" class="quick-btn" (click)="mailService.deleteMessage(msg.id, $event)" title="Delete" aria-label="Move to trash">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                  <button type="button" class="quick-btn" (click)="openSnooze(msg.id, $event)" title="Snooze" aria-label="Snooze conversation">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </section>

      <!-- Right: Mail Thread Pane (Reading Experience) -->
      @if (mailService.selectedMessage()) {
        <section class="mail-thread-pane" aria-label="Email conversation reader">
          <app-mail-thread></app-mail-thread>
        </section>
      }

      <!-- Snooze Modal -->
      @if (mailService.activeSnoozeMessageId()) {
        <app-snooze-modal
          (snooze)="onSnoozeConfirmed($event)"
          (cancel)="mailService.activeSnoozeMessageId.set(null)"
        ></app-snooze-modal>
      }
    </div>
  `,
  styles: [`
    .mail-view-container {
      height: 100%;
      display: flex;
      overflow: hidden;
      background-color: var(--bg-surface);
    }
    .mail-list-pane {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-right: 1px solid var(--border-subtle);
      background-color: var(--bg-surface);
    }
    .mail-thread-pane {
      flex: 1.35;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: var(--bg-surface);
    }
    @media (max-width: 900px) {
      .has-selection .mail-list-pane {
        display: none;
      }
      .has-selection .mail-thread-pane {
        flex: 1;
      }
    }
    .mail-list-header {
      padding: var(--space-2) var(--space-2);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-1);
    }
    .header-main {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }
    .folder-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.2px;
    }
    .filter-tabs {
      display: flex;
      align-items: center;
      gap: 2px;
      background-color: var(--bg-surface-hover);
      padding: 3px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }
    .filter-tab {
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
      transition: all var(--transition-fast);
    }
    .filter-tab:hover {
      color: var(--text-primary);
    }
    .filter-tab.active {
      background-color: var(--bg-surface);
      color: var(--brand-primary);
      font-weight: 600;
      box-shadow: var(--shadow-xs);
    }
    .mail-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px var(--space-2);
      border-bottom: 1px solid var(--border-subtle);
      background-color: var(--bg-app);
      font-size: 12px;
      color: var(--text-muted);
    }
    .toolbar-left {
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
    }
    .select-all-checkbox {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .bulk-actions-group {
      display: flex;
      align-items: center;
      gap: 4px;
      border-left: 1px solid var(--border-subtle);
      padding-left: var(--space-1);
    }
    .toolbar-btn {
      color: var(--text-secondary);
      padding: 4px 6px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
    }
    .toolbar-btn:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .selected-count-label {
      font-weight: 500;
      margin-left: 4px;
    }
    .message-count-summary {
      font-size: 11px;
      color: var(--text-subtle);
    }
    .mail-rows-container {
      flex: 1;
      overflow-y: auto;
    }
    .mail-row {
      position: relative;
      display: flex;
      align-items: center;
      padding: 10px var(--space-2);
      border-bottom: 1px solid var(--border-subtle);
      gap: var(--space-1-5);
      cursor: pointer;
      user-select: none;
      transition: background-color var(--transition-fast);
      background-color: var(--bg-surface);
    }
    .mail-row:hover {
      background-color: var(--bg-surface-hover);
    }
    .mail-row.unread {
      background-color: var(--bg-surface-unread);
    }
    .mail-row.selected {
      background-color: var(--bg-surface-selected);
      border-left: 3px solid var(--brand-primary);
      padding-left: calc(var(--space-2) - 3px);
    }
    .mail-row.checked {
      background-color: var(--bg-surface-selected);
    }
    .row-checkbox {
      display: flex;
      align-items: center;
    }
    .star-toggle {
      color: var(--text-subtle);
      display: flex;
      align-items: center;
      padding: 2px;
      border-radius: var(--radius-xs);
    }
    .star-toggle:hover, .star-toggle.starred {
      color: #eab308;
    }
    .row-avatar {
      flex-shrink: 0;
    }
    .row-sender {
      width: 150px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sender-text {
      font-size: 13px;
      font-weight: 450;
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mail-row.unread .sender-text {
      font-weight: 650;
      color: var(--text-primary);
    }
    .priority-indicator {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      background-color: var(--status-error-bg);
      color: var(--status-error);
      font-weight: 700;
      font-size: 10px;
      border-radius: var(--radius-full);
    }
    .row-content {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      font-size: 13px;
    }
    .row-subject {
      font-weight: 450;
      color: var(--text-secondary);
      flex-shrink: 0;
    }
    .mail-row.unread .row-subject {
      font-weight: 650;
      color: var(--text-primary);
    }
    .row-separator {
      margin: 0 6px;
      color: var(--text-subtle);
    }
    .row-snippet {
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row-meta {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      flex-shrink: 0;
      font-size: 12px;
      color: var(--text-muted);
    }
    .attachment-icon {
      color: var(--text-muted);
      display: flex;
    }
    .row-timestamp {
      min-width: 60px;
      text-align: right;
    }
    .mail-row.unread .row-timestamp {
      color: var(--text-primary);
      font-weight: 600;
    }
    .row-hover-actions {
      display: none;
      position: absolute;
      right: var(--space-2);
      top: 50%;
      transform: translateY(-50%);
      align-items: center;
      gap: 2px;
      background-color: var(--bg-surface-elevated);
      padding: 2px 4px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-subtle);
    }
    .mail-row:hover .row-hover-actions {
      display: flex;
    }
    .quick-btn {
      color: var(--text-muted);
      padding: 5px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
    }
    .quick-btn:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
  `]
})
export class MailListComponent {
  constructor(public mailService: MailService) {}

  onMessageClick(msg: EmailMessage) {
    this.mailService.selectMessage(msg);
  }

  toggleReadStatus(msg: EmailMessage, event: Event) {
    event.stopPropagation();
    if (msg.isUnread) {
      this.mailService.markAsRead(msg.id);
    } else {
      this.mailService.markAsUnread(msg.id, event);
    }
  }

  openSnooze(messageId: string, event: Event) {
    event.stopPropagation();
    this.mailService.activeSnoozeMessageId.set(messageId);
  }

  onSnoozeConfirmed(time: string) {
    const id = this.mailService.activeSnoozeMessageId();
    if (id) {
      this.mailService.snoozeMessage(id, time);
    }
  }

  isAllSelected(): boolean {
    const list = this.mailService.filteredMessages();
    const sel = this.mailService.selectedMessageIds();
    return list.length > 0 && sel.length === list.length;
  }

  isIndeterminate(): boolean {
    const list = this.mailService.filteredMessages();
    const sel = this.mailService.selectedMessageIds();
    return sel.length > 0 && sel.length < list.length;
  }

  getEmptyStateIcon(): 'inbox' | 'search' | 'trash' | 'default' {
    const fId = this.mailService.selectedFolderId();
    if (this.mailService.searchQuery()) return 'search';
    if (fId === 'fld-trash') return 'trash';
    return 'inbox';
  }

  getEmptyStateHeadline(): string {
    if (this.mailService.searchQuery()) return 'No messages matched your search.';
    const fId = this.mailService.selectedFolderId();
    if (fId === 'fld-trash') return 'Your trash is empty.';
    if (fId === 'fld-drafts') return 'Nothing here yet.';
    if (fId === 'fld-starred') return 'No starred conversations.';
    return "You're all caught up.";
  }

  getEmptyStateDescription(): string {
    if (this.mailService.searchQuery()) return 'Try checking for spelling errors or broadening your search terms.';
    const fId = this.mailService.selectedFolderId();
    if (fId === 'fld-trash') return 'Items moved to trash will appear here.';
    if (fId === 'fld-drafts') return 'Saved email drafts will be stored here.';
    return 'There are no active messages in this folder.';
  }
}
