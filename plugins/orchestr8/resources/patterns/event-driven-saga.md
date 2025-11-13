---
id: event-driven-saga
category: pattern
tags: [saga, distributed-transactions, choreography, orchestration, compensation, microservices]
capabilities:
  - Saga pattern for distributed transactions
  - Choreography-based saga implementation
  - Orchestration-based saga implementation
  - Compensation transaction handling
useWhen:
  - Distributed transactions across microservices requiring eventual consistency without two-phase commit protocol coordination
  - Multi-service workflows needing choreography-based (event-driven) or orchestration-based (coordinator) saga patterns with compensation
  - Long-running business processes spanning multiple services where each step has idempotent action and compensation pair
  - Rollback scenarios requiring compensating transactions executed in reverse order when downstream services fail
  - Inventory reservation, payment processing, and order fulfillment workflows requiring saga state management with dead letter queues
estimatedTokens: 750
---

# Saga Pattern for Distributed Transactions

Manage distributed transactions across services using a sequence of local transactions with compensation actions for rollback.

## Problem

In microservices, you can't use traditional ACID transactions across services. Saga pattern provides eventual consistency with compensating actions.

## Two Approaches

### 1. Choreography-Based Saga

Each service listens to events and publishes new events. No central coordinator.

```javascript
// Order Service
async function onOrderPlaced(event) {
    try {
        // Reserve inventory
        await publishEvent({
            type: 'ReserveInventory',
            data: {
                orderId: event.data.orderId,
                items: event.data.items
            }
        });
    } catch (error) {
        await publishEvent({
            type: 'OrderFailed',
            data: { orderId: event.data.orderId, reason: error.message }
        });
    }
}

// Inventory Service
async function onReserveInventory(event) {
    try {
        await reserveInventory(event.data.items);
        await publishEvent({
            type: 'InventoryReserved',
            data: { orderId: event.data.orderId }
        });
    } catch (error) {
        // Compensating transaction
        await publishEvent({
            type: 'InventoryReservationFailed',
            data: { orderId: event.data.orderId }
        });
    }
}

// Payment Service
async function onInventoryReserved(event) {
    try {
        await processPayment(event.data.orderId);
        await publishEvent({
            type: 'PaymentProcessed',
            data: { orderId: event.data.orderId }
        });
    } catch (error) {
        // Trigger compensation
        await publishEvent({
            type: 'PaymentFailed',
            data: { orderId: event.data.orderId }
        });
    }
}

// Inventory Service - Compensation Handler
async function onPaymentFailed(event) {
    // Release reserved inventory
    await releaseInventory(event.data.orderId);
    await publishEvent({
        type: 'InventoryReleased',
        data: { orderId: event.data.orderId }
    });
}
```

**Pros:**
- Simple, no central coordinator
- Services loosely coupled
- Scales well

**Cons:**
- Hard to understand flow
- Difficult to debug
- No single place to see saga state

### 2. Orchestration-Based Saga

Central coordinator manages the saga flow.

```javascript
class OrderSagaOrchestrator {
    async execute(order) {
        const sagaId = generateSagaId();

        try {
            // Step 1: Reserve inventory
            await this.executeStep({
                sagaId,
                action: () => inventoryService.reserve(order.items),
                compensation: () => inventoryService.release(order.items)
            });

            // Step 2: Process payment
            await this.executeStep({
                sagaId,
                action: () => paymentService.charge(order.customerId, order.amount),
                compensation: () => paymentService.refund(order.customerId, order.amount)
            });

            // Step 3: Ship order
            await this.executeStep({
                sagaId,
                action: () => shippingService.ship(order),
                compensation: () => shippingService.cancel(order)
            });

            await this.completeSaga(sagaId);

        } catch (error) {
            await this.compensate(sagaId);
            throw error;
        }
    }

    async executeStep(step) {
        // Record step
        await db.sagaSteps.insert({
            sagaId: step.sagaId,
            status: 'executing',
            action: step.action.toString(),
            compensation: step.compensation.toString(),
            timestamp: new Date()
        });

        try {
            await step.action();
            await db.sagaSteps.update(
                { sagaId: step.sagaId },
                { status: 'completed' }
            );
        } catch (error) {
            await db.sagaSteps.update(
                { sagaId: step.sagaId },
                { status: 'failed', error: error.message }
            );
            throw error;
        }
    }

    async compensate(sagaId) {
        const steps = await db.sagaSteps.find({ sagaId })
            .sort({ timestamp: -1 }); // Reverse order

        // Execute compensations in reverse order
        for (const step of steps) {
            if (step.status === 'completed') {
                try {
                    await step.compensation();
                    await db.sagaSteps.update(
                        { _id: step._id },
                        { status: 'compensated' }
                    );
                } catch (error) {
                    console.error('Compensation failed:', error);
                    // Log for manual intervention
                }
            }
        }
    }
}
```

**Pros:**
- Clear flow and state
- Easy to understand and debug
- Central monitoring

**Cons:**
- Central point of failure
- Orchestrator couples services
- More complex implementation

## Compensation Actions

Each saga step must have a compensation action:

| Action | Compensation |
|--------|-------------|
| Reserve inventory | Release inventory |
| Charge payment | Refund payment |
| Ship order | Cancel shipment |
| Send email | Send cancellation email |
| Create booking | Cancel booking |

## Saga State Management

```javascript
class SagaState {
    constructor(sagaId) {
        this.sagaId = sagaId;
        this.status = 'pending'; // pending, running, completed, failed, compensating, compensated
        this.steps = [];
        this.currentStep = 0;
    }

    async recordStep(stepName, status, result) {
        this.steps.push({
            name: stepName,
            status,
            result,
            timestamp: new Date()
        });
        await this.save();
    }

    async save() {
        await db.sagas.update(
            { sagaId: this.sagaId },
            this,
            { upsert: true }
        );
    }
}
```

## Best Practices

1. **Idempotent Operations**: All saga operations must be idempotent
2. **Timeouts**: Set timeouts for each step
3. **Retry Logic**: Implement retry with exponential backoff
4. **Dead Letter Queue**: Handle permanently failed steps
5. **Monitoring**: Track saga state and failures
6. **Semantic Lock**: Prevent concurrent modifications

## When to Use

- Distributed transactions across microservices
- Long-running business processes
- Need consistency without distributed locks
- Cannot use 2-phase commit

## When NOT to Use

- Single service/database (use local transactions)
- Strict ACID requirements (consider different architecture)
- Simple workflows (choreography might be overkill)

## Related Event-Driven Patterns

- **orchestr8://patterns/event-driven-best-practices** - Idempotency and retry patterns essential for sagas
- **orchestr8://patterns/event-driven-pubsub** - Choreography-based sagas use pub/sub
- **orchestr8://patterns/event-driven-cqrs** - Saga state can be event-sourced
- **orchestr8://patterns/event-driven-eventsourcing** - Event sourcing saga state
- **orchestr8://patterns/architecture-microservices** - Sagas for distributed microservices transactions
