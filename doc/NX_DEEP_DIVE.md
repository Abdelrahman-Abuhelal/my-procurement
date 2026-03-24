# 🏫 Nx Fundamentals (Simple Version)

---

## What is Nx?

**Nx = one tool that manages multiple projects in one folder**

**Without Nx:**
```
frontend/ (separate repo)
backend/  (separate repo)
shared/   (separate repo)
→ Version mismatches, deployment pain
```

**With Nx:**
```
one monorepo/
  ├── apps/
  │   ├── frontend
  │   └── backend
  └── shared-types
→ One command, one cache, one deploy
```

---

## The 3 Key Ideas

### 1. **Project Graph** (Nx Knows What Depends on What)

```
shared-types (library, used by both)
    ↑        ↑
    |        |
frontend    backend
```

**What matters:**
- You change `shared-types` → Nx rebuilds `frontend` and `backend` automatically
- You change only `frontend` → Nx skips rebuilding `backend` (saves time)

**How it works:** Nx reads your `import` statements + `tsconfig.json` + `project.json`

---

### 2. **Targets** (Tasks You Can Run)

Each project has tasks defined in `project.json`:

```bash
nx build procurement-portal     # Build the frontend
nx serve api                    # Run the backend
nx test procurement-portal      # Test the frontend
nx lint                         # Lint everything
```

**That's it.** Same commands work for all projects.

---

### 3. **Caching** (Why Nx is Fast)

```bash
# First time: takes 45 seconds
nx build procurement-portal

# Second time (no changes): takes 0.5 seconds ⚡
nx build procurement-portal

# You change api code, frontend build still cached
nx build procurement-portal → 0.5 seconds ⚡
```

---

## Your Project Structure

```
nx.json                          (global rules)
├── apps/
│   ├── procurement-portal/      (Angular frontend app)
│   │   └── project.json         (defines: build, serve, test, lint targets)
│   └── api/                     (NestJS backend app)
│       └── project.json
└── shared-types/                (TypeScript types library)
    └── project.json             (empty - just exports types)
```

---

## Simple Mental Models

| This | Means |
|------|-------|
| **`nx build procurement-portal`** | One command to build frontend |
| **`nx build`** | Build ALL projects (in right order) |
| **`project.json`** | "What tasks can I run?" |
| **`nx.json`** | "Global rules for all projects" |
| **Project Graph** | "Which projects depend on which" |
| **Cache** | "Remember the result, reuse if nothing changed" |

---

## Try These Commands (1 minute each)

```bash
# See what Nx can do with this project
nx graph

# See dependencies between projects
nx show project shared-types --web

# Build only what changed
nx affected:build --base=master

# Run one task
nx serve procurement-portal
```

---

## That's Nx!

**Remember:**
- Nx understands your projects automatically
- Nx runs tasks in the right order  
- Nx caches results (fast!)
- One monorepo = less pain

**Next:** Let's move to Angular (the frontend framework)
