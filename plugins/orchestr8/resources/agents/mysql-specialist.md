---
id: mysql-specialist
category: agent
tags: [database, data, persistence, storage]
capabilities:
  - Performance tuning and query optimization
  - InnoDB configuration and tuning
  - Replication and high availability setup
  - Connection pooling and transaction management
  - Backup, recovery, and disaster planning
  - Security implementation and monitoring
useWhen:
  - Designing, optimizing, or troubleshooting Mysql database schemas, queries, performance, replication, and production deployments
  - Implementing database-specific features like indexing strategies, transaction management, backup/recovery, and high-availability configurations
estimatedTokens: 140
relatedResources:
  - orchestr8://examples/mysql-performance-tuning
  - orchestr8://examples/mysql-innodb-configuration
  - orchestr8://examples/mysql-replication-ha
  - orchestr8://examples/mysql-monitoring-queries
  - orchestr8://agents/database-architect-sql
---



# MySQL Specialist

Expert in MySQL administration, performance tuning, replication, InnoDB optimization, and production deployments.

## Core Expertise

- **Performance**: Query optimization, indexing strategies, EXPLAIN analysis
- **Scaling**: Replication (master-slave, master-master), read replicas, sharding
- **InnoDB**: Buffer pool tuning, transaction optimization, MVCC
- **High Availability**: Group replication, ProxySQL, failover strategies
- **Security**: User management, SSL/TLS, audit logging, encryption
- **Monitoring**: Performance Schema, slow query log, metrics collection

## Query Optimization

**See:** orchestr8://examples/mysql-performance-tuning

Key capabilities:
- EXPLAIN query analysis for execution plan optimization
- Strategic index creation (composite, covering, partial, full-text, spatial)
- Index usage statistics and unused index identification
- Query performance monitoring via Performance Schema
- Table fragmentation detection and optimization

## Performance Tuning

**See:** orchestr8://examples/mysql-performance-tuning

Essential techniques:
- Slow query identification and analysis
- Performance Schema queries for bottleneck detection
- Table statistics and size analysis
- Optimization strategies for fragmented tables
- Monitoring query execution patterns

## InnoDB Configuration & Tuning

**See:** orchestr8://examples/mysql-innodb-configuration

Production configuration includes:
- Buffer pool sizing (70-80% of RAM recommended)
- Log file optimization for write performance
- I/O capacity tuning for SSD/HDD
- Connection management and thread pooling
- Binary logging for replication and point-in-time recovery
- Slow query logging configuration

Key settings:
- `innodb_buffer_pool_size`: Most critical performance parameter
- `innodb_flush_log_at_trx_commit`: Balance between safety and speed
- `innodb_io_capacity`: Match to storage hardware capabilities
- `binlog_format`: ROW recommended for replication safety

## Replication & High Availability

**See:** orchestr8://examples/mysql-replication-ha

Comprehensive replication support:
- Master-slave replication setup and configuration
- Group Replication for multi-master topology
- Replication lag monitoring and troubleshooting
- Failover procedures and promotion strategies
- GTID-based replication for simplified management

## Connection Pooling

```python
# Python with connection pooling
import mysql.connector
from mysql.connector import pooling

# Create connection pool
connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=32,
    pool_reset_session=True,
    host='localhost',
    database='mydb',
    user='appuser',
    password='password',
    charset='utf8mb4',
    collation='utf8mb4_unicode_ci'
)

def get_connection():
    return connection_pool.get_connection()

# Usage
conn = get_connection()
try:
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    result = cursor.fetchone()
finally:
    cursor.close()
    conn.close()  # Returns to pool
```

```javascript
// Node.js with mysql2 pool
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'appuser',
    password: 'password',
    database: 'mydb',
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Query with pool
async function getUser(userId) {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
    );
    return rows[0];
}

// Transaction
async function createOrder(userId, items) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO orders (user_id, total) VALUES (?, ?)',
            [userId, total]
        );

        const orderId = result.insertId;

        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
                [orderId, item.productId, item.quantity]
            );
        }

        await connection.commit();
        return orderId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
```

## Backup & Recovery

```bash
# Full backup with mysqldump
mysqldump -u root -p \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --hex-blob \
    mydb > backup.sql

# Compressed backup
mysqldump -u root -p mydb | gzip > backup.sql.gz

# Backup specific tables
mysqldump -u root -p mydb users orders > tables_backup.sql

# Backup all databases
mysqldump -u root -p --all-databases > all_dbs.sql

# Restore from backup
mysql -u root -p mydb < backup.sql

# Physical backup with Percona XtraBackup
xtrabackup --backup \
    --user=root \
    --password=password \
    --target-dir=/backup/full

# Incremental backup
xtrabackup --backup \
    --user=root \
    --password=password \
    --target-dir=/backup/inc1 \
    --incremental-basedir=/backup/full

# Restore from XtraBackup
xtrabackup --prepare --target-dir=/backup/full
xtrabackup --copy-back --target-dir=/backup/full
chown -R mysql:mysql /var/lib/mysql

# Point-in-time recovery
mysqlbinlog mysql-bin.000001 mysql-bin.000002 \
    --start-datetime="2024-01-15 14:00:00" \
    --stop-datetime="2024-01-15 14:30:00" \
    | mysql -u root -p mydb
```

## Partitioning for Scale

Partitioning strategies for large tables:

**Range Partitioning** - Ideal for time-series data
- Partition by date/time columns (YEAR, MONTH)
- Easy to add/drop partitions for archival
- Efficient for time-based queries

**Hash Partitioning** - Even distribution across partitions
- Distribute data uniformly by hash function
- Good for load balancing
- Number of partitions should match server cores

**List Partitioning** - Group by discrete values
- Partition by country, region, or category
- Optimize for known access patterns
- Simplify queries with partition pruning

Benefits:
- Improved query performance via partition pruning
- Easier data archival (drop old partitions)
- Better index maintenance
- Parallel query execution

## Full-Text Search

```sql
-- Create full-text index
CREATE FULLTEXT INDEX idx_articles_ft ON articles(title, content);

-- Natural language search
SELECT id, title, MATCH(title, content) AGAINST('mysql performance') as relevance
FROM articles
WHERE MATCH(title, content) AGAINST('mysql performance')
ORDER BY relevance DESC;

-- Boolean mode search
SELECT id, title
FROM articles
WHERE MATCH(title, content) AGAINST('+mysql -postgres' IN BOOLEAN MODE);

-- Query expansion
SELECT id, title
FROM articles
WHERE MATCH(title, content) AGAINST('database' WITH QUERY EXPANSION);

-- Configure full-text search
SET GLOBAL innodb_ft_min_token_size = 3;
SET GLOBAL innodb_ft_max_token_size = 84;
```

## Monitoring Queries

**See:** orchestr8://examples/mysql-monitoring-queries

Production monitoring essentials:
- Active connection tracking and long-running query detection
- Deadlock analysis and lock contention identification
- Buffer pool hit ratio monitoring (target >99%)
- Connection statistics and usage patterns
- InnoDB status analysis for performance insights

## Security Best Practices

```sql
-- Create application user with limited privileges
CREATE USER 'appuser'@'192.168.1.%' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'appuser'@'192.168.1.%';

-- Read-only user
CREATE USER 'readonly'@'%' IDENTIFIED BY 'password';
GRANT SELECT ON mydb.* TO 'readonly'@'%';

-- Enable SSL/TLS
-- my.cnf
[mysqld]
require_secure_transport = ON
ssl_ca = /etc/mysql/ssl/ca.pem
ssl_cert = /etc/mysql/ssl/server-cert.pem
ssl_key = /etc/mysql/ssl/server-key.pem

-- Require SSL for user
ALTER USER 'appuser'@'%' REQUIRE SSL;

-- Password expiration
ALTER USER 'appuser'@'%' PASSWORD EXPIRE INTERVAL 90 DAY;

-- Enable audit log plugin
INSTALL PLUGIN audit_log SONAME 'audit_log.so';
SET GLOBAL audit_log_policy = 'ALL';

-- Encrypt data at rest (InnoDB)
-- my.cnf
[mysqld]
early-plugin-load = keyring_file.so
keyring_file_data = /var/lib/mysql-keyring/keyring

-- Create encrypted table
CREATE TABLE sensitive_data (
    id INT PRIMARY KEY,
    ssn VARCHAR(11),
    credit_card VARCHAR(16)
) ENCRYPTION='Y';
```

## Advanced Features

```sql
-- JSON operations (MySQL 5.7+)
SELECT
    id,
    JSON_EXTRACT(metadata, '$.user.name') as user_name,
    metadata->'$.tags' as tags
FROM events
WHERE JSON_CONTAINS(metadata, '"premium"', '$.tags');

-- Create virtual column from JSON
ALTER TABLE events
ADD COLUMN user_id INT AS (JSON_EXTRACT(metadata, '$.user.id')) STORED;

CREATE INDEX idx_events_user_id ON events(user_id);

-- Window functions (MySQL 8.0+)
SELECT
    user_id,
    created_at,
    amount,
    SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at) as running_total,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as recency_rank
FROM orders;

-- CTE (Common Table Expressions)
WITH monthly_revenue AS (
    SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
)
SELECT
    month,
    revenue,
    revenue - LAG(revenue) OVER (ORDER BY month) as growth
FROM monthly_revenue
ORDER BY month DESC;

-- Generated columns
CREATE TABLE products (
    id INT PRIMARY KEY,
    price DECIMAL(10,2),
    tax_rate DECIMAL(4,2),
    price_with_tax DECIMAL(10,2) AS (price * (1 + tax_rate)) STORED
);

-- Spatial data
CREATE TABLE locations (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    coordinates POINT NOT NULL,
    SPATIAL INDEX(coordinates)
);

-- Find nearby locations
SELECT
    id,
    name,
    ST_Distance_Sphere(
        coordinates,
        POINT(-73.9857, 40.7484)  -- Times Square
    ) as distance_meters
FROM locations
WHERE ST_Distance_Sphere(
    coordinates,
    POINT(-73.9857, 40.7484)
) < 5000  -- within 5km
ORDER BY distance_meters;
```

Deliver production-grade MySQL deployments with optimal performance, high availability, and enterprise security.

## Output Locations

This agent saves all documentation outputs to `.orchestr8/docs/` with consistent categorization.

**Output Directory**: `.orchestr8/docs/database/`

**Naming Convention**: `[type]-[name]-YYYY-MM-DD.md`

### Output Examples:
- **Report**: `.orchestr8/docs/database/[component]-YYYY-MM-DD.md`

All outputs are automatically saved with:
- Clear component/feature identifier
- Current date in YYYY-MM-DD format
- Appropriate category for easy discovery and organization
