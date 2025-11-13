---
id: message-broker-comparison
category: pattern
tags: [kafka, rabbitmq, sqs, sns, message-broker, messaging, comparison]
capabilities:
  - Message broker selection criteria
  - Kafka vs RabbitMQ vs AWS comparison
  - Use case recommendations
  - Technology trade-offs
useWhen:
  - Message broker selection requiring comparison of Kafka (high-throughput streaming), RabbitMQ (flexible routing), and AWS SQS/SNS (managed service)
  - Technology trade-off analysis evaluating throughput (Kafka >1M msg/sec), delivery guarantees, operational complexity, and ecosystem maturity
  - Event-driven architecture planning needing broker recommendation based on use case like log aggregation, task queues, or pub/sub notifications
  - Cloud versus self-hosted decisions comparing AWS managed services (SQS/SNS/EventBridge) with self-hosted Kafka or RabbitMQ clusters
estimatedTokens: 520
---

# Message Broker Comparison

Comparison of popular message brokers to guide technology selection for event-driven architectures.

## Apache Kafka

**Best for**: High-throughput, event streaming, event sourcing

### Properties
- Distributed commit log
- Persistent storage on disk
- Event replay from any offset
- Multiple consumers per topic
- Horizontal partitioning for scale
- Strong ordering guarantees per partition

### Use Cases
- Event sourcing
- Real-time analytics and stream processing
- Log aggregation
- Activity tracking
- Metrics collection
- Data pipeline integration

### Pros
- Extremely high throughput (millions of messages/sec)
- Durable storage with configurable retention
- Replay events from any point
- Scales horizontally
- Strong ecosystem (Kafka Connect, Kafka Streams)

### Cons
- More complex to operate
- Higher operational overhead
- Requires Zookeeper (until KRaft mode is standard)
- Not ideal for traditional message queuing

## RabbitMQ

**Best for**: Complex routing, work queues, RPC patterns

### Properties
- Traditional message broker
- Flexible routing topologies
- Priority queues
- Dead letter exchanges
- Request/reply patterns
- Multiple protocols (AMQP, MQTT, STOMP)

### Use Cases
- Task queues and job processing
- Request/reply (RPC)
- Complex routing scenarios
- Priority-based message handling
- Microservices communication
- IoT messaging (MQTT)

### Pros
- Rich routing capabilities
- Easy to set up and operate
- Great for traditional queue patterns
- Low latency
- Strong community and tooling

### Cons
- Messages deleted after consumption (no replay)
- Lower throughput than Kafka
- Vertical scaling limitations
- Clustering can be complex

## AWS SQS/SNS

**Best for**: Cloud-native, managed service, AWS ecosystem

### SQS (Queue) Properties
- Point-to-point messaging
- At-least-once delivery (standard), exactly-once (FIFO)
- FIFO queues available
- Fully managed, serverless
- Dead letter queue support

### SNS (Topic) Properties
- Publish-subscribe pattern
- Fan-out to multiple subscribers
- Push notifications (email, SMS, mobile)
- Integration with AWS services

### Use Cases
- AWS cloud-native applications
- Serverless architectures (Lambda)
- Decoupling microservices
- Push notifications
- Event fan-out

### Pros
- Fully managed (no ops)
- Unlimited scalability
- Pay per use
- Deep AWS integration
- High availability built-in

### Cons
- AWS vendor lock-in
- Limited features vs Kafka/RabbitMQ
- Cost can be high at scale
- No message replay
- Delivery delays possible

## Selection Matrix

| Requirement | Kafka | RabbitMQ | SQS/SNS |
|-------------|-------|----------|---------|
| High throughput | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Low latency | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Event replay | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ |
| Complex routing | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Ease of ops | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Message ordering | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ (FIFO) |
| Multi-subscriber | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (SNS) |

## Decision Guidelines

**Choose Kafka when:**
- Need event sourcing or event streaming
- High throughput requirements (>100k msgs/sec)
- Need to replay events
- Building data pipelines
- Real-time analytics

**Choose RabbitMQ when:**
- Complex routing requirements
- Task/job queuing
- Request/reply patterns
- Priority queues needed
- Lower throughput (<50k msgs/sec)

**Choose SQS/SNS when:**
- AWS cloud-native application
- Want fully managed solution
- Serverless architecture
- Don't need event replay
- Want to minimize operational overhead

## Hybrid Approaches

Many systems use multiple brokers:
- **Kafka** for event streaming and analytics
- **RabbitMQ** for task queues and RPC
- **SNS** for notifications and alerts

## Related Event-Driven Patterns

- **orchestr8://patterns/event-driven-pubsub** - Implementation patterns for pub/sub systems
- **orchestr8://patterns/event-driven-best-practices** - Best practices apply to all brokers
- **orchestr8://patterns/event-driven-saga** - Broker selection affects saga implementation
- **orchestr8://patterns/architecture-microservices** - Broker choice in microservices communication
