import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { ComposeComponent } from '../../mail/compose/compose.component';
import { AdvancedSearchComponent } from '../../search/advanced-search/advanced-search.component';
import { ToastContainerComponent } from '../../../shared/components/toast/toast.component';
import { MailService } from '../../../core/services/mail.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TopbarComponent,
    SidebarComponent,
    BottomNavComponent,
    ComposeComponent,
    AdvancedSearchComponent,
    ToastContainerComponent
  ],
  template: `
    <div class="app-layout">
      <!-- Top Application Bar -->
      <app-topbar
        (toggleMobileSidebar)="toggleMobileDrawer()"
        (openAdvancedSearch)="isAdvancedSearchOpen.set(true)"
      ></app-topbar>

      <!-- Main Workspace Area -->
      <div class="workspace-layout">
        <!-- Desktop Left Navigation Sidebar -->
        <div class="sidebar-slot" [class.mobile-open]="isMobileDrawerOpen()">
          <app-sidebar></app-sidebar>
          <div class="mobile-drawer-backdrop" (click)="isMobileDrawerOpen.set(false)"></div>
        </div>

        <!-- Dynamic Content Router View -->
        <main class="main-content-slot" id="main-content" role="main">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Mobile Bottom Navigation -->
      <app-bottom-nav></app-bottom-nav>

      <!-- Compose Window Modal / Dock -->
      @if (mailService.isComposeOpen()) {
        <app-compose></app-compose>
      }

      <!-- Advanced Search Modal Dialog -->
      @if (isAdvancedSearchOpen()) {
        <app-advanced-search (close)="isAdvancedSearchOpen.set(false)"></app-advanced-search>
      }

      <!-- Global Toast Container -->
      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-app);
    }
    .workspace-layout {
      flex: 1;
      min-height: 0;
      display: flex;
      position: relative;
    }
    .sidebar-slot {
      height: 100%;
    }
    @media (max-width: 768px) {
      .sidebar-slot {
        position: fixed;
        top: 56px;
        bottom: 60px;
        left: -260px;
        z-index: 1050;
        transition: left var(--transition-normal);
      }
      .sidebar-slot.mobile-open {
        left: 0;
      }
      .sidebar-slot.mobile-open .mobile-drawer-backdrop {
        position: fixed;
        top: 56px;
        bottom: 60px;
        left: 240px;
        right: 0;
        background: var(--bg-backdrop);
        z-index: 1040;
      }
    }
    .main-content-slot {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      background-color: var(--bg-app);
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 768px) {
      .main-content-slot {
        padding-bottom: 60px; /* Space for bottom nav */
      }
    }
  `]
})
export class ShellComponent {
  isMobileDrawerOpen = signal<boolean>(false);
  isAdvancedSearchOpen = signal<boolean>(false);

  constructor(public mailService: MailService) {}

  toggleMobileDrawer() {
    this.isMobileDrawerOpen.update(v => !v);
  }
}
