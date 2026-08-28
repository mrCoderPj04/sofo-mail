import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../../core/services/mail.service';
import { DirectoryService } from '../../../core/services/directory.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmsEmployee } from '../../../core/models/contact.model';

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="compose-window"
      [class.docked]="mailService.composeMode() === 'docked'"
      [class.fullscreen]="mailService.composeMode() === 'fullscreen'"
      [class.minimized]="mailService.composeMode() === 'minimized'"
      role="dialog"
      aria-label="Compose email"
    >
      <!-- Compose Header Bar -->
      <div class="compose-header" (click)="toggleMinimize()">
        <span class="compose-title">New Message — PJSOFONIC Secure Hub</span>
        <div class="compose-controls" (click)="$event.stopPropagation()">
          <button type="button" class="control-btn" (click)="toggleMinimize()" [title]="mailService.composeMode() === 'minimized' ? 'Expand' : 'Minimize'">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button type="button" class="control-btn" (click)="toggleFullscreen()" [title]="mailService.composeMode() === 'fullscreen' ? 'Exit fullscreen' : 'Fullscreen'">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              @if (mailService.composeMode() === 'fullscreen') {
                <polyline points="4 14 10 14 10 20"></polyline>
                <polyline points="20 10 14 10 14 4"></polyline>
                <line x1="14" y1="10" x2="21" y2="3"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              } @else {
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              }
            </svg>
          </button>
          <button type="button" class="control-btn" (click)="close()" title="Close and save draft">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Compose Body -->
      @if (mailService.composeMode() !== 'minimized') {
        <div class="compose-fields">
          <!-- TO Field -->
          <div class="field-row">
            <label class="field-label">To</label>
            <div class="recipient-chips">
              @for (email of toRecipients; track email) {
                <span class="recipient-chip">
                  <span>{{ email }}</span>
                  <button type="button" class="remove-chip" (click)="removeRecipient('to', email)">×</button>
                </span>
              }
              <input
                type="text"
                class="field-input"
                [(ngModel)]="toInput"
                (ngModelChange)="onRecipientSearch($event, 'to')"
                (keydown.enter)="addRecipient('to')"
                (keydown.backspace)="handleBackspace('to')"
                placeholder="{{ toRecipients.length === 0 ? 'Type name or email address...' : '' }}"
              />
            </div>
            <div class="field-toggles">
              @if (!showCc) {
                <button type="button" class="toggle-btn" (click)="showCc = true">Cc</button>
              }
              @if (!showBcc) {
                <button type="button" class="toggle-btn" (click)="showBcc = true">Bcc</button>
              }
            </div>
          </div>

          <!-- Autocomplete Dropdown for EMS Directory -->
          @if (matchingEmployees().length > 0 && activeFieldInput) {
            <div class="autocomplete-dropdown">
              @for (emp of matchingEmployees(); track emp.id) {
                <div class="autocomplete-item" (click)="selectEmployee(emp)">
                  <div class="emp-info">
                    <span class="emp-name">{{ emp.firstName }} {{ emp.lastName }}</span>
                    <span class="emp-role">{{ emp.designation }} · {{ emp.department }}</span>
                  </div>
                  <span class="emp-email">{{ emp.officialEmail }}</span>
                </div>
              }
            </div>
          }

          <!-- CC Field -->
          @if (showCc) {
            <div class="field-row">
              <label class="field-label">Cc</label>
              <div class="recipient-chips">
                @for (email of ccRecipients; track email) {
                  <span class="recipient-chip">
                    <span>{{ email }}</span>
                    <button type="button" class="remove-chip" (click)="removeRecipient('cc', email)">×</button>
                  </span>
                }
                <input
                  type="text"
                  class="field-input"
                  [(ngModel)]="ccInput"
                  (ngModelChange)="onRecipientSearch($event, 'cc')"
                  (keydown.enter)="addRecipient('cc')"
                  placeholder="Cc recipients..."
                />
              </div>
            </div>
          }

          <!-- BCC Field -->
          @if (showBcc) {
            <div class="field-row">
              <label class="field-label">Bcc</label>
              <div class="recipient-chips">
                @for (email of bccRecipients; track email) {
                  <span class="recipient-chip">
                    <span>{{ email }}</span>
                    <button type="button" class="remove-chip" (click)="removeRecipient('bcc', email)">×</button>
                  </span>
                }
                <input
                  type="text"
                  class="field-input"
                  [(ngModel)]="bccInput"
                  (ngModelChange)="onRecipientSearch($event, 'bcc')"
                  (keydown.enter)="addRecipient('bcc')"
                  placeholder="Bcc recipients..."
                />
              </div>
            </div>
          }

          <!-- Subject Field -->
          <div class="field-row">
            <input
              type="text"
              class="field-input subject-input"
              [(ngModel)]="subject"
              (ngModelChange)="triggerAutosave()"
              placeholder="Subject"
            />
          </div>
        </div>

        <!-- Rich Formatting Toolbar -->
        <div class="formatting-toolbar">
          <button type="button" class="fmt-btn" (click)="format('bold')" title="Bold (Ctrl+B)"><b>B</b></button>
          <button type="button" class="fmt-btn" (click)="format('italic')" title="Italic (Ctrl+I)"><i>I</i></button>
          <button type="button" class="fmt-btn" (click)="format('underline')" title="Underline (Ctrl+U)"><u>U</u></button>
          <div class="fmt-divider"></div>
          <button type="button" class="fmt-btn" (click)="format('insertUnorderedList')" title="Bullet List">• List</button>
          <button type="button" class="fmt-btn" (click)="format('insertOrderedList')" title="Numbered List">1. List</button>
          <div class="fmt-divider"></div>
          <button type="button" class="fmt-btn" (click)="insertSignature()" title="Insert corporate signature">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
            </svg>
            <span>Signature</span>
          </button>
        </div>

        <!-- Rich Text Message Editor Area -->
        <div
          class="compose-editor"
          contenteditable="true"
          (input)="onEditorInput($event)"
          (blur)="triggerAutosave()"
          role="textbox"
          aria-multiline="true"
          data-placeholder="Write your email here..."
        ></div>

        <!-- Attachment List Area -->
        @if (attachments().length > 0) {
          <div class="attachments-tray">
            @for (att of attachments(); track att.id) {
              <div class="tray-item" [class.uploading]="att.uploadProgress !== undefined && att.uploadProgress < 100">
                <span class="file-name">{{ att.fileName }}</span>
                @if (att.uploadProgress !== undefined && att.uploadProgress < 100) {
                  <span class="upload-status">Uploading securely… {{ att.uploadProgress }}%</span>
                } @else {
                  <span class="file-size">{{ formatSize(att.fileSizeBytes) }}</span>
                }
                <button type="button" class="remove-att-btn" (click)="removeAttachment(att.id)">×</button>
              </div>
            }
          </div>
        }

        <!-- Bottom Action Bar -->
        <div class="compose-footer">
          <div class="footer-left">
            <button type="button" class="btn-send" (click)="send()" [disabled]="isSending()">
              @if (isSending()) {
                <span class="spinner"></span>
                <span>Sending...</span>
              } @else {
                <span>Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              }
            </button>

            <!-- Attach File Trigger -->
            <label class="btn-attach" title="Attach file from workstation">
              <input type="file" multiple (change)="onFileSelected($event)" style="display: none;" />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </label>
          </div>

          <div class="footer-right">
            <span class="autosave-status">{{ autosaveStatus() }}</span>
            <button type="button" class="btn-discard" (click)="close()" title="Discard draft" aria-label="Discard draft">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .compose-window {
      position: fixed;
      bottom: 0;
      right: var(--space-4);
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      box-shadow: var(--shadow-dropdown);
      display: flex;
      flex-direction: column;
      z-index: 2000;
      overflow: hidden;
      transition: all var(--transition-normal);
    }
    .compose-window.docked {
      width: 580px;
      height: 520px;
    }
    .compose-window.fullscreen {
      top: var(--space-2);
      bottom: var(--space-2);
      left: var(--space-2);
      right: var(--space-2);
      width: auto;
      height: auto;
      border-radius: var(--radius-lg);
    }
    .compose-window.minimized {
      width: 320px;
      height: 44px;
    }
    @media (max-width: 768px) {
      .compose-window.docked {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        border-radius: 0;
      }
    }
    .compose-header {
      height: 44px;
      background-color: var(--brand-dark-navy);
      color: #ffffff;
      padding: 0 var(--space-2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
      cursor: pointer;
      flex-shrink: 0;
    }
    .compose-title {
      font-size: 13px;
      font-weight: 600;
    }
    .compose-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .control-btn {
      color: #94a3b8;
      padding: 4px;
      border-radius: var(--radius-xs);
      display: flex;
      align-items: center;
    }
    .control-btn:hover {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .compose-fields {
      display: flex;
      flex-direction: column;
      position: relative;
      background-color: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
    }
    .field-row {
      display: flex;
      align-items: center;
      padding: 6px var(--space-2);
      border-bottom: 1px solid var(--border-subtle);
      min-height: 38px;
    }
    .field-label {
      width: 40px;
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .recipient-chips {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px;
    }
    .recipient-chip {
      background-color: var(--brand-primary-subtle);
      color: var(--brand-primary);
      border: 1px solid rgba(2, 132, 199, 0.25);
      border-radius: var(--radius-full);
      padding: 2px 8px;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .remove-chip {
      font-size: 14px;
      color: var(--brand-primary);
      padding: 0 2px;
    }
    .field-input {
      flex: 1;
      min-width: 140px;
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      color: var(--text-primary);
    }
    .subject-input {
      padding: 4px 0;
      font-weight: 500;
    }
    .field-toggles {
      display: flex;
      gap: 6px;
    }
    .toggle-btn {
      font-size: 12px;
      color: var(--text-muted);
    }
    .toggle-btn:hover {
      color: var(--text-primary);
      text-decoration: underline;
    }
    .autocomplete-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-dropdown);
      max-height: 180px;
      overflow-y: auto;
      z-index: 100;
    }
    .autocomplete-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px var(--space-2);
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }
    .autocomplete-item:hover {
      background-color: var(--bg-surface-hover);
    }
    .emp-info {
      display: flex;
      flex-direction: column;
    }
    .emp-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .emp-role {
      font-size: 11px;
      color: var(--text-muted);
    }
    .emp-email {
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--brand-primary);
    }
    .formatting-toolbar {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px var(--space-2);
      border-bottom: 1px solid var(--border-subtle);
      background-color: var(--bg-app);
    }
    .fmt-btn {
      padding: 4px 8px;
      border-radius: var(--radius-xs);
      color: var(--text-secondary);
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .fmt-btn:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .fmt-divider {
      width: 1px;
      height: 16px;
      background-color: var(--border-subtle);
      margin: 0 4px;
    }
    .compose-editor {
      flex: 1;
      padding: var(--space-2);
      overflow-y: auto;
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-primary);
      outline: none;
      min-height: 140px;
    }
    .compose-editor[data-placeholder]:empty:before {
      content: attr(data-placeholder);
      color: var(--text-muted);
    }
    .attachments-tray {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 6px var(--space-2);
      border-top: 1px solid var(--border-subtle);
      background-color: var(--bg-app);
    }
    .tray-item {
      display: flex;
      align-items: center;
      gap: 6px;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 4px 8px;
      font-size: 12px;
    }
    .tray-item.uploading {
      border-color: var(--brand-primary);
    }
    .upload-status {
      color: var(--brand-primary);
      font-size: 11px;
    }
    .file-size {
      color: var(--text-muted);
      font-size: 11px;
    }
    .remove-att-btn {
      color: var(--text-muted);
      font-size: 14px;
    }
    .remove-att-btn:hover {
      color: var(--status-error);
    }
    .compose-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-1-5) var(--space-2);
      border-top: 1px solid var(--border-subtle);
      background-color: var(--bg-surface);
      flex-shrink: 0;
    }
    .footer-left {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }
    .btn-send {
      display: flex;
      align-items: center;
      gap: 6px;
      background-color: var(--brand-primary);
      color: #ffffff;
      padding: 8px 18px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 13px;
    }
    .btn-send:hover:not(:disabled) {
      background-color: var(--brand-primary-hover);
    }
    .btn-send:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-attach {
      color: var(--text-muted);
      padding: 6px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .btn-attach:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }
    .autosave-status {
      font-size: 11px;
      color: var(--text-muted);
    }
    .btn-discard {
      color: var(--text-muted);
      padding: 6px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
    }
    .btn-discard:hover {
      color: var(--status-error);
      background-color: var(--status-error-bg);
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ComposeComponent implements OnInit {
  toRecipients: string[] = [];
  ccRecipients: string[] = [];
  bccRecipients: string[] = [];
  toInput = '';
  ccInput = '';
  bccInput = '';
  showCc = false;
  showBcc = false;
  subject = '';
  editorHtml = '';
  isSending = signal<boolean>(false);
  autosaveStatus = signal<string>('Saved just now');
  attachments = signal<any[]>([]);

  activeFieldInput = '';
  activeFieldType: 'to' | 'cc' | 'bcc' = 'to';

  readonly matchingEmployees = computed(() => {
    if (!this.activeFieldInput || this.activeFieldInput.trim().length < 1) return [];
    return this.directoryService.search(this.activeFieldInput).slice(0, 5);
  });

  constructor(
    public mailService: MailService,
    private directoryService: DirectoryService,
    private authService: AuthService,
    private notifications: NotificationService
  ) {}

  ngOnInit() {
    const draft = this.mailService.composeDraft();
    if (draft) {
      this.toRecipients = [...(draft.to || [])];
      this.ccRecipients = [...(draft.cc || [])];
      this.bccRecipients = [...(draft.bcc || [])];
      this.subject = draft.subject || '';
      this.editorHtml = draft.bodyHtml || '';
      if (this.ccRecipients.length > 0) this.showCc = true;
      if (this.bccRecipients.length > 0) this.showBcc = true;
    }
  }

  toggleMinimize() {
    const current = this.mailService.composeMode();
    this.mailService.composeMode.set(current === 'minimized' ? 'docked' : 'minimized');
  }

  toggleFullscreen() {
    const current = this.mailService.composeMode();
    this.mailService.composeMode.set(current === 'fullscreen' ? 'docked' : 'fullscreen');
  }

  close() {
    this.mailService.closeCompose();
  }

  onRecipientSearch(val: string, field: 'to' | 'cc' | 'bcc') {
    this.activeFieldInput = val;
    this.activeFieldType = field;
  }

  selectEmployee(emp: EmsEmployee) {
    if (this.activeFieldType === 'to') {
      if (!this.toRecipients.includes(emp.officialEmail)) this.toRecipients.push(emp.officialEmail);
      this.toInput = '';
    } else if (this.activeFieldType === 'cc') {
      if (!this.ccRecipients.includes(emp.officialEmail)) this.ccRecipients.push(emp.officialEmail);
      this.ccInput = '';
    } else if (this.activeFieldType === 'bcc') {
      if (!this.bccRecipients.includes(emp.officialEmail)) this.bccRecipients.push(emp.officialEmail);
      this.bccInput = '';
    }
    this.activeFieldInput = '';
    this.triggerAutosave();
  }

  addRecipient(field: 'to' | 'cc' | 'bcc') {
    let email = '';
    if (field === 'to') { email = this.toInput.trim(); this.toInput = ''; }
    if (field === 'cc') { email = this.ccInput.trim(); this.ccInput = ''; }
    if (field === 'bcc') { email = this.bccInput.trim(); this.bccInput = ''; }

    if (email && email.includes('@')) {
      if (field === 'to' && !this.toRecipients.includes(email)) this.toRecipients.push(email);
      if (field === 'cc' && !this.ccRecipients.includes(email)) this.ccRecipients.push(email);
      if (field === 'bcc' && !this.bccRecipients.includes(email)) this.bccRecipients.push(email);
      this.triggerAutosave();
    }
  }

  removeRecipient(field: 'to' | 'cc' | 'bcc', email: string) {
    if (field === 'to') this.toRecipients = this.toRecipients.filter(e => e !== email);
    if (field === 'cc') this.ccRecipients = this.ccRecipients.filter(e => e !== email);
    if (field === 'bcc') this.bccRecipients = this.bccRecipients.filter(e => e !== email);
    this.triggerAutosave();
  }

  handleBackspace(field: 'to' | 'cc' | 'bcc') {
    if (field === 'to' && !this.toInput && this.toRecipients.length > 0) {
      this.toRecipients.pop();
    }
  }

  onEditorInput(event: any) {
    this.editorHtml = event.target.innerHTML;
    this.triggerAutosave();
  }

  format(cmd: string) {
    document.execCommand(cmd, false);
  }

  insertSignature() {
    const user = this.authService.currentUser();
    const sig = `<br><br>--<br><strong>${user?.firstName || 'Elena'} ${user?.lastName || 'Vance'}</strong><br><span style="color: #64748b; font-size: 12px;">${user?.designation || 'Lead Security Architect'} | PJSOFONIC</span><br><span style="color: #94a3b8; font-size: 11px;">Confidentiality Notice: This email is intended solely for official PJSOFONIC communication.</span>`;
    const editor = document.querySelector('.compose-editor');
    if (editor) {
      editor.innerHTML += sig;
      this.editorHtml = editor.innerHTML;
      this.triggerAutosave();
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const attId = 'att-' + Math.random().toString(36).substring(2, 9);
      const newAtt = {
        id: attId,
        fileName: file.name,
        contentType: file.type,
        fileSizeBytes: file.size,
        uploadProgress: 10
      };

      this.attachments.update(list => [...list, newAtt]);

      // Progress animation
      setTimeout(() => {
        this.attachments.update(list => list.map(a => a.id === attId ? { ...a, uploadProgress: 60 } : a));
      }, 300);

      setTimeout(() => {
        this.attachments.update(list => list.map(a => a.id === attId ? { ...a, uploadProgress: 100 } : a));
        this.notifications.info(`Uploaded securely: ${file.name}`);
      }, 700);
    }
  }

  removeAttachment(id: string) {
    this.attachments.update(list => list.filter(a => a.id !== id));
  }

  triggerAutosave() {
    this.autosaveStatus.set('Saving draft…');
    setTimeout(() => {
      this.mailService.saveDraft({
        to: this.toRecipients,
        cc: this.ccRecipients,
        bcc: this.bccRecipients,
        subject: this.subject,
        bodyHtml: this.editorHtml,
        bodyText: this.editorHtml.replace(/<[^>]*>/g, '')
      });
      this.autosaveStatus.set('Saved just now');
    }, 600);
  }

  send() {
    if (this.toRecipients.length === 0 && !this.toInput) {
      this.notifications.warning('Please enter a recipient email.');
      return;
    }

    if (this.toInput && this.toInput.includes('@')) {
      this.toRecipients.push(this.toInput.trim());
      this.toInput = '';
    }

    this.isSending.set(true);

    setTimeout(() => {
      const success = this.mailService.sendMessage({
        to: this.toRecipients,
        cc: this.ccRecipients,
        bcc: this.bccRecipients,
        subject: this.subject,
        bodyHtml: this.editorHtml,
        bodyText: this.editorHtml.replace(/<[^>]*>/g, ''),
        attachmentIds: this.attachments().map(a => a.id)
      });
      this.isSending.set(false);
    }, 500);
  }

  formatSize(bytes: number): string {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  }
}
