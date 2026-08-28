import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmsEmployee } from '../models/contact.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private readonly API_BASE = environment.apiBaseUrl;

  readonly employees = signal<EmsEmployee[]>([]);
  readonly isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadRealtimeEmployees();
  }

  loadRealtimeEmployees() {
    this.isLoading.set(true);
    this.http.get<EmsEmployee[]>(`${this.API_BASE}/contacts`).subscribe({
      next: (list) => {
        this.isLoading.set(false);
        if (list && list.length > 0) {
          this.employees.set(list);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  search(query: string): EmsEmployee[] {
    const list = this.employees();
    if (!query || query.trim() === '') return list;
    const q = query.toLowerCase().trim();
    return list.filter(e =>
      (e.firstName && e.firstName.toLowerCase().includes(q)) ||
      (e.lastName && e.lastName.toLowerCase().includes(q)) ||
      (e.officialEmail && e.officialEmail.toLowerCase().includes(q)) ||
      (e.department && e.department.toLowerCase().includes(q)) ||
      (e.designation && e.designation.toLowerCase().includes(q)) ||
      (e.employeeNumber && e.employeeNumber.toLowerCase().includes(q))
    );
  }

  filterByDepartment(department: string): EmsEmployee[] {
    const list = this.employees();
    if (!department || department === 'All') return list;
    return list.filter(e => e.department === department);
  }

  getDepartments(): string[] {
    const list = this.employees();
    const depts = Array.from(new Set(list.map(e => e.department).filter(Boolean))).sort();
    return ['All', ...depts];
  }
}
