# 🏫 NestJS Backend Fundamentals (Simple Version)

---

## What is NestJS?

**NestJS = Framework for building Node.js servers (backend)**

**Simple analogy:**
- Angular = framework for building websites
- NestJS = framework for building APIs

**Node.js without NestJS:**
```javascript
// Raw Node.js (messy)
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/auth/signin' && req.method === 'POST') {
    // Parse JSON
    // Validate input
    // Call database
    // Return response
  }
});
```

**NestJS (clean, organized):**
```typescript
@Controller('auth')
export class AuthController {
  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
```

---

## Controllers = Route Handlers

**A controller defines API endpoints:**

```typescript
// auth.controller.ts
@Controller('auth')
export class AuthController {
  
  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
  
  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }
  
  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Request() req) {
    return req.user;
  }
}
```

**What this creates:**
- `POST /auth/signin`
- `POST /auth/signup`
- `GET /auth/me`

**Decorators explained:**
- `@Controller('auth')` = base path is `/auth`
- `@Post()` = HTTP POST method
- `@Get()` = HTTP GET method
- `@Body()` = extract request body
- `@Request()` = full request object
- `@UseGuards()` = apply middleware/guard

---

## Services = Business Logic

**A service contains the actual logic:**

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  
  async signIn(dto: SignInDto) {
    // 1. Find user by email
    const user = await this.usersService.findByEmail(dto.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash
    );
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // 3. Generate JWT token
    const token = this.jwtService.sign({ userId: user.id });
    
    // 4. Return user + token
    return {
      user,
      token,
      expiresIn: 28800 // 8 hours in seconds
    };
  }
  
  async signUp(dto: SignUpDto) {
    // Check if email exists
    const exists = await this.usersService.findByEmail(dto.email);
    
    if (exists) {
      throw new ConflictException('Email already in use');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);
    
    // Create user
    const user = await this.usersService.create({
      ...dto,
      passwordHash
    });
    
    // Generate token
    const token = this.jwtService.sign({ userId: user.id });
    
    return { user, token };
  }
}
```

**Why separate service from controller?**
- Testable (mock service in tests)
- Reusable (multiple controllers can use same service)
- Organized (logic separate from HTTP)

---

## Dependency Injection (DI)

**NestJS automatically manages instances:**

```typescript
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  // ↑ Angular provides these automatically
}
```

**How it works:**
1. Tell NestJS what to provide in a module
2. Request it in constructor
3. NestJS injects it (same instance for everyone)

---

## Modules = Organize Code

**Group controllers + services:**

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Database
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService]  // Other modules can use AuthService
})
export class AuthModule {}
```

**App module (imports all):**
```typescript
@Module({
  imports: [
    AuthModule,
    CatalogModule,
    DatabaseModule
  ]
})
export class AppModule {}
```

---

## Guards = Middleware/Protection

**Protect routes with authentication:**

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}
  
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    // 1. Get token from headers
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
    
    const [, token] = authHeader.split(' '); // "Bearer <token>"
    
    // 2. Verify token
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = { id: payload.userId };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    
    return true;  // Allow access
  }
}
```

**Use in controller:**
```typescript
@Get('me')
@UseGuards(AuthGuard)
getMe(@Request() req) {
  return req.user;
}
```

---

## Database with MongoDB

**Install Mongoose:**
```bash
npm install @nestjs/mongoose mongoose
```

**Define schema:**
```typescript
// user.schema.ts
@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  
  @Prop({ required: true, unique: true })
  email: string;
  
  @Prop({ required: true })
  passwordHash: string;
  
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

**Use in service:**
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
  
  async create(dto: CreateUserDto) {
    const user = new this.userModel(dto);
    return user.save();
  }
}
```

---

## DTOs (Data Transfer Objects)

**Validate incoming data:**

```typescript
// auth.dto.ts
export class SignInDto {
  @IsEmail()
  email: string;
  
  @IsStrongPassword()
  password: string;
}

export class SignUpDto extends SignInDto {
  @IsString()
  @MinLength(2)
  name: string;
}
```

**Use in controller:**
```typescript
@Post('signin')
signIn(@Body() dto: SignInDto) {
  // ↑ NestJS validates automatically
  return this.authService.signIn(dto);
}
```

---

## Error Handling

**Throw typed exceptions:**

```typescript
// In service
if (!user) {
  throw new NotFoundException('User not found');  // 404
}

if (user.isBlocked) {
  throw new ForbiddenException('User is blocked');  // 403
}

if (!passwordValid) {
  throw new UnauthorizedException('Invalid password');  // 401
}

if (emailExists) {
  throw new ConflictException('Email already exists');  // 409
}
```

**Frontend receives:**
```javascript
{
  statusCode: 409,
  message: "Email already exists",
  error: "Conflict"
}
```

---

## Your Project File Structure

```
api/src/
├── main.ts                      // Entry point
├── app/
│   ├── app.module.ts           // Root module
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── auth.dto.ts
│   │   ├── auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   └── schemas/
│   │       └── user.schema.ts
│   └── catalog/
│       ├── catalog.controller.ts
│       ├── catalog.service.ts
│       ├── catalog.module.ts
│       ├── catalog.dto.ts
│       └── schemas/
│           └── catalog-item.schema.ts
└── config/
    └── database.ts              // MongoDB connection
```

---

## Complete Auth Endpoint

### 1. Controller (HTTP layer)
```typescript
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('signin')
  @HttpCode(200)
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
```

### 2. Service (Business logic)
```typescript
@Injectable()
export class AuthService {
  signIn(dto: SignInDto) {
    const user = this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException();
    
    const passwordValid = bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) throw new UnauthorizedException();
    
    const token = this.jwtService.sign({ userId: user.id });
    
    return { user, token, expiresIn: 28800 };
  }
}
```

### 3. Module (Organize)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
```

### 4. Request flow
```
POST /auth/signin
  → AuthController.signIn()
  → AuthService.signIn()
  → Find user in database
  → Verify password
  → Generate JWT token
  → Return { user, token }
```

---

## Catalog Endpoints

### Create item
```typescript
@Post()
@UseGuards(AuthGuard)
create(@Body() dto: CreateCatalogItemDto, @Request() req) {
  return this.catalogService.create(dto, req.user.id);
}
```

**Service:**
```typescript
async create(dto: CreateCatalogItemDto, userId: string) {
  return this.catalogModel.create({
    ...dto,
    createdBy: userId
  });
}
```

### Get items
```typescript
@Get()
@UseGuards(AuthGuard)
findAll() {
  return this.catalogService.findAll();
}
```

### Get by ID
```typescript
@Get(':id')
@UseGuards(AuthGuard)
findOne(@Param('id') id: string) {
  return this.catalogService.findOne(id);
}
```

---

## Key Concepts at a Glance

| Concept | What | Example |
|---------|------|---------|
| **Controller** | HTTP routes | AuthController |
| **Service** | Business logic | AuthService |
| **Module** | Group code | AuthModule |
| **Guard** | Middleware/protection | AuthGuard |
| **DTO** | Validate input | SignInDto |
| **Schema** | Database structure | UserSchema |
| **DI** | Angular provides instances | `constructor(private auth: AuthService)` |
| **Exception** | Typed errors | `UnauthorizedException()` |

---

## Request-Response Flow

```
1. Client sends: POST /auth/signin { email, password }
   ↓
2. Controller receives: @Controller decorates, @Body extracts
   ↓
3. Service processes: verify email, check password, generate token
   ↓
4. Database queries: find user by email
   ↓
5. Service returns: { user, token }
   ↓
6. Controller returns: HTTP 200 with JSON response
   ↓
7. Client receives: { user: {...}, token: "..." }
```

---

## Environment Variables

**`.env` file:**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=8h
PORT=3000
```

**Usage in code:**
```typescript
constructor(
  private configService: ConfigService
) {}

async connect() {
  const mongoUri = this.configService.get('MONGO_URI');
  await mongoose.connect(mongoUri);
}
```

---

## That's NestJS!

**Remember:**
- Controllers = HTTP routes
- Services = business logic
- DI = Angular manages instances
- Guards = protection (auth, etc)
- DTOs = validate input
- Schemas = database structure
- Modules = organize code

**Real flow:**
Request → Controller → Service → Database → Response

**Next:** MongoDB (database design)
