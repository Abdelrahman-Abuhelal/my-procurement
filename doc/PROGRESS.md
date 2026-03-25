# Project Progress & Implementation Journal

**Project:** Mini Procurement Portal (Catalog Management)  
**Stack:** Nx + Angular + NgRx + NestJS + MongoDB  
**Deadline:** March 29, 2026  
**Time Budget:** 6-8 hours (max 10)

---

## ✅ Completed Steps

### Step 1: Nx Architecture Understanding & Workspace Analysis
**Date:** March 21, 2026  
**Status:** ✓ Complete

**What we did:**
- Analyzed the existing Nx monorepo structure
- Identified key folders: `apps/procurement-portal` (frontend), `api` (backend), `shared-types` (types library), and e2e tests

**Why we did it:**
- You're new to Nx and needed to understand the monorepo architecture before building features
- Understanding project layout is critical for organizing new code correctly
- Prevents mixing concerns and ensures scalability

**Key findings:**
- `procurement-portal`: Angular app (frontend)
- `api`: NestJS app (backend)
- `shared-types`: Shared DTOs/types between frontend and backend
- Each project has its own `project.json` (Nx config) and `tsconfig`

**Next action:** Establish the foundation for the new features

---

### Step 2: Project Documentation Folder Setup
**Date:** March 21, 2026  
**Status:** ✓ Complete

**What we did:**
- Created `/doc` folder at root of procurement-portal
- Designated location for all theoretical notes, assumptions, and final recording summaries

**Why we did it:**
- Requirement from technical assessment: README must include assumptions and setup instructions
- Separates documentation from code (cleaner structure)
- Allows you to link practical implementation with theoretical understanding

**Folder structure:**
```
doc/
├── PROGRESS.md           (this file - tracks everything we do)
├── TECHNICAL_NOTES.md    (explains architectural decisions & why)
├── SETUP_GUIDE.md        (final setup instructions)
└── ASSUMPTIONS.md        (project assumptions & constraints)
```

**Next action:** Start implementing features - authentication layer first

---

## 🎓 Learning Sessions (Deep Understanding First)

### Step 3: Nx Architecture Deep Dive ✅ DONE
**Duration:** ~45 minutes
**Status:** Complete

**What we did:**
- Simplified Nx explanation (project graph, targets, caching)
- Showed your actual `nx.json` and `project.json` files
- Learned build caching + dependency order
- Provided practice commands

**File:** [doc/NX_DEEP_DIVE.md](NX_DEEP_DIVE.md)

**Key takeaways:**
- Nx runs tasks in right order automatically
- Caching speeds up rebuilds (0.5s vs 45s)
- Project graph = smart dependency tracking

---

### Step 4: Angular Fundamentals ✅ DONE
**Duration:** ~45 minutes
**Status:** Complete

**What we covered:**
- Components (template + logic)
- Services (shared logic + DI)
- Data flow (parent ↔ child with @Input/@Output)
- Observables + RxJS (async data streams)
- Routing + guards (navigation + protection)
- Forms (template-driven vs reactive)
- HTTP requests (API calls)
- Lifecycle hooks (ngOnInit, ngOnDestroy)

**File:** [doc/ANGULAR_DEEP_DIVE.md](ANGULAR_DEEP_DIVE.md)

**Key takeaway:**
- Angular = component-based framework
- Services = where logic lives
- Observables = async data handling
- Guards = route protection

---

### Step 5: NgRx State Management ✅ DONE
**Duration:** ~45 minutes
**Status:** Complete

**What we covered:**
- Problem: state scattered across services
- Solution: NgRx (centralized store)
- Actions (things that happen)
- Effects (async + API calls)
- Reducers (pure functions, update state)
- Selectors (read from store, memoized)
- Complete auth + catalog flows
- Redux DevTools (time-travel debugging)
- File structure (how to organize in project)

**File:** [doc/NGRX_DEEP_DIVE.md](NGRX_DEEP_DIVE.md)

**Key takeaway:**
- NgRx = single store, everything in one place
- Components dispatch actions
- Effects handle async
- Reducers update state
- Components subscribe to selectors

---

### Step 6: NestJS Backend ✅ DONE
**Duration:** ~45 minutes
**Status:** Complete

**What we covered:**
- Controllers (HTTP routes)
- Services (business logic)
- Dependency injection (DI)
- Modules (organize code)
- Guards (protection/middleware)
- DTOs (validate input)
- Error handling (typed exceptions)
- MongoDB integration with Mongoose
- Complete auth flow
- Catalog endpoints
- Environment variables

**File:** [doc/NESTJS_DEEP_DIVE.md](NESTJS_DEEP_DIVE.md)

**Key takeaway:**
- NestJS = framework for building secure, organized APIs
- Request flow: Controller → Service → Database
- Guards protect routes (check JWT)
- DTOs validate all incoming data

---

### Step 7: MongoDB Database Design ✅ DONE
**Duration:** ~45 minutes
**Status:** Complete

**What we covered:**
- MongoDB vs SQL (NoSQL flexibility)
- Collections + Documents (like tables + rows)
- User schema (with unique index on email)
- CatalogItem schema (with reference to User)
- Relationships (one-to-many: User creates many items)
- Indexing (speed up queries)
- Common queries (find, create, search)
- MongoDB Atlas (cloud database)
- Mongoose connection to NestJS

**File:** [doc/MONGODB_DEEP_DIVE.md](MONGODB_DEEP_DIVE.md)

**Key takeaway:**
- MongoDB stores JSON-like documents
- Use references for relationships (store ID, not full data)
- Indexes speed up queries (especially email lookups)
- Mongoose is the bridge between Node.js and MongoDB

---

## 🎯 LEARNING PHASE COMPLETE! ✅

**All 5 core technologies understood:**
1. ✅ Nx (monorepo orchestration)
2. ✅ Angular (frontend framework)
3. ✅ NgRx (state management)
4. ✅ NestJS (backend framework)
5. ✅ MongoDB (database design)

---

## 🚀 IMPLEMENTATION PHASE NOW

### Step 8: Backend Setup - Authentication Module (NestJS)

**Progress update:**
- Re-created the NestJS backend in the Nx `apps/api` layout
- Migrated sign-up and sign-in auth flow into the new app
- Added global validation pipe and CORS
- Added protected `GET /auth/me` endpoint using JWT guard + strategy
- Verified `signup`, `signin`, and `me` using Postman

**JWT learning outcome:**
- Understood why protected API routes are required by the assessment
- Learned the full JWT flow:
  `signin -> token -> Authorization header -> guard -> strategy -> req.user -> controller -> service`

---

## 📋 Future Learning Sessions (Planned)

### Step 4: Angular + TypeScript Fundamentals
**Priority:** High
**Estimated time:** 1+ hour

**Topics:**
- Component lifecycle (why it matters)
- RxJS observables (what they are, not just syntax)
- Dependency injection (how Angular manages instances)
- Lazy loading (why it's important for performance)

**File:** `doc/ANGULAR_DEEP_DIVE.md` (to be created)

---

### Step 5: NgRx State Management
**Priority:** High
**Estimated time:** 1+ hour

**Topics:**
- Actions (why we dispatch them)
- Reducers (pure functions explained)
- Effects (async side effects)
- Selectors (memoization & performance)
- DevTools integration (debugging)

**File:** `doc/NGRX_DEEP_DIVE.md` (to be created)

---

### Step 6: NestJS Backend Concepts
**Priority:** High
**Estimated time:** 1+ hour

**Topics:**
- Controllers & routes
- Services & dependency injection
- Guards & middleware
- MongoDB integration with Mongoose
- JWT authentication flow

**File:** `doc/NESTJS_DEEP_DIVE.md` (to be created)

---

### Step 7: MongoDB & Data Modeling
**Priority:** High
**Estimated time:** 45 minutes

**Topics:**
- Schemas vs SQL (conceptual differences)
- ObjectId + references
- Indexing (why it matters)
- Relationship design (User → CatalogItem)

**File:** `doc/MONGODB_DEEP_DIVE.md` (to be created)

---

## 📋 THEN: Implementation Steps (After Learning)

### Step 8: Backend Setup - Authentication Module (NestJS)
**Priority:** Critical (blocks everything)
**Estimated time:** 1.5-2 hours

**Plan:**
- Create NestJS auth service with JWT
- Implement POST /auth/signup & /auth/signin endpoints
- Add password hashing (bcrypt)
- Create User schema in MongoDB

**Why first:**
- Frontend cannot test without working backend auth
- All other endpoints require authentication guard

---

### Step 4: Frontend Setup - Auth Module (Angular + NgRx)
**Priority:** Critical
**Estimated time:** 1.5-2 hours

**Plan:**
- Create NgRx authentication store (actions, reducers, effects)
- Build sign-in/sign-up forms
- Implement auth guard for protected routes
- Setup localStorage for token persistence (8-hour session)

**Why this order:**
- Once backend auth works, frontend can consume it
- NgRx store centralizes auth state across app

---

### Step 5: Catalog Item Features (Backend + Frontend)
**Priority:** High
**Estimated time:** 2-3 hours

**Plan:**
- Backend: Create CatalogItem schema, GET /items, POST /items endpoints
- Frontend: Create catalog page with list, search/filter, loading/error states
- Connect to NgRx store for state management
- Implement auto-update after item creation

---

### Step 6: Protected Routes & Error Handling
**Priority:** High
**Estimated time:** 1 hour

**Plan:**
- Setup Angular route guards
- Handle 401/403 errors globally
- Redirect unauthenticated users to sign-in

---

### Step 7: Testing & Final Polish
**Priority:** Medium
**Estimated time:** 1 hour

**Plan:**
- Basic unit tests for auth service & store
- E2E test workflow (sign-up → sign-in → create item → see in list)
- Create README with setup + environment variables

---

## ⚙️ Technical Decisions & Why

See [TECHNICAL_NOTES.md](TECHNICAL_NOTES.md) for detailed rationale on:
- Why NgRx for state management
- Why JWT for authentication
- Why shared-types library
- Why 8-hour session expiry
- Database design decisions

---

## 🚀 Quick Reference Commands

```bash
# Serve frontend
nx serve procurement-portal

# Serve backend API
nx serve api

# Run tests
nx test procurement-portal
nx test api

# View dependency graph
nx graph

# Lint
nx lint
```

---

## 📌 Important Notes

- **Session tracking:** Lives in this file and TECHNICAL_NOTES.md
- **Code organization:** Follow Nx conventions (each project owns its domain)
- **Shared code:** Only put in `shared-types` library
- **Time tracking:** Update elapsed time in each step

---

**Last Updated:** March 21, 2026  
**Next Review:** Before Step 3 (Backend Auth)
