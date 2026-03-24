# ❓ Questions & Answers During Implementation

**Purpose:** Record all questions you ask + my answers (for reference later)  
**This file will grow as we work together**

---

## How to Use This File

As you implement:
1. **You encounter a question** → Ask me
2. **I answer it** → Gets added to this file
3. **Reference later** → Come back to this Q&A anytime
4. **Learning record** → Shows what you learned and why

---

## Q&A Template

```markdown
### Q: [Your Question Here]
**Context:** [What you were doing when you asked]  
**Answer:**
[My detailed answer]

**Why this matters:**
[Explanation of the concept]

**Example:**
[Code example if needed]
```

---

## Your Questions Will Go Here

### Q2: MongoDB Cloud Connection - Connection String Format & DNS Issues
**Context:** Connection kept failing with `ECONNREFUSED querySrv` error, then worked after DNS flush  
**Answer:**
The issue was twofold:
1. **Missing database name** - Connection string needs format: `mongodb+srv://user:pass@cluster/database` (not just without the database name)
2. **DNS caching** - Windows was caching old DNS records. Solution: `ipconfig /flushdns` then restart terminal/VS Code

**Real solution for MongoDB cloud:**
- Make sure IP is whitelisted (Network Access in Atlas: add 0.0.0.0/0 for dev)
- Use correct format: `mongodb+srv://ahilal:test1234@procurement.alcpyzj.mongodb.net/?appName=procurement`
- Test with Node.js test file (not just VS Code extension)
- If still fails, flush DNS and restart

**Why this matters:**
- MongoDB Atlas connections require DNS resolution
- Windows sometimes caches DNS - flushing helps
- Testing with actual Node.js code reveals real issues faster than VS Code extension

**How to verify it works:**
```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);
await client.connect();
await client.db("admin").command({ ping: 1 });
console.log("✅ Connected!");
```

**Key learning:** Always test with actual code, not just tools. The extension was hiding the real problem.

---

## Useful Links (Add as we go)

- [NestJS Docs](https://docs.nestjs.com)
- [Angular Docs](https://angular.io/docs)
- [NgRx Docs](https://ngrx.io/docs)
- [Mongoose Docs](https://mongoosejs.com)
- [MongoDB Query Docs](https://docs.mongodb.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

## Topics Covered in Q&A

( Will be updated as questions come up )

- Setup & Environment
- NestJS Concepts
- MongoDB Queries
- Angular Components
- NgRx Implementation
- Debugging & Errors
- Best Practices
- Performance Optimization

---

**Last Updated:** March 23, 2026  
**Questions So Far:** 0
