---
id: event-driven-best-practices
category: pattern
tags: [event-driven, best-practices, idempotency, dead-letter-queue, schema, monitoring]
capabilities:
  - Event-driven architecture best practices
  - Dead letter queue implementation
  - Event schema validation
  - Retry and error handling patterns
useWhen:
  - Event-driven system implementation requiring idempotency guarantees, event versioning, and schema validation with dead letter queues
  - Reliable event processing scenarios needing retry policies with exponential backoff and circuit breakers for downstream failures
  - Event failure handling requiring dead letter queue configuration, poison message detection, and manual intervention workflows
  - Message quality assurance needing event schema validation, correlation ID tracking, and event ordering guarantees
estimatedTokens: 580
---

# Event-Driven Architecture Best Practices

Essential patterns and practices for building reliable, maintainable event-driven systems.

## Dead Letter Queues

Handle events that fail processing repeatedly:

```javascript
async function handleEventWithRetry(event) {
    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            await processEvent(event);
            return;
        } catch (error) {
            attempts++;
            if (attempts >= maxRetries) {
                // Send to dead letter queue for manual investigation
                await sendToDeadLetterQueue(event, error);
                throw error;
            }
            // Exponential backoff
            await sleep(Math.pow(2, attempts) * 1000);
        }
    }
}

async function sendToDeadLetterQueue(event, error) {
    await dlqProducer.send({
        topic: 'events.dead-letter',
        messages: [{
            key: event.id,
            value: JSON.stringify({
                originalEvent: event,
                error: {
                    message: error.message,
                    stack: error.stack
                },
                failedAt: new Date(),
                retryCount: 3
            })
        }]
    });

    // Alert ops team
    await alerting.notify({
        severity: 'error',
        message: `Event ${event.id} sent to DLQ after 3 retries`
    });
}
```

## Event Schema Registry

Define and validate event schemas:

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

// Schema registry
const schemas = {
    'OrderPlaced': {
        type: 'object',
        required: ['orderId', 'customerId', 'items', 'totalAmount'],
        properties: {
            orderId: { type: 'string', format: 'uuid' },
            customerId: { type: 'string', format: 'uuid' },
            items: {
                type: 'array',
                minItems: 1,
                items: {
                    type: 'object',
                    required: ['productId', 'quantity', 'price'],
                    properties: {
                        productId: { type: 'string' },
                        quantity: { type: 'number', minimum: 1 },
                        price: { type: 'number', minimum: 0 }
                    }
                }
            },
            totalAmount: { type: 'number', minimum: 0 },
            timestamp: { type: 'string', format: 'date-time' }
        }
    },
    'PaymentProcessed': {
        type: 'object',
        required: ['orderId', 'paymentId', 'amount'],
        properties: {
            orderId: { type: 'string', format: 'uuid' },
            paymentId: { type: 'string' },
            amount: { type: 'number', minimum: 0 },
            method: { type: 'string', enum: ['card', 'paypal', 'bank_transfer'] }
        }
    }
};

function validateEvent(event) {
    const schema = schemas[event.type];
    if (!schema) {
        throw new Error(`Unknown event type: ${event.type}`);
    }

    const validate = ajv.compile(schema);
    if (!validate(event.data)) {
        throw new Error(`Invalid event data: ${JSON.stringify(validate.errors)}`);
    }
}

// Use before publishing
async function publishEvent(event) {
    validateEvent(event); // Throws if invalid
    await producer.send(event);
}
```

## Event Versioning Strategy

```javascript
// Include version in event
const event = {
    type: 'OrderPlaced',
    version: 2,
    data: { /* v2 fields */ }
};

// Handler supports multiple versions
const eventHandlers = {
    'OrderPlaced:v1': async (data) => {
        // Handle v1 format
        return {
            orderId: data.id,
            customerId: data.customer,
            items: data.products // v1 called it "products"
        };
    },
    'OrderPlaced:v2': async (data) => {
        // Handle v2 format
        return {
            orderId: data.orderId,
            customerId: data.customerId,
            items: data.items // v2 renamed to "items"
        };
    }
};

async function handleEvent(event) {
    const handlerKey = `${event.type}:v${event.version}`;
    const handler = eventHandlers[handlerKey];

    if (!handler) {
        throw new Error(`No handler for ${handlerKey}`);
    }

    const normalizedData = await handler(event.data);
    await processOrder(normalizedData);
}
```

## Monitoring and Observability

```javascript
class EventMonitor {
    async publishWithMetrics(event) {
        const startTime = Date.now();

        try {
            await producer.send(event);

            // Record success metrics
            metrics.increment('events.published', {
                event_type: event.type,
                status: 'success'
            });

        } catch (error) {
            metrics.increment('events.published', {
                event_type: event.type,
                status: 'error'
            });
            throw error;

        } finally {
            const duration = Date.now() - startTime;
            metrics.timing('events.publish_duration', duration, {
                event_type: event.type
            });
        }
    }

    async consumeWithMetrics(event, handler) {
        const startTime = Date.now();

        try {
            await handler(event);

            metrics.increment('events.processed', {
                event_type: event.type,
                status: 'success'
            });

        } catch (error) {
            metrics.increment('events.processed', {
                event_type: event.type,
                status: 'error',
                error_type: error.constructor.name
            });
            throw error;

        } finally {
            const duration = Date.now() - startTime;
            metrics.timing('events.process_duration', duration, {
                event_type: event.type
            });
        }
    }
}
```

## Key Principles

1. **Idempotency**: All event handlers must be idempotent
2. **At-Least-Once Delivery**: Design for duplicate events
3. **Event Immutability**: Never modify events after publishing
4. **Schema Evolution**: Plan for schema changes from day one
5. **Dead Letter Queues**: Always have a fallback for failed events
6. **Monitoring**: Track event flow, latency, and failures
7. **Versioning**: Version your events from the start
8. **Validation**: Validate events at producer and consumer

## Related Event-Driven Patterns

This pattern provides foundational best practices. Explore specific implementation patterns:

- **orchestr8://patterns/event-driven-pubsub** - Pub/sub messaging with Kafka/RabbitMQ
- **orchestr8://patterns/event-driven-cqrs** - Command Query Responsibility Segregation
- **orchestr8://patterns/event-driven-eventsourcing** - Event sourcing with aggregate patterns
- **orchestr8://patterns/event-driven-saga** - Distributed transactions with compensation
- **orchestr8://patterns/message-broker-comparison** - Kafka vs RabbitMQ vs AWS SQS/SNS
