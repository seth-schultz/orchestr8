---
id: neo4j-nodejs-driver
category: example
tags: [neo4j, nodejs, javascript, driver, transactions]
capabilities:
  - Neo4j driver setup and configuration
  - Read and write transactions
  - Parameterized queries for security
  - Session management best practices
  - Complex graph traversals
useWhen:
  - Building Node.js applications with Neo4j
  - Need production-ready transaction handling
  - Implementing graph queries from JavaScript
  - Managing database connections and sessions
estimatedTokens: 920
relatedResources:
  - orchestr8://agents/neo4j-specialist
---

# Neo4j Node.js Driver

## Overview
Production-ready Neo4j integration for Node.js with proper session management, transactions, and error handling.

## Implementation

```javascript
import neo4j from 'neo4j-driver';

// Create driver
const driver = neo4j.driver(
    'neo4j://localhost:7687',
    neo4j.auth.basic('neo4j', 'password'),
    {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 60000
    }
);

// Session management
async function createUser(user) {
    const session = driver.session({ database: 'neo4j' });

    try {
        const result = await session.executeWrite(async tx => {
            return await tx.run(
                `CREATE (u:User {
                    id: $id,
                    name: $name,
                    email: $email,
                    createdAt: datetime()
                })
                RETURN u`,
                { id: user.id, name: user.name, email: user.email }
            );
        });

        return result.records[0].get('u').properties;
    } finally {
        await session.close();
    }
}

// Read transaction
async function getUser(userId) {
    const session = driver.session();

    try {
        const result = await session.executeRead(async tx => {
            return await tx.run(
                'MATCH (u:User {id: $id}) RETURN u',
                { id: userId }
            );
        });

        if (result.records.length === 0) {
            return null;
        }

        return result.records[0].get('u').properties;
    } finally {
        await session.close();
    }
}

// Complex query with relationships
async function getUserPurchases(userId) {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId})-[r:PURCHASED]->(p:Product)
             RETURN p.name as product, r.date as purchaseDate, r.amount as amount
             ORDER BY r.date DESC`,
            { userId }
        );

        return result.records.map(record => ({
            product: record.get('product'),
            purchaseDate: record.get('purchaseDate').toString(),
            amount: record.get('amount')
        }));
    } finally {
        await session.close();
    }
}

// Transaction with multiple operations
async function createOrder(order) {
    const session = driver.session();

    try {
        return await session.executeWrite(async tx => {
            // Create order node
            await tx.run(
                `CREATE (o:Order {
                    id: $id,
                    userId: $userId,
                    total: $total,
                    createdAt: datetime()
                })`,
                { id: order.id, userId: order.userId, total: order.total }
            );

            // Create relationships to products
            for (const item of order.items) {
                await tx.run(
                    `MATCH (o:Order {id: $orderId})
                     MATCH (p:Product {id: $productId})
                     CREATE (o)-[:CONTAINS {
                         quantity: $quantity,
                         price: $price
                     }]->(p)`,
                    {
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }
                );
            }

            return order.id;
        });
    } finally {
        await session.close();
    }
}

// Streaming large results
async function streamAllUsers(callback) {
    const session = driver.session();

    try {
        const result = await session.run('MATCH (u:User) RETURN u');

        result.records.forEach(record => {
            callback(record.get('u').properties);
        });
    } finally {
        await session.close();
    }
}

// Close driver on app shutdown
async function cleanup() {
    await driver.close();
}
```

## Usage Notes

**Driver Configuration:**
- Connection pooling with max pool size
- Timeout for connection acquisition
- Basic authentication with username/password
- Support for multiple databases (Neo4j 4.0+)

**Session Management:**
- Always close sessions in `finally` block
- Use `executeWrite` for write transactions
- Use `executeRead` for read transactions
- Specify database name if not using default

**Transactions:**
- `executeWrite` - Automatically retries on transient errors
- `executeRead` - Routes to read replicas in cluster
- Multiple operations in single transaction for atomicity
- Rollback automatic on exceptions

**Parameterized Queries:**
- Always use parameters (`$id`, `$name`) for values
- Prevents Cypher injection attacks
- Enables query plan caching
- Better performance

**Error Handling:**
- Driver throws on connection errors
- Transaction failures trigger automatic retries
- Close session even on errors (finally block)
- Check for empty results before accessing

**Best Practices:**
- Use connection pooling (don't create drivers repeatedly)
- Close driver on application shutdown
- Prefer `executeRead/executeWrite` over manual transactions
- Return structured data from queries
