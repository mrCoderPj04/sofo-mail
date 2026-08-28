import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="brand-header">
          <div class="logo-mark">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="8" fill="#0f2027"/>
              <path d="M6 10l10 7 10-7v14a2 2 0 01-2 2H8a2 2 0 01-2-2V10z" fill="none" stroke="#0ea5e9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 10l10 7 10-7" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="brand-titles">
            <h1 class="product-name">SOFOMail</h1>
            <p class="brand-tagline">PJSOFONIC Enterprise Mail</p>
          </div>
        </div>

        <div class="ems-banner">
          <span class="ems-dot"></span>
          <span>PJSOFONIC EMS Live Authentication</span>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          @if (errorMessage()) {
            <div class="alert-error" role="alert">
              {{ errorMessage() }}
            </div>
          }

          <div class="form-group">
            <label for="identifier">EMS Employee ID / Registered EMS Email</label>
            <div class="input-wrapper">
              <input
                id="identifier"
                type="text"
                name="identifier"
                [(ngModel)]="identifier"
                placeholder="e.g. PJS-XXXXX, your.name@pjsofonic.com, or username"
                required
                autocomplete="username"
                [disabled]="isLoading()"
              />
            </div>
            <span class="field-hint">Only registered PJSOFONIC EMS employees can access this portal.</span>
          </div>

          <div class="form-group">
            <label for="password">EMS Account Password</label>
            <div class="input-wrapper">
              <input
                id="password"
                type="password"
                name="password"
                [(ngModel)]="password"
                placeholder="Enter your EMS password"
                required
                autocomplete="current-password"
                [disabled]="isLoading()"
              />
            </div>
            <span class="field-hint">Your password on https://erp-backend-1-02lc.onrender.com</span>
          </div>

          <div class="form-options">
            <label class="remember-toggle">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
              <span>Trust this enterprise device</span>
            </label>
          </div>

          <button type="submit" class="btn-primary" [disabled]="isLoading() || !identifier.trim() || !password.trim()">
            @if (isLoading()) {
              <span class="spinner"></span>
              <span>Verifying with EMS Backend...</span>
            } @else {
              <span>Sign In to SOFOMail</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            }
          </button>
        </form>

        <div class="auth-footer">
          <div class="security-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Supabase ("project_sofo-mail") · Zero-Trust SSO</span>
          </div>
          <p class="compliance-note">EMS Authentication Server: https://erp-backend-1-02lc.onrender.com</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-3);
      background: radial-gradient(circle at 50% 20%, #172a3a 0%, #0f172a 60%, #090d16 100%);
      color: #f1f5f9;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      background-color: #181c22;
      border: 1px solid #28303d;
      border-radius: var(--radius-xl);
      padding: var(--space-4);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
    }
    .brand-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-3);
    }
    .product-name {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .brand-tagline {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }
    .ems-banner {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      background-color: #172a3a;
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: var(--radius-sm);
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: var(--space-3);
    }
    .ems-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #38bdf8;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-2-5);
    }
    .alert-error {
      background-color: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 12px;
      line-height: 1.4;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .form-group label {
      font-size: 12px;
      font-weight: 500;
      color: #cbd5e1;
    }
    .field-hint {
      font-size: 11px;
      color: #64748b;
    }
    .input-wrapper input {
      width: 100%;
      background-color: #121519;
      border: 1px solid #2f3746;
      border-radius: var(--radius-md);
      padding: 10px 14px;
      color: #ffffff;
      font-size: 14px;
      transition: border-color var(--transition-fast);
    }
    .input-wrapper input:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #94a3b8;
    }
    .remember-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      background-color: #0284c7;
      color: #ffffff;
      padding: 12px 18px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 14px;
      transition: background-color var(--transition-fast);
      margin-top: var(--space-1);
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #0369a1;
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .auth-footer {
      margin-top: var(--space-3);
      padding-top: var(--space-2);
      border-top: 1px solid #252c38;
      text-align: center;
    }
    .security-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #94a3b8;
      font-size: 11px;
      margin-bottom: 6px;
    }
    .compliance-note {
      font-size: 10px;
      color: #64748b;
      word-break: break-all;
    }
  `]
})
export class LoginComponent implements OnInit {
  identifier = '';
  password = '';
  rememberMe = true;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notifications: NotificationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.identifier = params['email'];
      }
    });
  }

  onSubmit() {
    if (!this.identifier.trim() || !this.password.trim()) {
      this.errorMessage.set('Please enter your EMS credentials.');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login(this.identifier, this.password).subscribe({
      next: (res) => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(typeof err === 'string' ? err : 'Access Denied: Only registered PJSOFONIC EMS employees can access SOFOMail. Please check your credentials.');
      }
    });
  }
}
