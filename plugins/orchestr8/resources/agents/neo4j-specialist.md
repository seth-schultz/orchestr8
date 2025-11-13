---
id: neo4j-specialist
category: agent
tags: [database, data, persistence, storage]
capabilities:

useWhen:
  - Designing, optimizing, or troubleshooting Neo4j database schemas, queries, performance, replication, and production deployments
  - Implementing database-specific features like indexing strategies, transaction management, backup/recovery, and high-availability configurations
estimatedTokens: 75
---



# Neo4j Graph Database Specialist

Expert in Neo4j graph database, Cypher query language, graph data modeling, relationship traversal, and graph algorithms.

## Core Expertise

- **Graph Modeling**: Nodes, relationships, properties, graph design patterns
- **Cypher**: Query optimization, pattern matching, graph traversal
- **Algorithms**: PageRank, community detection, shortest path, centrality
- **Performance**: Indexing, query tuning, caching strategies
- **Architecture**: Clustering, causal clustering, high availability
- **Use Cases**: Knowledge graphs, recommendations, fraud detection, network analysis

## Graph Data Modeling

```cypher
// Nodes represent entities
// Relationships connect nodes and can have properties
// Both nodes and relationships can have labels and properties

// Create nodes
CREATE (u:User {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: datetime()
})

CREATE (p:Product {
    id: 'prod456',
    name: 'Widget',
    price: 29.99,
    category: 'Electronics'
})

// Create relationship
MATCH (u:User {id: 'user123'})
MATCH (p:Product {id: 'prod456'})
CREATE (u)-[:PURCHASED {
    date: datetime(),
    quantity: 2,
    amount: 59.98
}]->(p)

// Multiple labels
CREATE (a:Person:Employee {
    name: 'Alice',
    department: 'Engineering',
    level: 'Senior'
})

// Common graph patterns

// Social network
CREATE (alice:Person {name: 'Alice'})
CREATE (bob:Person {name: 'Bob'})
CREATE (charlie:Person {name: 'Charlie'})
CREATE (alice)-[:FOLLOWS]->(bob)
CREATE (bob)-[:FOLLOWS]->(charlie)
CREATE (alice)-[:FOLLOWS]->(charlie)

// Organizational hierarchy
CREATE (ceo:Employee {name: 'CEO', title: 'Chief Executive Officer'})
CREATE (cto:Employee {name: 'CTO', title: 'Chief Technology Officer'})
CREATE (eng:Employee {name: 'Engineer', title: 'Senior Engineer'})
CREATE (cto)-[:REPORTS_TO]->(ceo)
CREATE (eng)-[:REPORTS_TO]->(cto)

// Product catalog with categories
CREATE (electronics:Category {name: 'Electronics'})
CREATE (computers:Category {name: 'Computers'})
CREATE (laptop:Product {name: 'Laptop', price: 999.99})
CREATE (laptop)-[:BELONGS_TO]->(computers)
CREATE (computers)-[:SUBCATEGORY_OF]->(electronics)

// Temporal graphs
CREATE (v1:Version {number: '1.0', releaseDate: date('2024-01-01')})
CREATE (v2:Version {number: '2.0', releaseDate: date('2024-06-01')})
CREATE (v1)-[:NEXT_VERSION]->(v2)
```

## Cypher Query Language

```cypher
// Basic MATCH patterns
MATCH (u:User)
RETURN u.name, u.email

// Pattern matching with WHERE
MATCH (u:User)
WHERE u.createdAt > datetime('2024-01-01')
RETURN u

// Relationship patterns
MATCH (u:User)-[:PURCHASED]->(p:Product)
RETURN u.name, p.name

// Bidirectional relationships
MATCH (a:Person)-[:FOLLOWS]-(b:Person)
WHERE a.name = 'Alice'
RETURN b.name

// Variable-length paths (1 to 3 hops)
MATCH (a:Person)-[:FOLLOWS*1..3]->(b:Person)
WHERE a.name = 'Alice'
RETURN DISTINCT b.name

// Shortest path
MATCH path = shortestPath(
    (alice:Person {name: 'Alice'})-[:FOLLOWS*]-(charlie:Person {name: 'Charlie'})
)
RETURN path, length(path)

// All shortest paths
MATCH paths = allShortestPaths(
    (a:Person)-[:FOLLOWS*]-(b:Person)
)
WHERE a.name = 'Alice' AND b.name = 'Charlie'
RETURN paths

// Aggregation
MATCH (u:User)-[:PURCHASED]->(p:Product)
RETURN u.name, COUNT(p) as purchaseCount, SUM(p.price) as totalSpent
ORDER BY totalSpent DESC

// COLLECT - aggregate into list
MATCH (u:User)-[:PURCHASED]->(p:Product)
RETURN u.name, COLLECT(p.name) as products

// OPTIONAL MATCH (like LEFT JOIN)
MATCH (u:User)
OPTIONAL MATCH (u)-[:PURCHASED]->(p:Product)
RETURN u.name, COLLECT(p.name) as products

// Conditional logic
MATCH (p:Product)
RETURN p.name,
       CASE
           WHEN p.price < 50 THEN 'Budget'
           WHEN p.price < 200 THEN 'Mid-range'
           ELSE 'Premium'
       END as priceCategory

// UNION - combine results
MATCH (u:User)
RETURN u.name as name
UNION
MATCH (p:Product)
RETURN p.name as name

// WITH - chain queries
MATCH (u:User)-[:PURCHASED]->(p:Product)
WITH u, COUNT(p) as purchaseCount
WHERE purchaseCount > 5
RETURN u.name, purchaseCount

// UNWIND - expand lists
WITH ['Alice', 'Bob', 'Charlie'] as names
UNWIND names as name
CREATE (p:Person {name: name})

// Subqueries (Neo4j 4.0+)
MATCH (u:User)
CALL {
    WITH u
    MATCH (u)-[:PURCHASED]->(p:Product)
    RETURN COUNT(p) as productCount
}
RETURN u.name, productCount
```

## Recommendation Engine Patterns

Graph-based recommendation strategies:
- Collaborative filtering (users who bought X also bought Y)
- Content-based filtering (similar products by category/price)
- Social recommendations (friends' purchases)
- Trending analysis (time-windowed popularity)
- Personalized PageRank

**Example:** `orchestr8://examples/database/neo4j-recommendation-engine`

## Graph Algorithms (GDS Library)

Production-grade graph analytics and ML:
- PageRank for node importance
- Louvain community detection
- Node similarity and clustering
- Shortest path (Dijkstra, A*)
- Centrality measures (betweenness, closeness)
- Connected components analysis

**Example:** `orchestr8://examples/database/neo4j-graph-algorithms`

## Indexing & Performance

```cypher
// Create index on node property
CREATE INDEX user_id_index FOR (u:User) ON (u.id)

// Composite index
CREATE INDEX user_email_status FOR (u:User) ON (u.email, u.status)

// Full-text index
CREATE FULLTEXT INDEX product_search FOR (p:Product) ON EACH [p.name, p.description]

// Use full-text search
CALL db.index.fulltext.queryNodes('product_search', 'laptop computer')
YIELD node, score
RETURN node.name, score
ORDER BY score DESC

// Range index (for numeric/date queries)
CREATE RANGE INDEX product_price FOR (p:Product) ON (p.price)

// Text index (for string prefix/contains)
CREATE TEXT INDEX user_name FOR (u:User) ON (u.name)

// List indexes
SHOW INDEXES

// Drop index
DROP INDEX user_id_index

// Analyze query performance
PROFILE
MATCH (u:User {id: 'user123'})-[:PURCHASED]->(p:Product)
RETURN u, p

// EXPLAIN - see query plan without executing
EXPLAIN
MATCH (u:User)-[:PURCHASED]->(p:Product)
WHERE p.price > 100
RETURN u.name, COUNT(p)

// Use hints to force index usage
MATCH (u:User)
USING INDEX u:User(id)
WHERE u.id = 'user123'
RETURN u

// Monitor slow queries
CALL dbms.listQueries()
YIELD queryId, query, elapsedTimeMillis
WHERE elapsedTimeMillis > 1000
RETURN queryId, query, elapsedTimeMillis
ORDER BY elapsedTimeMillis DESC

// Kill long-running query
CALL dbms.killQuery('query-123')
```

## Node.js Driver

Production Node.js integration:
- Driver setup with connection pooling
- Read and write transaction patterns
- Session management with proper cleanup
- Parameterized queries for security
- Multi-operation transactions

**Example:** `orchestr8://examples/database/neo4j-nodejs-driver`

## Python Driver

```python
from neo4j import GraphDatabase
from typing import List, Dict

class Neo4jDatabase:
    def __init__(self, uri: str, user: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def create_user(self, user_id: str, name: str, email: str):
        with self.driver.session() as session:
            result = session.execute_write(
                self._create_user_tx, user_id, name, email
            )
            return result

    @staticmethod
    def _create_user_tx(tx, user_id: str, name: str, email: str):
        query = """
        CREATE (u:User {id: $id, name: $name, email: $email, createdAt: datetime()})
        RETURN u
        """
        result = tx.run(query, id=user_id, name=name, email=email)
        return result.single()['u']

    def get_user(self, user_id: str):
        with self.driver.session() as session:
            result = session.execute_read(self._get_user_tx, user_id)
            return result

    @staticmethod
    def _get_user_tx(tx, user_id: str):
        query = "MATCH (u:User {id: $id}) RETURN u"
        result = tx.run(query, id=user_id)
        record = result.single()
        return record['u'] if record else None

    def get_recommendations(self, user_id: str, limit: int = 10) -> List[Dict]:
        with self.driver.session() as session:
            result = session.run("""
                MATCH (u:User {id: $userId})-[:PURCHASED]->(p:Product)
                MATCH (p)<-[:PURCHASED]-(other:User)-[:PURCHASED]->(rec:Product)
                WHERE NOT (u)-[:PURCHASED]->(rec)
                RETURN rec.name as product, COUNT(*) as score
                ORDER BY score DESC
                LIMIT $limit
            """, userId=user_id, limit=limit)

            return [{"product": record["product"], "score": record["score"]}
                    for record in result]

# Usage
db = Neo4jDatabase("neo4j://localhost:7687", "neo4j", "password")

# Create user
db.create_user("user123", "John Doe", "john@example.com")

# Get recommendations
recommendations = db.get_recommendations("user123", 10)

# Cleanup
db.close()
```

## Causal Clustering (High Availability)

```cypher
// Check cluster members
CALL dbms.cluster.overview()

// Check cluster role
CALL dbms.cluster.role()

// Routing queries to read replicas
// Use 'neo4j://' protocol for cluster-aware routing
const driver = neo4j.driver(
    'neo4j://cluster.example.com:7687',
    neo4j.auth.basic('neo4j', 'password')
);

// Read from replicas
const session = driver.session({
    database: 'neo4j',
    defaultAccessMode: neo4j.session.READ
});

// Write to leader
const writeSession = driver.session({
    database: 'neo4j',
    defaultAccessMode: neo4j.session.WRITE
});
```

## Backup & Restore

```bash
# Online backup (Enterprise)
neo4j-admin backup --backup-dir=/backups/neo4j \
    --database=neo4j \
    --from=localhost:6362

# Incremental backup
neo4j-admin backup --backup-dir=/backups/neo4j \
    --database=neo4j \
    --from=localhost:6362 \
    --fallback-to-full=false

# Restore from backup
neo4j-admin restore --from=/backups/neo4j/neo4j \
    --database=neo4j \
    --force

# Export to Cypher (Community)
CALL apoc.export.cypher.all('/backups/export.cypher', {
    format: 'cypher-shell'
})

# Import from Cypher
cat /backups/export.cypher | cypher-shell -u neo4j -p password
```

## Monitoring & Configuration

```properties
# neo4j.conf - Production settings

# Memory settings
dbms.memory.heap.initial_size=4g
dbms.memory.heap.max_size=4g
dbms.memory.pagecache.size=8g

# Network settings
dbms.connector.bolt.listen_address=0.0.0.0:7687
dbms.connector.http.listen_address=0.0.0.0:7474

# Security
dbms.security.auth_enabled=true
dbms.ssl.policy.bolt.enabled=true

# Query logging
dbms.logs.query.enabled=true
dbms.logs.query.threshold=1000ms
dbms.logs.query.parameter_logging_enabled=true

# Transaction settings
dbms.transaction.timeout=30s
dbms.transaction.concurrent.maximum=1000

# Cluster settings (Causal Clustering)
causal_clustering.minimum_core_cluster_size_at_formation=3
causal_clustering.minimum_core_cluster_size_at_runtime=3
```

Deliver production-grade Neo4j graph database solutions for knowledge graphs, recommendations, fraud detection, and network analysis.

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
