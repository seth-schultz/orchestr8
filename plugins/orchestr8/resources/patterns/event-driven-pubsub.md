---
id: event-driven-pubsub
category: pattern
tags: [event-driven, pubsub, kafka, messaging, async, microservices]
capabilities:
  - Publish-subscribe pattern implementation
  - Kafka producer and consumer setup
  - Event message design
  - Topic-based communication
useWhen:
  - Asynchronous multi-service communication requiring topic-based event broadcasting with Kafka or similar message brokers
  - One-to-many event notification scenarios where 3+ independent subscribers react to domain events without coupling
  - Systems requiring event replay capabilities for audit trails, debugging, or rebuilding read models from event history
  - Loose coupling requirements between microservices with producer-subscriber isolation and independent scaling per consumer group
  - High-throughput event streaming with partition-based parallelism and at-least-once delivery semantics
  - Event versioning scenarios requiring backward-compatible message schemas and multiple event format versions
estimatedTokens: 680
---

# Event-Driven Pub/Sub Pattern

Implement publish-subscribe communication pattern using message brokers like Kafka for loosely-coupled, scalable event distribution.

## Core Concepts

### Events vs Commands vs Queries
- **Event**: Something that happened (past tense) - `OrderPlaced`, `PaymentProcessed`
- **Command**: Request to do something - `PlaceOrder`, `ProcessPayment`
- **Query**: Request for information - `GetOrderStatus`, `ListOrders`

### Event Types
1. **Domain Events**: Business-significant occurrences
2. **Integration Events**: Cross-service communication
3. **System Events**: Technical events (errors, monitoring)

## Pub/Sub Architecture

```
Publisher → Topic → Subscriber 1
                 → Subscriber 2
                 → Subscriber 3
```

## Kafka Implementation

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'order-service',
    brokers: ['kafka:9092']
});

// Producer (Publisher)
const producer = kafka.producer();

async function publishOrderPlaced(order) {
    await producer.connect();
    await producer.send({
        topic: 'order.placed',
        messages: [{
            key: order.id,
            value: JSON.stringify({
                orderId: order.id,
                customerId: order.customerId,
                amount: order.amount,
                items: order.items,
                timestamp: new Date().toISOString()
            }),
            headers: {
                'event-type': 'OrderPlaced',
                'event-version': '1.0',
                'correlation-id': order.correlationId
            }
        }]
    });
}

// Consumer (Subscriber)
const consumer = kafka.consumer({ groupId: 'inventory-service' });

async function subscribeToOrderEvents() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order.placed', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const event = JSON.parse(message.value.toString());

            try {
                await handleOrderPlaced(event);
                // Commit offset on success
                await consumer.commitOffsets([{
                    topic,
                    partition,
                    offset: (parseInt(message.offset) + 1).toString()
                }]);
            } catch (error) {
                console.error('Failed to process event:', error);
                // Send to dead letter queue
                await sendToDeadLetterQueue(message);
            }
        }
    });
}
```

## Best Practices

### Event Versioning
```javascript
const events = {
    'OrderPlaced:v1': handleOrderPlacedV1,
    'OrderPlaced:v2': handleOrderPlacedV2
};

function handleEvent(event) {
    const handler = events[`${event.type}:v${event.version}`];
    if (handler) {
        return handler(event);
    }
    throw new Error(`Unknown event: ${event.type} v${event.version}`);
}
```

### Idempotency
```javascript
async function handleEvent(event) {
    // Check if already processed
    const processed = await db.processedEvents.findOne({
        eventId: event.id
    });

    if (processed) {
        console.log('Event already processed, skipping');
        return;
    }

    // Process event
    await processEvent(event);

    // Mark as processed
    await db.processedEvents.insert({
        eventId: event.id,
        processedAt: new Date()
    });
}
```

## When to Use

- Microservices need to communicate asynchronously
- Multiple services need to react to same events
- Building loosely coupled systems
- Need event replay capabilities
- High scalability requirements

## Related Event-Driven Patterns

- **orchestr8://patterns/event-driven-best-practices** - Idempotency, DLQ, and monitoring practices
- **orchestr8://patterns/event-driven-cqrs** - Build read models with pub/sub events
- **orchestr8://patterns/event-driven-eventsourcing** - Event sourcing with pub/sub distribution
- **orchestr8://patterns/event-driven-saga** - Choreography-based sagas with pub/sub
- **orchestr8://patterns/message-broker-comparison** - Choose between Kafka, RabbitMQ, SQS/SNS
- **orchestr8://patterns/architecture-microservices** - Pub/sub in microservices communication
