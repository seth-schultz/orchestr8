---
id: error-handling-validation
category: skill
tags: [validation, input-validation, error-types, zod, typescript]
capabilities:
  - Input validation patterns
  - Custom error types
  - User-facing error messages
  - Validation error formatting
estimatedTokens: 550
useWhen:
  - Validating user input for REST API endpoints with Zod schema validation and detailed field-level error messages
  - Creating custom error class hierarchy for TypeScript application with specific types for ValidationError, ConflictError, UnauthorizedError
  - Formatting Zod validation errors into consistent API response structure with field paths and actionable error messages
  - Building API middleware for request body validation that catches schema errors and returns 400 status with validation details
  - Implementing business logic validation in service layer checking entity uniqueness and throwing ConflictError with user-friendly messages
  - Designing validation error response format with error codes, field-level details, and request correlation IDs for debugging
---

# Input Validation & Error Types

## Related Error Handling Skills

**Foundational:**
- This skill defines custom error types used across error handling family

**API Layer (uses these error types):**
- orchestr8://skills/error-handling-api-patterns - API error responses and middleware

**Cross-Cutting:**
- orchestr8://skills/error-handling-logging - Error logging with context
- orchestr8://skills/error-handling-resilience - Retry and circuit breaker patterns

**Related Security:**
- orchestr8://skills/security-input-validation - Security-focused validation

## Schema Validation with Zod

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(18, 'Must be 18 or older').optional(),
  role: z.enum(['user', 'admin'], { 
    errorMap: () => ({ message: 'Role must be user or admin' }) 
  }),
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Validation middleware
function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
}

// Usage
app.post('/users', validateBody(CreateUserSchema), createUserHandler);
```

## Custom Error Classes

```typescript
// Base application error
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}
```

## Error Response Formatter

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId?: string;
  };
}

function formatErrorResponse(
  error: Error | AppError,
  requestId?: string
): ErrorResponse {
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
  }

  // Unknown errors - don't expose details
  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      requestId,
    },
  };
}
```

## Global Error Handler Middleware

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const requestId = req.id; // From request ID middleware
  
  // Log error with context
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId,
    statusCode: err instanceof AppError ? err.statusCode : 500,
  });

  // Send formatted response
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      formatErrorResponse(err, requestId)
    );
  }

  // Unknown error - 500
  res.status(500).json(formatErrorResponse(err, requestId));
});
```

## Business Logic Validation

```typescript
class UserService {
  async createUser(data: CreateUserInput): Promise<User> {
    // Check if email exists
    const existing = await this.db.user.findUnique({
      where: { email: data.email },
    });
    
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    // Validate business rules
    if (data.role === 'admin' && data.age && data.age < 21) {
      throw new ValidationError('Admins must be at least 21 years old');
    }

    try {
      return await this.db.user.create({ data });
    } catch (error) {
      logger.error('Database error creating user', { error });
      throw new AppError('Failed to create user');
    }
  }
}
```

## Field-Level Validation

```typescript
function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', { field: 'email' });
  }
}

function validatePassword(password: string): void {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Must contain number');
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Invalid password', {
      field: 'password',
      requirements: errors,
    });
  }
}
```

## Safe Parsing Pattern

```typescript
// Parse and validate with type safety
function parseUserInput(input: unknown): CreateUserInput {
  const result = CreateUserSchema.safeParse(input);
  
  if (!result.success) {
    throw new ValidationError('Invalid input data', {
      errors: result.error.flatten().fieldErrors,
    });
  }
  
  return result.data;
}

// Usage
try {
  const validData = parseUserInput(req.body);
  const user = await userService.createUser(validData);
  res.status(201).json({ user });
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).json(formatErrorResponse(error, req.id));
  }
  throw error;
}
```

## Key Principles

1. **Validate early**: Check input at API boundary
2. **Use schema validation**: Zod, Joi, or class-validator
3. **Custom error types**: Make errors self-documenting
4. **User-friendly messages**: Clear, actionable error text
5. **Never expose internals**: Sanitize error details for clients
6. **Log validation failures**: Track patterns for improvements
