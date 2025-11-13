---
id: event-driven-eventsourcing
category: pattern
tags: [event-driven, event-sourcing, cqrs, aggregate, domain-events, audit]
capabilities:
  - Event sourcing pattern implementation
  - Event store design
  - Aggregate pattern with events
  - State reconstruction from events
useWhen:
  - Complete audit trail requirements needing immutable event log for compliance, debugging, or forensic analysis of state changes
  - Temporal query scenarios requiring state reconstruction at any historical point with event replay from aggregate streams
  - Event-driven architectures where domain events are first-class citizens driving projections, notifications, and downstream processing
  - CQRS implementations needing event store as source of truth with snapshot optimization for large event streams
  - Financial or regulatory domains requiring full traceability of all transactions and business decisions with event versioning
estimatedTokens: 720
---

# Event Sourcing Pattern

Store state changes as a sequence of events instead of current state, enabling complete audit trails and state reconstruction.

## Core Concept

Instead of storing current state:
```javascript
// Traditional: Store current state
{ id: 1, status: 'confirmed', total: 100 }
```

Store events that led to that state:
```javascript
// Event sourcing: Store events
[
  { type: 'OrderPlaced', data: { items: [...], total: 100 } },
  { type: 'PaymentConfirmed', data: { paymentId: 'xyz' } }
]
```

## Event Store Implementation

```javascript
class EventStore {
    async append(streamId, events) {
        for (const event of events) {
            await db.events.insert({
                streamId,
                eventType: event.type,
                data: event.data,
                metadata: event.metadata,
                timestamp: new Date(),
                version: await this.getNextVersion(streamId)
            });
        }
    }

    async getEvents(streamId, fromVersion = 0) {
        return await db.events.find({
            streamId,
            version: { $gte: fromVersion }
        }).sort({ version: 1 });
    }
}
```

## Aggregate Pattern

```javascript
class Order {
    constructor() {
        this.id = null;
        this.customerId = null;
        this.items = [];
        this.status = 'pending';
        this.totalAmount = 0;
        this.version = 0;
    }

    // Commands (produce events)
    placeOrder(orderId, customerId, items) {
        if (this.id !== null) {
            throw new Error('Order already placed');
        }

        return [{
            type: 'OrderPlaced',
            data: {
                orderId,
                customerId,
                items,
                timestamp: new Date()
            }
        }];
    }

    addItem(item) {
        if (this.status !== 'pending') {
            throw new Error('Cannot add items to non-pending order');
        }

        return [{
            type: 'ItemAdded',
            data: { item }
        }];
    }

    confirmPayment(paymentId) {
        return [{
            type: 'PaymentConfirmed',
            data: { paymentId, timestamp: new Date() }
        }];
    }

    // Event handlers (mutate state)
    applyOrderPlaced(event) {
        this.id = event.data.orderId;
        this.customerId = event.data.customerId;
        this.items = event.data.items;
        this.status = 'pending';
        this.version++;
    }

    applyItemAdded(event) {
        this.items.push(event.data.item);
        this.totalAmount += event.data.item.price;
        this.version++;
    }

    applyPaymentConfirmed(event) {
        this.status = 'confirmed';
        this.version++;
    }

    // Rebuild state from events
    static fromEvents(events) {
        const order = new Order();
        for (const event of events) {
            const handler = `apply${event.type}`;
            if (typeof order[handler] === 'function') {
                order[handler](event);
            }
        }
        return order;
    }
}
```

## Usage Pattern

```javascript
const eventStore = new EventStore();

// Handle command
async function placeOrder(command) {
    const order = new Order();
    const events = order.placeOrder(
        command.orderId,
        command.customerId,
        command.items
    );

    await eventStore.append(`order-${command.orderId}`, events);

    // Publish integration events
    for (const event of events) {
        await publishEvent(event);
    }
}

// Rebuild from history
async function getOrder(orderId) {
    const events = await eventStore.getEvents(`order-${orderId}`);
    return Order.fromEvents(events);
}
```

## Benefits

- **Complete Audit Trail**: Every state change is recorded
- **Temporal Queries**: Reconstruct state at any point in time
- **Event Replay**: Rebuild read models or fix bugs by replaying events
- **Natural Fit for Event-Driven**: Events are first-class citizens

## Trade-offs

- **Complexity**: More complex than traditional CRUD
- **Event Versioning**: Need strategy for evolving event schemas
- **Performance**: May need snapshots for large event streams
- **Learning Curve**: Team needs to understand pattern

## Snapshots for Performance

```javascript
async function getOrder(orderId) {
    // Load latest snapshot
    const snapshot = await snapshotStore.getLatest(`order-${orderId}`);

    // Load events since snapshot
    const events = await eventStore.getEvents(
        `order-${orderId}`,
        snapshot ? snapshot.version + 1 : 0
    );

    // Rebuild from snapshot + new events
    const order = snapshot ? snapshot.state : new Order();
    return Order.fromEvents(events, order);
}
```

## Related Event-Driven Patterns

- **orchestr8://patterns/event-driven-best-practices** - Event validation, versioning, and DLQ patterns
- **orchestr8://patterns/event-driven-cqrs** - Build read models from event streams
- **orchestr8://patterns/event-driven-pubsub** - Event distribution and pub/sub infrastructure
- **orchestr8://patterns/event-driven-saga** - Saga pattern for cross-aggregate workflows
- **orchestr8://patterns/architecture-microservices** - Event sourcing in microservices
