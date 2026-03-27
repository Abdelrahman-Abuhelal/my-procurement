import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { authActions } from '../../auth/state/auth.actions';
import { catalogActions } from './catalog.actions';

@Injectable()
export class CatalogEffects {
  private actions$ = inject(Actions);
  private api = inject(ApiService);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.loadItems),
      switchMap(({ search }) =>
        this.api.getItems(search).pipe(
          map((items) => catalogActions.loadItemsSuccess({ items })),
          catchError((error) =>
            of(
              catalogActions.loadItemsFailure({
                error: error?.error?.message ?? 'Unable to load items',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.createItem),
      switchMap(({ title, description, category, price }) =>
        this.api.createItem({ title, description, category, price }).pipe(
          map((item) => catalogActions.createItemSuccess({ item })),
          catchError((error) =>
            of(
              catalogActions.createItemFailure({
                error: error?.error?.message ?? 'Unable to create item',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadOnAuthSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.signInSuccess, authActions.signUpSuccess, authActions.restoreSessionSuccess),
      map(() => catalogActions.loadItems({})),
    ),
  );

  reloadAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.createItemSuccess),
      map(() => catalogActions.loadItems({})),
    ),
  );
}
