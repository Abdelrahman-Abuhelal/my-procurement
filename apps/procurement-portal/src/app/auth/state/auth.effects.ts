import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../../core/api.service';
import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
} from '../../core/auth.storage';
import { authActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private api = inject(ApiService);
  private router = inject(Router);

  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.restoreSession),
      map(() => {
        const session = readStoredSession();
        if (!session) {
          return authActions.authFailure({ error: '' });
        }

        return authActions.restoreSessionSuccess({
          user: session.user,
          token: session.token,
        });
      }),
    ),
  );

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.signIn),
      switchMap(({ email, password }) =>
        this.api.signIn({ email, password }).pipe(
          map(({ user, token }) => authActions.signInSuccess({ user, token })),
          catchError((error) =>
            of(
              authActions.authFailure({
                error: error?.error?.message ?? 'Unable to sign in',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.signUp),
      switchMap(({ name, email, password }) =>
        this.api.signUp({ name, email, password }).pipe(
          map(({ user, token }) => authActions.signUpSuccess({ user, token })),
          catchError((error) =>
            of(
              authActions.authFailure({
                error: error?.error?.message ?? 'Unable to sign up',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  persistSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.signInSuccess, authActions.signUpSuccess),
        tap(({ user, token }) => {
          writeStoredSession({
            user,
            token,
            expiresAt: Date.now() + 8 * 60 * 60 * 1000,
          });
          this.router.navigateByUrl('/catalog');
        }),
      ),
    { dispatch: false },
  );

  signOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.signOut),
        tap(() => {
          clearStoredSession();
          this.router.navigateByUrl('/sign-in');
        }),
      ),
    { dispatch: false },
  );
}
