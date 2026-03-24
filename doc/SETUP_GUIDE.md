# 🛠️ Setup Guide: Tools & Environment

**Goal:** Get your machine ready to build the Procurement Portal  
**Approach:** Hands-on implementation with guidance

---

## Required Tools & Services

### 1. **Node.js & npm**
**What:** Runtime to run JavaScript/TypeScript code  
**Install:**
```bash
# Download from https://nodejs.org
# Choose LTS version (Latest Stable)
# Verify installation:
node --version
npm --version
```

**Why needed:**
- NestJS runs on Node.js
- npm installs packages
- Your project already has it (check if `node` command works)

**Status:** ✅ Likely already installed

---

### 2. **MongoDB (Local or Cloud)**

**Option A: MongoDB Atlas (Cloud) - RECOMMENDED FOR THIS PROJECT**
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a cluster (free tier)
4. Get connection string: mongodb+srv://username:password@cluster.mongodb.net/database
5. Add to .env file (see below)
```

**Option B: MongoDB Community (Local)**
```bash
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: apt-get install mongodb

# Start MongoDB
mongod

# Verify:
mongo --version
```

**Why needed:**
- Backend needs database to store users and items
- Atlas = no installation hassle, accessible anywhere
- Local = works offline, but need to maintain it

**Recommendation:** Use **Atlas** (easier for cloud deployment later)

---

### 3. **Postman (API Testing)**
```
Download: https://www.postman.com/downloads/
Platform: Windows/Mac/Linux

OR use free web version: https://web.postman.com
```

**Why needed:**
- Test API endpoints before frontend is ready
- Send POST /auth/signin requests manually
- Check responses, status codes, errors

**What you'll do:**
```
1. Create request: POST localhost:3000/auth/signin
2. Add body: { "email": "test@example.com", "password": "123456" }
3. Send → See response
4. No need to build frontend first
```

---

### 4. **.env File (Environment Variables)**

**Create file:** `api/.env`
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/procurement

JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=8h

PORT=3000
NODE_ENV=development
```

**Why needed:**
- Store sensitive data (database password, JWT secret)
- Different values for dev/prod
- Never commit `.env` to git

**How to fill it:**
1. Get `MONGO_URI` from MongoDB Atlas connection string
2. Create random `JWT_SECRET` (just make it long and random)
3. Leave `PORT=3000` as is

---

### 5. **Docker (Optional but Recommended)**

**Install:**
```bash
# Download from https://www.docker.com/products/docker-desktop
# Includes Docker + Docker Compose

# Verify:
docker --version
docker-compose --version
```

**Why needed:**
- Run MongoDB in a container (no installation needed)
- Same environment on all machines
- Easy deployment to production

**For now:** You can skip this and use MongoDB Atlas instead
**Later:** Use for deployment to GCP

---

### 6. **VS Code Extensions (Nice to Have)**

**Recommended:**
- **Rest Client** (hugooodts) - Test API in VS Code (instead of Postman)
- **MongoDB for VS Code** (MongoDB) - View MongoDB collections
- **SQLite** (alexcvzz) - View local databases
- **Thunder Client** - API testing alternative

**Install:**
```
Open VS Code → Extensions (Ctrl+Shift+X) → Search → Install
```

---

### 7. **Git (Version Control)**

**Check if installed:**
```bash
git --version
```

**If not, install:**
```bash
# https://git-scm.com/downloads
```

**Why needed:**
- Track code changes
- Push to GitHub (requirement)
- Revert mistakes

---

## Quick Setup Checklist

### Before Starting Implementation

```
☐ Node.js installed (check: node --version)
☐ Npm works (check: npm --version)
☐ Nx workspace set up (already done for you)
☐ MongoDB Atlas account (or local MongoDB running)
☐ .env file created at api/.env with MONGO_URI, JWT_SECRET
☐ Port 3000 available (not used by another app)
☐ Postman installed or browser open to https://web.postman.com
☐ Git installed (check: git --version)
```

---

## Environment Variables Setup

**Step by step for .env:**

### 1. Create the file
```bash
cd api
touch .env
```

### 2. Add MongoDB Atlas connection

```bash
# Get from MongoDB Atlas:
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Click "Databases" → "Connect"
# 3. Choose "Drivers" → "Node.js"
# 4. Copy connection string
# 5. Replace <username> and <password>

MONGO_URI=mongodb+srv://abdel:myPassword123@cluster.mongodb.net/procurement
```

### 3. Add JWT Secret

```bash
# Make up a long random string (or use this for now, change later)
JWT_SECRET=my-super-secret-jwt-key-12345-change-this-in-production
JWT_EXPIRES_IN=8h
```

### 4. Add Server Config

```bash
PORT=3000
NODE_ENV=development
```

### Full .env file:
```
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/procurement
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRES_IN=8h
PORT=3000
NODE_ENV=development
```

---

## Verification: Is Everything Ready?

### Test Node.js
```bash
node --version
npm --version
```

### Test Nx
```bash
nx --version
```

### Test MongoDB connection (optional, but good to check)
```bash
# If using Atlas, just verify the connection string is correct
# You'll know it works when the app runs

# If using local MongoDB:
mongo
# Should open MongoDB shell
```

### Test Postman
```
Open Postman → Create new request
You should see the interface ready
```

---

## Common Issues & Solutions

### Issue: "Port 3000 already in use"
```bash
# Find what's using port 3000
lsof -i :3000  (Mac/Linux)
netstat -ano | findstr :3000  (Windows)

# Kill the process or use different port
# Change PORT in .env to 3001
```

### Issue: "Cannot connect to MongoDB"
```bash
# Check connection string in .env
# Make sure IP is whitelisted in MongoDB Atlas (Settings → Network Access)
# Try: mongodb+srv://user:pass@cluster.mongodb.net/database (with /database at end)
```

### Issue: "JWT_SECRET undefined"
```bash
# Make sure .env file is in api/ folder
# Make sure you're running from root: nx serve api
# Restart server after adding .env
```

---

## Next Steps

Once you have all tools set up:

### You will implement:
1. **Backend Auth Module** (following my guidance)
   - Auth service with sign-up/sign-in
   - JWT token generation
   - Password hashing
   - MongoDB schemas
   - API endpoints

2. **Backend Catalog Module**
   - CatalogItem schema
   - CRUD endpoints
   - Search/filter queries

3. **Frontend Auth** (NgRx + Components)
4. **Frontend Catalog** (NgRx + Components)
5. **Testing & Polish**

---

## Time Estimate

| Task | Time |
|------|------|
| Setup (this document) | 30 min |
| Backend Auth | 1.5 hours |
| Backend Catalog | 1 hour |
| Frontend Auth + NgRx | 1.5 hours |
| Frontend Catalog | 1 hour |
| Testing + Polish | 1 hour |
| **Total** | **~6-7 hours** |

---

**Ready to start? Complete the setup checklist above, then let's begin with Backend Auth Module!**
