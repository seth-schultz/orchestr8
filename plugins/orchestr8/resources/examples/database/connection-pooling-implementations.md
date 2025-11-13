---
id: connection-pooling-implementations
category: example
tags: [database, postgresql, connection-pooling, read-replicas, sharding, typescript]
capabilities:
  - Complete PostgreSQL connection pool implementation with pg library
  - Read replica router with round-robin load balancing
  - Database sharding with hash-based, range-based, and geographic strategies
  - Connection management with transactions and health checks
  - Pool monitoring and metrics
useWhen:
  - Implementing PostgreSQL connection pooling in TypeScript applications
  - Setting up read replica routing with automatic failover
  - Building sharded database architecture with consistent hashing
  - Creating database health check and monitoring utilities
  - Need production-ready connection management examples
estimatedTokens: 1200
relatedResources:
  - orchestr8://patterns/database-connection-pooling-scaling
---

# Database Connection Pooling - Complete Implementations

Production-ready connection pooling, read replica routing, and sharding implementations for PostgreSQL.

## PostgreSQL Connection Pool

```typescript
import { Pool, PoolClient } from 'pg';

class DatabaseConnectionPool {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,

      // Connection pool settings
      max: 20,                    // Maximum connections
      min: 5,                     // Minimum connections
      idleTimeoutMillis: 30000,   // Close idle connections after 30s
      connectionTimeoutMillis: 2000, // Timeout acquiring connection
      allowExitOnIdle: false,     // Keep pool alive
    });

    // Monitor pool health
    this.pool.on('error', (err) => {
      console.error('Unexpected database error', err);
    });

    this.pool.on('connect', () => {
      console.log('New database connection established');
    });
  }

  async query<T>(text: string, params?: any[]): Promise<T[]> {
    const start = Date.now();

    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query (${duration}ms):`, text);
      }

      return result.rows;
    } catch (error) {
      console.error('Query error:', text, params, error);
      throw error;
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release(); // Return connection to pool
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
```

## Pool Configuration Guidelines

```typescript
// Development (low traffic)
const devConfig = {
  max: 10,    // Fewer connections
  min: 2,     // Minimal idle
  idleTimeoutMillis: 10000
};

// Production (moderate traffic)
const prodConfig = {
  max: 20,    // More connections
  min: 5,     // Keep some idle
  idleTimeoutMillis: 30000
};

// Production (high traffic)
const highTrafficConfig = {
  max: 50,    // Many connections
  min: 10,    // Keep pool warm
  idleTimeoutMillis: 60000
};

// Rule of thumb: max = (available_connections * 0.8) / num_app_instances
```

## Read Replica Router

```typescript
class DatabaseRouter {
  private primary: Pool;
  private replicas: Pool[];
  private replicaIndex: number = 0;

  constructor() {
    this.primary = new Pool({ /* primary config */ });
    this.replicas = [
      new Pool({ host: 'replica1.db.com', /* ... */ }),
      new Pool({ host: 'replica2.db.com', /* ... */ })
    ];
  }

  // Write operations go to primary
  async write(query: string, params?: any[]) {
    return this.primary.query(query, params);
  }

  // Read operations go to replicas (round-robin)
  async read(query: string, params?: any[]) {
    const replica = this.replicas[this.replicaIndex];
    this.replicaIndex = (this.replicaIndex + 1) % this.replicas.length;
    return replica.query(query, params);
  }

  // Read from primary (for critical reads requiring latest data)
  async readFromPrimary(query: string, params?: any[]) {
    return this.primary.query(query, params);
  }
}
```

## Service Layer with Read Replicas

```typescript
class UserService {
  constructor(private db: DatabaseRouter) {}

  // Read operations use replicas
  async getUser(id: string): Promise<User> {
    const [user] = await this.db.read(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return user;
  }

  async listUsers(limit: number = 50): Promise<User[]> {
    return this.db.read(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
  }

  // Write operations use primary
  async createUser(data: CreateUserDto): Promise<User> {
    const [user] = await this.db.write(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [data.name, data.email]
    );
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const [user] = await this.db.write(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
      [data.name, id]
    );
    return user;
  }

  // Critical read that needs latest data
  async getUserAfterWrite(id: string): Promise<User> {
    return this.db.readFromPrimary(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
  }
}
```

## Database Sharding

### Hash-Based Sharding

```typescript
class ShardedDatabase {
  private shards: Pool[];

  constructor(shardConfigs: DatabaseConfig[]) {
    this.shards = shardConfigs.map(config => new Pool(config));
  }

  // Determine shard based on user ID
  private getShardForUser(userId: string): Pool {
    const hash = this.hashUserId(userId);
    const shardIndex = hash % this.shards.length;
    return this.shards[shardIndex];
  }

  private hashUserId(userId: string): number {
    // Simple hash (use better hash in production like xxhash)
    return userId.split('').reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
  }

  async getUserById(userId: string): Promise<User> {
    const shard = this.getShardForUser(userId);
    const result = await shard.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0];
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const shard = this.getShardForUser(user.id);
    const result = await shard.query(
      'INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *',
      [user.id, user.name, user.email]
    );
    return result.rows[0];
  }

  // Cross-shard query (expensive, avoid if possible)
  async getAllUsers(): Promise<User[]> {
    const results = await Promise.all(
      this.shards.map(shard =>
        shard.query('SELECT * FROM users')
      )
    );

    return results.flatMap(r => r.rows);
  }
}
```

### Range-Based Sharding

```typescript
// Shard 1: users with ID 1-1000000
// Shard 2: users with ID 1000001-2000000
private getShardByRange(userId: number): Pool {
  const usersPerShard = 1000000;
  const shardIndex = Math.floor((userId - 1) / usersPerShard);
  return this.shards[shardIndex];
}
```

### Geographic Sharding

```typescript
// Shard by region for data locality
private getShardByRegion(region: string): Pool {
  const shardMap = {
    'us-east': 0,
    'us-west': 1,
    'eu': 2,
    'asia': 3
  };
  return this.shards[shardMap[region]];
}
```

## Connection Management Best Practices

### Always Release Connections

```typescript
// BAD
const client = await pool.connect();
await client.query('SELECT * FROM users');
// Connection never released!

// GOOD
const client = await pool.connect();
try {
  await client.query('SELECT * FROM users');
} finally {
  client.release(); // Always release
}
```

### Use Transactions for Related Operations

```typescript
await db.transaction(async (client) => {
  await client.query('INSERT INTO orders ...');
  await client.query('UPDATE inventory ...');
  // Both succeed or both rollback
});
```

### Monitor Connection Pool Metrics

```typescript
setInterval(() => {
  console.log({
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount
  });
}, 60000);
```

## Connection Pool Monitoring

```typescript
class PoolMonitor {
  constructor(private pool: Pool) {}

  getMetrics() {
    return {
      total: this.pool.totalCount,
      idle: this.pool.idleCount,
      waiting: this.pool.waitingCount
    };
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  startMonitoring(intervalMs: number = 60000) {
    setInterval(() => {
      const metrics = this.getMetrics();
      console.log('Pool metrics:', metrics);

      // Alert if pool exhausted
      if (metrics.waiting > 0) {
        console.warn('⚠️  Connection pool exhausted!', metrics);
      }

      // Alert if too many idle
      if (metrics.idle > metrics.total * 0.8) {
        console.warn('⚠️  Too many idle connections', metrics);
      }
    }, intervalMs);
  }
}
```

## Usage Example

```typescript
// Initialize
const db = new DatabaseConnectionPool();
const monitor = new PoolMonitor(db.pool);
monitor.startMonitoring();

// Simple query
const users = await db.query<User>('SELECT * FROM users WHERE active = $1', [true]);

// Transaction
await db.transaction(async (client) => {
  await client.query('INSERT INTO orders (user_id, total) VALUES ($1, $2)', [userId, total]);
  await client.query('UPDATE users SET order_count = order_count + 1 WHERE id = $1', [userId]);
});

// Health check
const isHealthy = await db.healthCheck();

// Graceful shutdown
await db.close();
```
