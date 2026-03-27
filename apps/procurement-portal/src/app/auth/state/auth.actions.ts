import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../core/models';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    'Restore Session': emptyProps(),
    'Restore Session Success': props<{ user: User; token: string }>(),
    'Sign In': props<{ email: string; password: string }>(),
    'Sign In Success': props<{ user: User; token: string }>(),
    'Sign Up': props<{ name: string; email: string; password: string }>(),
    'Sign Up Success': props<{ user: User; token: string }>(),
    'Auth Failure': props<{ error: string }>(),
    'Sign Out': emptyProps(),
    'Clear Error': emptyProps(),
  },
});
