---
id: dynamodb-data-modeling
category: example
tags: [dynamodb, nosql, data-modeling, single-table-design]
capabilities:
  - Single-table design patterns
  - Partition key and sort key strategies
  - GSI design for inverted relationships
  - Hierarchical data modeling
useWhen:
  - Designing DynamoDB schemas for complex applications
  - Implementing single-table design patterns
  - Modeling relationships in NoSQL
  - Optimizing access patterns for DynamoDB
estimatedTokens: 800
relatedResources:
  - orchestr8://agents/dynamodb-specialist
  - orchestr8://skills/data-modeling-best-practices
---

# DynamoDB Data Modeling Best Practices

Single-table design patterns with partition keys, sort keys, and GSI strategies.

## Overview

Demonstrates production-ready DynamoDB data modeling using single-table design for an e-commerce application with users, orders, products, and reviews.

## Implementation

```javascript
// Single-table design pattern (recommended)
// One table to rule them all - denormalization is key

// Primary Key Design:
// PK (Partition Key): Determines data distribution
// SK (Sort Key): Enables range queries and relationships

// Example: E-commerce application
const items = [
    // User entity
    {
        PK: 'USER#123',
        SK: 'METADATA',
        Type: 'User',
        Email: 'john@example.com',
        Name: 'John Doe',
        CreatedAt: '2024-01-15T10:00:00Z'
    },

    // User's orders
    {
        PK: 'USER#123',
        SK: 'ORDER#2024-01-15#001',
        Type: 'Order',
        OrderID: 'ORDER#001',
        Amount: 99.99,
        Status: 'completed',
        OrderDate: '2024-01-15T10:30:00Z'
    },

    // Product entity
    {
        PK: 'PRODUCT#456',
        SK: 'METADATA',
        Type: 'Product',
        Name: 'Widget',
        Price: 29.99,
        Category: 'Electronics',
        Stock: 100
    },

    // Product reviews
    {
        PK: 'PRODUCT#456',
        SK: 'REVIEW#USER#123',
        Type: 'Review',
        Rating: 5,
        Comment: 'Great product!',
        ReviewDate: '2024-01-16T14:00:00Z'
    },

    // Order item (supports complex queries)
    {
        PK: 'ORDER#001',
        SK: 'PRODUCT#456',
        Type: 'OrderItem',
        Quantity: 2,
        Price: 29.99
    }
];

// GSI for inverted relationships
// GSI1PK and GSI1SK enable reverse lookups

// Access Patterns Examples:
// 1. Get user by ID: Query PK='USER#123', SK begins_with 'METADATA'
// 2. Get user's orders: Query PK='USER#123', SK begins_with 'ORDER#'
// 3. Get orders by date range: Query PK='USER#123', SK between 'ORDER#2024-01-01' and 'ORDER#2024-01-31'
// 4. Get product reviews: Query PK='PRODUCT#456', SK begins_with 'REVIEW#'
// 5. Get order items: Query PK='ORDER#001'

// Composite keys for complex hierarchies
const hierarchicalData = {
    PK: 'ORG#acme',
    SK: 'DEPT#engineering#TEAM#backend#USER#john',
    Type: 'TeamMember',
    Role: 'Senior Engineer'
};
```

## Usage Notes

- Use composite keys (PK/SK) for flexible access patterns
- Denormalize data to avoid expensive joins
- Design PK for even distribution across partitions
- Use SK for hierarchical queries and range operations
- Add GSI for inverted relationships
- Include Type field for filtering by entity type
- Use consistent naming conventions (e.g., ENTITY#ID)
