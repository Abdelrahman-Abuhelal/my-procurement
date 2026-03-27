import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from './state/auth.actions';
import { selectAuthError, selectAuthLoading } from './state/auth.selectors';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="auth-card">
      <h1>Create Account</h1>
      <p>Set up access to the procurement portal.</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>
          <span>Name</span>
          <input type="text" formControlName="name" />
        </label>

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
          {{ (loading$ | async) ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>

      <a routerLink="/sign-in">Already have an account? Sign in</a>
    </section>
  `,
  styles: [
    `
      .auth-card { max-width: 420px; margin: 4rem auto; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); }
      form { display: grid; gap: 1rem; margin: 1.5rem 0; }
      label { display: grid; gap: 0.35rem; color: #334155; }
      input { padding: 0.85rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; }
      button { border: 0; padding: 0.9rem 1rem; border-radius: 0.75rem; background: #1d4ed8; color: white; cursor: pointer; }
      .error { color: #b91c1c; margin: 0; }
      a { color: #0f766e; text-decoration: none; }
    `,
  ],
})
export class SignUpPageComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit() {
    const { name, email, password } = this.form.getRawValue();
    if (!name || !email || !password) {
      return;
    }

    this.store.dispatch(authActions.signUp({ name, email, password }));
  }
}
