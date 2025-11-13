---
id: dynamodb-sdk-operations
category: example
tags: [dynamodb, aws-sdk, crud, transactions]
capabilities:
  - AWS SDK v3 CRUD operations
  - Query and batch operations
  - Transaction handling
  - Conditional writes and atomic counters
useWhen:
  - Implementing DynamoDB CRUD operations
  - Building transactional workflows
  - Handling batch operations
  - Implementing atomic updates and counters
estimatedTokens: 1100
relatedResources:
  - orchestr8://agents/dynamodb-specialist
  - orchestr8://agents/typescript-core
---

# DynamoDB AWS SDK v3 Operations

Complete CRUD, query, transaction, and batch operations using AWS SDK v3.

## Implementation

```javascript
import {
    DynamoDBClient,
    PutItemCommand,
    GetItemCommand,
    QueryCommand,
    UpdateItemCommand,
    DeleteItemCommand,
    BatchWriteItemCommand,
    TransactWriteItemsCommand
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

// Put item
async function createUser(user) {
    const command = new PutItemCommand({
        TableName: 'MyTable',
        Item: marshall({
            PK: `USER#${user.id}`,
            SK: 'METADATA',
            Type: 'User',
            ...user
        }),
        // Conditional: Only create if not exists
        ConditionExpression: 'attribute_not_exists(PK)'
    });

    try {
        await client.send(command);
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            console.log('User already exists');
        }
        throw error;
    }
}

// Get item
async function getUser(userId) {
    const command = new GetItemCommand({
        TableName: 'MyTable',
        Key: marshall({
            PK: `USER#${userId}`,
            SK: 'METADATA'
        })
    });

    const response = await client.send(command);
    return response.Item ? unmarshall(response.Item) : null;
}

// Query (same partition key)
async function getUserOrders(userId, startDate, endDate) {
    const command = new QueryCommand({
        TableName: 'MyTable',
        KeyConditionExpression: 'PK = :pk AND SK BETWEEN :start AND :end',
        ExpressionAttributeValues: marshall({
            ':pk': `USER#${userId}`,
            ':start': `ORDER#${startDate}`,
            ':end': `ORDER#${endDate}`
        })
    });

    const response = await client.send(command);
    return response.Items.map(item => unmarshall(item));
}

// Update item
async function updateUserEmail(userId, newEmail) {
    const command = new UpdateItemCommand({
        TableName: 'MyTable',
        Key: marshall({
            PK: `USER#${userId}`,
            SK: 'METADATA'
        }),
        UpdateExpression: 'SET Email = :email, UpdatedAt = :now',
        ExpressionAttributeValues: marshall({
            ':email': newEmail,
            ':now': new Date().toISOString()
        }),
        ReturnValues: 'ALL_NEW'
    });

    const response = await client.send(command);
    return unmarshall(response.Item);
}

// Atomic counter increment
async function incrementPageViews(pageId) {
    const command = new UpdateItemCommand({
        TableName: 'MyTable',
        Key: marshall({ PK: `PAGE#${pageId}`, SK: 'STATS' }),
        UpdateExpression: 'ADD ViewCount :inc',
        ExpressionAttributeValues: marshall({ ':inc': 1 }),
        ReturnValues: 'ALL_NEW'
    });

    const response = await client.send(command);
    return unmarshall(response.Item).ViewCount;
}

// Conditional update
async function updateOrderStatus(orderId, expectedStatus, newStatus) {
    const command = new UpdateItemCommand({
        TableName: 'MyTable',
        Key: marshall({ PK: `ORDER#${orderId}`, SK: 'METADATA' }),
        UpdateExpression: 'SET #status = :newStatus',
        ConditionExpression: '#status = :expectedStatus',
        ExpressionAttributeNames: { '#status': 'Status' },
        ExpressionAttributeValues: marshall({
            ':newStatus': newStatus,
            ':expectedStatus': expectedStatus
        })
    });

    await client.send(command);
}

// Batch write (up to 25 items)
async function batchCreateUsers(users) {
    const command = new BatchWriteItemCommand({
        RequestItems: {
            'MyTable': users.map(user => ({
                PutRequest: {
                    Item: marshall({
                        PK: `USER#${user.id}`,
                        SK: 'METADATA',
                        Type: 'User',
                        ...user
                    })
                }
            }))
        }
    });

    await client.send(command);
}

// Transaction (all or nothing, up to 100 items)
async function createOrderWithItems(order, items) {
    const command = new TransactWriteItemsCommand({
        TransactItems: [
            // Create order
            {
                Put: {
                    TableName: 'MyTable',
                    Item: marshall({
                        PK: `ORDER#${order.id}`,
                        SK: 'METADATA',
                        Type: 'Order',
                        ...order
                    })
                }
            },
            // Create order items
            ...items.map(item => ({
                Put: {
                    TableName: 'MyTable',
                    Item: marshall({
                        PK: `ORDER#${order.id}`,
                        SK: `ITEM#${item.productId}`,
                        Type: 'OrderItem',
                        ...item
                    })
                }
            })),
            // Update user's order count
            {
                Update: {
                    TableName: 'MyTable',
                    Key: marshall({ PK: `USER#${order.userId}`, SK: 'METADATA' }),
                    UpdateExpression: 'ADD OrderCount :inc',
                    ExpressionAttributeValues: marshall({ ':inc': 1 })
                }
            }
        ]
    });

    await client.send(command);
}

// Pagination
async function getAllUsers() {
    let lastEvaluatedKey = null;
    const allUsers = [];

    do {
        const command = new QueryCommand({
            TableName: 'MyTable',
            IndexName: 'TypeIndex',
            KeyConditionExpression: '#type = :type',
            ExpressionAttributeNames: { '#type': 'Type' },
            ExpressionAttributeValues: marshall({ ':type': 'User' }),
            Limit: 100,
            ExclusiveStartKey: lastEvaluatedKey
        });

        const response = await client.send(command);
        allUsers.push(...response.Items.map(item => unmarshall(item)));
        lastEvaluatedKey = response.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return allUsers;
}
```

## Usage Notes

- Use conditional expressions to prevent race conditions
- Batch operations for efficiency (max 25 items)
- Transactions for ACID guarantees (max 100 items)
- Implement pagination for large result sets
- Use atomic counters (ADD) for concurrent updates
- Always handle ConditionalCheckFailedException
- Marshall/unmarshall for type conversion
