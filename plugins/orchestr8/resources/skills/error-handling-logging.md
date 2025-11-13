---
id: error-handling-logging
category: skill
tags: [logging, observability, monitoring, structured-logging, error-tracking]
capabilities:
  - Structured logging patterns
  - Error context preservation
  - Security-aware logging
  - Log correlation and tracing
estimatedTokens: 450
useWhen:
  - Implementing structured logging with Winston for Express API with request correlation IDs and PII masking for GDPR compliance
  - Building observability into distributed microservices with Sentry integration for error tracking and stack trace aggregation
  - Debugging production errors in serverless functions by adding contextual logging with operation metadata and timing information
  - Setting up CloudWatch log aggregation with alert thresholds for high error rates in payment processing system
  - Implementing security-aware logging that masks sensitive data while preserving debugging context for authentication failures
  - Creating request correlation system across Node.js services using X-Request-ID headers with child logger patterns
---

# Error Logging & Observability

## Related Error Handling Skills

**Used By All Error Handling:**
- This skill provides logging for all error scenarios

**Domain-Specific Error Handling:**
- orchestr8://skills/error-handling-api-patterns - API error logging
- orchestr8://skills/error-handling-validation - Validation error logging
- orchestr8://skills/error-handling-resilience - Retry/failure logging

**Related Observability:**
- orchestr8://skills/observability-distributed-tracing - Distributed tracing
- orchestr8://skills/observability-structured-logging - Advanced logging patterns
- orchestr8://skills/observability-metrics-prometheus - Error metrics

## Structured Logging

```typescript
import { Logger } from 'winston'; // or pino, bunyan

// Log errors with rich context
logger.error('Operation failed', {
  operation: 'createUser',
  userId: user?.id,
  error: {
    message: error.message,
    stack: error.stack,
    code: error.code,
    type: error.constructor.name,
  },
  context: {
    requestId: req.id,
    path: req.path,
    method: req.method,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  },
  timestamp: new Date().toISOString(),
});
```

## Security-Aware Logging

```typescript
// ❌ DON'T: Log sensitive data
logger.error('Authentication failed', {
  username: user.username,
  password: user.password,        // ❌ Never log passwords
  token: req.headers.authorization, // ❌ Never log tokens
  ssn: user.ssn,                   // ❌ Never log PII
  creditCard: payment.cardNumber,  // ❌ Never log payment info
});

// ✅ DO: Log safely
logger.error('Authentication failed', {
  userId: user.id,                 // ✅ Use IDs not names
  email: maskEmail(user.email),    // ✅ Mask PII if needed
  reason: 'invalid_credentials',   // ✅ Generic reason
  attemptCount: user.failedAttempts,
});

// Email masking helper
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local[0]}***@${domain}`;
}

// Credit card masking
function maskCard(cardNumber: string): string {
  return `****-****-****-${cardNumber.slice(-4)}`;
}
```

## Log Levels and When to Use

```typescript
// DEBUG: Development troubleshooting (disabled in production)
logger.debug('User query params', { params: req.query });

// INFO: Normal operations, business events
logger.info('User created', { userId: user.id, email: maskEmail(user.email) });

// WARN: Recoverable errors, degraded functionality
logger.warn('Cache miss, falling back to database', { key: cacheKey });
logger.warn('Rate limit approaching', { userId, current: 95, limit: 100 });

// ERROR: Application errors that need attention
logger.error('Failed to send email', {
  userId: user.id,
  emailType: 'welcome',
  error: error.message,
  stack: error.stack,
});

// FATAL: Unrecoverable errors, service shutdown
logger.fatal('Database connection lost', {
  error: error.message,
  connectionString: maskConnectionString(config.db.url),
});
```

## Error Context Preservation

```typescript
// Add context as error propagates up the stack
class ErrorWithContext extends Error {
  constructor(
    message: string,
    public context: Record<string, any> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  addContext(key: string, value: any): this {
    this.context[key] = value;
    return this;
  }
}

// Service layer: Add operation context
async function createUser(data: CreateUserInput): Promise<User> {
  try {
    return await db.user.create({ data });
  } catch (error) {
    throw new ErrorWithContext('User creation failed', {
      operation: 'createUser',
      email: data.email,
      originalError: error.message,
    });
  }
}

// Controller layer: Add request context
async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    if (error instanceof ErrorWithContext) {
      error.addContext('requestId', req.id)
           .addContext('path', req.path);

      logger.error(error.message, error.context);
    }
    throw error;
  }
}
```

## Request Correlation

```typescript
// Request ID middleware
import { v4 as uuidv4 } from 'uuid';

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] as string || uuidv4();
  res.setHeader('x-request-id', req.id);
  next();
});

// Child logger with request context
app.use((req, res, next) => {
  req.logger = logger.child({
    requestId: req.id,
    path: req.path,
    method: req.method,
  });
  next();
});

// Use request logger throughout request lifecycle
function createUserHandler(req: Request, res: Response) {
  req.logger.info('Creating user');

  try {
    const user = await userService.createUser(req.body);
    req.logger.info('User created', { userId: user.id });
    res.json({ user });
  } catch (error) {
    req.logger.error('User creation failed', { error });
    throw error;
  }
}
```

## Error Aggregation for Monitoring

```typescript
// Track error patterns for alerting
const errorMetrics = {
  count: 0,
  byType: new Map<string, number>(),
  byEndpoint: new Map<string, number>(),
};

function trackError(error: Error, req: Request) {
  errorMetrics.count++;

  const errorType = error.constructor.name;
  errorMetrics.byType.set(
    errorType,
    (errorMetrics.byType.get(errorType) || 0) + 1
  );

  const endpoint = `${req.method} ${req.path}`;
  errorMetrics.byEndpoint.set(
    endpoint,
    (errorMetrics.byEndpoint.get(endpoint) || 0) + 1
  );

  // Alert if error rate exceeds threshold
  if (errorMetrics.count > 100) {
    logger.fatal('High error rate detected', {
      total: errorMetrics.count,
      topErrors: Array.from(errorMetrics.byType.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    });
  }
}
```

## Integration with Error Tracking Services

```typescript
import * as Sentry from '@sentry/node';

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Capture errors with context
function logErrorToSentry(error: Error, req: Request) {
  Sentry.withScope((scope) => {
    scope.setUser({
      id: req.user?.id,
      email: maskEmail(req.user?.email),
    });

    scope.setContext('request', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
    });

    scope.setLevel('error');
    scope.setTag('endpoint', req.path);

    Sentry.captureException(error);
  });
}
```

## Production Logging Best Practices

```typescript
// Configure logger based on environment
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production'
        ? winston.format.json()
        : winston.format.simple(),
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
});

// Don't log in tests unless debugging
if (process.env.NODE_ENV === 'test') {
  logger.silent = true;
}
```

## Key Principles

1. **Log with context**: Include operation, IDs, request info
2. **Never log secrets**: Passwords, tokens, API keys, PII
3. **Use structured logging**: JSON format for parsing
4. **Correlate requests**: Request IDs across services
5. **Appropriate log levels**: DEBUG < INFO < WARN < ERROR < FATAL
6. **Monitor error patterns**: Alert on spikes and trends
