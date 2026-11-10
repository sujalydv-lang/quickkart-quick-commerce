import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Redirects to /login when not logged in. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) { return true; }
  return router.createUrlTree(['/login']);
};

/** Admin-only guard (used for /customers). Non-admins go to /products. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn() && auth.isAdmin()) { return true; }
  if (!auth.isLoggedIn()) { return router.createUrlTree(['/login']); }
  return router.createUrlTree(['/products']);
};
