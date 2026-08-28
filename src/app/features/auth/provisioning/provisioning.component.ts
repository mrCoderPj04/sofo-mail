import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-provisioning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="provisioning-page">
      <div class="provisioning-card">
        <!-- Success Animation / Header -->
        <div class="header-icon-container">
          <div class="icon-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        <h1 class="card-title">Your Corporate Mailbox is Generated!</h1>
        <p class="card-subtitle">
          Your official PJSOFONIC email address has been automatically created from your EMS employee profile. You can customize the name prefix or keep the official address.
        </p>

        <!-- Generated / Custom Email Display Box -->
        <div class="email-display-card">
          <div class="email-card-header">
            <div class="email-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <span>Official Corporate Email</span>
            </div>
            <button type="button" class="btn-edit-toggle" (click)="toggleEdit()">
              {{ isEditing() ? 'Cancel Edit' : '✏️ Edit Handle' }}
            </button>
          </div>

          @if (!isEditing()) {
            <div class="email-row">
              <div class="email-value-wrap">
                <span class="email-value">{{ fullEmail() }}</span>
                <span class="domain-tag">Active</span>
              </div>
              <button type="button" class="btn-copy" (click)="copyEmail()" [class.copied]="copied()">
                @if (copied()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Copied!</span>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>Copy</span>
                }
              </button>
            </div>
          } @else {
            <div class="custom-edit-box">
              <div class="custom-input-group">
                <input
                  type="text"
                  [(ngModel)]="customHandle"
                  (input)="sanitizeHandle()"
                  placeholder="your.choice.name"
                  class="custom-handle-input"
                  autofocus
                />
                <span class="domain-suffix">&#64;pjsofonic.com</span>
              </div>
              <p class="custom-hint">Choose any preferred alias/name for your corporate mailbox handle.</p>
              <button type="button" class="btn-save-custom" (click)="saveCustomHandle()" [disabled]="!customHandle.trim()">
                ✓ Save Custom Handle
              </button>
            </div>
          }
        </div>

        <!-- How to Login Information -->
        <div class="info-guide-box">
          <div class="guide-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>How to Login in the future:</span>
          </div>
          <p class="guide-text">
            You can now log in directly using this official email <strong>{{ fullEmail() }}</strong> with the <strong>same password</strong> you use for your EMS ID account.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons-group">
          <button type="button" class="btn-primary-proceed" (click)="proceedToInbox()">
            <span>Proceed to Inbox</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button type="button" class="btn-secondary-relogin" (click)="copyAndRelogin()">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Copy & Re-login with Official Email</span>
          </button>
        </div>

        <!-- Zero-Trust Notice -->
        <div class="provision-footer">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>PJSOFONIC Enterprise Security · 5.0 GB Mailbox Provisioned</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .provisioning-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-3);
      background: radial-gradient(circle at 50% 20%, #172a3a 0%, #0f172a 60%, #090d16 100%);
      color: #f1f5f9;
    }
    .provisioning-card {
      width: 100%;
      max-width: 520px;
      background-color: #181c22;
      border: 1px solid #28303d;
      border-radius: var(--radius-xl);
      padding: var(--space-4);
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .header-icon-container {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-2);
    }
    .icon-pulse {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: rgba(14, 165, 233, 0.12);
      border: 2px solid rgba(14, 165, 233, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: gentle-pulse 2s infinite ease-in-out;
    }
    @keyframes gentle-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.3); }
      50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
    }
    .card-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
      letter-spacing: -0.3px;
    }
    .card-subtitle {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: var(--space-3);
    }
    .email-display-card {
      background-color: #121519;
      border: 1px solid #2a3441;
      border-radius: var(--radius-lg);
      padding: 14px 16px;
      margin-bottom: var(--space-3);
      text-align: left;
    }
    .email-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .email-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #0ea5e9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .btn-edit-toggle {
      font-size: 11px;
      color: #38bdf8;
      background: transparent;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }
    .btn-edit-toggle:hover {
      text-decoration: underline;
    }
    .email-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #1b222c;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      border: 1px solid #333f50;
    }
    .email-value-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }
    .email-value {
      font-size: 15px;
      font-weight: 600;
      color: #38bdf8;
      font-family: var(--font-mono);
      word-break: break-all;
    }
    .domain-tag {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
    }
    .custom-edit-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .custom-input-group {
      display: flex;
      align-items: center;
      background: #1b222c;
      border: 1px solid #0ea5e9;
      border-radius: var(--radius-md);
      padding: 6px 12px;
    }
    .custom-handle-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
      font-family: var(--font-mono);
      outline: none;
    }
    .domain-suffix {
      color: #94a3b8;
      font-size: 14px;
      font-weight: 500;
    }
    .custom-hint {
      font-size: 11px;
      color: #94a3b8;
      margin: 0;
    }
    .btn-save-custom {
      background: #0ea5e9;
      color: #ffffff;
      border: none;
      border-radius: var(--radius-sm);
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      align-self: flex-start;
      margin-top: 4px;
    }
    .btn-save-custom:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-copy {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: var(--radius-sm);
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    .btn-copy:hover {
      background: #1d4ed8;
    }
    .btn-copy.copied {
      background: #065f46;
      color: #34d399;
    }
    .info-guide-box {
      background-color: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      margin-bottom: var(--space-3);
      text-align: left;
    }
    .guide-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #38bdf8;
      margin-bottom: 4px;
    }
    .guide-text {
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.5;
      margin: 0;
    }
    .guide-text strong {
      color: #ffffff;
    }
    .action-buttons-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: var(--space-2);
    }
    .btn-primary-proceed {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: #0284c7;
      color: #ffffff;
      padding: 12px 18px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      border: none;
      transition: background-color var(--transition-fast);
    }
    .btn-primary-proceed:hover {
      background-color: #0369a1;
    }
    .btn-secondary-relogin {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
      padding: 10px 16px;
      border-radius: var(--radius-md);
      font-weight: 500;
      font-size: 13px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .btn-secondary-relogin:hover {
      background-color: #334155;
      color: #ffffff;
    }
    .provision-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: #64748b;
      font-size: 11px;
      margin-top: var(--space-2);
    }
  `]
})
export class ProvisioningComponent implements OnInit {
  copied = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  customHandle = '';

  fullEmail = computed(() => {
    const user = this.authService.currentUser();
    if (user?.officialEmail) {
      return user.officialEmail;
    }
    return 'employee@pjsofonic.com';
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationService
  ) {}

  ngOnInit() {
    const current = this.authService.currentUser();
    if (current?.officialEmail) {
      this.customHandle = current.officialEmail.split('@')[0];
    }
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
  }

  sanitizeHandle() {
    this.customHandle = this.customHandle.toLowerCase().replace(/[^a-z0-9._-]/g, '');
  }

  saveCustomHandle() {
    if (!this.customHandle.trim()) return;
    this.authService.customizeEmailHandle(this.customHandle).subscribe({
      next: () => {
        this.isEditing.set(false);
        this.notifications.showSuccess('Official email handle updated successfully!');
      },
      error: () => {
        this.isEditing.set(false);
      }
    });
  }

  copyEmail() {
    navigator.clipboard.writeText(this.fullEmail()).then(() => {
      this.copied.set(true);
      this.notifications.showSuccess('Corporate email copied to clipboard!');
      setTimeout(() => this.copied.set(false), 2500);
    });
  }

  proceedToInbox() {
    this.authService.completeProvisioning();
  }

  copyAndRelogin() {
    const email = this.fullEmail();
    navigator.clipboard.writeText(email).then(() => {
      this.authService.markUserProvisioned(email);
      this.notifications.showInfo('Email copied. Please login using this email and your EMS password.');
      this.authService.logout();
      this.router.navigate(['/auth/login'], { queryParams: { email } });
    });
  }
}
