---
id: dynamodb-advanced-features
category: example
tags: [dynamodb, streams, dax, ttl, gsi]
capabilities:
  - DynamoDB Streams event processing
  - DAX caching for read performance
  - TTL for automatic data expiration
  - GSI configuration and querying
useWhen:
  - Implementing event-driven architectures with DynamoDB
  - Optimizing read-heavy workloads with DAX
  - Implementing automatic data expiration
  - Designing secondary indexes for access patterns
estimatedTokens: 1000
relatedResources:
  - orchestr8://agents/dynamodb-specialist
  - orchestr8://patterns/event-driven-pubsub
---

# DynamoDB Advanced Features

Streams, DAX caching, TTL, and Global Secondary Indexes.

## DynamoDB Streams

```javascript
import { DynamoDBStreamsClient, GetRecordsCommand } from '@aws-sdk/client-dynamodb-streams';

// Lambda function to process DynamoDB Stream
export async function handler(event) {
    for (const record of event.Records) {
        console.log('Event:', record.eventName); // INSERT, MODIFY, REMOVE

        if (record.eventName === 'INSERT') {
            const newItem = unmarshall(record.dynamodb.NewImage);
            console.log('New item:', newItem);

            // Trigger actions based on new items
            if (newItem.Type === 'Order') {
                await sendOrderConfirmationEmail(newItem);
                await updateInventory(newItem);
            }
        }

        if (record.eventName === 'MODIFY') {
            const oldItem = unmarshall(record.dynamodb.OldImage);
            const newItem = unmarshall(record.dynamodb.NewImage);

            // Detect changes
            if (oldItem.Status !== newItem.Status) {
                await sendStatusUpdateNotification(newItem);
            }
        }

        if (record.eventName === 'REMOVE') {
            const deletedItem = unmarshall(record.dynamodb.OldImage);
            await archiveDeletedItem(deletedItem);
        }
    }
}

// CDC (Change Data Capture) pattern
async function processStreamRecord(record) {
    const { eventName, dynamodb } = record;

    switch (eventName) {
        case 'INSERT':
            return handleInsert(unmarshall(dynamodb.NewImage));
        case 'MODIFY':
            return handleUpdate(
                unmarshall(dynamodb.OldImage),
                unmarshall(dynamodb.NewImage)
            );
        case 'REMOVE':
            return handleDelete(unmarshall(dynamodb.OldImage));
    }
}
```

## DAX Caching

```javascript
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
const AmazonDaxClient = require('amazon-dax-client');

// DAX client
const daxClient = new AmazonDaxClient({
    endpoints: ['mycluster.dax-clusters.us-east-1.amazonaws.com:8111'],
    region: 'us-east-1'
});

const daxDocClient = DynamoDBDocument.from(daxClient);

// Use DAX for read-heavy workloads
async function getProductWithCache(productId) {
    // DAX provides microsecond latency for cached items
    const result = await daxDocClient.get({
        TableName: 'MyTable',
        Key: {
            PK: `PRODUCT#${productId}`,
            SK: 'METADATA'
        }
    });

    return result.Item;
}

// Write-through cache (DAX automatically invalidates)
async function updateProduct(productId, updates) {
    await daxDocClient.update({
        TableName: 'MyTable',
        Key: {
            PK: `PRODUCT#${productId}`,
            SK: 'METADATA'
        },
        UpdateExpression: 'SET #name = :name, Price = :price',
        ExpressionAttributeNames: { '#name': 'Name' },
        ExpressionAttributeValues: updates
    });
}
```

## TTL (Time To Live)

```javascript
// Enable TTL on table (via AWS Console or CLI)
// aws dynamodb update-time-to-live \
//   --table-name MyTable \
//   --time-to-live-specification "Enabled=true, AttributeName=ExpiresAt"

// Create item with TTL
async function createSession(sessionId, userId, expiresInSeconds) {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

    const command = new PutItemCommand({
        TableName: 'MyTable',
        Item: marshall({
            PK: `SESSION#${sessionId}`,
            SK: 'METADATA',
            Type: 'Session',
            UserID: userId,
            CreatedAt: new Date().toISOString(),
            ExpiresAt: expiresAt // Unix timestamp
        })
    });

    await client.send(command);
}

// Items are automatically deleted after ExpiresAt time
// Deletion happens within 48 hours (background process)
```

## Global Secondary Indexes

```javascript
// Create table with GSI (CloudFormation/CDK)
const tableDefinition = {
    TableName: 'MyTable',
    KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'Type', AttributeType: 'S' },
        { AttributeName: 'GSI1PK', AttributeType: 'S' },
        { AttributeName: 'GSI1SK', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'TypeIndex',
            KeySchema: [
                { AttributeName: 'Type', KeyType: 'HASH' },
                { AttributeName: 'SK', KeyType: 'RANGE' }
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        {
            IndexName: 'GSI1',
            KeySchema: [
                { AttributeName: 'GSI1PK', KeyType: 'HASH' },
                { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
            ],
            Projection: { ProjectionType: 'ALL' }
        }
    ],
    BillingMode: 'PAY_PER_REQUEST' // On-demand pricing
};

// Query GSI
async function getUsersByEmail(email) {
    const command = new QueryCommand({
        TableName: 'MyTable',
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'Email = :email',
        ExpressionAttributeValues: marshall({ ':email': email })
    });

    const response = await client.send(command);
    return response.Items.map(item => unmarshall(item));
}

// Sparse index pattern (only items with attribute are indexed)
const itemWithGSI = {
    PK: 'USER#123',
    SK: 'METADATA',
    Type: 'User',
    Email: 'john@example.com',
    GSI1PK: 'john@example.com', // Only set for queryable items
    GSI1SK: 'USER#123'
};
```

## Usage Notes

- Use Streams for event-driven architectures and CDC
- Enable DAX for read-heavy workloads (microsecond latency)
- Implement TTL for automatic session/cache expiration
- Design GSIs for inverted access patterns
- Use sparse indexes to save costs
- Stream processing is eventually consistent (sub-second latency)
- DAX write-through caching handles invalidation automatically
