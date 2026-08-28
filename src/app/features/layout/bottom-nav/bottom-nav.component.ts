import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MailService } from '../../../core/services/mail.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="mobile-bottom-nav" aria-label="Mobile navigation">
      <button type="button" class="nav-tab" [class.active]="isCurrent('/inbox')" (click)="navigate('/inbox')">
        <span class="tab-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          </svg>
          @if (mailService.totalInboxUnread() > 0) {
            <span class="tab-badge">{{ mailService.totalInboxUnread() }}</span>
          }
        </span>
        <span class="tab-label">Inbox</span>
      </button>

      <button type="button" class="nav-tab" (click)="openSearch()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span class="tab-label">Search</span>
      </button>

      <!-- Central Compose Floating Trigger -->
      <button type="button" class="nav-tab compose-tab" (click)="openCompose()" aria-label="Compose">
        <div class="compose-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      </button>

      <button type="button" class="nav-tab" [class.active]="isCurrent('/contacts')" (click)="navigate('/contacts')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span class="tab-label">Contacts</span>
      </button>

      <button type="button" class="nav-tab" [class.active]="isCurrent('/settings')" (click)="navigate('/settings')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <span class="tab-label">Settings</span>
      </button>
    </nav>
  `,
  styles: [`
    .mobile-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background-color: var(--bg-surface);
      border-top: 1px solid var(--border-subtle);
      z-index: 1000;
      justify-content: space-around;
      align-items: center;
      padding: 0 var(--space-1);
    }
    @media (max-width: 768px) {
      .mobile-bottom-nav {
        display: flex;
      }
    }
    .nav-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      color: var(--text-muted);
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 500;
      transition: color var(--transition-fast);
    }
    .nav-tab.active {
      color: var(--brand-primary);
    }
    .tab-icon-wrapper {
      position: relative;
      display: inline-flex;
    }
    .tab-badge {
      position: absolute;
      top: -4px;
      right: -8px;
      background-color: var(--brand-primary);
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      padding: 0 4px;
      border-radius: var(--radius-full);
      line-height: 1.3;
    }
    .compose-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: var(--brand-primary);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
      transform: translateY(-8px);
    }
  `]
})
export class BottomNavComponent {
  constructor(public mailService: MailService, private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  isCurrent(path: string): boolean {
    return this.router.url.includes(path);
  }

  openCompose() {
    this.mailService.openCompose();
  }

  openSearch() {
    this.router.navigate(['/inbox']);
    // Focus search input
    setTimeout(() => {
      const input = document.querySelector('.search-bar input') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }
}
