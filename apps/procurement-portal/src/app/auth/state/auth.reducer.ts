import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models';
import { authActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(authActions.restoreSession, authActions.signIn, authActions.signUp, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    authActions.restoreSessionSuccess,
    authActions.signInSuccess,
    authActions.signUpSuccess,
    (state, { user, token }) => ({
      ...state,
      user,
      token,
      loading: false,
      error: null,
    }),
  ),
  on(authActions.authFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(authActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
  on(authActions.signOut, () => initialAuthState),
);
