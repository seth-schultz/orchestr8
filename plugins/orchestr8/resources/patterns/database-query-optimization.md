---
id: database-query-optimization
category: pattern
tags: [database, query-optimization, n+1-problem, performance, orm, dataloader]
capabilities:
  - N+1 query problem detection and solution
  - Query optimization techniques
  - DataLoader pattern implementation
  - Efficient ORM usage patterns
useWhen:
  - N+1 query problem resolution requiring eager loading with include/relations or DataLoader batching for GraphQL APIs
  - ORM query optimization with Sequelize, TypeORM, or Prisma needing query builder patterns and raw SQL for complex aggregations
  - High query count scenarios requiring batch loading, query result caching, and pagination with cursor-based navigation
  - Slow query performance needing SELECT column limitation, JOIN optimization, and subquery to CTE conversion
  - GraphQL resolver optimization requiring DataLoader implementation to batch and cache database requests per HTTP request
estimatedTokens: 780
---

# Database Query Optimization

Patterns for optimizing database queries, eliminating N+1 problems, and improving query efficiency in TypeScript applications.

## N+1 Query Problem

### The Problem
```typescript
// BAD: N+1 Query Problem
async function getUsersWithOrders() {
  const users = await User.findAll(); // 1 query

  for (const user of users) {
    user.orders = await Order.findAll({  // N queries (1 per user)!
      where: { userId: user.id }
    });
  }

  return users; // Total: 1 + N queries
}

// With 100 users: 101 queries!
```

### Solution 1: Eager Loading
```typescript
// GOOD: Eager Loading
async function getUsersWithOrders() {
  return User.findAll({
    include: [{
      model: Order,
      as: 'orders'
    }]
  }); // 1-2 queries total (JOIN or separate query)
}

// With 100 users: 1-2 queries
```

### Solution 2: DataLoader (Best)
```typescript
import DataLoader from 'dataloader';

class OrderLoader {
  private loader: DataLoader<string, Order[]>;

  constructor(private orderRepository: OrderRepository) {
    this.loader = new DataLoader(
      async (userIds: readonly string[]) => {
        // Batch load orders for all users at once
        const orders = await this.orderRepository.findByUserIds(Array.from(userIds));

        // Group orders by user ID
        const ordersByUserId = new Map<string, Order[]>();
        orders.forEach(order => {
          const userOrders = ordersByUserId.get(order.userId) || [];
          userOrders.push(order);
          ordersByUserId.set(order.userId, userOrders);
        });

        // Return in same order as requested
        return userIds.map(id => ordersByUserId.get(id) || []);
      },
      {
        cache: true, // Cache results within request
        maxBatchSize: 100 // Limit batch size
      }
    );
  }

  async loadOrdersForUser(userId: string): Promise<Order[]> {
    return this.loader.load(userId);
  }
}

// Usage
const orderLoader = new OrderLoader(orderRepository);

const users = await User.findAll();
const usersWithOrders = await Promise.all(
  users.map(async user => ({
    ...user,
    orders: await orderLoader.loadOrdersForUser(user.id)
  }))
);

// DataLoader batches all loads into 1 query + caches results
```

## Query Optimization Techniques

### 1. Select Only Needed Columns
```typescript
// BAD: SELECT *
const user = await User.findById(id);
// Fetches all columns, even if only need name/email

// GOOD: Select specific columns
const user = await User.findById(id, {
  attributes: ['id', 'name', 'email', 'createdAt']
});
// Fetches only required columns, less data transfer
```

### 2. Paginate Large Result Sets
```typescript
async function getOrders(page: number = 1, limit: number = 50) {
  const offset = (page - 1) * limit;

  const { rows, count } = await Order.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
}
```

### 3. Database Aggregations, Not Application Logic
```typescript
// BAD: Fetch all and calculate in application
async function getOrderStats(userId: string) {
  const orders = await Order.findAll({ where: { userId } });

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);
  const avgOrderValue = totalSpent / totalOrders;

  return { totalOrders, totalSpent, avgOrderValue };
}

// GOOD: Aggregate in database
async function getOrderStats(userId: string) {
  const [result] = await Order.findAll({
    where: { userId },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
      [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent'],
      [sequelize.fn('AVG', sequelize.col('amount')), 'avgOrderValue']
    ],
    raw: true
  });

  return result;
}
// Much faster, less data transfer
```

### 4. Avoid LIKE with Leading Wildcard
```typescript
// BAD: Can't use index
await Product.findAll({
  where: {
    name: { [Op.like]: `%laptop%` } // Leading wildcard prevents index use
  }
});

// BETTER: Prefix search can use index
await Product.findAll({
  where: {
    name: { [Op.like]: `laptop%` } // Can use index
  }
});

// BEST: Full-text search
await Product.findAll({
  where: sequelize.literal(
    `to_tsvector('english', name) @@ to_tsquery('english', ?)`,
    query
  )
});
```

### 5. EXISTS Instead of COUNT for Existence Checks
```typescript
// BAD: Counts all rows
async function userHasOrders(userId: string): Promise<boolean> {
  const count = await Order.count({ where: { userId } });
  return count > 0;
}

// GOOD: Stops at first match
async function userHasOrders(userId: string): Promise<boolean> {
  const order = await Order.findOne({
    where: { userId },
    attributes: ['id']
  });
  return !!order;
}
```

### 6. Batch Operations
```typescript
// BAD: Insert in loop
for (const item of items) {
  await Product.create(item); // N queries
}

// GOOD: Bulk insert
await Product.bulkCreate(items); // 1 query

// BETTER: With transaction
await sequelize.transaction(async (transaction) => {
  await Product.bulkCreate(items, { transaction });
});
```

## Advanced Patterns

### Subquery Optimization
```typescript
// Get users with recent orders
const users = await User.findAll({
  where: {
    id: {
      [Op.in]: sequelize.literal(`
        (SELECT DISTINCT user_id
         FROM orders
         WHERE created_at > NOW() - INTERVAL '30 days')
      `)
    }
  }
});
```

### Conditional Queries
```typescript
interface FilterOptions {
  status?: string;
  minAmount?: number;
  userId?: string;
}

async function getOrders(filters: FilterOptions) {
  const where: any = {};

  // Build where clause conditionally
  if (filters.status) where.status = filters.status;
  if (filters.minAmount) where.amount = { [Op.gte]: filters.minAmount };
  if (filters.userId) where.userId = filters.userId;

  return Order.findAll({ where });
}
```

### Query Result Caching
```typescript
import { createClient } from 'redis';

class CachedQueryService {
  private redis = createClient();

  async getOrderSummary(orderId: string) {
    const cacheKey = `order:${orderId}:summary`;

    // Try cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Cache miss: query database
    const summary = await Order.findOne({
      where: { id: orderId },
      include: [/* relations */]
    });

    // Cache for 5 minutes
    await this.redis.setEx(cacheKey, 300, JSON.stringify(summary));

    return summary;
  }
}
```

## Query Monitoring

### Log Slow Queries
```typescript
class QueryMonitor {
  async query<T>(queryFn: () => Promise<T>): Promise<T> {
    const start = Date.now();

    try {
      const result = await queryFn();
      const duration = Date.now() - start;

      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query (${duration}ms)`);
      }

      return result;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }
}
```

### EXPLAIN Analysis
```typescript
// Analyze query plan
async function analyzeQuery() {
  const result = await sequelize.query(
    `EXPLAIN ANALYZE
     SELECT * FROM orders
     WHERE user_id = ? AND status = ?`,
    { bind: [userId, 'pending'] }
  );

  console.log('Query Plan:', result);
}
```

## Best Practices

✅ **Eager load associations** - Avoid N+1 problems
✅ **Use DataLoader for batching** - Automatic batching and caching
✅ **Select only needed columns** - Reduce data transfer
✅ **Paginate large results** - Never fetch all rows
✅ **Aggregate in database** - Don't compute in application
✅ **Use appropriate indexes** - Ensure queries can use indexes
✅ **Monitor slow queries** - Track and optimize >100ms queries

❌ **Don't use lazy loading** - Causes N+1 problems
❌ **Don't SELECT *** - Wastes bandwidth
❌ **Don't fetch all rows** - Always paginate
❌ **Don't loop over queries** - Use bulk operations
❌ **Don't ignore query plans** - EXPLAIN reveals issues

## When to Apply

- Queries taking >100ms
- High number of database queries per request
- N+1 query patterns detected
- Full table scans in query plans
- Slow page load times
- Database CPU/IO saturation

## Related Database Patterns

- **orchestr8://patterns/database-indexing-strategies** - Add indexes to speed up queries
- **orchestr8://patterns/database-connection-pooling-scaling** - Connection pooling and read replicas
- **orchestr8://patterns/performance-caching** - Cache queries with Redis to reduce database hits
