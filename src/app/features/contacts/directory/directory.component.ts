import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectoryService } from '../../../core/services/directory.service';
import { MailService } from '../../../core/services/mail.service';
import { EmsEmployee } from '../../../core/models/contact.model';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent, EmptyStateComponent],
  template: `
    <div class="directory-container">
      <!-- Directory Top Bar -->
      <div class="directory-header">
        <div class="header-titles">
          <h1 class="page-title">PJSOFONIC EMS Employee Directory</h1>
          <p class="page-subtitle">Official verified employee communication records from Enterprise Management System.</p>
        </div>

        <div class="directory-controls">
          <!-- Search Box -->
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search by name, role, or email..."
              aria-label="Search employees"
            />
          </div>

          <!-- Department Filter -->
          <select [(ngModel)]="selectedDepartment" class="dept-select" aria-label="Filter by department">
            @for (dept of directoryService.getDepartments(); track dept) {
              <option [value]="dept">{{ dept }}</option>
            }
          </select>

          <!-- Sync Realtime EMS Button -->
          <button type="button" class="btn-sync-ems" (click)="refreshDirectory()" [disabled]="directoryService.isLoading()">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.spinning]="directoryService.isLoading()">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>{{ directoryService.isLoading() ? 'Syncing...' : 'Sync Real-time EMS' }}</span>
          </button>

          <!-- View Mode Toggle -->
          <div class="view-toggle">
            <button type="button" class="toggle-btn" [class.active]="viewMode() === 'grid'" (click)="viewMode.set('grid')" title="Card View" aria-label="Card view">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button type="button" class="toggle-btn" [class.active]="viewMode() === 'table'" (click)="viewMode.set('table')" title="Table View" aria-label="Table view">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Directory Content -->
      <div class="directory-content">
        @if (filteredEmployees().length === 0) {
          <app-empty-state
            icon="contacts"
            headline="No contacts yet."
            description="No employee records matched your filter criteria."
          ></app-empty-state>
        } @else if (viewMode() === 'grid') {
          <div class="employees-grid">
            @for (emp of filteredEmployees(); track emp.id) {
              <div class="employee-card">
                <div class="card-top">
                  <app-avatar [name]="emp.firstName + ' ' + emp.lastName" [status]="emp.availabilityStatus" size="lg"></app-avatar>
                  <div class="card-titles">
                    <h3 class="emp-name">{{ emp.firstName }} {{ emp.lastName }}</h3>
                    <span class="emp-id">{{ emp.employeeNumber }}</span>
                  </div>
                </div>

                <div class="card-body">
                  <div class="info-row">
                    <span class="info-label">Role:</span>
                    <span class="info-value font-medium">{{ emp.designation }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Dept:</span>
                    <span class="info-value">{{ emp.department }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">{{ emp.location }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value email-value">{{ emp.officialEmail }}</span>
                  </div>
                </div>

                <div class="card-footer">
                  <button type="button" class="btn-email-emp" (click)="emailEmployee(emp)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="table-responsive">
            <table class="employees-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (emp of filteredEmployees(); track emp.id) {
                  <tr>
                    <td>
                      <div class="table-emp-cell">
                        <app-avatar [name]="emp.firstName + ' ' + emp.lastName" [status]="emp.availabilityStatus" size="sm"></app-avatar>
                        <div class="table-emp-names">
                          <span class="table-name">{{ emp.firstName }} {{ emp.lastName }}</span>
                          <span class="table-email">{{ emp.officialEmail }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="font-mono text-muted">{{ emp.employeeNumber }}</td>
                    <td class="font-medium">{{ emp.designation }}</td>
                    <td>{{ emp.department }}</td>
                    <td class="text-muted">{{ emp.location }}</td>
                    <td>
                      <span class="status-badge" [class]="'status-' + emp.availabilityStatus.toLowerCase()">
                        {{ formatStatus(emp.availabilityStatus) }}
                      </span>
                    </td>
                    <td>
                      <button type="button" class="table-btn" (click)="emailEmployee(emp)" title="Send Email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .directory-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: var(--bg-surface);
    }
    .directory-header {
      padding: var(--space-3);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .page-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .page-subtitle {
      font-size: 13px;
      color: var(--text-muted);
    }
    .directory-controls {
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      flex-wrap: wrap;
    }
    .search-box {
      flex: 1;
      min-width: 240px;
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0 12px;
      height: 38px;
      color: var(--text-muted);
    }
    .search-box input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      color: var(--text-primary);
    }
    .dept-select {
      background-color: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0 12px;
      height: 38px;
      font-size: 13px;
      color: var(--text-primary);
      outline: none;
      cursor: pointer;
    }
    .view-toggle {
      display: flex;
      background-color: var(--bg-surface-hover);
      padding: 2px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }
    .toggle-btn {
      padding: 6px 8px;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      display: flex;
      align-items: center;
    }
    .toggle-btn.active {
      background-color: var(--bg-surface);
      color: var(--brand-primary);
      box-shadow: var(--shadow-xs);
    }
    .directory-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-3);
    }
    .employees-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-2-5);
    }
    .employee-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--space-2-5);
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-xs);
      transition: all var(--transition-fast);
    }
    .employee-card:hover {
      border-color: var(--brand-primary);
      box-shadow: var(--shadow-md);
    }
    .card-top {
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
      margin-bottom: var(--space-2);
    }
    .emp-name {
      font-size: 15px;
      font-weight: 650;
      color: var(--text-primary);
    }
    .emp-id {
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-muted);
    }
    .card-body {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
      margin-bottom: var(--space-2);
      flex: 1;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
    }
    .info-label {
      color: var(--text-muted);
    }
    .info-value {
      color: var(--text-primary);
      text-align: right;
    }
    .font-medium {
      font-weight: 550;
    }
    .email-value {
      font-family: var(--font-mono);
      color: var(--brand-primary);
    }
    .card-footer {
      border-top: 1px solid var(--border-subtle);
      padding-top: var(--space-1-5);
    }
    .btn-email-emp {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--brand-primary);
      transition: all var(--transition-fast);
    }
    .btn-email-emp:hover {
      background-color: var(--brand-primary);
      color: #ffffff;
      border-color: var(--brand-primary);
    }
    .table-responsive {
      overflow-x: auto;
    }
    .employees-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    .employees-table th {
      padding: 10px 14px;
      background-color: var(--bg-app);
      color: var(--text-muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .employees-table td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-subtle);
      color: var(--text-primary);
    }
    .table-emp-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .table-emp-names {
      display: flex;
      flex-direction: column;
    }
    .table-name {
      font-weight: 600;
    }
    .table-email {
      font-size: 11px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }
    .font-mono {
      font-family: var(--font-mono);
    }
    .text-muted {
      color: var(--text-muted);
    }
    .status-badge {
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 500;
    }
    .status-active { background-color: var(--status-success-bg); color: var(--status-success); }
    .status-in_meeting { background-color: var(--status-warning-bg); color: var(--status-warning); }
    .status-away { background-color: rgba(249, 115, 22, 0.12); color: #f97316; }
    .status-out_of_office { background-color: var(--badge-bg-neutral); color: var(--badge-text-neutral); }
    .table-btn {
      color: var(--brand-primary);
      padding: 6px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
    }
    .table-btn:hover {
      background-color: var(--brand-primary-subtle);
    }
    .btn-sync-ems {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: var(--bg-surface-hover);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      padding: 0 12px;
      height: 38px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .btn-sync-ems:hover:not(:disabled) {
      background-color: rgba(14, 165, 233, 0.1);
      color: var(--brand-primary);
      border-color: rgba(14, 165, 233, 0.3);
    }
    .btn-sync-ems:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .spinning {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class DirectoryComponent {
  searchQuery = '';
  selectedDepartment = 'All';
  viewMode = signal<'grid' | 'table'>('grid');

  readonly filteredEmployees = computed(() => {
    let list = this.directoryService.search(this.searchQuery);
    if (this.selectedDepartment !== 'All') {
      list = list.filter(e => e.department === this.selectedDepartment);
    }
    return list;
  });

  constructor(
    public directoryService: DirectoryService,
    private mailService: MailService
  ) {}

  refreshDirectory() {
    this.directoryService.loadRealtimeEmployees();
  }

  emailEmployee(emp: EmsEmployee) {
    this.mailService.openCompose({
      to: [emp.officialEmail],
      subject: ''
    });
  }

  formatStatus(st: string): string {
    return st.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
