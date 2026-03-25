# Technical Notes: Why We Architect This Way

This document explains the "why" behind each architectural decision so you understand the reasoning, not just the implementation.

---

## 1. Monorepo with Nx (Why This is Smart)

**Decision:** Use existing Nx monorepo instead of separate repos

**Why:**
- **Single source of truth:** Shared types live in one place (`shared-types`)
- **Atomic commits:** Frontend + backend changes commit together (no version mismatch)
- **Code reuse:** Both apps import from `shared-types` without npm publishing
- **Task caching:** Nx caches builds—rebuild only affected projects
- **Scalability:** Easy to add microservices later without tooling changes

**Alternative considered:** Separate GitHub repos (frontend + backend)
- **Rejected because:** Would require publishing `shared-types` to npm, slower development, harder to sync updates

---

## 2. Authentication: Session vs JWT vs OAuth

**Decision:** JWT with 8-hour expiry + localStorage

**Why:**
- **JWT:** Stateless token (backend doesn't store session data in memory or DB)
- **8-hour expiry:** Reasonable security vs usability tradeoff
- **localStorage:** Simple persistence across page refreshes
- **Backend simplicity:** No session table or Redis needed

**Why not OAuth (Google/GitHub login)?**
- Assessment asks for sign-up/sign-in implementation (implies custom auth)
- Less code to write (time-boxed assessment)
- OAuth adds complexity (less time for features)

**Why not httpOnly cookies?**
- XSRF protection would need extra endpoints
- localStorage is simpler for this timeframe

**JWT request flow we implemented:**
```text
1. User signs up or signs in
   -> AuthService generates a JWT containing userId

2. Frontend stores the token
   -> Later sends it as: Authorization: Bearer <token>

3. Protected endpoint is called
   -> Example: GET /api/auth/me or later GET /api/items

4. JwtAuthGuard runs first
   -> Blocks request if token is missing or invalid

5. JwtStrategy verifies the token
   -> Uses JWT_SECRET
   -> Extracts payload from Authorization header

6. Strategy validate() returns a small user object
   -> req.user = { userId }

7. Controller reads req.user.userId
   -> Service loads the real user from MongoDB

8. Response is returned only for authenticated users
```

**Why this flow is useful:**
- **Simple:** No server-side session store required
- **Scalable:** Any backend instance can verify the token
- **Fits the assessment:** Protected API access is required
- **Works with Angular guards later:** Frontend can redirect when token is missing/expired

---

## 3. State Management: NgRx (Why Not Context API?)

**Decision:** NgRx for Angular state management

**Why:**
- **Predictability:** Every state change is a logged action (easy debugging)
- **Separation of concerns:** Actions → Effects → Reducers → Selectors
- **Time-travel debugging:** Chrome devtools can replay state changes
- **Testability:** Pure functions (reducers) are easy to unit test
- **Performance:** Memoized selectors prevent unnecessary re-renders

**Why not simpler approaches:**
- **RxJS only:** No normalized state structure, harder to track changes
- **Context API:** Good for small apps, gets messy with complex flows
- **Given the stack:** NgRx is industry-standard for enterprise Angular

---

## 4. Backend API: NestJS (Why TypeScript?)

**Decision:** Use NestJS (already in project)

**Why:**
- **Shared types:** Backend + frontend both TypeScript → `shared-types` reuse
- **Dependency injection:** Cleaner code than Express middleware chains
- **Decorators:** `@Controller`, `@Post`, `@UseGuards` make intent obvious
- **Testing:** Built-in test utilities

**Folder structure decision:**
```
api/src/
├── app/
│   ├── auth/              (auth service, controllers, guards)
│   ├── catalog/           (catalog service, controllers)
│   └── app.module.ts      (root module)
├── main.ts
└── assets/
```
- **Why:** Nx convention + mirrors Angular apps structure (easier mental model)

---

## 5. Database: MongoDB (Not SQL)

**Decision:** MongoDB (as specified in assessment)

**Why:**
- **Flexible schema:** Can add fields without migrations
- **Mongoose ODM:** TypeScript support, validation at app layer
- **Fast development:** No schema SQL scripts to maintain
- **Scalable:** Can shard by userId later if needed

**Schema design decisions:**

**User Collection:**
```typescript
interface User {
  _id: ObjectId;           // Auto by MongoDB
  name: string;
  email: string;           // Unique index
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
```
- **Why passwordHash not plaintext:** Security (mandatory)
- **Why email unique:** Required for sign-in lookup
- **Why createdAt:** Audit trail + sort by recency

**CatalogItem Collection:**
```typescript
interface CatalogItem {
  _id: ObjectId;
  title: string;
  description: string;
  category: string;
  price: number;
  createdBy: ObjectId;      // Reference to User._id
  createdAt: Date;
  updatedAt: Date;
}
```
- **Why createdBy reference:** Track who created it + could implement "my items" filter
- **Why category:** Enable filtering in UI
- **Why price as number:** Calculations (future: total order value)

---

## 6. Frontend Architecture: Feature-Based Modules

**Decision:** Organize Angular by feature (auth, catalog)

**Why:**
```
apps/procurement-portal/src/app/
├── auth/
│   ├── store/            (NgRx: actions, reducers, effects, selectors)
│   ├── guards/           (canActivate route guards)
│   ├── services/         (auth.service.ts calls API)
│   └── pages/            (SignInComponent, SignUpComponent)
├── catalog/
│   ├── store/
│   ├── services/
│   └── pages/
├── app.routes.ts         (route definitions)
└── app.config.ts         (global config)
```

- **Scalability:** Easy to lazy-load modules by feature
- **Isolation:** Each feature is self-contained (easy to delete/refactor)
- **Team work:** Different people can work on auth vs catalog without conflicts

---

## 7. Error Handling Strategy

**Backend errors:**
```typescript
throw new UnauthorizedException('Invalid credentials');
throw new ConflictException('Email already exists');
throw new NotFoundException('Item not found');
```
- **Why typed errors:** Frontend gets clear HTTP status (401, 409, 404)
- **Why descriptive messages:** Helps frontend show exact error to user

**Frontend error handling:**
- NgRx effects catch HTTP errors, dispatch error actions
- Error state persists in store for UI display
- Automatic retry logic for network timeouts

**Why centralized?**
- Don't repeat error handling in every component
- Global HTTP interceptor logs all errors
- Can add telemetry later

---

## 8. Authentication Guard Implementation

**Decision:** Angular canActivate guard checks NgRx auth store

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  
  return store.select(selectIsLoggedIn).pipe(
    take(1),
    tap(isLoggedIn => {
      if (!isLoggedIn) router.navigate(['/sign-in']);
    }),
    map(isLoggedIn => isLoggedIn)
  );
};
```

**Why this approach:**
- **Check store first:** No extra API call (token already loaded)
- **Automatic redirect:** If not logged in, go to sign-in
- **Works with refresh:** On page load, effects replay auth state from localStorage
- **Future-proof:** Can add role-based access control later

---

## 9. Why NOT Skip NgRx for This Project

**Common thought:** "This is small, just use RxJS subjects"

**Counter:**
- Auth state is used across many components (sign-in page, navbar, guards)
- Without NgRx, you'd manually manage subscriptions (memory leaks)
- With NgRx, store is single source of truth
- Time to set up NgRx (~30 min) is worth it for maintainability

---

## 10. API Request/Response Pattern

**Decision:** All requests go through NgRx effects (not direct service calls)

```
Component
  ↓ (dispatch action)
Store (effect catches action)
  ↓ (calls service)
AuthService (makes HTTP call)
  ↓ (response received)
Effect (dispatch success/error)
  ↓
Reducer (updates store)
  ↓
Selector (component subscribes)
Displays data
```

**Why this flow:**
- **Debuggable:** Every step logged in Redux devtools
- **Testable:** Effects and reducers are pure functions
- **Error resilient:** Network failure doesn't crash component
- **Cached:** Multiple components can subscribe without duplicate API calls

---

## 11. Shared Types Library Structure

**Decision:** Put User & CatalogItem types in `shared-types`

```
shared-types/src/lib/
├── user.types.ts
├── catalog.types.ts
└── index.ts               (exports all)
```

**Why:**
- Frontend imports: `import { User } from '@procure/shared-types'`
- Backend imports: same package
- Changes to User interface update both automatically
- No version mismatch between frontend/backend

**Why NOT put logic here:**
- Only types and interfaces
- Business logic stays in services (backend or frontend)

---

## 12. 8-Hour Session Expiry: Why This Duration?

**Decision:** JWT expires after 8 hours

**Why:**
- **Standard business day:** User doesn't have to re-login during work hours
- **Security:** Stolen token has limited window of abuse
- **Refresh token:** Could add this later (but not required for MVP)

**Why not 24 hours?**
- Long session = higher risk if token leaked
- Assessment didn't ask for it

**Why not 30 minutes?**
- Too aggressive for a work tool
- Users would get frustrated

---

## 13. Search/Filter Implementation Choice

**Decision:** Client-side filter first (all items fetched, then filtered)

**Why:**
- **MVP simplicity:** No complex query builder on backend
- **UX snappy:** Instant filter (no HTTP round trip)
- **Works offline:** Cached data stays usable

**Future optimization:**
- If catalog grows to 10,000+ items, implement server-side pagination
- Add `.../items?search=widget&skip=0&take=20` endpoint
- That's why we design store to handle pagination state

---

## 14. Loading & Error States: Why Essential

**Decision:** Explicit states in NgRx for loading, success, error

```typescript
interface CatalogState {
  items: CatalogItem[];
  loading: boolean;
  error: string | null;
}
```

**Why:**
- **UX:** User sees spinner while loading (not frozen)
- **Network resilience:** User sees error message if API is down
- **Retry logic:** Can implement retry button easily
- **Empty state:** If items = [] and !loading, show "no items" message

---

## 15. Why Shared Utils are NOT in `shared-types`

**Decision:** Utils stay in each app (frontend utils, backend utils)

**Why:**
- Angular validators ≠ NestJS validators
- Frontend has pipes, directives; backend doesn't
- Different dependencies
- Easier to manage and test individually

**Only exception:** Pure utility functions (date formatting, string sanitization)
- These CAN go in `shared-types` if needed later

---

## Summary of Key Principles

| Principle | Implementation |
|-----------|----------------|
| **DRY (Don't Repeat)** | Shared types in one location |
| **Separation of Concerns** | Each app owns its layer (frontend, backend) |
| **Scalability** | Monorepo allows microservices later |
| **Debuggability** | NgRx devtools trace every action |
| **Testability** | Pure functions (reducers, selectors) |
| **Security** | JWT + httpOnly options, password hashing |
| **UX** | Loading states, error handling, 8-hour session |

---

**Last Updated:** March 21, 2026
