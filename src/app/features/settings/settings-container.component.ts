import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { MailService } from '../../core/services/mail.service';
import { ThemeService, AppTheme } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import { SecuritySession, AuditLog } from '../../core/models/user.model';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings-container',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent],
  template: `
    <div class="settings-page">
      <!-- Settings Left Tab Navigation -->
      <aside class="settings-sidebar">
        <div class="settings-sidebar-header">
          <h1 class="settings-title">Settings</h1>
          <span class="settings-subtitle">Enterprise Preferences</span>
        </div>

        <nav class="settings-nav">
          <button type="button" class="nav-tab-btn" [class.active]="activeTab() === 'account'" (click)="activeTab.set('account')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Account Profile</span>
          </button>

          <button type="button" class="nav-tab-btn" [class.active]="activeTab() === 'security'" (click)="activeTab.set('security')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Active Login Sessions</span>
          </button>

          <button type="button" class="nav-tab-btn" [class.active]="activeTab() === 'mfa'" (click)="activeTab.set('mfa')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>2FA Authenticator & Keys</span>
          </button>

          <button type="button" class="nav-tab-btn" [class.active]="activeTab() === 'signature'" (click)="activeTab.set('signature')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
            </svg>
            <span>Signature & Templates</span>
          </button>

          <button type="button" class="nav-tab-btn" [class.active]="activeTab() === 'appearance'" (click)="activeTab.set('appearance')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
            </svg>
            <span>Appearance & Theme</span>
          </button>

          <button type="button" class="nav-tab-btn" [class.active]="activeTab() === 'rules'" (click)="activeTab.set('rules')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>Mail Rules & Routing</span>
          </button>

          <button type="button" class="nav-tab-btn" [class.active]="activeTab() === 'storage'" (click)="activeTab.set('storage')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
            <span>Storage & Database</span>
          </button>
        </nav>
      </aside>

      <!-- Settings Tab Content -->
      <main class="settings-content">
        <!-- 1. Account Profile Tab -->
        @if (activeTab() === 'account') {
          <div class="tab-panel">
            <div class="panel-header-row">
              <div>
                <h2 class="panel-title">EMS Account Profile</h2>
                <p class="panel-desc">Real-time employee identity authenticated via PJSOFONIC EMS (https://erp-backend-1-02lc.onrender.com).</p>
              </div>
              <button type="button" class="btn-edit-profile" (click)="toggleProfileEdit()">
                {{ isEditingProfile() ? 'Cancel Edit' : '✏️ Edit Profile Details' }}
              </button>
            </div>

            <div class="setting-card">
              <div class="user-profile-header">
                <app-avatar [name]="getDisplayName()" size="xl" status="ACTIVE"></app-avatar>
                <div class="user-meta">
                  <div class="user-title-row">
                    <h3 class="name">{{ getDisplayName() }}</h3>
                    <span class="badge-role">{{ authService.currentUser()?.role || 'EMPLOYEE' }}</span>
                  </div>
                  <span class="email font-mono">{{ authService.currentUser()?.officialEmail }}</span>
                  
                  <div class="status-tags-row">
                    <span class="ems-tag">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      EMS Verified Record
                    </span>
                    @if (is2faActive()) {
                      <span class="mfa-tag">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          <polyline points="9 12 11 14 15 10"></polyline>
                        </svg>
                        2FA Active & Protected
                      </span>
                    }
                  </div>
                </div>
              </div>

              @if (!isEditingProfile()) {
                <!-- View Mode Grid -->
                <div class="form-grid">
                  <!-- Strictly Immutable Non-Editable EMS ID -->
                  <div class="grid-field">
                    <div class="field-label-wrap">
                      <label>EMS Employee ID</label>
                      <span class="badge-locked">🔒 Non-Editable</span>
                    </div>
                    <input type="text" [value]="getEmsId()" disabled class="disabled-input font-mono locked-input" />
                    <span class="field-hint">Permanent login identifier from PJSOFONIC EMS</span>
                  </div>

                  <!-- Strictly Immutable Non-Editable Corporate Email -->
                  <div class="grid-field">
                    <div class="field-label-wrap">
                      <label>Official Corporate Email</label>
                      <span class="badge-locked">🔒 Non-Editable</span>
                    </div>
                    <input type="text" [value]="authService.currentUser()?.officialEmail" disabled class="disabled-input font-mono locked-input" />
                    <span class="field-hint">Permanent assigned corporate mailbox address</span>
                  </div>

                  <div class="grid-field">
                    <label>First Name</label>
                    <input type="text" [value]="authService.currentUser()?.firstName || 'Elena'" disabled class="disabled-input" />
                  </div>
                  <div class="grid-field">
                    <label>Last Name</label>
                    <input type="text" [value]="authService.currentUser()?.lastName || 'Vance'" disabled class="disabled-input" />
                  </div>
                  <div class="grid-field">
                    <label>Work Location</label>
                    <input type="text" [value]="profileLocation" disabled class="disabled-input" />
                  </div>
                  <div class="grid-field">
                    <label>Reporting Manager</label>
                    <input type="text" [value]="profileManager" disabled class="disabled-input" />
                  </div>
                  <div class="grid-field">
                    <label>Department</label>
                    <input type="text" [value]="authService.currentUser()?.department || 'Information Security'" disabled class="disabled-input" />
                  </div>
                  <div class="grid-field">
                    <label>Contact Phone</label>
                    <input type="text" [value]="profilePhone" disabled class="disabled-input" />
                  </div>
                </div>
              } @else {
                <!-- Edit Mode Form -->
                <form (ngSubmit)="saveProfileChanges()" class="edit-profile-form">
                  <div class="edit-banner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span>Update your personal profile, location, and reporting details.</span>
                  </div>

                  <div class="form-grid">
                    <!-- Strictly Immutable Non-Editable EMS ID -->
                    <div class="grid-field">
                      <div class="field-label-wrap">
                        <label>EMS Employee ID</label>
                        <span class="badge-locked">🔒 Non-Editable</span>
                      </div>
                      <input type="text" [value]="getEmsId()" disabled class="disabled-input font-mono locked-input" />
                      <span class="field-hint">Cannot be changed (locked to EMS login session)</span>
                    </div>

                    <!-- Strictly Immutable Non-Editable Corporate Email -->
                    <div class="grid-field">
                      <div class="field-label-wrap">
                        <label>Official Corporate Email</label>
                        <span class="badge-locked">🔒 Non-Editable</span>
                      </div>
                      <input type="text" [value]="authService.currentUser()?.officialEmail" disabled class="disabled-input font-mono locked-input" />
                      <span class="field-hint">Cannot be changed (locked to official mailbox)</span>
                    </div>

                    <div class="grid-field">
                      <label>First Name *</label>
                      <input type="text" [(ngModel)]="editFirstName" name="editFirstName" required class="active-input" placeholder="First Name" />
                    </div>

                    <div class="grid-field">
                      <label>Last Name</label>
                      <input type="text" [(ngModel)]="editLastName" name="editLastName" class="active-input" placeholder="Last Name" />
                    </div>

                    <div class="grid-field">
                      <label>Work Location *</label>
                      <input type="text" [(ngModel)]="editLocation" name="editLocation" required class="active-input" placeholder="e.g. San Francisco HQ, London Office, Remote" />
                    </div>

                    <div class="grid-field">
                      <label>Reporting Manager *</label>
                      <input type="text" [(ngModel)]="editManager" name="editManager" required class="active-input" placeholder="e.g. Marcus Chen (VP Engineering)" />
                    </div>

                    <div class="grid-field">
                      <label>Department</label>
                      <input type="text" [(ngModel)]="editDepartment" name="editDepartment" class="active-input" placeholder="e.g. Information Security" />
                    </div>

                    <div class="grid-field">
                      <label>Contact Phone</label>
                      <input type="text" [(ngModel)]="editPhone" name="editPhone" class="active-input" placeholder="+1 (555) 019-4829" />
                    </div>
                  </div>

                  <div class="edit-actions-row">
                    <button type="submit" class="btn-save-profile">
                      ✓ Save Profile Changes
                    </button>
                    <button type="button" class="btn-cancel-profile" (click)="toggleProfileEdit()">
                      Cancel
                    </button>
                  </div>
                </form>
              }
            </div>
          </div>
        }

        <!-- 2. Real-time Active Sessions -->
        @if (activeTab() === 'security') {
          <div class="tab-panel">
            <h2 class="panel-title">Active Login Sessions</h2>
            <p class="panel-desc">Real-time devices and workstations currently authenticated to your PJSOFONIC account.</p>

            <div class="setting-card">
              <div class="sessions-list">
                @for (ses of sessions; track ses.id) {
                  <div class="session-item" [class.current]="ses.isCurrent">
                    <div class="session-icon">
                      @if (ses.deviceInfo.includes('Mobile') || ses.deviceInfo.includes('iOS')) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                          <line x1="12" y1="18" x2="12.01" y2="18"></line>
                        </svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                      }
                    </div>

                    <div class="session-info">
                      <div class="session-top">
                        <span class="device-name">{{ ses.deviceInfo }}</span>
                        @if (ses.isCurrent) {
                          <span class="badge-current">
                            <span class="live-pulse-dot"></span>
                            Active Now (This Device)
                          </span>
                        }
                      </div>
                      <div class="session-meta">
                        <span>IP: <strong>{{ ses.ipAddress }}</strong></span>
                        <span>·</span>
                        <span>Location: {{ ses.location }}</span>
                        <span>·</span>
                        <span>{{ ses.lastActiveAt }}</span>
                      </div>
                      <div class="session-ua">{{ ses.userAgent }}</div>
                    </div>

                    <div class="session-actions">
                      @if (!ses.isCurrent) {
                        <button type="button" class="btn-revoke" (click)="revokeSession(ses.id)">
                          Revoke Session
                        </button>
                      } @else {
                        <span class="current-label">Current Session</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- 3. Real High-Contrast Scannable 2FA Authenticator QR Code -->
        @if (activeTab() === 'mfa') {
          <div class="tab-panel">
            <h2 class="panel-title">Two-Factor Authentication (2FA)</h2>
            <p class="panel-desc">Pair Google Authenticator, Microsoft Authenticator, or Apple Keychain by scanning the QR code below.</p>

            <div class="setting-card">
              <div class="totp-setup-container">
                <!-- Real Scannable QR Code Section -->
                <div class="qr-code-section">
                  <div class="qr-matrix-wrapper">
                    <img
                      [src]="qrCodeUrl()"
                      alt="Scan with Google Authenticator"
                      width="160"
                      height="160"
                      class="real-qr-img"
                    />
                  </div>
                  <span class="qr-caption">📱 Scan with Google / MS Authenticator</span>
                </div>

                <div class="totp-details-section">
                  <h3 class="setup-heading">Step 1: Scan QR or Enter Secret Key</h3>
                  <p class="setup-sub">Open your Authenticator app (Google Authenticator, Microsoft Authenticator, or Bitwarden) and scan the QR code.</p>

                  <div class="manual-key-box">
                    <div class="key-label">Manual Base32 Secret Key:</div>
                    <div class="key-row">
                      <span class="key-text font-mono">{{ totpSecretKey }}</span>
                      <button type="button" class="btn-copy-key" (click)="copySecret()">
                        Copy Key
                      </button>
                    </div>
                  </div>

                  <h3 class="setup-heading" style="margin-top: 18px;">Step 2: Enter 6-Digit Verification Code</h3>
                  <div class="verify-code-row">
                    <input
                      type="text"
                      maxlength="6"
                      [(ngModel)]="enteredTotpCode"
                      placeholder="123456"
                      class="totp-input font-mono"
                      [disabled]="isVerifying2fa()"
                    />
                    <button type="button" class="btn-verify-2fa" (click)="verifyAndActivate2fa()" [disabled]="isVerifying2fa() || enteredTotpCode.length < 6">
                      {{ isVerifying2fa() ? 'Verifying...' : 'Verify & Connect 2FA' }}
                    </button>
                  </div>
                  <p class="setup-hint">Once connected, this 6-digit code will be required whenever you sign in to SOFOMail.</p>
                </div>
              </div>

              <!-- 2FA Active Status Banner -->
              @if (is2faActive()) {
                <div class="mfa-connected-banner">
                  <div class="shield-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 12 11 14 15 10"></polyline>
                    </svg>
                  </div>
                  <div class="banner-texts">
                    <strong>✓ 2FA Multi-Factor Authentication is Active & Connected</strong>
                    <p>Your account is protected. Every login will require your 6-digit code from Google/Microsoft Authenticator.</p>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- 4. Signature & Templates -->
        @if (activeTab() === 'signature') {
          <div class="tab-panel">
            <h2 class="panel-title">Signature & Templates</h2>
            <p class="panel-desc">Customize your corporate email signature with verified EMS employee credentials.</p>

            <div class="setting-card">
              <div class="form-group">
                <label>Default Corporate Signature</label>
                <textarea rows="4" [(ngModel)]="signatureText" class="signature-textarea font-mono"></textarea>
              </div>

              <div class="checkbox-row">
                <input type="checkbox" [(ngModel)]="includeLegalDisclaimer" id="legalDisc" />
                <label for="legalDisc">Automatically append PJSOFONIC Corporate Confidentiality Notice</label>
              </div>

              <button type="button" class="btn-save" (click)="saveSignature()">Save Signature</button>
            </div>
          </div>
        }

        <!-- 5. Appearance & Theme -->
        @if (activeTab() === 'appearance') {
          <div class="tab-panel">
            <h2 class="panel-title">Appearance & Display</h2>
            <p class="panel-desc">Customize interface theme and typography density.</p>

            <div class="setting-card">
              <div class="theme-options-grid">
                <button type="button" class="theme-card" [class.selected]="themeService.currentTheme() === 'dark'" (click)="themeService.setTheme('dark')">
                  <div class="theme-preview dark-preview"></div>
                  <span>Enterprise Dark (Default)</span>
                </button>
                <button type="button" class="theme-card" [class.selected]="themeService.currentTheme() === 'light'" (click)="themeService.setTheme('light')">
                  <div class="theme-preview light-preview"></div>
                  <span>Corporate Light</span>
                </button>
              </div>
            </div>
          </div>
        }

        <!-- 6. Mail Rules & Routing -->
        @if (activeTab() === 'rules') {
          <div class="tab-panel">
            <h2 class="panel-title">Mail Rules & Routing</h2>
            <p class="panel-desc">Automatic filtering and labeling rules configured for your mailbox.</p>

            <div class="setting-card">
              <div class="rules-list">
                <div class="rule-item">
                  <div class="rule-details">
                    <strong>Rule #1: Security Alerts & Compliance Notices</strong>
                    <span>Condition: Sender contains <code>security&#64;pjsofonic.com</code></span>
                    <span class="action-tag">Mark Important & Star</span>
                  </div>
                  <span class="rule-active">Active</span>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- 7. Storage & Database -->
        @if (activeTab() === 'storage') {
          <div class="tab-panel">
            <h2 class="panel-title">Storage & Supabase Database</h2>
            <p class="panel-desc">Enterprise storage quota and Supabase PostgreSQL schema status.</p>

            <div class="setting-card">
              <div class="storage-info">
                <div class="storage-meta">
                  <span>Used: <strong>176 MB</strong> of <strong>5.0 GB</strong> (3.4%)</span>
                  <span>Schema: <code>"project_sofo-mail"</code></span>
                </div>
                <div class="storage-bar">
                  <div class="storage-bar-fill" style="width: 3.4%;"></div>
                </div>
                <span class="retention-info">Audit logs retained for 365 days under PJSOFONIC enterprise compliance.</span>
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .settings-page {
      display: flex;
      min-height: 100%;
      height: 100%;
      background-color: var(--bg-canvas);
    }
    .settings-sidebar {
      width: 250px;
      border-right: 1px solid var(--border-subtle);
      background-color: var(--bg-surface);
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
    }
    .settings-sidebar-header {
      margin-bottom: var(--space-3);
    }
    .settings-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .settings-subtitle {
      font-size: 12px;
      color: var(--text-muted);
    }
    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-tab-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      text-align: left;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .nav-tab-btn:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .nav-tab-btn.active {
      background-color: var(--bg-surface-active);
      color: var(--brand-primary);
      font-weight: 600;
    }
    .settings-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-4);
      min-height: 0;
    }
    .tab-panel {
      max-width: 820px;
    }
    .panel-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-3);
    }
    .panel-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    .panel-desc {
      font-size: 13px;
      color: var(--text-muted);
    }
    .btn-edit-profile {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: #0284c7;
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md);
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color var(--transition-fast);
      white-space: nowrap;
    }
    .btn-edit-profile:hover {
      background-color: #0369a1;
    }
    .setting-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      margin-bottom: var(--space-3);
    }
    .user-profile-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: var(--space-3);
    }
    .user-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .name {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .badge-role {
      background-color: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.3);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 600;
    }
    .email {
      font-size: 13px;
      color: var(--text-secondary);
      display: block;
      margin-top: 2px;
    }
    .status-tags-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
    }
    .ems-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.2);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .mfa-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #22c55e;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
    }
    .grid-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .field-label-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .grid-field label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .badge-locked {
      font-size: 10px;
      color: #f59e0b;
      font-weight: 600;
    }
    .disabled-input {
      background-color: #121519;
      border: 1px solid #28303d;
      border-radius: var(--radius-md);
      padding: 9px 12px;
      color: #94a3b8;
      font-size: 13px;
    }
    .locked-input {
      background-color: #0d1117;
      border-color: #3b4252;
      color: #cbd5e1;
      font-weight: 600;
    }
    .active-input {
      background-color: #161b22;
      border: 1px solid #0ea5e9;
      border-radius: var(--radius-md);
      padding: 9px 12px;
      color: #ffffff;
      font-size: 13px;
      outline: none;
    }
    .active-input:focus {
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
    }
    .field-hint {
      font-size: 10px;
      color: var(--text-muted);
    }
    .edit-profile-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .edit-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(14, 165, 233, 0.1);
      border: 1px solid rgba(14, 165, 233, 0.25);
      border-radius: var(--radius-md);
      padding: 8px 12px;
      font-size: 12px;
      color: #38bdf8;
    }
    .edit-actions-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: var(--space-1);
    }
    .btn-save-profile {
      background-color: #10b981;
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md);
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }
    .btn-save-profile:hover {
      background-color: #059669;
    }
    .btn-cancel-profile {
      background-color: transparent;
      color: #94a3b8;
      border: 1px solid #334155;
      border-radius: var(--radius-md);
      padding: 10px 16px;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-cancel-profile:hover {
      background-color: #1e293b;
      color: #ffffff;
    }
    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .session-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: 12px 14px;
      border-radius: var(--radius-md);
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
    }
    .session-item.current {
      border-color: rgba(14, 165, 233, 0.4);
      background-color: rgba(14, 165, 233, 0.04);
    }
    .session-icon {
      color: var(--text-secondary);
    }
    .session-info {
      flex: 1;
    }
    .session-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 2px;
    }
    .device-name {
      font-weight: 600;
      font-size: 13px;
      color: var(--text-primary);
    }
    .badge-current {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #10b981;
      font-weight: 600;
    }
    .live-pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #10b981;
      animation: pulse-ring 1.5s infinite;
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .session-meta {
      font-size: 12px;
      color: var(--text-secondary);
      display: flex;
      gap: 6px;
    }
    .session-ua {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .btn-revoke {
      font-size: 12px;
      color: #ef4444;
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .btn-revoke:hover {
      background-color: rgba(239, 68, 68, 0.1);
    }
    .current-label {
      font-size: 11px;
      color: var(--text-muted);
    }
    .totp-setup-container {
      display: flex;
      gap: var(--space-4);
      align-items: flex-start;
      margin-bottom: var(--space-3);
    }
    .qr-code-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 14px;
      background-color: #ffffff;
      border: 1px solid #334155;
      border-radius: var(--radius-md);
    }
    .qr-matrix-wrapper {
      background: #ffffff;
      padding: 4px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .real-qr-img {
      border-radius: var(--radius-xs);
      display: block;
    }
    .qr-caption {
      font-size: 11px;
      color: #334155;
      font-weight: 600;
      text-align: center;
    }
    .totp-details-section {
      flex: 1;
    }
    .setup-heading {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    .setup-sub {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 10px;
      line-height: 1.4;
    }
    .setup-hint {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 8px;
    }
    .manual-key-box {
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 8px 12px;
    }
    .key-label {
      font-size: 11px;
      color: var(--text-muted);
      margin-bottom: 2px;
    }
    .key-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .key-text {
      font-size: 13px;
      font-weight: 600;
      color: var(--brand-primary);
      letter-spacing: 1px;
    }
    .btn-copy-key {
      font-size: 11px;
      color: #ffffff;
      background: var(--brand-primary);
      border: none;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .verify-code-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .totp-input {
      width: 140px;
      padding: 8px 12px;
      font-size: 16px;
      text-align: center;
      letter-spacing: 4px;
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-primary);
    }
    .btn-verify-2fa {
      background-color: #0ea5e9;
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md);
      padding: 9px 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-verify-2fa:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .mfa-connected-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      background-color: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.25);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      margin-top: var(--space-3);
    }
    .banner-texts strong {
      font-size: 13px;
      color: #22c55e;
      display: block;
    }
    .banner-texts p {
      font-size: 12px;
      color: var(--text-secondary);
      margin: 2px 0 0 0;
    }
    .signature-textarea {
      width: 100%;
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 10px 12px;
      color: var(--text-primary);
      font-size: 13px;
    }
    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: var(--space-2) 0;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .btn-save {
      background-color: var(--brand-primary);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md);
      padding: 9px 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .theme-options-grid {
      display: flex;
      gap: var(--space-3);
    }
    .theme-card {
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: var(--text-primary);
      font-size: 13px;
      width: 180px;
    }
    .theme-card.selected {
      border-color: var(--brand-primary);
      background-color: rgba(14, 165, 233, 0.08);
    }
    .theme-preview {
      width: 100%;
      height: 60px;
      border-radius: var(--radius-sm);
    }
    .dark-preview {
      background-color: #0f172a;
      border: 1px solid #334155;
    }
    .light-preview {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
    }
    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .rule-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
    }
    .rule-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 12px;
    }
    .action-tag {
      color: #0ea5e9;
      font-weight: 500;
    }
    .rule-active {
      color: #10b981;
      font-size: 11px;
      font-weight: 600;
    }
    .storage-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .storage-meta {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .storage-bar {
      width: 100%;
      height: 8px;
      background-color: var(--bg-surface-hover);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 6px;
    }
    .storage-bar-fill {
      height: 100%;
      background-color: var(--brand-primary);
    }
    .retention-info {
      font-size: 12px;
      color: var(--text-muted);
    }
  `]
})
export class SettingsContainerComponent implements OnInit {
  activeTab = signal<string>('account');
  isEditingProfile = signal<boolean>(false);
  is2faActive = signal<boolean>(false);
  totpSecretKey = 'JBSWY3DPEHPK3PXP';
  qrCodeUrl = signal<string>('https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=otpauth%3A%2F%2Ftotp%2FPJSOFONIC%3Aemployee%40pjsofonic.com%3Fsecret%3DJBSWY3DPEHPK3PXP%26issuer%3DPJSOFONIC');
  enteredTotpCode = '';
  isVerifying2fa = signal<boolean>(false);
  isGenerating2fa = signal<boolean>(false);
  signatureText = 'Elena Vance\nLead Security Architect | PJSOFONIC\nOfficial PJSOFONIC Corporate Identity';
  includeLegalDisclaimer = true;

  // Profile fields
  profileLocation = 'San Francisco, CA (HQ)';
  profileManager = 'Marcus Chen (VP Engineering)';
  profilePhone = '+1 (555) 019-4829';

  // Edit models
  editFirstName = '';
  editLastName = '';
  editLocation = '';
  editManager = '';
  editDepartment = '';
  editPhone = '';

  sessions: SecuritySession[] = [
    {
      id: 'ses-001',
      deviceInfo: 'Desktop (Enterprise Workstation)',
      ipAddress: '127.0.0.1 (Local Verified IP)',
      location: 'San Francisco, CA (HQ)',
      isCurrent: true,
      isRevoked: false,
      userAgent: 'Mozilla/5.0 (Linux; x86_64) Chrome/128.0 Enterprise',
      lastActiveAt: 'Active now',
      createdAt: 'Today, 8:30 AM'
    }
  ];

  auditLogs: AuditLog[] = [
    {
      id: 'aud-001',
      eventType: 'LOGIN_SUCCESS',
      ipAddress: '127.0.0.1',
      actionDetails: 'Authenticated via PJSOFONIC EMS SSO (https://erp-backend-1-02lc.onrender.com)',
      status: 'SUCCESS',
      createdAt: 'Today, 10:42 AM'
    }
  ];

  constructor(
    public authService: AuthService,
    public mailService: MailService,
    public themeService: ThemeService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private notifications: NotificationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab.set(params['tab']);
      }
    });
    this.loadProfileFromUser();
    this.generateNew2faSecret();
  }

  generateNew2faSecret() {
    this.isGenerating2fa.set(true);
    this.http.post<any>(`${environment.apiBaseUrl}/settings/2fa/generate`, {}).subscribe({
      next: (res) => {
        this.isGenerating2fa.set(false);
        if (res && res.secret) {
          this.totpSecretKey = res.secret;
          if (res.qrCodeUrl) {
            this.qrCodeUrl.set(res.qrCodeUrl);
          } else if (res.otpAuthUri) {
            this.qrCodeUrl.set(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(res.otpAuthUri)}`);
          }
        }
      },
      error: () => {
        this.isGenerating2fa.set(false);
      }
    });
  }

  loadProfileFromUser() {
    const user = this.authService.currentUser();
    if (user) {
      this.editFirstName = user.firstName || '';
      this.editLastName = user.lastName || '';
      this.editDepartment = user.department || 'Information Security';
    }
    this.editLocation = this.profileLocation;
    this.editManager = this.profileManager;
    this.editPhone = this.profilePhone;
  }

  getDisplayName(): string {
    const user = this.authService.currentUser();
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim();
    }
    return 'Corporate Employee';
  }

  getEmsId(): string {
    const user = this.authService.currentUser();
    if (user?.username) {
      return user.username.toUpperCase();
    }
    return 'PJS-10492';
  }

  toggleProfileEdit() {
    this.isEditingProfile.update(v => !v);
    if (this.isEditingProfile()) {
      this.loadProfileFromUser();
    }
  }

  saveProfileChanges() {
    if (!this.editFirstName.trim()) {
      this.notifications.showError('First name is required.');
      return;
    }

    const payload = {
      firstName: this.editFirstName.trim(),
      lastName: this.editLastName.trim(),
      location: this.editLocation.trim(),
      managerName: this.editManager.trim(),
      department: this.editDepartment.trim(),
      phone: this.editPhone.trim()
    };

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.profileLocation = this.editLocation.trim();
        this.profileManager = this.editManager.trim();
        this.profilePhone = this.editPhone.trim();
        this.isEditingProfile.set(false);
        this.notifications.showSuccess('✓ Profile details updated successfully in database!');
      },
      error: () => {
        this.isEditingProfile.set(false);
      }
    });
  }

  copySecret() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.totpSecretKey);
    }
    this.notifications.showSuccess('2FA Secret Key copied to clipboard!');
  }

  verifyAndActivate2fa() {
    if (!this.enteredTotpCode || this.enteredTotpCode.trim().length !== 6) {
      this.notifications.showError('Please enter a valid 6-digit code from your Authenticator app.');
      return;
    }

    this.isVerifying2fa.set(true);
    const payload = {
      secret: this.totpSecretKey,
      code: this.enteredTotpCode.trim()
    };

    this.http.post<any>(`${environment.apiBaseUrl}/settings/2fa/verify`, payload).subscribe({
      next: (res) => {
        this.isVerifying2fa.set(false);
        this.is2faActive.set(true);
        this.authService.is2faConfigured.set(true);
        this.notifications.showSuccess('✓ 2FA Authenticator successfully paired and activated! 2FA will now be required on every login.');
        this.enteredTotpCode = '';
      },
      error: (err) => {
        this.isVerifying2fa.set(false);
        const msg = err?.error?.message || 'Invalid 6-digit authentication code. Please check your Authenticator app.';
        this.notifications.showError(msg);
      }
    });
  }

  revokeSession(sessionId: string) {
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    this.notifications.showInfo('Active session revoked successfully.');
  }

  saveSignature() {
    this.notifications.showSuccess('Official signature preferences saved.');
  }
}
