---
id: error-handling-api-patterns
category: skill
tags: [api, rest, express, error-handling, middleware, http]
capabilities:
  - Standard API error responses
  - Error middleware patterns
  - HTTP status code mapping
  - User-facing error messages
estimatedTokens: 400
useWhen:
  - Building REST API with Express implementing standardized error response format with status codes and user-friendly messages
  - Creating global error handling middleware for Node.js API mapping custom exceptions to HTTP status codes with request correlation
  - Designing consistent error responses for GraphQL API with proper error codes for validation, authentication, and business logic failures
  - Implementing async route handler wrapper pattern to catch promise rejections and forward to centralized Express error middleware
  - Defining custom error classes hierarchy for TypeScript API with ValidationError, NotFoundError, ConflictError extending base AppError
  - Building API error documentation with comprehensive examples of error response formats for all endpoint failure scenarios
---

# API Error Handling Patterns

## Related Error Handling Skills

**Foundational (use first):**
- orchestr8://skills/error-handling-validation - Custom error types (ValidationError, NotFoundError, etc.)

**Complementary:**
- orchestr8://skills/error-handling-logging - Logging errors with request correlation
- orchestr8://skills/error-handling-resilience - Retry logic for external API calls

**Related Patterns:**
- orchestr8://patterns/event-driven-best-practices - Event-driven error handling

## Core Principles

1. **Fail Fast**: Detect errors as early as possible (validation at boundary)
2. **Graceful Degradation**: Continue operating with reduced functionality
3. **Clear Messages**: Provide actionable error information
4. **User Experience**: Never expose internal errors to users
5. **Consistency**: Use standard error response format

## Standard Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable message
    details?: any;          // Additional context (validation errors, etc.)
    timestamp?: string;     // ISO 8601 timestamp
    requestId?: string;     // Request correlation ID
  };
}

// Example responses
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Invalid email format",
      "age": "Must be at least 18"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "abc-123-def"
  }
}

{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "abc-123-def"
  }
}

{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "abc-123-def"
  }
}
```

## Express Error Middleware

```typescript
import { Request, Response, NextFunction } from 'express';

// Global error handler (must be last middleware)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const requestId = req.id;

  // Log error with full context
  logger.error('API Error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId,
    statusCode: err instanceof AppError ? err.statusCode : 500,
  });

  // Map errors to responses
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: err.details,
        requestId,
      },
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: err.message,
        requestId,
      },
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        requestId,
      },
    });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied',
        requestId,
      },
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: err.message,
        requestId,
      },
    });
  }

  // Don't expose internal errors to users
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      requestId,
    },
  });
});
```

## HTTP Status Code Mapping

```typescript
// 4xx: Client errors (user can fix)
400 Bad Request         -> ValidationError, malformed input
401 Unauthorized        -> UnauthorizedError, missing/invalid auth
403 Forbidden           -> ForbiddenError, insufficient permissions
404 Not Found           -> NotFoundError, resource doesn't exist
409 Conflict            -> ConflictError, duplicate/state conflict
422 Unprocessable       -> BusinessRuleError, valid but rejected
429 Too Many Requests   -> RateLimitError, rate limit exceeded

// 5xx: Server errors (user can't fix)
500 Internal Error      -> Unexpected errors, bugs
502 Bad Gateway         -> Upstream service error
503 Service Unavailable -> Service down, maintenance
504 Gateway Timeout     -> Upstream timeout
```

## Custom Error Classes

**Note:** Use error types from orchestr8://skills/error-handling-validation

```typescript
// Import custom error types
import {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from './errors';

// See error-handling-validation skill for complete error class definitions
```

## Not Found Handler (404)

```typescript
// Catch-all for undefined routes (before error middleware)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
      requestId: req.id,
    },
  });
});
```

## Async Route Handler Wrapper

```typescript
// Wrap async handlers to catch errors
function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({ user });
}));

app.post('/users', asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json({ user });
}));
```

## Error Response Helper

```typescript
function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: any,
  requestId?: string
): void {
  res.status(statusCode).json({
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      requestId,
    },
  });
}

// Usage in routes
if (!user) {
  return sendError(res, 404, 'NOT_FOUND', 'User not found', null, req.id);
}
```

## Validation Error Formatting

```typescript
import { z } from 'zod';

// Middleware to validate request body
function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.reduce((acc, err) => {
          const field = err.path.join('.');
          acc[field] = err.message;
          return acc;
        }, {} as Record<string, string>);

        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details,
            requestId: req.id,
          },
        });
      }
      next(error);
    }
  };
}

// Usage
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name too short'),
  age: z.number().int().min(18, 'Must be 18 or older'),
});

app.post('/users', validateBody(CreateUserSchema), createUserHandler);
```

## User-Facing Error Messages

```typescript
// ❌ DON'T: Expose internal details
throw new Error('Cannot insert duplicate key (email)="user@example.com" into table "users"');

// ✅ DO: Provide clear, actionable message
throw new ConflictError('An account with this email already exists');

// ❌ DON'T: Technical jargon
throw new Error('Foreign key constraint violation on field "organizationId"');

// ✅ DO: Business language
throw new ValidationError('The selected organization does not exist');

// ❌ DON'T: Stack traces to users
res.status(500).json({ error: error.stack });

// ✅ DO: Generic message, log details
logger.error('Unexpected error', { error: error.stack });
res.status(500).json({
  error: {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again later.',
  },
});
```

## Key Principles

1. **Consistent format**: Always use ErrorResponse structure
2. **Appropriate status codes**: 4xx for client errors, 5xx for server errors
3. **User-friendly messages**: Business language, not technical
4. **Hide internals**: Never expose stack traces, DB errors, or secrets
5. **Log everything**: Full context in logs, sanitized in responses
6. **Request IDs**: Enable request tracing across services
