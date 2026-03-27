import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CatalogItem } from '../../core/models';

export const catalogActions = createActionGroup({
  source: 'Catalog',
  events: {
    'Load Items': props<{ search?: string }>(),
    'Load Items Success': props<{ items: CatalogItem[] }>(),
    'Load Items Failure': props<{ error: string }>(),
    'Create Item': props<{
      title: string;
      description: string;
      category: string;
      price: number;
    }>(),
    'Create Item Success': props<{ item: CatalogItem }>(),
    'Create Item Failure': props<{ error: string }>(),
    'Set Search': props<{ search: string }>(),
    'Clear Error': emptyProps(),
  },
});
