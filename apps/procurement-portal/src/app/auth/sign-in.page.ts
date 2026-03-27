import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from './state/auth.actions';
import { selectAuthError, selectAuthLoading } from './state/auth.selectors';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="auth-card">
      <h1>Sign In</h1>
      <p>Access your protected procurement workspace.</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>
          <span>Email</span>
          <input type="email" formControlName="email" />
        </label>

        <label>
          <span>Password</span>
          <input type="password" formControlName="password" />
        </label>

        <p class="error" *ngIf="error$ | async as error">{{ error }}</p>

        <button type="submit" [disabled]="form.invalid || (loading$ | async)">
          {{ (loading$ | async) ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <a routerLink="/sign-up">Need an account? Sign up</a>
    </section>
  `,
  styles: [
    `
      .auth-card { max-width: 420px; margin: 4rem auto; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); }
      form { display: grid; gap: 1rem; margin: 1.5rem 0; }
      label { display: grid; gap: 0.35rem; color: #334155; }
      input { padding: 0.85rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; }
      button { border: 0; padding: 0.9rem 1rem; border-radius: 0.75rem; background: #0f766e; color: white; cursor: pointer; }
      .error { color: #b91c1c; margin: 0; }
      a { color: #1d4ed8; text-decoration: none; }
    `,
  ],
})
export class SignInPageComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    const { email, password } = this.form.getRawValue();
    if (!email || !password) {
      return;
    }

    this.store.dispatch(authActions.signIn({ email, password }));
  }
}
