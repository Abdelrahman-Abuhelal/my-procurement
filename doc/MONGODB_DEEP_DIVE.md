# 🏫 MongoDB & Data Modeling (Simple Version)

---

## What is MongoDB?

**MongoDB = NoSQL database (stores JSON-like documents)**

**SQL vs MongoDB:**

| SQL | MongoDB |
|-----|---------|
| Tables | Collections |
| Rows | Documents |
| Columns | Fields |
| Relationships | References |

**Example:**

**SQL:**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password_hash VARCHAR(255)
);

INSERT INTO users VALUES (1, 'John', 'john@email.com', 'hashed...');
```

**MongoDB:**
```json
{
  "_id": ObjectId("123abc..."),
  "name": "John",
  "email": "john@email.com",
  "passwordHash": "hashed...",
  "createdAt": ISODate("2026-03-23")
}
```

---

## MongoDB Collections (Like Tables)

**Your project needs 2 collections:**

### 1. Users Collection

```typescript
// user.schema.ts
@Schema({ timestamps: true })
export class User {
  
  @Prop({ type: String, auto: true })
  _id: ObjectId;
  
  @Prop({ required: true })
  name: string;
  
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;
  
  @Prop({ required: true })
  passwordHash: string;
  
  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

**What this means:**
- `_id` = auto-generated unique identifier
- `email` = unique (no two users with same email)
- `lowercase: true` = store emails in lowercase (prevents duplicates)
- `timestamps: true` = auto add `createdAt` and `updatedAt`

**Indexes (speed up queries):**
```typescript
UserSchema.index({ email: 1 });  // Speed up "find by email" queries
```

### 2. CatalogItems Collection

```typescript
// catalog-item.schema.ts
@Schema({ timestamps: true })
export class CatalogItem {
  
  @Prop({ type: String, auto: true })
  _id: ObjectId;
  
  @Prop({ required: true })
  title: string;
  
  @Prop({ required: true })
  description: string;
  
  @Prop({ required: true })
  category: string;
  
  @Prop({ required: true, type: Number })
  price: number;
  
  @Prop({ required: true, type: String })
  createdBy: ObjectId;  // Reference to User._id
  
  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CatalogItemSchema = SchemaFactory.createForClass(CatalogItem);
CatalogItemSchema.index({ createdBy: 1 });  // Speed up "items by user" queries
```

---

## MongoDB vs SQL: Key Differences

### 1. No Schema Enforcement

**SQL (strict):**
```sql
-- Must add column for new feature
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
-- Must update all records
```

**MongoDB (flexible):**
```javascript
// Just add to document, no migration needed
db.users.updateOne(
  { _id: 123 },
  { $set: { phone: "555-1234" } }
);
// Old documents don't have phone, that's OK
```

### 2. Embedded vs Referenced Data

**Embedded (put data inside):**
```javascript
{
  _id: 123,
  name: "Order #1",
  items: [
    { title: "Widget", price: 10 },
    { title: "Gadget", price: 20 }
  ]  // ← Items embedded inside
}
```

**Referenced (store ID, lookup separately):**
```javascript
// orders collection
{
  _id: 123,
  name: "Order #1",
  itemIds: [456, 789]  // ← Just store IDs
}

// items collection
{
  _id: 456,
  title: "Widget",
  price: 10
}
```

**Your project uses References:**
```typescript
// CatalogItem has createdBy: ObjectId (reference to User)
{
  _id: "item-123",
  title: "Widget",
  createdBy: "user-456"  // ← ID only, not full user data
}

// To get user, do separate lookup:
const item = await catalogModel.findById("item-123");
const user = await userModel.findById(item.createdBy);
```

---

## Query Examples

### Find user by email
```typescript
const user = await this.userModel.findOne({ email: "john@example.com" });
```

### Update password hash
```typescript
await this.userModel.updateOne(
  { _id: userId },
  { passwordHash: newHash }
);
```

### Create new item
```typescript
const item = new this.catalogModel({
  title: "Widget",
  description: "A cool widget",
  category: "Tools",
  price: 29.99,
  createdBy: userId
});
await item.save();
```

### Get all items created by user
```typescript
const items = await this.catalogModel.find({ createdBy: userId });
```

### Get all items with pagination
```typescript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const items = await this.catalogModel
  .find()
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });  // Latest first
```

### Search items by title
```typescript
const results = await this.catalogModel.find({
  title: { $regex: searchTerm, $options: "i" }  // case-insensitive
});
```

---

## Relationships in MongoDB

### One-to-Many (User creates many CatalogItems)

```
User (one)
  ↓
CatalogItem (many)
```

**In database:**
```javascript
// User
{ _id: "user-1", name: "John" }

// CatalogItems
{ _id: "item-1", title: "Widget", createdBy: "user-1" }
{ _id: "item-2", title: "Gadget", createdBy: "user-1" }
{ _id: "item-3", title: "Doohickey", createdBy: "user-2" }
```

**Query: Get all items by user-1**
```typescript
const items = await catalogModel.find({ createdBy: "user-1" });
// Returns item-1 and item-2
```

---

## Indexing (Performance)

**Without index (slow):**
```
To find user by email:
- Scan ALL 1,000,000 users (slow!)
```

**With index (fast):**
```
To find user by email:
- Use index, jump directly to email (instant!)
```

**Create index:**
```typescript
UserSchema.index({ email: 1 });
CatalogItemSchema.index({ createdBy: 1 });
CatalogItemSchema.index({ category: 1 });
```

---

## Connection to NestJS

### 1. Define Schema
```typescript
@Schema()
export class User { ... }
```

### 2. Register in Module
```typescript
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: CatalogItem.name, schema: CatalogItemSchema }
    ])
  ]
})
export class AppModule {}
```

### 3. Inject in Service
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}
  
  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
```

---

## Your Database Design

```typescript
// ============= User =============
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  passwordHash: string,
  createdAt: Date,
  updatedAt: Date
}

// ============= CatalogItem =============
{
  _id: ObjectId,
  title: string,
  description: string,
  category: string,
  price: number,
  createdBy: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

**Relationships:**
```
User.createdAt → When user signed up
CatalogItem.createdBy → Which user created this item
CatalogItem.createdAt → When item was created
```

---

## MongoDB Atlas (Cloud)

**Instead of local database, use cloud:**

```
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Get connection string: mongodb+srv://user:pass@cluster.mongodb.net/db
4. Add to .env
```

**In code:**
```typescript
// app.module.ts
MongooseModule.forRoot(process.env.MONGO_URI);
```

---

## Common Queries You'll Use

### Auth queries
```typescript
// Find user to start sign-in
await userModel.findOne({ email })

// Create new user for sign-up
await userModel.create({ name, email, passwordHash })
```

### Catalog queries
```typescript
// Get all items (for catalog list)
await catalogModel.find().limit(10)

// Get items by user (for "my items")
await catalogModel.find({ createdBy: userId })

// Create new item
await catalogModel.create({ title, description, category, price, createdBy: userId })

// Search items
await catalogModel.find({ title: { $regex: searchTerm, $options: "i" } })
```

---

## That's MongoDB!

**Remember:**
- MongoDB stores JSON-like documents
- Collections = tables, Documents = rows
- Use references for relationships (store ID, not full data)
- Indexes speed up queries
- Schemas define structure (User, CatalogItem)
- Mongoose connects MongoDB to NestJS

**Your collections:**
1. **Users** (store sign-up data)
2. **CatalogItems** (store items, reference user who created it)

**Next: Start Implementation!**
