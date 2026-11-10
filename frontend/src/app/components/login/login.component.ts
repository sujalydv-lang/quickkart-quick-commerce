import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const email: string = this.loginForm.value.email ?? '';
    const password: string = this.loginForm.value.password ?? '';
    this.auth.login(email, password).subscribe((ok) => {
      this.submitting = false;
      if (!ok) {
        this.errorMessage = 'Wrong email or password. Please try again.';
        return;
      }
      // Role-based redirect: admin -> dashboard, customer -> products.
      this.router.navigate([this.auth.isAdmin() ? '/dashboard' : '/products']);
    });
  }

  /** Fill the form with a demo account (buttons in the template). */
  useDemo(role: 'admin' | 'customer'): void {
    this.loginForm.setValue({
      email: role === 'admin' ? 'admin@blinkit.in' : 'customer@blinkit.in',
      password: role === 'admin' ? 'admin123' : 'customer123'
    });
    this.errorMessage = '';
  }
}
