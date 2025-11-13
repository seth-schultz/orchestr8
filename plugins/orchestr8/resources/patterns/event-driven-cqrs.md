---
id: event-driven-cqrs
category: pattern
tags: [cqrs, event-driven, read-model, write-model, projection, scalability]
capabilities:
  - CQRS pattern implementation
  - Separate read and write models
  - Projection pattern for read models
  - Query optimization through denormalization
useWhen:
  - Read and write workloads differing significantly requiring independent scaling with separate command and query databases
  - Multiple read model requirements needing optimized projections for listing, detail views, analytics, and reporting with denormalization
  - Event-sourced systems requiring projection handlers to build materialized views from domain events with eventual consistency
  - Complex domains needing different data models for updates (normalized aggregates) versus queries (denormalized views)
  - High-performance scenarios requiring pre-calculated aggregations and optimized read models without complex joins
estimatedTokens: 650
---

# CQRS (Command Query Responsibility Segregation)

Separate read and write models to optimize each independently for better scalability and performance.

## Core Concept

Traditional approach: Same model for reads and writes
```
Controller → Service → Single Model → Database
```

CQRS: Separate models optimized for their purpose
```
Commands → Write Model → Event Store
                       ↓
                    Events → Projections → Read Models
                                               ↓
Queries → Read Model Handler → Read Database
```

## Write Model (Commands)

```javascript
class OrderCommandHandler {
    async handle(command) {
        switch (command.type) {
            case 'PlaceOrder':
                return await this.placeOrder(command);
            case 'CancelOrder':
                return await this.cancelOrder(command);
            default:
                throw new Error(`Unknown command: ${command.type}`);
        }
    }

    async placeOrder(command) {
        // Load aggregate from event store
        const order = await loadOrder(command.orderId);

        // Execute command
        const events = order.placeOrder(
            command.orderId,
            command.customerId,
            command.items
        );

        // Save events
        await eventStore.append(`order-${command.orderId}`, events);

        // Publish events
        await publishEvents(events);
    }
}
```

## Read Model (Queries)

Denormalized for fast reads:

```javascript
class OrderQueryHandler {
    async getOrderSummary(orderId) {
        // Read from optimized read model
        return await db.orderSummaries.findOne({ orderId });
    }

    async getCustomerOrders(customerId) {
        return await db.orderSummaries.find({ customerId })
            .sort({ createdAt: -1 })
            .limit(10);
    }

    async getOrdersWithStats(filters) {
        // Complex query optimized for reading
        return await db.orderSummaries.aggregate([
            { $match: filters },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: 'id',
                    as: 'customer'
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);
    }
}
```

## Projection Pattern

Update read model from events:

```javascript
class OrderSummaryProjection {
    async handle(event) {
        switch (event.type) {
            case 'OrderPlaced':
                await this.createSummary(event);
                break;
            case 'OrderCancelled':
                await this.updateStatus(event.data.orderId, 'cancelled');
                break;
            case 'OrderShipped':
                await this.updateStatus(event.data.orderId, 'shipped');
                break;
            case 'PaymentProcessed':
                await this.updatePaymentStatus(event);
                break;
        }
    }

    async createSummary(event) {
        await db.orderSummaries.insert({
            orderId: event.data.orderId,
            customerId: event.data.customerId,
            totalAmount: event.data.totalAmount,
            status: 'pending',
            itemCount: event.data.items.length,
            createdAt: event.timestamp,
            updatedAt: event.timestamp
        });
    }

    async updateStatus(orderId, status) {
        await db.orderSummaries.update(
            { orderId },
            { $set: { status, updatedAt: new Date() } }
        );
    }

    async updatePaymentStatus(event) {
        await db.orderSummaries.update(
            { orderId: event.data.orderId },
            {
                $set: {
                    paymentStatus: 'paid',
                    paidAt: event.timestamp,
                    updatedAt: new Date()
                }
            }
        );
    }
}
```

## Multiple Read Models

Create different read models for different use cases:

```javascript
// Order summary for listing
class OrderListProjection {
    async handle(event) {
        // Lightweight, denormalized for fast listing
        // Columns: id, customerId, status, amount, date
    }
}

// Order details for viewing
class OrderDetailsProjection {
    async handle(event) {
        // Rich, includes all items, customer info, shipping
        // Optimized for single order view
    }
}

// Analytics read model
class OrderAnalyticsProjection {
    async handle(event) {
        // Aggregated data for dashboards and reports
        // Pre-calculated totals, averages, trends
    }
}
```

## Benefits

- **Independent Scaling**: Scale reads and writes separately
- **Optimized Models**: Each model optimized for its purpose
- **Multiple Views**: Different read models for different use cases
- **Performance**: Denormalized reads, no complex joins

## Trade-offs

- **Eventual Consistency**: Read models may lag behind writes
- **Complexity**: More moving parts, more code
- **Data Duplication**: Same data in multiple models
- **Synchronization**: Must keep projections up to date

## When to Use

- Read/write workloads differ significantly
- Complex domain with multiple views of data
- Need to scale reads and writes independently
- Building event-driven or event-sourced systems
- Performance critical applications

## Related Event-Driven Patterns

- **orchestr8://patterns/event-driven-best-practices** - Foundational principles for event systems
- **orchestr8://patterns/event-driven-eventsourcing** - Combine CQRS with event sourcing
- **orchestr8://patterns/event-driven-pubsub** - Event distribution infrastructure
- **orchestr8://patterns/event-driven-saga** - Distributed transactions across services
- **orchestr8://patterns/architecture-microservices** - Microservices architecture with CQRS
