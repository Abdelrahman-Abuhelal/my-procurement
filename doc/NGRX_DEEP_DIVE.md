# 🏫 NgRx State Management (Simple Version)

---

## Problem: State Scattered Everywhere

**Without NgRx:**
```typescript
// auth.service.ts
export class AuthService {
  userLoggedIn = false;
  currentUser: User | null = null;
}

// catalog.service.ts
export class CatalogService {
  items: CatalogItem[] = [];
}

// navbar.component.ts — needs to know if user is logged in
constructor(private auth: AuthService) {}
// How do I know if auth.userLoggedIn changed? No notification.

// catalog.component.ts — needs to know items
constructor(private catalog: CatalogService) {}
// How do I know if items changed? No notification.
```

**Problems:**
- Data scattered across services
- Components don't know when data changes
- Multiple components with same data get out of sync

**Solution: NgRx**
```
All state in ONE STORE
Everyone subscribes to changes
One source of truth
```

---

## What Is NgRx?

**NgRx = Centralized state store for Angular**

**Simple mental model:**
```
Component dispatches Action
  ↓
Reducer updates Store
  ↓
Components subscribe to Store (get notified)
```

---

## The 4 Pieces of NgRx

### 1. **Action** = Something happened

```typescript
// auth.actions.ts
export const signIn = createAction(
  '[Auth] Sign In',
  props<{ email: string; password: string }>()
);

export const signInSuccess = createAction(
  '[Auth] Sign In Success',
  props<{ user: User; token: string }>()
);

export const signInFailure = createAction(
  '[Auth] Sign In Failure',
  props<{ error: string }>()
);
```

**What it means:**
- `signIn` = "User clicked sign in button"
- `signInSuccess` = "API returned user data"
- `signInFailure` = "API returned error"

---

### 2. **Effect** = Handle async (API calls, etc)

```typescript
// auth.effects.ts
@Injectable()
export class AuthEffects {
  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),           // Watch for signIn action
      switchMap(({ email, password }) =>
        this.authService.signIn(email, password).pipe(
          map(response => AuthActions.signInSuccess({
            user: response.user,
            token: response.token
          })),
          catchError(error => of(
            AuthActions.signInFailure({ error: error.message })
          ))
        )
      )
    )
  );
  
  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
```

**What happens:**
1. Effect watches for `signIn` action
2. Makes API call to `authService.signIn()`
3. If success → dispatch `signInSuccess` action
4. If error → dispatch `signInFailure` action

**Why Effects?**
- Keeps API logic organized
- Testable
- Can reuse same effect for multiple components

---

### 3. **Reducer** = Update store state

```typescript
// auth.reducer.ts
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  
  // When signIn action arrives
  on(AuthActions.signIn, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  // When signInSuccess action arrives
  on(AuthActions.signInSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isLoading: false
  })),
  
  // When signInFailure action arrives
  on(AuthActions.signInFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
```

**What it does:**
- **Pure function:** Same input = same output
- **Returns new state object** (never mutate)
- **Listens for actions** and updates accordingly

**Why pure functions?**
- Easy to test
- Predictable
- Redux DevTools can replay actions

---

### 4. **Selector** = Read from store

```typescript
// auth.selectors.ts
export const selectAuthState = (state: AppState) => state.auth;

export const selectUser = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.user
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.isLoading
);

export const selectError = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.error
);

// Memoized selector (only notifies if value changed)
export const selectIsLoggedIn = createSelector(
  selectUser,
  (user: User | null) => user !== null
);
```

**Why selectors?**
- Memoization (don't update component if value didn't change)
- Extract only what you need
- Easy to refactor (change selector, not components)

---

## Complete Auth Flow

### Step 1: User clicks "Sign In" button
```typescript
// sign-in.component.ts
export class SignInComponent {
  constructor(private store: Store) {}
  
  onSubmit(email: string, password: string) {
    this.store.dispatch(AuthActions.signIn({ email, password }));
    //                  ↑ Component dispatches action
  }
}
```

### Step 2: Effect catches action, makes API call
```typescript
// auth.effects.ts
signIn$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.signIn),  // ← Effect sees action
    switchMap(({ email, password }) =>
      this.authService.signIn(email, password)  // ← Makes API call
        .pipe(
          map(response => AuthActions.signInSuccess(...)),  // ← Dispatch success
          catchError(error => of(AuthActions.signInFailure(...))) // ← Dispatch error
        )
    )
  )
);
```

### Step 3: Reducer updates store
```typescript
// auth.reducer.ts
on(AuthActions.signInSuccess, (state, { user, token }) => ({
  ...state,
  user,
  token
  // ↑ Store state updated
}))
```

### Step 4: Components subscribe, get notified
```typescript
// navbar.component.ts
export class NavbarComponent {
  user$ = this.store.select(selectUser);  // Subscribe to user from store
  
  constructor(private store: Store) {}
}
```

**Template:**
```html
<div *ngIf="user$ | async as user">
  Welcome, {{ user.name }}!
</div>
```

---

## The Store in Your App

```typescript
// app.config.ts
export const appConfig = {
  providers: [
    provideStore({
      auth: authReducer,
      catalog: catalogReducer
    }),
    provideEffects([AuthEffects, CatalogEffects])
  ]
};
```

**This creates:**
```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isLoading: boolean,
    error: string | null
  },
  catalog: {
    items: CatalogItem[],
    isLoading: boolean,
    error: string | null
  }
}
```

---

## Using Store in Components

### Load catalog items
```typescript
export class CatalogComponent implements OnInit {
  items$ = this.store.select(selectCatalogItems);
  isLoading$ = this.store.select(selectCatalogLoading);
  error$ = this.store.select(selectCatalogError);
  
  constructor(private store: Store) {}
  
  ngOnInit() {
    this.store.dispatch(CatalogActions.loadItems());
    // ↑ Request items from store/effect
  }
}
```

**Template:**
```html
<div *ngIf="isLoading$ | async">Loading...</div>
<div *ngIf="error$ | async as error" class="error">{{ error }}</div>

<div *ngIf="(items$ | async) as items">
  <div *ngFor="let item of items">{{ item.title }}</div>
</div>
```

### Create new item
```typescript
export class CreateItemComponent {
  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });
  
  onSubmit() {
    this.store.dispatch(CatalogActions.createItem({
      item: this.form.value
    }));
    // ↑ Send to store/effect
  }
}
```

---

## Why NgRx for Your Project?

| Problem | NgRx Solution |
|---------|---------------|
| "Where is auth state?" | In store (one place) |
| "How do components know if logged in changed?" | Subscribe to selectors |
| "How do I handle API calls?" | Effects handle them |
| "Is loading?" | `selectIsLoading` selector |
| "Was there an error?" | `selectError` selector |
| "How do I debug state changes?" | Redux DevTools show every action |

---

## File Structure (Your Project)

```
apps/procurement-portal/src/app/
├── auth/
│   ├── store/
│   │   ├── auth.actions.ts      (signIn, signInSuccess, etc)
│   │   ├── auth.reducer.ts      (handle actions, update state)
│   │   ├── auth.effects.ts      (handle API calls)
│   │   └── auth.selectors.ts    (read from store)
│   ├── sign-in/
│   │   └── sign-in.component.ts (dispatch actions)
│   └── auth.service.ts           (make API calls)
└── catalog/
    ├── store/
    │   ├── catalog.actions.ts
    │   ├── catalog.reducer.ts
    │   ├── catalog.effects.ts
    │   └── catalog.selectors.ts
    ├── catalog/
    │   └── catalog.component.ts
    └── catalog.service.ts
```

---

## Redux DevTools (Debugging)

**Install extension:** Redux DevTools Chrome Extension

**See every action that happened:**
```
[Auth] Sign In
[Auth] Sign In Success
[Catalog] Load Items
[Catalog] Load Items Success
```

**Time-travel debugging:**
- Click on action → see state at that moment
- Replay actions
- Know exactly what happened

---

## Key Concepts at a Glance

| Term | Means | Example |
|------|-------|---------|
| **Action** | Something happened | `signIn({ email, password })` |
| **Effect** | Handle async (API calls) | `signIn$ → API → signInSuccess` |
| **Reducer** | Update store state | `on(signInSuccess, ...) → new state` |
| **Selector** | Read from store | `selectUser` → get user from store |
| **Store** | Single source of truth | `{ auth: {...}, catalog: {...} }` |
| **Dispatch** | Send action to store | `store.dispatch(action)` |
| **Subscribe** | Listen for changes | `store.select(selector)` |

---

## Typical Feature: Create Item Flow

**1. Component dispatches action**
```typescript
this.store.dispatch(CatalogActions.createItem({ item }));
```

**2. Effect catches it, calls API**
```typescript
switchMap(({ item }) => 
  this.catalogService.createItem(item).pipe(
    map(response => CatalogActions.createItemSuccess({ item: response })),
    catchError(error => of(CatalogActions.createItemFailure({ error })))
  )
)
```

**3. Reducer updates store**
```typescript
on(CatalogActions.createItemSuccess, (state, { item }) => ({
  ...state,
  items: [...state.items, item]  // Add new item
}))
```

**4. Components see update**
```typescript
items$ = this.store.select(selectCatalogItems);
// ↑ Automatically shows new item in list
```

---

## That's NgRx!

**Remember:**
- Actions = "what happened"
- Effects = "handle async"
- Reducers = "update state"
- Selectors = "read state"
- Components dispatch → Store updates → Components subscribe

**Next:** NestJS (backend framework)
