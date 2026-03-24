# 📝 Git Workflow for This Project

## Goal
Demonstrate professional git practices to the interviewer. Show clear, organized commits with good messages and PR structure.

---

## Commit Strategy

### When to Commit
- ✅ After completing each feature file (schema, DTO, service, etc)
- ✅ After testing that it works
- ✅ NOT every 5 lines of code

### Commit Message Format
Use this structure for clarity:

```
feat(auth): Create user schema with email index

- Added User schema with @nestjs/mongoose
- Email field has unique + lowercase constraints
- Created index on email for fast lookups
- Timestamps (createdAt, updatedAt) auto-added
```

**Prefix meanings:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Restructure code (no logic change)
- `test:` - Adding tests

---

## Commits to Make (For This Project)

### Backend Auth Setup
```
1. feat(auth): Create user schema
2. feat(auth): Create sign-up and sign-in DTOs
3. feat(auth): Create authentication service
4. feat(auth): Create auth controller with endpoints
5. feat(auth): Create auth module with imports
```

### Backend Catalog Setup
```
6. feat(catalog): Create catalog item schema
7. feat(catalog): Create catalog service
8. feat(catalog): Create catalog controller
9. feat(catalog): Create catalog module
```

### Frontend Auth (NgRx)
```
10. feat(auth-store): Create auth state management (actions, reducers)
11. feat(auth-effect): Create auth effects for API calls
12. feat(auth-guard): Create auth guard for route protection
13. feat(auth-ui): Create sign-in and sign-up components
```

### Frontend Catalog
```
14. feat(catalog-store): Create catalog store
15. feat(catalog-ui): Create catalog list component
16. feat(catalog-ui): Create create item form component
```

### Testing & Documentation
```
17. docs(readme): Add setup and deployment instructions
18. test(auth): Add unit tests for auth service
19. test(e2e): Add e2e tests for auth flow
```

---

## Good Commit Examples

### ✅ GOOD (Specific, descriptive)
```
feat(auth): Implement JWT token generation in auth service

- Added JwtService injection to AuthService
- Generate token with userId payload
- Set expiry to 8 hours (28800s)
- Return token with user data on sign-in

Closes #1
```

### ❌ BAD (Too vague)
```
fixed stuff
updated auth
work on login
```

---

## How to Make a Commit

From project root:

```bash
# 1. Check what changed
git status

# 2. Stage changes
git add api/src/app/auth/schemas/user.schema.ts

# OR stage all changes in a folder
git add api/src/app/auth/

# OR stage everything
git add .

# 3. View the diff before committing (optional but good practice)
git diff --cached

# 4. Commit with clear message
git commit -m "feat(auth): Create user schema with email index

- Added User schema with @nestjs/mongoose
- Email field has unique + lowercase constraints
- Created index on email for fast lookups"

# 5. View commit log to verify
git log --oneline -5
```

---

## Branch Strategy (If Using PRs)

### Feature Branch Names
```
feature/auth-module
feature/catalog-crud
feature/frontend-ngrx-auth
feature/testing-and-docs
```

### Example Workflow
```bash
# Create feature branch
git checkout -b feature/auth-module

# Make commits
git commit -m "feat(auth): ..."
git commit -m "feat(auth): ..."

# Push to GitHub
git push origin feature/auth-module

# Create PR on GitHub with:
# Title: "feat(auth): Complete authentication module"
# Description:
# - What was added
# - How to test
# - Related issues
```

---

## PR Template (Professional)

When creating a Pull Request on GitHub:

```markdown
## Description
This PR implements the authentication module for the backend, including:
- User schema with MongoDB integration
- Sign-up and sign-in DTOs with validation
- JWT token generation service
- Authentication endpoints

## Type of Change
- [x] New feature (non-breaking change which adds functionality)
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)

## How Has This Been Tested?
- Tested sign-up endpoint with Postman
- Tested sign-in endpoint with valid/invalid credentials
- Verified JWT token is generated correctly

## Checklist:
- [x] Code follows project style guidelines
- [x] Self-reviewed my own code
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] No new warnings generated
```

---

## Timeline for Commits

**During implementation:**
- Make commits as you complete each logical unit
- Not waiting until everything is done
- Shows incremental progress

**For the interview:**
- Interviewer can see `git log` and understand your workflow
- Shows you know professional git practices
- Demonstrates clean, organized development

---

## Quick Commit Checklist

Before each commit, ask:
- ✅ Does this commit do ONE thing?
- ✅ Is the message clear and descriptive?
- ✅ Does it follow `feat/fix/docs/refactor` format?
- ✅ Have I tested this works?
- ✅ Is the code formatted properly?

---

## Commands You'll Use Often

```bash
# See what's changed
git status

# See changes in detail
git diff

# Check commit history
git log --oneline

# Ammend last commit (if you forgot something)
git commit --amend --no-edit

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See who changed what in a file
git blame api/src/app/auth/auth.service.ts
```

---

**Start making commits as we complete each file!** 🚀
