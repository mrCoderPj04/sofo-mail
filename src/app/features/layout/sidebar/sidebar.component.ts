import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MailService } from '../../../core/services/mail.service';
import { MailFolder } from '../../../core/models/mail.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar-container">
      <!-- Compose Button -->
      <div class="compose-wrapper">
        <button type="button" class="btn-compose" (click)="openCompose()" aria-label="Compose new email">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Compose</span>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="nav-section" aria-label="Mailbox folders">
        <div class="section-label">Mailboxes</div>
        <ul class="nav-list">
          @for (folder of mailService.folders(); track folder.id) {
            @if (folder.folderType !== 'CUSTOM') {
              <li class="nav-item">
                <button
                  type="button"
                  class="nav-link"
                  [class.active]="mailService.selectedFolderId() === folder.id && isMailView()"
                  (click)="selectFolder(folder)"
                >
                  <span class="nav-icon" [style.color]="folder.colorHex">
                    @if (folder.iconName === 'inbox') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                      </svg>
                    } @else if (folder.iconName === 'star') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    } @else if (folder.iconName === 'bookmark') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    } @else if (folder.iconName === 'send') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    } @else if (folder.iconName === 'file-edit') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                    } @else if (folder.iconName === 'archive') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="21 8 21 21 3 21 3 8"></polyline>
                        <rect x="1" y="3" width="22" height="5"></rect>
                        <line x1="10" y1="12" x2="14" y2="12"></line>
                      </svg>
                    } @else if (folder.iconName === 'shield-alert') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    } @else if (folder.iconName === 'trash-2') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    }
                  </span>
                  <span class="nav-label">{{ folder.displayName }}</span>
                  @if (folder.unreadCount > 0) {
                    <span class="unread-pill">{{ folder.unreadCount }}</span>
                  }
                </button>
              </li>
            }
          }
        </ul>

        <!-- Custom Corporate Folders -->
        <div class="section-label mt-label">Enterprise Tags</div>
        <ul class="nav-list">
          @for (folder of mailService.folders(); track folder.id) {
            @if (folder.folderType === 'CUSTOM') {
              <li class="nav-item">
                <button
                  type="button"
                  class="nav-link"
                  [class.active]="mailService.selectedFolderId() === folder.id && isMailView()"
                  (click)="selectFolder(folder)"
                >
                  <span class="folder-tag-dot" [style.background-color]="folder.colorHex"></span>
                  <span class="nav-label">{{ folder.displayName }}</span>
                  @if (folder.unreadCount > 0) {
                    <span class="unread-pill">{{ folder.unreadCount }}</span>
                  }
                </button>
              </li>
            }
          }
        </ul>

        <!-- Directory & Enterprise Tools -->
        <div class="section-label mt-label">Workspace</div>
        <ul class="nav-list">
          <li class="nav-item">
            <a routerLink="/contacts" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              <span class="nav-label">EMS Directory</span>
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/settings" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </span>
              <span class="nav-label">Settings & Security</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Mailbox Quota Widget -->
      <div class="quota-container">
        <div class="quota-header">
          <span class="quota-title">Storage Quota</span>
          <span class="quota-values">{{ mailService.storageQuota().humanizedUsed }} / {{ mailService.storageQuota().humanizedTotal }}</span>
        </div>
        <div class="quota-bar-bg">
          <div class="quota-bar-fill" [style.width.%]="mailService.storageQuota().percentUsed"></div>
        </div>
        <span class="quota-hint">Managed by PJSOFONIC IT</span>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      width: 240px;
      height: 100%;
      background-color: var(--bg-sidebar);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      padding: var(--space-2) var(--space-1-5);
      user-select: none;
      flex-shrink: 0;
    }
    .compose-wrapper {
      margin-bottom: var(--space-2);
      padding: 0 var(--space-0-5);
    }
    .btn-compose {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      background-color: var(--brand-primary);
      color: #ffffff;
      padding: 10px 16px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 14px;
      box-shadow: var(--shadow-sm);
      transition: background-color var(--transition-fast);
    }
    .btn-compose:hover {
      background-color: var(--brand-primary-hover);
    }
    .nav-section {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .section-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      padding: var(--space-1) var(--space-1);
    }
    .mt-label {
      margin-top: var(--space-2);
    }
    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-link {
      width: 100%;
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      padding: 7px 10px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: all var(--transition-fast);
    }
    .nav-link:hover {
      background-color: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .nav-link.active {
      background-color: var(--bg-surface-selected);
      color: var(--brand-primary);
      font-weight: 600;
    }
    .nav-icon {
      display: flex;
      align-items: center;
      color: var(--text-muted);
    }
    .nav-link.active .nav-icon {
      color: var(--brand-primary);
    }
    .nav-label {
      flex: 1;
      text-align: left;
    }
    .unread-pill {
      background-color: var(--brand-primary);
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      padding: 1px 7px;
      border-radius: var(--radius-full);
      line-height: 1.3;
    }
    .folder-tag-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-left: 5px;
      margin-right: 5px;
    }
    .quota-container {
      padding: var(--space-1-5) var(--space-1);
      border-top: 1px solid var(--border-subtle);
      margin-top: auto;
    }
    .quota-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .quota-title {
      font-weight: 600;
    }
    .quota-values {
      font-family: var(--font-mono);
    }
    .quota-bar-bg {
      width: 100%;
      height: 4px;
      background-color: var(--bg-surface-hover);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: 4px;
    }
    .quota-bar-fill {
      height: 100%;
      background-color: var(--brand-primary);
      border-radius: var(--radius-full);
    }
    .quota-hint {
      font-size: 10px;
      color: var(--text-subtle);
    }
  `]
})
export class SidebarComponent {
  constructor(public mailService: MailService, private router: Router) {}

  openCompose() {
    this.mailService.openCompose();
  }

  selectFolder(folder: MailFolder) {
    this.mailService.selectFolder(folder.id);
    if (!this.isMailView()) {
      this.router.navigate(['/inbox']);
    }
  }

  isMailView(): boolean {
    return this.router.url.includes('/inbox');
  }
}
