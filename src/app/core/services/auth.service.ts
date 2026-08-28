import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { UserProfile } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface AuthResponseDto {
  accessToken?: string;
  tokenType?: string;
  expiresInMs?: number;
  requiresMfa?: boolean;
  tempToken?: string;
  mfaType?: string;
  user?: UserProfile;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_STORAGE_KEY = 'sofomail_auth_token';
  private readonly USER_STORAGE_KEY = 'sofomail_user_profile';
  private readonly PROVISIONED_USERS_KEY = 'sofomail_provisioned_users';

  private readonly API_BASE = environment.apiBaseUrl;

  readonly currentUser = signal<UserProfile | null>(this.getStoredUser());
  readonly token = signal<string | null>(this.getStoredToken());
  readonly isAuthenticated = computed(() => !!this.token() && !!this.currentUser());
  readonly requiresMfa = signal<boolean>(false);
  readonly tempMfaToken = signal<string | null>(null);
  readonly is2faConfigured = signal<boolean>(true);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(identifier: string, pass: string): Observable<AuthResponseDto> {
    const input = identifier.trim();
    const payload = { username: input, password: pass };

    return this.http.post<AuthResponseDto>(`${this.API_BASE}/auth/login`, payload).pipe(
      tap(res => {
        if (res.requiresMfa && res.tempToken) {
          this.requiresMfa.set(true);
          this.tempMfaToken.set(res.tempToken);
          this.router.navigate(['/auth/mfa']);
        } else if (res.accessToken && res.user) {
          this.handleSuccessfulAuth(res.accessToken, res.user);
        }
      }),
      catchError(err => {
        console.error('SOFOMail Auth Error:', err);
        if (err.status === 0) {
          return throwError(() => 'Cannot reach SOFOMail backend (http://localhost:8080). Please ensure "mvn spring-boot:run" is running.');
        }
        const serverMsg = err?.error?.message || err?.error?.error || (typeof err.error === 'string' ? err.error : null);
        if (serverMsg) {
          return throwError(() => serverMsg);
        }
        return throwError(() => 'Access Denied: Only registered PJSOFONIC EMS employees can access SOFOMail. Verification failed on https://erp-backend-1-02lc.onrender.com.');
      })
    );
  }

  handleSuccessfulAuth(token: string, user: UserProfile) {
    this.token.set(token);
    this.currentUser.set(user);
    this.requiresMfa.set(false);
    this.tempMfaToken.set(null);

    localStorage.setItem(this.AUTH_STORAGE_KEY, token);
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));

    const isAlreadyProvisioned = user.isProvisioned ||
      this.isUserAlreadyProvisioned(user.officialEmail) ||
      (user.username && this.isUserAlreadyProvisioned(user.username));

    if (!isAlreadyProvisioned) {
      // First-time login: show generated / customizable email screen
      this.router.navigate(['/auth/provisioning']);
    } else {
      // 2nd time & returning login: directly go to inbox!
      this.router.navigate(['/inbox']);
    }
  }

  verifyMfa(code: string): Observable<AuthResponseDto> {
    const payload = { tempToken: this.tempMfaToken(), code: code.trim() };

    return this.http.post<AuthResponseDto>(`${this.API_BASE}/auth/mfa/verify`, payload).pipe(
      tap(res => {
        if (res.accessToken && res.user) {
          this.handleSuccessfulAuth(res.accessToken, res.user);
        }
      })
    );
  }

  customizeEmailHandle(customHandle: string): Observable<UserProfile> {
    const clean = customHandle.trim().toLowerCase().replaceAll(/[^a-z0-9._-]/g, '');
    const newEmail = `${clean}@pjsofonic.com`;

    return this.http.post<UserProfile>(`${this.API_BASE}/auth/provision/customize`, { handle: clean }).pipe(
      tap(updatedUser => {
        this.currentUser.set(updatedUser);
        this.markUserProvisioned(updatedUser.officialEmail);
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }),
      catchError(() => {
        // Fallback local update
        if (this.currentUser()) {
          const updated = { ...this.currentUser()!, officialEmail: newEmail, isProvisioned: true };
          this.currentUser.set(updated);
          this.markUserProvisioned(newEmail);
          localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updated));
          return of(updated);
        }
        return of({} as UserProfile);
      })
    );
  }

  updateProfile(profile: any): Observable<any> {
    return this.http.put(`${this.API_BASE}/settings/profile`, profile).pipe(
      tap((res: any) => {
        if (this.currentUser()) {
          const updated = {
            ...this.currentUser()!,
            firstName: res.firstName || profile.firstName,
            lastName: res.lastName || profile.lastName,
            location: res.location || profile.location,
            managerName: res.managerName || profile.managerName,
            department: res.department || profile.department,
            phone: res.phone || profile.phone
          };
          this.currentUser.set(updated);
          localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updated));
        }
      }),
      catchError(() => {
        // Fallback local update
        if (this.currentUser()) {
          const updated = { ...this.currentUser()!, ...profile };
          this.currentUser.set(updated);
          localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updated));
        }
        return of({ success: true });
      })
    );
  }

  completeProvisioning() {
    if (this.currentUser()) {
      const email = this.currentUser()!.officialEmail;
      this.markUserProvisioned(email);
      const updated = { ...this.currentUser()!, isProvisioned: true };
      this.currentUser.set(updated);
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updated));

      this.http.post(`${this.API_BASE}/auth/provision/complete`, {}).subscribe({
        error: () => {}
      });
    }
    this.router.navigate(['/inbox']);
  }

  markUserProvisioned(identifier: string) {
    const list = this.getProvisionedUsersList();
    const clean = identifier.toLowerCase().trim();
    if (!list.includes(clean)) {
      list.push(clean);
      localStorage.setItem(this.PROVISIONED_USERS_KEY, JSON.stringify(list));
    }
  }

  isUserAlreadyProvisioned(identifier: string): boolean {
    const list = this.getProvisionedUsersList();
    const clean = identifier.toLowerCase().trim();
    return list.some(item => clean.includes(item) || item.includes(clean));
  }

  private getProvisionedUsersList(): string[] {
    if (typeof localStorage === 'undefined') return [];
    const data = localStorage.getItem(this.PROVISIONED_USERS_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    this.requiresMfa.set(false);
    this.tempMfaToken.set(null);
    localStorage.removeItem(this.AUTH_STORAGE_KEY);
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.router.navigate(['/auth/login']);
  }

  private getStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.AUTH_STORAGE_KEY);
  }

  private getStoredUser(): UserProfile | null {
    if (typeof localStorage === 'undefined') return null;
    const data = localStorage.getItem(this.USER_STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}
