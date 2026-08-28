import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MailService } from '../../../core/services/mail.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService, AppTheme } from '../../../core/services/theme.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent],
  template: `
    <header class="topbar-header">
      <div class="topbar-left">
        <button type="button" class="mobile-menu-btn" (click)="toggleMobileSidebar.emit()" aria-label="Toggle navigation">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="brand-link" (click)="navigateToInbox()">
          <div class="brand-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="8" fill="#0f2027"/>
              <path d="M6 10l10 7 10-7v14a2 2 0 01-2 2H8a2 2 0 01-2-2V10z" fill="none" stroke="#0ea5e9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 10l10 7 10-7" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">SOFOMail</span>
            <span class="brand-org">PJSOFONIC</span>
          </div>
        </div>
      </div>

      <div class="topbar-center">
        <div class="search-bar">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search messages, senders, or EMS directory..."
            [ngModel]="mailService.searchQuery()"
            (ngModelChange)="onSearchChange($event)"
            aria-label="Search messages"
          />
          @if (mailService.searchQuery()) {
            <button type="button" class="clear-search-btn" (click)="clearSearch()" aria-label="Clear search query">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          }
          <button type="button" class="filter-trigger-btn" (click)="openAdvancedSearch.emit()" aria-label="Open advanced search filters" title="Advanced Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Theme Switcher -->
        <div class="theme-switcher">
          <button
            type="button"
            class="action-btn"
            [class.active]="themeService.currentTheme() === 'light'"
            (click)="setTheme('light')"
            title="Light Theme"
            aria-label="Switch to Light Theme"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
          <button
            type="button"
            class="action-btn"
            [class.active]="themeService.currentTheme() === 'dark'"
            (click)="setTheme('dark')"
            title="Dark Theme"
            aria-label="Switch to Dark Theme"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <button
            type="button"
            class="action-btn"
            [class.active]="themeService.currentTheme() === 'system'"
            (click)="setTheme('system')"
            title="System Theme"
            aria-label="Follow System Theme"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </button>
        </div>

        <!-- Help Button -->
        <button type="button" class="icon-btn" (click)="openHelp()" title="Help & Security Policies" aria-label="Help and enterprise documentation">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>

        <!-- Profile Menu Dropdown Trigger -->
        <div class="profile-menu-container">
          <button type="button" class="profile-btn" (click)="toggleProfileMenu()" aria-label="User account menu" [attr.aria-expanded]="isProfileMenuOpen()">
            <app-avatar [name]="authService.currentUser()?.firstName + ' ' + authService.currentUser()?.lastName" status="ACTIVE" size="sm"></app-avatar>
            <span class="profile-name-desktop">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</span>
            <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          @if (isProfileMenuOpen()) {
            <div class="profile-dropdown" (click)="$event.stopPropagation()">
              <div class="dropdown-header">
                <div class="user-name">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</div>
                <div class="user-email">{{ authService.currentUser()?.officialEmail }}</div>
                <div class="user-role-badge">{{ authService.currentUser()?.designation }}</div>
              </div>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item" (click)="navigateToSettings('account')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Account Profile</span>
              </button>
              <button type="button" class="dropdown-item" (click)="navigateToSettings('security')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Security & Sessions</span>
              </button>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item text-danger" (click)="logout()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Sign Out of EMS</span>
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar-header {
      height: 56px;
      background-color: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-2);
      position: relative;
      z-index: 100;
      user-select: none;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      min-width: 220px;
    }
    .mobile-menu-btn {
      display: none;
      color: var(--text-muted);
      padding: 6px;
      border-radius: var(--radius-sm);
    }
    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: flex;
      }
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      cursor: pointer;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }
    .brand-name {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: var(--text-primary);
    }
    .brand-org {
      font-size: 10px;
      font-weight: 600;
      color: var(--brand-primary);
      letter-spacing: 0.5px;
    }
    .topbar-center {
      flex: 1;
      max-width: 620px;
      margin: 0 var(--space-2);
    }
    .search-bar {
      display: flex;
      align-items: center;
      background-color: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0 var(--space-1);
      height: 38px;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }
    .search-bar:focus-within {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
    }
    .search-icon {
      color: var(--text-muted);
      margin-left: 6px;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .search-bar input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      color: var(--text-primary);
    }
    .clear-search-btn, .filter-trigger-btn {
      color: var(--text-muted);
      padding: 5px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
    }
    .clear-search-btn:hover, .filter-trigger-btn:hover {
      color: var(--text-primary);
      background-color: var(--bg-surface-hover);
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }
    .theme-switcher {
      display: flex;
      align-items: center;
      background-color: var(--bg-surface-hover);
      border-radius: var(--radius-full);
      padding: 2px;
      border: 1px solid var(--border-subtle);
    }
    .action-btn {
      padding: 5px;
      border-radius: var(--radius-full);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      transition: all var(--transition-fast);
    }
    .action-btn.active {
      background-color: var(--bg-surface);
      color: var(--brand-primary);
      box-shadow: var(--shadow-xs);
    }
    .icon-btn {
      padding: 8px;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      display: flex;
      align-items: center;
    }
    .icon-btn:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .profile-menu-container {
      position: relative;
    }
    .profile-btn {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: 4px 8px;
      border-radius: var(--radius-md);
      color: var(--text-primary);
      transition: background-color var(--transition-fast);
    }
    .profile-btn:hover {
      background-color: var(--bg-surface-hover);
    }
    .profile-name-desktop {
      font-size: 13px;
      font-weight: 550;
      color: var(--text-primary);
    }
    @media (max-width: 640px) {
      .profile-name-desktop, .chevron-icon {
        display: none;
      }
    }
    .profile-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 240px;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-dropdown);
      padding: var(--space-1);
      z-index: 1050;
      animation: dropdownFade 150ms ease-out;
    }
    @keyframes dropdownFade {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .dropdown-header {
      padding: var(--space-1) var(--space-1-5);
    }
    .user-name {
      font-weight: 600;
      font-size: 13px;
      color: var(--text-primary);
    }
    .user-email {
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      margin-bottom: 4px;
    }
    .user-role-badge {
      font-size: 11px;
      color: var(--brand-primary);
      font-weight: 500;
    }
    .dropdown-divider {
      height: 1px;
      background-color: var(--border-subtle);
      margin: var(--space-1) 0;
    }
    .dropdown-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      color: var(--text-secondary);
      text-align: left;
    }
    .dropdown-item:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .text-danger {
      color: var(--status-error);
    }
    .text-danger:hover {
      background-color: var(--status-error-bg);
      color: var(--status-error);
    }
  `]
})
export class TopbarComponent {
  @Output() toggleMobileSidebar = new EventEmitter<void>();
  @Output() openAdvancedSearch = new EventEmitter<void>();

  isProfileMenuOpen = signal<boolean>(false);

  constructor(
    public mailService: MailService,
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  onSearchChange(value: string) {
    this.mailService.searchQuery.set(value);
  }

  clearSearch() {
    this.mailService.searchQuery.set('');
  }

  setTheme(theme: AppTheme) {
    this.themeService.setTheme(theme);
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen.update(v => !v);
  }

  openHelp() {
    this.router.navigate(['/settings'], { queryParams: { tab: 'security' } });
  }

  navigateToInbox() {
    this.router.navigate(['/inbox']);
    this.mailService.selectFolder('fld-inbox');
  }

  navigateToSettings(tab = 'account') {
    this.isProfileMenuOpen.set(false);
    this.router.navigate(['/settings'], { queryParams: { tab } });
  }

  logout() {
    this.isProfileMenuOpen.set(false);
    this.authService.logout();
  }
}
