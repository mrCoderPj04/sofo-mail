import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../../core/services/mail.service';
import { EmailMessage } from '../../../core/models/mail.model';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-mail-thread',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent, BadgeComponent],
  template: `
    @if (mailService.selectedMessage(); as msg) {
      <div class="thread-viewer">
        <!-- Thread Header Bar -->
        <div class="thread-header">
          <div class="thread-header-left">
            <button type="button" class="btn-back" (click)="closeThread()" title="Back to list" aria-label="Back to messages list">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h2 class="thread-subject">{{ msg.subject }}</h2>
          </div>

          <div class="thread-header-actions">
            <button type="button" class="action-btn" (click)="mailService.toggleStar(msg.id)" [title]="msg.isStarred ? 'Unstar' : 'Star'">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" [attr.fill]="msg.isStarred ? '#eab308' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
            <button type="button" class="action-btn" (click)="mailService.archiveMessage(msg.id)" title="Archive">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="21 8 21 21 3 21 3 8"></polyline>
                <rect x="1" y="3" width="22" height="5"></rect>
                <line x1="10" y1="12" x2="14" y2="12"></line>
              </svg>
            </button>
            <button type="button" class="action-btn" (click)="mailService.deleteMessage(msg.id)" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button type="button" class="action-btn" (click)="mailService.markAsUnread(msg.id)" title="Mark as unread">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
            </button>
          </div>
        </div>

        <!-- Thread Body Messages -->
        <div class="thread-body">
          @for (threadMsg of mailService.currentThreadMessages(); track threadMsg.id; let idx = $index; let last = $last) {
            <article class="message-card" [class.latest]="last">
              <!-- Message Top Metadata -->
              <div class="message-header">
                <div class="message-sender-info">
                  <app-avatar [name]="threadMsg.senderName" size="md"></app-avatar>
                  <div class="sender-details">
                    <div class="sender-line">
                      <span class="sender-name">{{ threadMsg.senderName }}</span>
                      <span class="sender-email">&lt;{{ threadMsg.senderEmail }}&gt;</span>
                      @if (threadMsg.isVerifiedEmsSender) {
                        <app-badge variant="brand">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>EMS Verified</span>
                        </app-badge>
                      }
                    </div>
                    <div class="recipients-line">
                      <span class="recipients-label">to:</span>
                      <span class="recipients-list">
                        @if (threadMsg.recipients) {
                          @for (r of threadMsg.recipients; track r.email) {
                            <span class="recipient-tag">{{ r.name || r.email }}</span>
                          }
                        } @else {
                          <span class="recipient-tag">Elena Vance</span>
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div class="message-meta-right">
                  <span class="message-time">{{ threadMsg.sentAt || 'Today' }}</span>
                </div>
              </div>

              <!-- Message Rich HTML Content -->
              <div class="message-content" [innerHTML]="threadMsg.bodyHtml"></div>

              <!-- Attachments Tray -->
              @if (threadMsg.attachments && threadMsg.attachments.length > 0) {
                <div class="attachments-section">
                  <div class="attachments-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                    <span>{{ threadMsg.attachments.length }} Attachment</span>
                  </div>
                  <div class="attachment-cards">
                    @for (att of threadMsg.attachments; track att.id) {
                      <div class="attachment-card">
                        <div class="attachment-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        <div class="attachment-info">
                          <span class="att-name" [title]="att.fileName">{{ att.fileName }}</span>
                          <span class="att-size">{{ formatSize(att.fileSizeBytes) }} · Verified Safe</span>
                        </div>
                        <button type="button" class="btn-download" (click)="downloadAttachment(att)" title="Download securely" aria-label="Download attachment">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>
                      </div>
                    }
                  </div>
                </div>
              }
            </article>
          }

          <!-- Inline Quick Reply Box -->
          <div class="inline-reply-box">
            @if (!isReplying()) {
              <div class="reply-placeholder-row">
                <button type="button" class="btn-reply-action" (click)="startReply('reply')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 17 4 12 9 7"></polyline>
                    <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                  </svg>
                  <span>Reply</span>
                </button>
                <button type="button" class="btn-reply-action" (click)="startReply('replyAll')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 17 2 12 7 7"></polyline>
                    <polyline points="12 17 7 12 12 7"></polyline>
                    <path d="M22 18v-2a4 4 0 0 0-4-4H7"></path>
                  </svg>
                  <span>Reply All</span>
                </button>
                <button type="button" class="btn-reply-action" (click)="forwardMessage(msg)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 17 20 12 15 7"></polyline>
                    <path d="M4 18v-2a4 4 0 0 1 4-4h12"></path>
                  </svg>
                  <span>Forward</span>
                </button>
              </div>
            } @else {
              <div class="reply-editor-wrapper">
                <div class="reply-editor-header">
                  <span class="replying-to">Replying to <strong>{{ msg.senderName }}</strong></span>
                  <button type="button" class="btn-cancel-reply" (click)="isReplying.set(false)">Cancel</button>
                </div>
                <textarea
                  [(ngModel)]="replyBody"
                  placeholder="Write your secure enterprise response..."
                  rows="4"
                  class="reply-textarea"
                ></textarea>
                <div class="reply-actions">
                  <button type="button" class="btn-send-reply" (click)="sendInlineReply(msg)">
                    <span>Send</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .thread-viewer {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: var(--bg-surface);
    }
    .thread-header {
      padding: var(--space-2) var(--space-3);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      flex-shrink: 0;
    }
    .thread-header-left {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      overflow: hidden;
    }
    .btn-back {
      padding: 6px;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .btn-back:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .thread-subject {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .thread-header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
    .action-btn {
      padding: 6px 8px;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      display: flex;
      align-items: center;
    }
    .action-btn:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .thread-body {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .message-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--space-3);
      box-shadow: var(--shadow-xs);
    }
    .message-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--space-2);
      gap: var(--space-2);
    }
    .message-sender-info {
      display: flex;
      align-items: flex-start;
      gap: var(--space-1-5);
    }
    .sender-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .sender-line {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      flex-wrap: wrap;
    }
    .sender-name {
      font-weight: 650;
      font-size: 14px;
      color: var(--text-primary);
    }
    .sender-email {
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }
    .recipients-line {
      font-size: 12px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .recipient-tag {
      color: var(--text-secondary);
      background-color: var(--bg-surface-hover);
      padding: 1px 6px;
      border-radius: var(--radius-xs);
    }
    .message-meta-right {
      font-size: 12px;
      color: var(--text-muted);
      white-space: nowrap;
    }
    .message-content {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-primary);
      padding: var(--space-1) 0;
    }
    .message-content p {
      margin-bottom: var(--space-1-5);
    }
    .message-content ul, .message-content ol {
      margin-left: var(--space-3);
      margin-bottom: var(--space-1-5);
    }
    .message-content li {
      margin-bottom: 4px;
    }
    .attachments-section {
      margin-top: var(--space-3);
      padding-top: var(--space-2);
      border-top: 1px solid var(--border-subtle);
    }
    .attachments-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: var(--space-1);
    }
    .attachment-cards {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1-5);
    }
    .attachment-card {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 8px 12px;
      max-width: 320px;
    }
    .attachment-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .att-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .att-size {
      font-size: 11px;
      color: var(--text-muted);
    }
    .btn-download {
      color: var(--text-muted);
      padding: 4px;
      border-radius: var(--radius-xs);
      display: flex;
      align-items: center;
      margin-left: auto;
    }
    .btn-download:hover {
      background-color: var(--bg-surface);
      color: var(--brand-primary);
    }
    .inline-reply-box {
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      background-color: var(--bg-surface);
      padding: var(--space-2);
    }
    .reply-placeholder-row {
      display: flex;
      gap: var(--space-1);
    }
    .btn-reply-action {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }
    .btn-reply-action:hover {
      background-color: var(--bg-surface-selected);
      color: var(--brand-primary);
      border-color: var(--brand-primary);
    }
    .reply-editor-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--space-1-5);
    }
    .reply-editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: var(--text-muted);
    }
    .btn-cancel-reply {
      color: var(--text-muted);
      font-size: 12px;
    }
    .btn-cancel-reply:hover {
      color: var(--text-primary);
      text-decoration: underline;
    }
    .reply-textarea {
      width: 100%;
      background-color: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 10px;
      font-size: 13px;
      color: var(--text-primary);
      resize: vertical;
      outline: none;
    }
    .reply-textarea:focus {
      border-color: var(--border-focus);
    }
    .reply-actions {
      display: flex;
      justify-content: flex-end;
    }
    .btn-send-reply {
      display: flex;
      align-items: center;
      gap: 6px;
      background-color: var(--brand-primary);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
    }
    .btn-send-reply:hover {
      background-color: var(--brand-primary-hover);
    }
  `]
})
export class MailThreadComponent {
  isReplying = signal<boolean>(false);
  replyBody = '';

  constructor(
    public mailService: MailService,
    private notifications: NotificationService
  ) {}

  closeThread() {
    this.mailService.selectMessage(null);
  }

  startReply(type: 'reply' | 'replyAll') {
    this.isReplying.set(true);
    this.replyBody = '';
  }

  forwardMessage(msg: EmailMessage) {
    this.mailService.openCompose({
      subject: 'Fwd: ' + msg.subject,
      bodyHtml: `<br><br>---------- Forwarded message ---------<br>From: ${msg.senderName} &lt;${msg.senderEmail}&gt;<br>Subject: ${msg.subject}<br><br>${msg.bodyHtml}`
    });
  }

  sendInlineReply(msg: EmailMessage) {
    if (!this.replyBody.trim()) {
      this.notifications.warning('Please enter a reply message.');
      return;
    }

    this.mailService.sendMessage({
      threadId: msg.threadId,
      to: [msg.senderEmail],
      subject: 'Re: ' + msg.subject,
      bodyHtml: `<p>${this.replyBody.replace(/\\n/g, '<br>')}</p>`,
      bodyText: this.replyBody
    });

    this.isReplying.set(false);
    this.replyBody = '';
  }

  downloadAttachment(att: any) {
    this.notifications.success(`Downloading ${att.fileName}...`);
  }

  formatSize(bytes: number): string {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  }
}
