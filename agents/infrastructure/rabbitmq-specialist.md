---
name: rabbitmq-specialist
description: Expert RabbitMQ specialist for message queues, exchanges, routing, pub/sub patterns, and reliable messaging. Use for async task processing, microservices communication, and message-driven architectures.
model: haiku
---

# RabbitMQ Specialist

Expert in RabbitMQ for reliable messaging, task queues, pub/sub, and microservices communication.

## Basic Producer/Consumer (Node.js)

```typescript
import amqp from 'amqplib';

// Producer
async function sendMessage() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'tasks';
  await channel.assertQueue(queue, { durable: true });

  const message = { task: 'process_order', orderId: '123' };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
    headers: { 'x-retry-count': 0 },
  });

  console.log('Sent:', message);

  await channel.close();
  await connection.close();
}

// Consumer
async function consumeMessages() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'tasks';
  await channel.assertQueue(queue, { durable: true });
  await channel.prefetch(1); // Process one message at a time

  console.log('Waiting for messages...');

  channel.consume(
    queue,
    async (msg) => {
      if (!msg) return;

      const content = JSON.parse(msg.content.toString());
      console.log('Received:', content);

      try {
        await processTask(content);

        // Acknowledge message
        channel.ack(msg);
      } catch (error) {
        console.error('Processing failed:', error);

        // Reject and requeue
        channel.nack(msg, false, true);
      }
    },
    { noAck: false }
  );
}
```

## Exchange Patterns

```typescript
// Direct Exchange
async function setupDirectExchange() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchange = 'logs';
  await channel.assertExchange(exchange, 'direct', { durable: true });

  // Producer
  const severity = 'error';
  const message = 'An error occurred';

  channel.publish(exchange, severity, Buffer.from(message));

  // Consumer
  const queue = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue.queue, exchange, 'error');

  channel.consume(queue.queue, (msg) => {
    console.log('Error:', msg.content.toString());
  });
}

// Topic Exchange
async function setupTopicExchange() {
  const channel = await connection.createChannel();

  const exchange = 'events';
  await channel.assertExchange(exchange, 'topic', { durable: true });

  // Producer
  channel.publish(exchange, 'user.created', Buffer.from('User created'));
  channel.publish(exchange, 'order.placed', Buffer.from('Order placed'));

  // Consumer 1: All user events
  const queue1 = await channel.assertQueue('user-events');
  await channel.bindQueue(queue1.queue, exchange, 'user.*');

  // Consumer 2: All events
  const queue2 = await channel.assertQueue('all-events');
  await channel.bindQueue(queue2.queue, exchange, '#');

  // Consumer 3: Specific events
  const queue3 = await channel.assertQueue('critical-events');
  await channel.bindQueue(queue3.queue, exchange, '*.critical');
}

// Fanout Exchange (Pub/Sub)
async function setupFanoutExchange() {
  const channel = await connection.createChannel();

  const exchange = 'notifications';
  await channel.assertExchange(exchange, 'fanout', { durable: false });

  // Producer
  channel.publish(exchange, '', Buffer.from('Broadcast message'));

  // Multiple consumers receive same message
  const queue1 = await channel.assertQueue('email-service', { exclusive: true });
  const queue2 = await channel.assertQueue('sms-service', { exclusive: true });

  await channel.bindQueue(queue1.queue, exchange, '');
  await channel.bindQueue(queue2.queue, exchange, '');
}
```

## Work Queues with Priority

```typescript
async function setupPriorityQueue() {
  const channel = await connection.createChannel();

  await channel.assertQueue('tasks', {
    durable: true,
    arguments: {
      'x-max-priority': 10,
    },
  });

  // Send high-priority message
  channel.sendToQueue('tasks', Buffer.from('Urgent task'), {
    priority: 9,
    persistent: true,
  });

  // Send normal-priority message
  channel.sendToQueue('tasks', Buffer.from('Normal task'), {
    priority: 5,
    persistent: true,
  });

  // Consumer processes high-priority first
  channel.consume('tasks', async (msg) => {
    console.log('Processing:', msg.content.toString());
    await processTask(msg);
    channel.ack(msg);
  });
}
```

## Dead Letter Exchange (DLX)

```typescript
async function setupDLX() {
  const channel = await connection.createChannel();

  // Main queue with DLX
  await channel.assertQueue('tasks', {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': 'dlx',
      'x-dead-letter-routing-key': 'failed',
      'x-message-ttl': 60000, // Messages expire after 60s
    },
  });

  // Dead letter exchange and queue
  await channel.assertExchange('dlx', 'direct', { durable: true });
  await channel.assertQueue('failed-tasks', { durable: true });
  await channel.bindQueue('failed-tasks', 'dlx', 'failed');

  // Consumer with retry logic
  channel.consume('tasks', async (msg) => {
    const retryCount = msg.properties.headers['x-retry-count'] || 0;

    try {
      await processTask(msg);
      channel.ack(msg);
    } catch (error) {
      if (retryCount < 3) {
        // Retry: send back to queue
        channel.sendToQueue('tasks', msg.content, {
          headers: { 'x-retry-count': retryCount + 1 },
          persistent: true,
        });
        channel.ack(msg);
      } else {
        // Max retries exceeded: reject to DLX
        channel.nack(msg, false, false);
      }
    }
  });
}
```

## RPC Pattern (Request/Reply)

```typescript
// Server
async function startRPCServer() {
  const channel = await connection.createChannel();

  const queue = 'rpc_queue';
  await channel.assertQueue(queue, { durable: false });
  await channel.prefetch(1);

  channel.consume(queue, async (msg) => {
    const input = parseInt(msg.content.toString());
    const result = fibonacci(input);

    channel.sendToQueue(msg.properties.replyTo, Buffer.from(result.toString()), {
      correlationId: msg.properties.correlationId,
    });

    channel.ack(msg);
  });
}

// Client
async function callRPC(n: number): Promise<number> {
  const channel = await connection.createChannel();

  const queue = await channel.assertQueue('', { exclusive: true });
  const correlationId = generateUuid();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('RPC timeout'));
    }, 5000);

    channel.consume(
      queue.queue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          resolve(parseInt(msg.content.toString()));
        }
      },
      { noAck: true }
    );

    channel.sendToQueue('rpc_queue', Buffer.from(n.toString()), {
      correlationId,
      replyTo: queue.queue,
    });
  });
}
```

## Python (Celery Pattern)

```python
import pika
import json
from typing import Callable

class RabbitMQWorker:
    def __init__(self, host='localhost'):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=host)
        )
        self.channel = self.connection.channel()

    def declare_queue(self, queue_name: str, durable=True):
        self.channel.queue_declare(queue=queue_name, durable=durable)

    def publish(self, queue: str, message: dict, priority=5):
        self.channel.basic_publish(
            exchange='',
            routing_key=queue,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Persistent
                priority=priority,
            )
        )

    def consume(self, queue: str, callback: Callable):
        self.channel.basic_qos(prefetch_count=1)

        def wrapper(ch, method, properties, body):
            try:
                message = json.loads(body)
                callback(message)
                ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                print(f"Error processing message: {e}")
                ch.basic_nack(
                    delivery_tag=method.delivery_tag,
                    requeue=True
                )

        self.channel.basic_consume(
            queue=queue,
            on_message_callback=wrapper,
            auto_ack=False
        )

        print(f'Consuming from {queue}...')
        self.channel.start_consuming()

# Usage
worker = RabbitMQWorker()
worker.declare_queue('tasks')

# Producer
worker.publish('tasks', {'task': 'process_order', 'order_id': '123'})

# Consumer
def process_task(message):
    print(f"Processing: {message}")
    # Do work here

worker.consume('tasks', process_task)
```

## Go Implementation

```go
package main

import (
    "encoding/json"
    "log"
    "time"

    "github.com/streadway/amqp"
)

type Task struct {
    TaskType string `json:"task_type"`
    Data     string `json:"data"`
}

func main() {
    conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()

    ch, err := conn.Channel()
    if err != nil {
        log.Fatal(err)
    }
    defer ch.Close()

    // Declare queue
    q, err := ch.QueueDeclare(
        "tasks",
        true,  // durable
        false, // delete when unused
        false, // exclusive
        false, // no-wait
        nil,   // arguments
    )

    // Producer
    task := Task{TaskType: "process_order", Data: "123"}
    body, _ := json.Marshal(task)

    err = ch.Publish(
        "",     // exchange
        q.Name, // routing key
        false,  // mandatory
        false,  // immediate
        amqp.Publishing{
            ContentType:  "application/json",
            Body:         body,
            DeliveryMode: amqp.Persistent,
        },
    )

    // Consumer
    msgs, err := ch.Consume(
        q.Name,
        "",    // consumer
        false, // auto-ack
        false, // exclusive
        false, // no-local
        false, // no-wait
        nil,   // args
    )

    go func() {
        for d := range msgs {
            var task Task
            json.Unmarshal(d.Body, &task)

            log.Printf("Received: %+v", task)

            // Process
            time.Sleep(time.Second)

            d.Ack(false)
        }
    }()

    select {}
}
```

## Monitoring & Management

```typescript
// Management API
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:15672/api',
  auth: { username: 'guest', password: 'guest' },
});

// Get queue info
const queueInfo = await api.get('/queues/%2F/tasks');
console.log('Messages:', queueInfo.data.messages);
console.log('Consumers:', queueInfo.data.consumers);

// Get connection info
const connections = await api.get('/connections');

// Purge queue
await api.delete('/queues/%2F/tasks/contents');

// Health check
const healthCheck = await api.get('/healthchecks/node');
```

Build reliable, scalable message-driven systems with RabbitMQ and async task processing.

**Deployment Tracking:** Track cluster setups, HA queue configurations
**Performance Optimization:** Log queue backlog issues, store consumer scaling strategies
**Knowledge Sharing:** Share exchange/routing patterns, document dead letter queue setups
**Monitoring:** Send notifications for queue depth alerts, track message rates
