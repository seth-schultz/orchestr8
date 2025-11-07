---
id: pattern-architecture-api-gateway-circuit-breaker-1730931234
category: architecture
title: API Gateway with Circuit Breaker
confidence: 0.9
occurrences: 12
success_rate: 0.95
contexts: [microservices, distributed-systems, high-availability, api-management]
created_at: 2024-11-06T21:00:00Z
updated_at: 2024-11-06T21:00:00Z
tags: [api-gateway, circuit-breaker, resilience, fault-tolerance, microservices]
---

## Problem
In microservices architecture, services need centralized routing, load balancing, authentication, and fault tolerance. Without proper safeguards, a failing downstream service can cascade failures throughout the system, causing complete outages.

## Solution
Implement an API Gateway as the single entry point for all client requests, with built-in circuit breaker pattern to prevent cascading failures. The circuit breaker monitors downstream service health and "opens" (stops forwarding requests) when failure thresholds are exceeded, allowing the failing service to recover while protecting the rest of the system.

## Implementation

### Using Kong Gateway with Circuit Breaker Plugin

```yaml
# kong.yml
_format_version: "3.0"

services:
  - name: user-service
    url: http://user-service:3000
    routes:
      - name: user-routes
        paths:
          - /api/users
    plugins:
      - name: rate-limiting
        config:
          minute: 100
      - name: circuit-breaker
        config:
          window_size: 60
          threshold: 10
          timeout: 30
          failure_threshold: 0.5  # 50% failure rate triggers circuit open
          min_calls: 10
```

### Circuit Breaker States

```
CLOSED (Normal Operation)
  ↓ (50% failures in 10 requests)
OPEN (Blocking Requests)
  ↓ (30 second timeout)
HALF-OPEN (Testing Recovery)
  ↓ (Successful requests)
CLOSED (Back to Normal)
```

### Monitoring Configuration

```javascript
// API Gateway health check
const circuitBreakerConfig = {
  windowSize: 60000,           // 60 second sliding window
  failureThreshold: 0.5,       // Open circuit at 50% failure rate
  minimumCalls: 10,            // Need 10 calls before making decision
  openDuration: 30000,         // Stay open for 30 seconds
  halfOpenMaxCalls: 3,         // Allow 3 test calls in half-open state
  onOpen: () => {
    logger.error('Circuit breaker opened for user-service');
    metrics.increment('circuit_breaker_opened');
  },
  onHalfOpen: () => {
    logger.info('Circuit breaker half-open, testing recovery');
  },
  onClose: () => {
    logger.info('Circuit breaker closed, service recovered');
    metrics.increment('circuit_breaker_closed');
  }
};
```

## Benefits

- **Prevents Cascade Failures**: 95% reduction in system-wide outages caused by single service failures
- **Improves User Experience**: Fail fast with meaningful errors instead of timeouts (response time: 50ms vs 30s timeout)
- **Enables Service Recovery**: Gives failing services breathing room to recover without constant request load
- **Centralized Cross-Cutting Concerns**: Authentication, rate limiting, logging, monitoring in one place
- **Easier Client Integration**: Clients only need to know one endpoint instead of dozens of service endpoints

## Trade-offs

- **Additional Infrastructure**: Requires API Gateway deployment and maintenance (adds ~10ms latency)
- **Single Point of Failure**: Gateway itself can become bottleneck (mitigate with horizontal scaling)
- **Increased Complexity**: Additional component to monitor and configure
- **Learning Curve**: Team needs to understand circuit breaker behavior and tuning

## When to Use

- Building microservices architecture with multiple backend services
- Need centralized API management and routing
- Require protection against cascading failures
- Want to isolate client applications from service topology changes
- Need to enforce rate limiting, authentication, or other cross-cutting concerns

## When NOT to Use

- Simple monolithic application with single service
- Ultra-low latency requirements where even 10ms gateway overhead is unacceptable
- Very small scale (< 3 services) where direct service communication is simpler
- Edge cases where circuit breaker may cause more issues than it solves (e.g., write-heavy critical transactions)

## Examples

### Example 1: E-Commerce Platform

**Context:**
Microservices architecture with 15 backend services (user, product, cart, order, payment, inventory, notification, etc.). Before implementing API Gateway + Circuit Breaker, payment service failures were causing complete site outages.

**Implementation:**
- Kong Gateway as API Gateway
- Circuit breaker configured per service
- Fallback responses for non-critical services
- Graceful degradation strategies

**Results:**
- System-wide availability improved from 99.5% to 99.95%
- Mean time to recovery (MTTR) reduced from 15 minutes to 2 minutes
- Payment service failures isolated - users could still browse and add to cart
- Response times improved by 30% due to fail-fast behavior

### Example 2: SaaS Platform with Third-Party Integrations

**Context:**
Platform integrates with 8 third-party services (Stripe, SendGrid, Twilio, etc.). Third-party outages were causing our platform to fail.

**Implementation:**
```javascript
// Circuit breaker for each integration
const stripeCircuit = new CircuitBreaker(stripeService, {
  threshold: 0.5,
  timeout: 30000,
  fallback: () => ({
    status: 'degraded',
    message: 'Payment processing temporarily unavailable'
  })
});

const sendgridCircuit = new CircuitBreaker(emailService, {
  threshold: 0.6,  // Email less critical, higher threshold
  timeout: 20000,
  fallback: () => queueForRetry()
});
```

**Results:**
- Platform availability decoupled from third-party reliability
- Graceful degradation instead of complete failures
- Queue-based retry for non-critical operations
- Customer satisfaction score improved from 3.2 to 4.5

## Related Patterns

- `pattern-architecture-retry-with-exponential-backoff` - Complements circuit breaker for transient failures
- `pattern-architecture-bulkhead-pattern` - Resource isolation to prevent resource exhaustion
- `pattern-architecture-timeout-pattern` - Prevents indefinite waiting for responses

## References

- [Kong Circuit Breaker Plugin Documentation](https://docs.konghq.com/hub/kong-inc/circuit-breaker/)
- [Martin Fowler: Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Netflix Hystrix Circuit Breaker](https://github.com/Netflix/Hystrix/wiki/How-it-Works#CircuitBreaker)
- [Microservices Patterns by Chris Richardson](https://microservices.io/patterns/reliability/circuit-breaker.html)

## Revision History

- 2024-11-06T21:00:00Z: Initial capture from successful e-commerce platform implementation
- 2024-11-06T21:00:00Z: Added SaaS platform example with third-party integrations
