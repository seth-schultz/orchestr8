---
id: error-handling-resilience
category: skill
tags: [error-handling, resilience, retry, circuit-breaker, fault-tolerance, reliability]
capabilities:
  - Retry logic with exponential backoff
  - Circuit breaker implementation
  - Graceful degradation patterns
  - Transient failure handling
estimatedTokens: 600
useWhen:
  - Implementing retry logic with exponential backoff for payment gateway API calls experiencing intermittent network timeouts
  - Building circuit breaker pattern for third-party inventory service to prevent cascading failures during outages
  - Handling transient database connection failures in high-traffic Node.js application with graceful degradation to cached data
  - Designing fault-tolerant microservice communication with automatic retry and timeout strategies for distributed order processing
  - Implementing resilience patterns for external email service integration with fallback queue for delayed retry
  - Creating timeout wrappers with cleanup for long-running async operations in real-time data processing pipeline
---

# Resilience Patterns: Retry & Circuit Breaker

## Related Error Handling Skills

**Complementary Error Handling:**
- orchestr8://skills/error-handling-api-patterns - API error responses when resilience fails
- orchestr8://skills/error-handling-logging - Logging retry attempts and circuit breaker state
- orchestr8://skills/error-handling-validation - Validating inputs before retry

**Related Patterns:**
- orchestr8://patterns/performance-caching - Caching for graceful degradation
- orchestr8://patterns/event-driven-saga - Saga pattern for distributed resilience

**Related Infrastructure:**
- orchestr8://skills/observability-metrics-prometheus - Monitoring circuit breaker metrics

## Retry Logic with Exponential Backoff

```typescript
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
        logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, {
          error: error.message,
        });
        await sleep(delay);
      }
    }
  }

  logger.error(`Operation failed after ${maxRetries} retries`);
  throw new Error(`Operation failed after ${maxRetries} retries: ${lastError.message}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
try {
  const data = await retryOperation(
    () => fetchFromUnreliableAPI(),
    3,    // max retries
    1000  // initial delay (1s, 2s, 4s)
  );
} catch (error) {
  logger.error('API call failed after retries', { error });
  throw new ServiceUnavailableError('External service unavailable');
}
```

## Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5,       // failures before opening
    private timeout: number = 60000,     // ms before attempting recovery
    private name: string = 'default'
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime >= this.timeout) {
        logger.info(`Circuit breaker ${this.name}: transitioning to HALF_OPEN`);
        this.state = 'HALF_OPEN';
      } else {
        throw new Error(`Circuit breaker ${this.name} is OPEN`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      logger.info(`Circuit breaker ${this.name}: recovered, transitioning to CLOSED`);
      this.state = 'CLOSED';
    }
  }

  private onFailure(error: Error) {
    this.failures++;
    this.lastFailTime = Date.now();

    logger.warn(`Circuit breaker ${this.name}: failure ${this.failures}/${this.threshold}`, {
      error: error.message,
    });

    if (this.failures >= this.threshold) {
      logger.error(`Circuit breaker ${this.name}: threshold exceeded, opening circuit`);
      this.state = 'OPEN';
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailTime: this.lastFailTime,
    };
  }
}

// Usage
const paymentServiceBreaker = new CircuitBreaker(5, 60000, 'payment-service');

try {
  const result = await paymentServiceBreaker.execute(() =>
    callPaymentAPI(order)
  );
} catch (error) {
  if (error.message.includes('Circuit breaker')) {
    // Service is down, use fallback
    return handlePaymentUnavailable(order);
  }
  throw error;
}
```

## Database Error Handling

```typescript
import { Prisma } from '@prisma/client';

async function findUser(id: string): Promise<User | null> {
  try {
    return await db.user.findUnique({ where: { id } });
  } catch (error) {
    // Prisma-specific error codes
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          // Record not found
          return null;
        case 'P2002':
          // Unique constraint violation
          throw new ConflictError('Record already exists');
        case 'P2003':
          // Foreign key constraint failed
          throw new ValidationError('Referenced record does not exist');
        default:
          logger.error('Database error', { code: error.code, error });
          throw new DatabaseError('Database operation failed');
      }
    }

    // Connection/timeout errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      logger.fatal('Database connection failed', { error });
      throw new ServiceUnavailableError('Database unavailable');
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      logger.error('Invalid database query', { error });
      throw new Error('Internal validation error');
    }

    // Unknown error
    logger.error('Unexpected database error', { error });
    throw new DatabaseError('Unexpected database error');
  }
}

// Transaction error handling
async function transferFunds(fromId: string, toId: string, amount: number) {
  try {
    await db.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: fromId },
        data: { balance: { decrement: amount } },
      });

      await tx.account.update({
        where: { id: toId },
        data: { balance: { increment: amount } },
      });
    });
  } catch (error) {
    logger.error('Transaction failed', { fromId, toId, amount, error });
    throw new TransactionError('Fund transfer failed');
  }
}
```

## Graceful Degradation

```typescript
// Fallback to cached data when service fails
async function getUserProfile(id: string): Promise<UserProfile> {
  try {
    return await fetchUserProfileFromAPI(id);
  } catch (error) {
    logger.warn('API unavailable, using cached profile', { id, error });

    const cached = await cache.get(`profile:${id}`);
    if (cached) {
      return { ...cached, stale: true };
    }

    // Ultimate fallback: basic profile
    return {
      id,
      name: 'Unknown User',
      stale: true,
      degraded: true,
    };
  }
}

// Feature flag for graceful degradation
async function processOrder(order: Order): Promise<OrderResult> {
  let loyaltyPoints = 0;

  try {
    loyaltyPoints = await loyaltyService.calculatePoints(order);
  } catch (error) {
    logger.warn('Loyalty service unavailable, continuing without points', { error });
    // Continue order processing without loyalty points
  }

  return {
    orderId: order.id,
    total: order.total,
    loyaltyPoints,
  };
}
```

## Timeout with Cleanup

```typescript
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  cleanup?: () => void
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      cleanup?.();
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise,
  ]);
}

// Usage with abort controller
async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();

  try {
    return await withTimeout(
      fetch(url, { signal: controller.signal }),
      timeoutMs,
      () => controller.abort() // cleanup: abort request
    );
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
```

## Key Principles

1. **Retry transient failures**: Network blips, rate limits, temporary unavailability
2. **Don't retry client errors**: 4xx errors are not transient
3. **Use exponential backoff**: Avoid thundering herd
4. **Circuit breaker for failing services**: Fail fast, recover automatically
5. **Graceful degradation**: Maintain partial functionality
6. **Cleanup on timeout**: Cancel operations, free resources
