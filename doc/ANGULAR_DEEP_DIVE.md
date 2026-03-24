# 🏫 Angular Fundamentals (Simple Version)

---

## What is Angular?

**Angular = a framework for building web applications (frontend)**

It gives you:
- **Components** (reusable UI pieces)
- **Services** (shared logic)
- **Dependency Injection** (manage instances automatically)
- **RxJS** (handle async data)
- **Routes** (page navigation)

**Simple example:**
```typescript
// A component is just a class + template
@Component({
  selector: 'app-sign-in',
  template: `<form><input/><button>Sign In</button></form>`
})
export class SignInComponent {
  onSubmit() { /* handle form */ }
}
```

---

## Component = Template + Logic + Styling

**A component has 3 parts:**

```typescript
@Component({
  selector: 'app-user-card',           // HTML tag name: <app-user-card></app-user-card>
  template: `                          // HTML
    <div>{{ user.name }}</div>
    <button (click)="deleteUser()">Delete</button>
  `,
  styles: [`div { color: blue; }`]    // CSS
})
export class UserCardComponent {
  @Input() user: User;                // Input from parent
  @Output() deleted = new EventEmitter(); // Output to parent
  
  deleteUser() {
    this.deleted.emit(this.user.id);  // Tell parent something happened
  }
}
```

**Using the component:**
```html
<app-user-card 
  [user]="currentUser"
  (deleted)="onUserDeleted($event)">
</app-user-card>
```

---

## Data Flow: Parent → Child → Parent

**Parent has data:**
```typescript
export class CatalogComponent {
  items = [{ id: 1, title: 'Widget' }];
  
  onItemDeleted(itemId) {
    this.items = this.items.filter(i => i.id !== itemId);
  }
}
```

**Parent template:**
```html
<app-item-card 
  *ngFor="let item of items"
  [item]="item"
  (itemDeleted)="onItemDeleted($event)">
</app-item-card>
```

**Child component:**
```typescript
export class ItemCardComponent {
  @Input() item;
  @Output() itemDeleted = new EventEmitter();
  
  delete() {
    this.itemDeleted.emit(this.item.id);
  }
}
```

**Flow:**
```
Parent has items → passes to Child via [item]
Child deletes → emits itemDeleted event with id
Parent receives event → updates items array
```

---

## Services = Shared Logic

**A service is just a class with methods:**

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}
  
  signIn(email, password) {
    return this.http.post('/auth/signin', { email, password });
  }
  
  getUser() {
    return this.http.get('/auth/me');
  }
}
```

**Use in component:**
```typescript
export class SignInComponent {
  constructor(private auth: AuthService) {}
  
  onSubmit(email, password) {
    this.auth.signIn(email, password).subscribe(
      (response) => console.log('Logged in!'),
      (error) => console.log('Error:', error)
    );
  }
}
```

**Key idea:** Service is shared, so multiple components use the same instance (one data source).

---

## Observables (with RxJS)

**Observable = a stream of data that arrives over time**

**Regular function (synchronous):**
```typescript
function getData() {
  return "Hello";               // Returns immediately
}
const result = getData();        // result = "Hello"
```

**Observable (asynchronous):**
```typescript
function getData() {
  return this.http.get('/api/data');  // Returns Observable
}

// Subscribe to get data when it arrives
getData().subscribe(
  (data) => console.log(data),        // When data arrives
  (error) => console.log(error),      // If error happens
  () => console.log('Done')           // When finished
);
```

**Real example: Sign-in**
```typescript
signIn(email, password) {
  // API call returns Observable
  return this.auth.signIn(email, password).subscribe(
    (response) => {
      // Now we have response
      localStorage.setItem('token', response.token);
      this.router.navigate(['/catalog']);
    },
    (error) => {
      console.log('Invalid credentials');
    }
  );
}
```

---

## Dependency Injection (DI)

**Problem without DI:**
```typescript
export class CatalogComponent {
  private authService = new AuthService();  // Hard to test, tightly coupled
}
```

**Solution WITH DI:**
```typescript
export class CatalogComponent {
  constructor(private authService: AuthService) {}  // Angular provides it
}
```

**Why?**
- Easier to test (inject mock AuthService)
- Loosely coupled
- One instance shared across app

**How it works:**
```typescript
// Module tells Angular "when someone needs AuthService, create it once and reuse"
@NgModule({
  providers: [AuthService]
})
export class AppModule {}

// Now any component requesting AuthService gets the same instance
constructor(private auth: AuthService) {} // ← Angular injects it
```

---

## Routing = Navigate Between Pages

**Routes are defined:**
```typescript
export const routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: '**', component: NotFoundComponent },  // Catch-all (404)
];
```

**Navigate in component:**
```typescript
constructor(private router: Router) {}

signIn() {
  this.router.navigate(['/catalog']);  // Go to /catalog
}
```

**Render routed component:**
```html
<router-outlet></router-outlet>  <!-- Component renders here -->
```

**Link in template:**
```html
<a routerLink="/catalog">View Catalog</a>
```

---

## Route Guards = Protect Routes

**Problem:** Anyone can go to `/catalog` by typing the URL

**Solution: Auth Guard**
```typescript
@Injectable()
export class AuthGuard {
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate() {
    if (this.auth.isLoggedIn()) {
      return true;  // Allow access
    }
    this.router.navigate(['/sign-in']);  // Redirect to sign-in
    return false;   // Block access
  }
}
```

**Protect route:**
```typescript
export const routes = [
  { path: 'catalog', component: CatalogComponent, canActivate: [AuthGuard] },
];
```

---

## Directives = Reusable Behavior

**Built-in directives:**

```html
<!-- If -->
<div *ngIf="isLoggedIn">Welcome!</div>

<!-- For loop -->
<div *ngFor="let item of items">{{ item.name }}</div>

<!-- Class binding -->
<div [class.active]="isActive">Item</div>

<!-- Style binding -->
<div [style.color]="isError ? 'red' : 'green'">Status</div>

<!-- Click handler -->
<button (click)="onDelete()">Delete</button>

<!-- Two-way binding (form input) -->
<input [(ngModel)]="userEmail"/>
```

---

## Angular File Structure (In Your Project)

```
apps/procurement-portal/src/
├── main.ts                    // Entry point
├── app/
│   ├── app.ts                // Root component
│   ├── app.routes.ts         // Routes
│   ├── app.config.ts         // Global config
│   ├── auth/
│   │   ├── sign-in/
│   │   │   ├── sign-in.component.ts
│   │   │   ├── sign-in.component.html
│   │   │   └── sign-in.component.scss
│   │   └── auth.service.ts
│   └── catalog/
│       ├── catalog/
│       │   ├── catalog.component.ts
│       │   └── catalog.component.html
│       └── catalog.service.ts
└── styles.scss               // Global styles
```

**Convention:**
- One feature = one folder (auth, catalog)
- Each component = own folder with .ts, .html, .scss
- Services = in same folder as components that use them

---

## Lifecycle Hooks (Component Lifecycle)

**Component goes through these stages:**

```typescript
export class MyComponent implements OnInit, OnDestroy {
  
  ngOnInit() {
    // 1. Called when component is created
    // Load data from API here
  }
  
  ngAfterViewInit() {
    // 2. Called after component template is rendered
    // Access DOM elements here
  }
  
  ngOnDestroy() {
    // 3. Called when component is destroyed
    // Cleanup subscriptions, timers, etc.
  }
}
```

**Why OnInit?**
```typescript
// ❌ DON'T load data in constructor
constructor(private api: ApiService) {
  const items = this.api.getItems(); // ← Broken! Not ready yet
}

// ✅ DO load data in ngOnInit
ngOnInit() {
  this.api.getItems().subscribe(items => {
    this.items = items;
  });
}
```

---

## Forms in Angular

**Two ways to build forms:**

### Template-driven (simple)
```html
<form (ngSubmit)="onSubmit()">
  <input [(ngModel)]="email" name="email"/>
  <input [(ngModel)]="password" name="password" type="password"/>
  <button type="submit">Sign In</button>
</form>
```

```typescript
export class SignInComponent {
  email = '';
  password = '';
  
  onSubmit() {
    this.auth.signIn(this.email, this.password).subscribe(...);
  }
}
```

### Reactive (structured, better for complex forms)
```typescript
export class SignInComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  
  onSubmit() {
    const { email, password } = this.form.value;
    this.auth.signIn(email, password).subscribe(...);
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="email"/>
  <input formControlName="password" type="password"/>
  <button type="submit">Sign In</button>
</form>
```

---

## HTTP Requests

**Make API calls:**

```typescript
@Injectable()
export class CatalogService {
  constructor(private http: HttpClient) {}
  
  // GET /items
  getItems() {
    return this.http.get<CatalogItem[]>('/items');
  }
  
  // POST /items
  createItem(item: CreateItemDto) {
    return this.http.post<CatalogItem>('/items', item);
  }
  
  // DELETE /items/:id
  deleteItem(id: string) {
    return this.http.delete(`/items/${id}`);
  }
}
```

**Use in component:**
```typescript
export class CatalogComponent {
  items: CatalogItem[] = [];
  loading = true;
  error = null;
  
  constructor(private catalog: CatalogService) {}
  
  ngOnInit() {
    this.catalog.getItems().subscribe(
      (data) => {
        this.items = data;
        this.loading = false;
      },
      (err) => {
        this.error = err.message;
        this.loading = false;
      }
    );
  }
}
```

**Template:**
```html
<div *ngIf="loading">Loading...</div>
<div *ngIf="error" class="error">{{ error }}</div>
<div *ngIf="!loading && items.length === 0">No items</div>

<div *ngFor="let item of items">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</div>
```

---

## Key Concepts at a Glance

| Concept | What | Example |
|---------|------|---------|
| **Component** | UI + Logic | SignInComponent |
| **Service** | Shared logic | AuthService |
| **Observable** | Async data stream | http.get() |
| **DI** | Angular creates instances | `constructor(private auth: AuthService)` |
| **Route** | URL → Component | `/catalog` → CatalogComponent |
| **Guard** | Protect routes | AuthGuard prevents unauthorized access |
| **Directive** | Reusable behavior | `*ngIf`, `*ngFor` |
| **Form** | Collect user input | SignInComponent form |
| **Lifecycle** | Component stages | ngOnInit, ngOnDestroy |

---

## Common Patterns You'll Use

### 1. Load data on page open
```typescript
ngOnInit() {
  this.service.getData().subscribe(data => this.data = data);
}
```

### 2. Handle form submission
```typescript
onSubmit() {
  this.service.createItem(this.form.value).subscribe(
    () => this.router.navigate(['/'])
  );
}
```

### 3. Show loading/error states
```typescript
ngOnInit() {
  this.loading = true;
  this.service.getData().subscribe(
    data => this.data = data,
    error => this.error = error,
    () => this.loading = false
  );
}
```

### 4. Redirect if not authenticated
```typescript
@Injectable()
export class AuthGuard implements CanActivateFn {
  canActivate() {
    return this.auth.isLoggedIn() || this.router.navigate(['/sign-in']);
  }
}
```

---

## That's Angular!

**Remember:**
- Components = reusable pieces
- Services = shared logic
- Observables = async data
- Routes = navigation
- Guards = protection
- DI = automatic instance management

**Next:** NgRx (managing state across components)
