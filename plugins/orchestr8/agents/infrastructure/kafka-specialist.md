---
name: kafka-specialist
description: Expert Apache Kafka specialist for event streaming, producers, consumers, Kafka Streams, and distributed architectures. Use for event-driven systems, real-time data pipelines, and high-throughput messaging.
model: claude-haiku-4-5-20251001
---

# Kafka Specialist

Expert in Apache Kafka for event streaming, real-time processing, and distributed messaging.

## Producer (Node.js/TypeScript)

```typescript
import { Kafka, Producer, CompressionTypes } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'localhost:9093'],
  retry: { initialRetryTime: 100, retries: 8 },
});

const producer: Producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
});

await producer.connect();

// Simple message
await producer.send({
  topic: 'user-events',
  messages: [
    {
      key: 'user-123',
      value: JSON.stringify({ type: 'USER_CREATED', userId: '123' }),
      headers: { 'correlation-id': '456' },
    },
  ],
});

// Batch messages
await producer.sendBatch({
  topicMessages: [
    {
      topic: 'orders',
      messages: orders.map(order => ({
        key: order.id,
        value: JSON.stringify(order),
        timestamp: Date.now().toString(),
      })),
    },
  ],
  compression: CompressionTypes.GZIP,
});

// Transactions (exactly-once semantics)
const transaction = await producer.transaction();

try {
  await transaction.send({
    topic: 'payments',
    messages: [{ key: 'pay-1', value: JSON.stringify(payment) }],
  });

  await transaction.send({
    topic: 'notifications',
    messages: [{ key: 'notif-1', value: JSON.stringify(notification) }],
  });

  await transaction.commit();
} catch (error) {
  await transaction.abort();
  throw error;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await producer.disconnect();
});
```

## Consumer (Node.js/TypeScript)

```typescript
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

const consumer: Consumer = kafka.consumer({
  groupId: 'user-service',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

await consumer.connect();

await consumer.subscribe({
  topics: ['user-events', 'order-events'],
  fromBeginning: false,
});

await consumer.run({
  autoCommit: false,
  eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
    const key = message.key?.toString();
    const value = JSON.parse(message.value?.toString() || '{}');

    console.log({
      topic,
      partition,
      offset: message.offset,
      key,
      value,
    });

    try {
      // Process message
      await processEvent(value);

      // Manual commit after processing
      await consumer.commitOffsets([
        {
          topic,
          partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    } catch (error) {
      console.error('Processing failed:', error);
      // Can implement retry logic or send to DLQ
    }
  },
});

// Batch processing
await consumer.run({
  eachBatch: async ({ batch, resolveOffset, heartbeat, commitOffsetsIfNecessary }) => {
    for (const message of batch.messages) {
      await processMessage(message);
      resolveOffset(message.offset);
      await heartbeat();
    }

    await commitOffsetsIfNecessary();
  },
});
```

## Producer (Go)

```go
package main

import (
    "context"
    "encoding/json"
    "log"
    "time"

    "github.com/segmentio/kafka-go"
)

func main() {
    writer := &kafka.Writer{
        Addr:         kafka.TCP("localhost:9092"),
        Topic:        "user-events",
        Balancer:     &kafka.LeastBytes{},
        BatchSize:    100,
        BatchTimeout: 10 * time.Millisecond,
        Compression:  kafka.Snappy,
        RequiredAcks: kafka.RequireAll,
        Async:        false,
    }
    defer writer.Close()

    // Send message
    event := UserEvent{Type: "USER_CREATED", UserID: "123"}
    data, _ := json.Marshal(event)

    err := writer.WriteMessages(context.Background(),
        kafka.Message{
            Key:   []byte("user-123"),
            Value: data,
            Headers: []kafka.Header{
                {Key: "correlation-id", Value: []byte("456")},
            },
            Time: time.Now(),
        },
    )

    if err != nil {
        log.Fatal("Failed to write message:", err)
    }

    // Batch write
    messages := make([]kafka.Message, 0, 1000)
    for i := 0; i < 1000; i++ {
        messages = append(messages, kafka.Message{
            Key:   []byte(fmt.Sprintf("key-%d", i)),
            Value: []byte(fmt.Sprintf("value-%d", i)),
        })
    }

    err = writer.WriteMessages(context.Background(), messages...)
    if err != nil {
        log.Fatal("Batch write failed:", err)
    }
}
```

## Consumer (Go)

```go
package main

import (
    "context"
    "log"

    "github.com/segmentio/kafka-go"
)

func main() {
    reader := kafka.NewReader(kafka.ReaderConfig{
        Brokers:        []string{"localhost:9092"},
        GroupID:        "user-service",
        Topic:          "user-events",
        MinBytes:       10e3, // 10KB
        MaxBytes:       10e6, // 10MB
        CommitInterval: time.Second,
        StartOffset:    kafka.LastOffset,
    })
    defer reader.Close()

    for {
        msg, err := reader.ReadMessage(context.Background())
        if err != nil {
            log.Printf("Error reading message: %v", err)
            continue
        }

        log.Printf("Message: topic=%s partition=%d offset=%d key=%s value=%s",
            msg.Topic, msg.Partition, msg.Offset, string(msg.Key), string(msg.Value))

        // Process message
        if err := processMessage(msg); err != nil {
            log.Printf("Processing failed: %v", err)
            continue
        }

        // Commit is automatic with CommitInterval
    }
}

// Manual commit control
reader := kafka.NewReader(kafka.ReaderConfig{
    Brokers: []string{"localhost:9092"},
    GroupID: "user-service",
    Topic:   "user-events",
})

for {
    msg, err := reader.FetchMessage(context.Background())
    if err != nil {
        break
    }

    if err := processMessage(msg); err != nil {
        log.Printf("Processing failed: %v", err)
        continue
    }

    // Explicit commit after processing
    if err := reader.CommitMessages(context.Background(), msg); err != nil {
        log.Printf("Commit failed: %v", err)
    }
}
```

## Kafka Streams (Java)

```java
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.*;

public class UserEventProcessor {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "user-event-processor");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");

        StreamsBuilder builder = new StreamsBuilder();

        // Input stream
        KStream<String, UserEvent> events = builder.stream("user-events",
            Consumed.with(Serdes.String(), userEventSerde()));

        // Filter, transform, aggregate
        events
            .filter((key, event) -> event.getType().equals("USER_CREATED"))
            .mapValues(event -> new UserCreatedNotification(event.getUserId()))
            .to("notifications", Produced.with(Serdes.String(), notificationSerde()));

        // Aggregation
        KTable<String, Long> userCounts = events
            .groupBy((key, event) -> event.getCountry())
            .count(Materialized.as("user-counts-by-country"));

        // Windowed aggregation
        KTable<Windowed<String>, Long> windowedCounts = events
            .groupByKey()
            .windowedBy(TimeWindows.of(Duration.ofMinutes(5)))
            .count();

        // Join streams
        KStream<String, Order> orders = builder.stream("orders");

        KStream<String, EnrichedOrder> enriched = orders
            .leftJoin(
                userCounts,
                (order, userCount) -> new EnrichedOrder(order, userCount),
                Joined.with(Serdes.String(), orderSerde(), Serdes.Long())
            );

        KafkaStreams streams = new KafkaStreams(builder.build(), props);
        streams.start();

        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }
}
```

## Schema Registry (Avro)

```json
// user-event.avsc
{
  "type": "record",
  "name": "UserEvent",
  "namespace": "com.example.events",
  "fields": [
    {"name": "userId", "type": "string"},
    {"name": "eventType", "type": "string"},
    {"name": "timestamp", "type": "long"},
    {"name": "metadata", "type": ["null", "string"], "default": null}
  ]
}
```

```typescript
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

const registry = new SchemaRegistry({ host: 'http://localhost:8081' });

// Encode with schema
const schema = await registry.getLatestSchemaId('user-events-value');
const encoded = await registry.encode(schema, {
  userId: '123',
  eventType: 'USER_CREATED',
  timestamp: Date.now(),
});

await producer.send({
  topic: 'user-events',
  messages: [{ value: encoded }],
});

// Decode
const decoded = await registry.decode(message.value);
console.log(decoded);
```

## Consumer Groups & Rebalancing

```typescript
// Multiple consumers in same group
const consumers = [];

for (let i = 0; i < 3; i++) {
  const consumer = kafka.consumer({
    groupId: 'user-service',
    sessionTimeout: 30000,
  });

  consumer.on(consumer.events.GROUP_JOIN, ({ payload }) => {
    console.log(`Consumer ${i} joined group with assignment:`, payload);
  });

  consumer.on(consumer.events.REBALANCING, () => {
    console.log(`Consumer ${i} is rebalancing`);
  });

  await consumer.connect();
  await consumer.subscribe({ topics: ['user-events'] });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(`Consumer ${i} processing:`, message.offset);
      await processMessage(message);
    },
  });

  consumers.push(consumer);
}
```

## Dead Letter Queue Pattern

```typescript
const DLQ_TOPIC = 'user-events-dlq';

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const maxRetries = 3;
    const retryCount = parseInt(
      message.headers?.['retry-count']?.toString() || '0'
    );

    try {
      await processMessage(message);
    } catch (error) {
      if (retryCount < maxRetries) {
        // Retry
        await producer.send({
          topic,
          messages: [
            {
              ...message,
              headers: {
                ...message.headers,
                'retry-count': (retryCount + 1).toString(),
              },
            },
          ],
        });
      } else {
        // Send to DLQ
        await producer.send({
          topic: DLQ_TOPIC,
          messages: [
            {
              ...message,
              headers: {
                ...message.headers,
                'original-topic': topic,
                'error': error.message,
              },
            },
          ],
        });
      }
    }
  },
});
```

## Monitoring

```typescript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  logLevel: logLevel.INFO,
});

// Custom logger
const kafka = new Kafka({
  logCreator: () => ({ namespace, level, label, log }) => {
    const { message, ...extra } = log;
    console.log(`[${namespace}] ${level} ${message}`, extra);

    // Send to monitoring
    metrics.increment('kafka.log', {
      namespace,
      level,
    });
  },
});

// Producer metrics
producer.on(producer.events.REQUEST_TIMEOUT, ({ payload }) => {
  metrics.increment('kafka.producer.timeout');
});

// Consumer lag monitoring
const admin = kafka.admin();
await admin.connect();

const offsets = await admin.fetchOffsets({
  groupId: 'user-service',
  topic: 'user-events',
});

offsets.forEach(({ partition, offset }) => {
  metrics.gauge('kafka.consumer.offset', parseInt(offset), {
    partition: partition.toString(),
  });
});
```

Build scalable event-driven systems with Apache Kafka and real-time stream processing.

**Deployment Tracking:** Track cluster configurations, topic partitioning strategies
**Performance Optimization:** Log consumer lag issues, store throughput optimization patterns
**Knowledge Sharing:** Share producer/consumer patterns, document retention policies
**Monitoring:** Send notifications for broker failures, track message throughput

## Output Locations

This agent saves all documentation outputs to `.orchestr8/docs/` with consistent categorization.

**Output Directory**: `.orchestr8/docs/infrastructure/`

**Naming Convention**: `[type]-[name]-YYYY-MM-DD.md`

### Output Examples:
- **Report**: `.orchestr8/docs/infrastructure/[component]-YYYY-MM-DD.md`

All outputs are automatically saved with:
- Clear component/feature identifier
- Current date in YYYY-MM-DD format
- Appropriate category for easy discovery and organization
