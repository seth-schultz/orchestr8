---
id: architecture-microservices
category: pattern
tags: [architecture, distributed-systems, scalability, microservices, api-gateway, service-mesh]
capabilities:
  - Microservices decomposition strategies
  - Service communication patterns (sync/async)
  - API gateway and service mesh implementation
  - Database per service pattern
  - Distributed transactions and saga pattern
useWhen:
  - Multi-service systems requiring independent deployment with service isolation, API gateways, and distributed data management
  - Large applications with 3+ development teams needing autonomous deployment cycles and technology stack flexibility per service
  - Scalability requirements varying significantly across business capabilities, demanding independent horizontal scaling per component
  - Systems requiring polyglot persistence with database-per-service pattern and eventual consistency via saga orchestration
  - Distributed transaction scenarios needing compensation-based rollback patterns and event-driven state synchronization
  - Legacy monolith decomposition projects requiring incremental service extraction with strangler fig pattern
estimatedTokens: 1400
---

# Microservices Architecture Pattern

Architectural style that structures an application as a collection of loosely coupled, independently deployable services, each focused on a specific business capability.

## Service Boundaries

### Domain-Driven Design Approach
- **Bounded Contexts**: Align services with business domains
- **Single Responsibility**: Each service owns one business capability
- **Data Ownership**: Services own their data; no shared databases

```typescript
// User Service - Manages user identity and profiles
class UserService {
  private userRepository: UserRepository;
  
  async createUser(data: CreateUserDto): Promise<User> {
    // Owns user data and business logic
    const user = await this.userRepository.create(data);
    await this.eventBus.publish('user.created', user);
    return user;
  }
}

// Order Service - Manages order lifecycle
class OrderService {
  private orderRepository: OrderRepository;
  
  async createOrder(userId: string, items: OrderItem[]): Promise<Order> {
    // References users but doesn't own user data
    const order = await this.orderRepository.create({ userId, items });
    await this.eventBus.publish('order.created', order);
    return order;
  }
}
```

## Communication Patterns

### Synchronous Communication (REST/gRPC)
```typescript
// API Gateway aggregates multiple services
class OrderAggregateService {
  constructor(
    private orderClient: OrderServiceClient,
    private userClient: UserServiceClient,
    private inventoryClient: InventoryServiceClient
  ) {}
  
  async getOrderWithDetails(orderId: string) {
    const [order, user, inventory] = await Promise.all([
      this.orderClient.getOrder(orderId),
      this.userClient.getUser(order.userId),
      this.inventoryClient.checkAvailability(order.items)
    ]);
    
    return { order, user, inventory };
  }
}
```

### Asynchronous Communication (Events/Messages)
```typescript
// Event-driven communication for loose coupling
class OrderEventHandler {
  @Subscribe('order.created')
  async onOrderCreated(event: OrderCreatedEvent) {
    // Inventory service reacts to order creation
    await this.inventoryService.reserveItems(event.orderId, event.items);
  }
  
  @Subscribe('payment.completed')
  async onPaymentCompleted(event: PaymentCompletedEvent) {
    // Order service updates order status
    await this.orderService.markAsPaid(event.orderId);
  }
}
```

## Service Discovery and Resilience

### Circuit Breaker Pattern
```typescript
class ResilientServiceClient {
  private circuitBreaker: CircuitBreaker;
  
  async callService<T>(operation: () => Promise<T>): Promise<T> {
    return this.circuitBreaker.execute(
      operation,
      {
        timeout: 5000,
        errorThreshold: 50, // Open circuit at 50% error rate
        volumeThreshold: 10, // Minimum requests before calculating
        resetTimeout: 30000 // Try again after 30s
      }
    );
  }
}
```

### Service Registry
```typescript
// Services register themselves for discovery
class ServiceRegistry {
  async register(service: ServiceInfo) {
    await this.consul.register({
      id: service.id,
      name: service.name,
      address: service.address,
      port: service.port,
      healthCheck: service.healthCheckUrl
    });
  }
  
  async discover(serviceName: string): Promise<ServiceInstance> {
    const instances = await this.consul.getHealthyInstances(serviceName);
    return this.loadBalancer.select(instances);
  }
}
```

## Data Management Patterns

### Database per Service
- Each service has its own database
- No direct database access between services
- Data consistency via eventual consistency and sagas

### Saga Pattern for Distributed Transactions
```typescript
class OrderSaga {
  async createOrder(orderData: CreateOrderDto) {
    const saga = new Saga();
    
    saga.addStep({
      name: 'reserve-inventory',
      action: () => this.inventoryService.reserve(orderData.items),
      compensation: () => this.inventoryService.release(orderData.items)
    });
    
    saga.addStep({
      name: 'process-payment',
      action: () => this.paymentService.charge(orderData.payment),
      compensation: () => this.paymentService.refund(orderData.payment)
    });
    
    saga.addStep({
      name: 'create-order',
      action: () => this.orderRepository.create(orderData),
      compensation: (orderId) => this.orderRepository.cancel(orderId)
    });
    
    return saga.execute();
  }
}
```

## Best Practices

1. **API Gateway**: Single entry point for clients, handles routing, auth, rate limiting
2. **Independent Deployment**: Services deploy without coordinating with other teams
3. **Observability**: Distributed tracing, centralized logging, service metrics
4. **Fault Tolerance**: Retries, timeouts, circuit breakers, graceful degradation
5. **Automation**: CI/CD pipelines, infrastructure as code, automated testing

## Benefits
- Independent scalability and deployment
- Technology diversity (polyglot architecture)
- Team autonomy and faster development
- Fault isolation and resilience

## Trade-offs
- Increased operational complexity
- Distributed system challenges (network latency, partial failures)
- Data consistency complexity
- Requires mature DevOps practices

## When to Use
- Large applications with multiple teams
- Different scalability requirements per component
- Need for independent deployment cycles
- Long-term projects with evolving requirements

## Related Architecture Patterns

- **orchestr8://patterns/architecture-layered** - Layered architecture within each microservice
- **orchestr8://patterns/architecture-decision-records** - Document microservices decomposition decisions
- **orchestr8://patterns/event-driven-saga** - Distributed transactions across microservices
- **orchestr8://patterns/event-driven-pubsub** - Inter-service communication pattern
- **orchestr8://patterns/event-driven-cqrs** - CQRS often used in microservices
