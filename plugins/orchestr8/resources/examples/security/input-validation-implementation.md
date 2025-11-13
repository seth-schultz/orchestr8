---
id: input-validation-implementation
category: example
tags: [security, validation, sanitization, xss, sql-injection, zod, typescript]
capabilities:
  - Complete input validation implementation with Zod schemas
  - SQL injection prevention with parameterized queries
  - XSS prevention with HTML sanitization
  - Command injection prevention with safe APIs
  - Path traversal prevention
  - NoSQL injection prevention
  - File upload validation
useWhen:
  - When implementing production-ready input validation system
  - When building comprehensive sanitization layer for user inputs
  - When securing application against injection attacks
  - When validating file uploads with MIME type verification
  - When implementing schema-based validation with Zod
estimatedTokens: 1450
relatedResources:
  - orchestr8://skills/security-input-validation
---

# Input Validation & Sanitization Implementation

Complete TypeScript implementation of secure input validation and sanitization patterns to prevent injection attacks.

## Schema Validation with Zod

```typescript
import { z } from 'zod';

// Define strict schemas for all inputs
const CreateUserSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100).trim(),
  age: z.number().int().min(13).max(120).optional(),
  role: z.enum(['user', 'admin', 'moderator']),
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Validate in middleware
function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated; // Replace with validated data
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
        });
      }
      throw error;
    }
  };
}

// Usage
app.post('/users', validateRequest(CreateUserSchema), async (req, res) => {
  const user = await userService.create(req.body); // Already validated
  res.status(201).json({ user });
});
```

## SQL Injection Prevention

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ SAFE: Parameterized queries (ORM)
async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }, // Automatically parameterized
  });
}

// ✅ SAFE: Raw queries with parameters
async function searchUsers(query: string) {
  return await prisma.$queryRaw`
    SELECT * FROM users
    WHERE name LIKE ${'%' + query + '%'}
  `; // Parameterized even in raw SQL
}

// ❌ DANGEROUS: String concatenation
async function searchUsersUnsafe(query: string) {
  // NEVER DO THIS - SQL injection vulnerability
  return await prisma.$queryRawUnsafe(
    `SELECT * FROM users WHERE name LIKE '%${query}%'`
  );
  // Attacker input: "'; DROP TABLE users; --"
}

// ✅ SAFE: Whitelist sorting columns
const ALLOWED_SORT_FIELDS = ['createdAt', 'email', 'name'] as const;

app.get('/users', async (req, res) => {
  const sortBy = req.query.sortBy as string;

  // Validate against whitelist
  if (!ALLOWED_SORT_FIELDS.includes(sortBy as any)) {
    return res.status(400).json({ error: 'Invalid sort field' });
  }

  const users = await prisma.user.findMany({
    orderBy: { [sortBy]: 'asc' },
  });

  res.json({ users });
});
```

## XSS Prevention

```typescript
import DOMPurify from 'isomorphic-dompurify';
import { escape } from 'html-escaper';

// ✅ Sanitize HTML content
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  });
}

// ✅ Escape plain text for HTML context
function escapeHtml(text: string): string {
  return escape(text);
}

// API: Accept rich text content
const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(10000),
  contentType: z.enum(['text', 'html']),
});

app.post('/posts', validateRequest(CreatePostSchema), async (req, res) => {
  const { title, content, contentType } = req.body;

  const sanitized = {
    title: escapeHtml(title), // Always escape titles
    content: contentType === 'html'
      ? sanitizeHtml(content)
      : escapeHtml(content),
  };

  const post = await prisma.post.create({ data: sanitized });
  res.status(201).json({ post });
});

// ✅ Set security headers
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"], // No inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"], // CSS only from same origin
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  xssFilter: true,
}));
```

## Command Injection Prevention

```typescript
import { spawn } from 'child_process';
import path from 'path';

// ❌ DANGEROUS: Shell command with user input
function convertImageUnsafe(filename: string) {
  // NEVER DO THIS
  exec(`convert ${filename} output.png`); // Shell injection!
  // Attacker: "image.jpg; rm -rf /"
}

// ✅ SAFE: Use array arguments (no shell)
function convertImageSafe(filename: string) {
  // Validate filename first
  const sanitized = path.basename(filename); // Remove directory traversal

  if (!/^[a-zA-Z0-9_.-]+$/.test(sanitized)) {
    throw new Error('Invalid filename');
  }

  return new Promise((resolve, reject) => {
    const child = spawn('convert', [sanitized, 'output.png'], {
      shell: false, // Crucial: no shell interpretation
    });

    child.on('close', (code) => {
      code === 0 ? resolve(true) : reject(new Error('Conversion failed'));
    });
  });
}

// ✅ Whitelist allowed operations
const ALLOWED_OPERATIONS = ['resize', 'crop', 'rotate'] as const;

function processImage(operation: string, filename: string) {
  if (!ALLOWED_OPERATIONS.includes(operation as any)) {
    throw new Error('Invalid operation');
  }

  const sanitizedFile = path.basename(filename);
  return spawn('convert', ['-' + operation, sanitizedFile, 'output.png'], {
    shell: false,
  });
}
```

## Path Traversal Prevention

```typescript
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = '/var/www/uploads';

// ❌ DANGEROUS: User-controlled paths
async function getFileUnsafe(filename: string) {
  // NEVER DO THIS - directory traversal!
  return await fs.readFile(`/var/www/uploads/${filename}`);
  // Attacker: "../../etc/passwd"
}

// ✅ SAFE: Validate and resolve paths
async function getFileSafe(filename: string) {
  // Remove directory separators
  const sanitized = path.basename(filename);

  // Resolve absolute path
  const filePath = path.resolve(UPLOAD_DIR, sanitized);

  // Ensure path is within allowed directory
  if (!filePath.startsWith(UPLOAD_DIR)) {
    throw new Error('Invalid file path');
  }

  // Additional validation
  if (!/^[a-zA-Z0-9_.-]+$/.test(sanitized)) {
    throw new Error('Invalid filename format');
  }

  return await fs.readFile(filePath);
}
```

## NoSQL Injection Prevention

```typescript
// ❌ DANGEROUS: Direct object assignment
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // NEVER DO THIS with MongoDB
  const user = await User.findOne({ email: email });
  // Attacker: { email: { $ne: null }, password: "anything" }
});

// ✅ SAFE: Validate types and structure
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

app.post('/login', validateRequest(LoginSchema), async (req, res) => {
  const { email, password } = req.body; // Now guaranteed to be strings

  const user = await User.findOne({ email }); // Safe
  // ...
});

// ✅ SAFE: Sanitize MongoDB operators
function sanitizeMongoOperators(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Remove keys starting with $
    if (!key.startsWith('$')) {
      sanitized[key] = sanitizeMongoOperators(value);
    }
  }
  return sanitized;
}
```

## File Upload Validation

```typescript
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import { randomBytes } from 'crypto';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    // Check extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      return cb(new Error('Invalid file extension'));
    }

    // Check MIME type (from client - can be spoofed)
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(new Error('Invalid MIME type'));
    }

    cb(null, true);
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Verify actual file type (magic bytes)
  const type = await fileTypeFromBuffer(req.file.buffer);
  if (!type || !ALLOWED_MIMES.includes(type.mime)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  // Generate safe filename
  const safeFilename = `${randomBytes(16).toString('hex')}.${type.ext}`;

  await fs.writeFile(path.join(UPLOAD_DIR, safeFilename), req.file.buffer);

  res.json({ filename: safeFilename });
});
```

## Advanced Validation Patterns

### Email Domain Whitelist

```typescript
const ALLOWED_EMAIL_DOMAINS = ['company.com', 'partner.com'];

const EmailSchema = z.string().email().refine(
  (email) => {
    const domain = email.split('@')[1];
    return ALLOWED_EMAIL_DOMAINS.includes(domain);
  },
  { message: 'Email domain not allowed' }
);
```

### URL Validation with Whitelist

```typescript
const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const ALLOWED_HOSTS = ['api.example.com', 'cdn.example.com'];

function validateUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }

    if (!ALLOWED_HOSTS.includes(url.hostname)) {
      throw new Error('Invalid hostname');
    }

    // Block private network IPs
    const privateIpRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;
    if (privateIpRegex.test(url.hostname)) {
      throw new Error('Private IP not allowed');
    }

    return true;
  } catch (error) {
    return false;
  }
}
```

### Complex Object Validation

```typescript
const UpdateUserSchema = z.object({
  profile: z.object({
    bio: z.string().max(500).optional(),
    website: z.string().url().optional(),
    social: z.object({
      twitter: z.string().regex(/^@?[a-zA-Z0-9_]+$/).optional(),
      github: z.string().regex(/^[a-zA-Z0-9-]+$/).optional(),
    }).optional(),
  }).optional(),
  settings: z.object({
    emailNotifications: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
  }).optional(),
});
```

## Usage Notes

### Security Best Practices
1. **Validate all input**: Use schema validation (Zod, Joi, Yup)
2. **Whitelist, don't blacklist**: Define allowed values explicitly
3. **Use parameterized queries**: Never concatenate SQL
4. **Sanitize HTML**: Use DOMPurify for rich text
5. **Escape output**: Context-specific (HTML, JS, URL, CSS)
6. **Validate file uploads**: Check magic bytes, not just extensions
7. **No shell execution**: Use array arguments with spawn/execFile
8. **Prevent path traversal**: Use path.basename and validate
9. **Type checking**: Ensure primitives, not objects (NoSQL)
10. **Set security headers**: CSP, X-XSS-Protection, X-Frame-Options

### What to Avoid
- ❌ String concatenation in SQL queries
- ❌ Trusting user input for file paths
- ❌ Executing shell commands with user input
- ❌ Storing unsanitized HTML
- ❌ Using blacklist-based validation
- ❌ Trusting client-side MIME types only
- ❌ Allowing MongoDB operators in user input

### Integration
Import this implementation into your Express/Node.js API. Requires:
- `zod` for schema validation
- `isomorphic-dompurify` for HTML sanitization
- `html-escaper` for text escaping
- `file-type` for file validation
- `multer` for file uploads
- ORM like Prisma for safe database queries
