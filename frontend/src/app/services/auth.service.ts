import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role, User } from '../models';

const STORAGE_KEY = 'quickkart_user';

// Demo accounts (also the backend seed users). No real password check
// happens server-side in this demo build; the backend is not consulted
// for login so the UI works standalone.
const DEMO_USERS: Array<User & { password: string }> = [
  { id: 1, name: 'Admin', email: 'admin@blinkit.in', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Customer', email: 'customer@blinkit.in', password: 'customer123', role: 'customer' }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Login with email/password. Emits true on success, false on wrong credentials. */
  login(email: string, password: string): Observable<boolean> {
    const match = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!match) { return of(false); }
    const user: User = { id: match.id, name: match.name, email: match.email, role: match.role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return of(true);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  getRole(): Role | null {
    return this.getCurrentUser()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
