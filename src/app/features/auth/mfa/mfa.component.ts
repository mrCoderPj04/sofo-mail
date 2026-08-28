import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="mfa-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>

        <h1 class="title">Two-Factor Authentication</h1>
        <p class="subtitle">Enter the 6-digit security code from your PJSOFONIC Authenticator or hardware security key.</p>

        <form (ngSubmit)="onSubmit()" class="mfa-form">
          @if (errorMessage()) {
            <div class="alert-error" role="alert">
              {{ errorMessage() }}
            </div>
          }

          <div class="code-inputs">
            <input
              type="text"
              maxlength="6"
              [(ngModel)]="code"
              name="mfaCode"
              placeholder="123456"
              required
              autocomplete="one-time-code"
              class="code-input"
              autofocus
            />
          </div>

          <button type="submit" class="btn-primary" [disabled]="isLoading() || code.length < 4">
            @if (isLoading()) {
              <span class="spinner"></span>
              <span>Verifying Token...</span>
            } @else {
              <span>Verify & Continue</span>
            }
          </button>
        </form>

        <div class="mfa-footer">
          <button type="button" class="btn-link" (click)="backToLogin()">Use a different authentication method</button>
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
      max-width: 420px;
      background-color: #181c22;
      border: 1px solid #28303d;
      border-radius: var(--radius-xl);
      padding: var(--space-4);
      text-align: center;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
    }
    .mfa-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-full);
      background-color: rgba(14, 165, 233, 0.1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-2);
      border: 1px solid rgba(14, 165, 233, 0.2);
    }
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .subtitle {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: var(--space-3);
    }
    .mfa-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-2-5);
    }
    .code-input {
      width: 100%;
      background-color: #121519;
      border: 1px solid #2f3746;
      border-radius: var(--radius-md);
      padding: 12px;
      color: #ffffff;
      font-size: 22px;
      text-align: center;
      letter-spacing: 8px;
      font-family: var(--font-mono);
      font-weight: 600;
    }
    .code-input:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }
    .alert-error {
      background-color: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 13px;
      text-align: left;
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
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #0369a1;
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .mfa-footer {
      margin-top: var(--space-3);
    }
    .btn-link {
      font-size: 12px;
      color: #38bdf8;
    }
    .btn-link:hover {
      text-decoration: underline;
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
  `]
})
export class MfaComponent {
  code = '';
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.code || this.code.length < 4) return;

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.verifyMfa(this.code).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(typeof err === 'string' ? err : 'Invalid MFA verification code. Please try again.');
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
