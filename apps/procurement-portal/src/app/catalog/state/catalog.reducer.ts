import { createReducer, on } from '@ngrx/store';
import { CatalogItem } from '../../core/models';
import { authActions } from '../../auth/state/auth.actions';
import { catalogActions } from './catalog.actions';

export interface CatalogState {
  items: CatalogItem[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  search: string;
}

export const initialCatalogState: CatalogState = {
  items: [],
  loading: false,
  creating: false,
  error: null,
  search: '',
};

export const catalogReducer = createReducer(
  initialCatalogState,
  on(catalogActions.setSearch, (state, { search }) => ({ ...state, search })),
  on(catalogActions.loadItems, (state) => ({ ...state, loading: true, error: null })),
  on(catalogActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
  })),
  on(catalogActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(catalogActions.createItem, (state) => ({ ...state, creating: true, error: null })),
  on(catalogActions.createItemSuccess, (state, { item }) => ({
    ...state,
    creating: false,
    items: [item, ...state.items],
  })),
  on(catalogActions.createItemFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error,
  })),
  on(catalogActions.clearError, (state) => ({ ...state, error: null })),
  on(authActions.signOut, () => initialCatalogState),
);
