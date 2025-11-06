# Token Optimization Strategy

## Overview

Optimize token usage while maintaining full autonomy and expert-level skill through:
1. **Lean Agent Definitions** - Essential knowledge only
2. **Reference Documentation** - Detailed examples separate
3. **Lazy Loading** - Load details on-demand
4. **Pattern-Based Examples** - Show once, reference elsewhere
5. **Progressive Disclosure** - Basic → Advanced when needed

---

## Optimization Principles

### 1. Essential Knowledge Only

**❌ BEFORE (Verbose):**
```markdown
## PostgreSQL Connection

Here's how to connect to PostgreSQL with connection pooling:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'postgres',
  password: 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function query(sql: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}
```

And here's the same thing in Python:

```python
import psycopg2
from psycopg2 import pool

connection_pool = psycopg2.pool.SimpleConnectionPool(
    1, 20,
    host='localhost',
    port=5432,
    database='mydb',
    user='postgres',
    password='password'
)

def query(sql, params=None):
    conn = connection_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params or [])
            return cur.fetchall()
    finally:
        connection_pool.putconn(conn)
```
```

**✅ AFTER (Optimized):**
```markdown
## PostgreSQL Connection

Use connection pooling for production:
- Node.js: `pg` with `Pool` (see [pg-reference.md](../references/postgresql-nodejs.md))
- Python: `psycopg2.pool` (see [psycopg2-reference.md](../references/postgresql-python.md))

```typescript
// Essential pattern - connection pool
import { Pool } from 'pg';
const pool = new Pool({ /* config */ });
const result = await pool.query(sql, params);
```
```

**Token Savings:** ~80% (from ~250 tokens to ~50 tokens)

---

### 2. Reference Documentation System

**Structure:**
```
.claude/
├── agents/
│   └── database/
│       └── postgresql-specialist.md     # Lean, references docs
├── docs/
│   ├── references/
│   │   ├── postgresql-nodejs.md         # Full Node.js examples
│   │   ├── postgresql-python.md         # Full Python examples
│   │   ├── postgresql-patterns.md       # Design patterns
│   │   └── postgresql-optimization.md   # Performance tuning
│   └── guides/
│       └── database-best-practices.md   # Cross-DB patterns
```

**Agent Pattern:**
```markdown
## Core Competency

Brief explanation with one clear example.

📚 **Full examples:** [postgresql-nodejs.md](../../docs/references/postgresql-nodejs.md)
🎯 **Patterns:** [postgresql-patterns.md](../../docs/references/postgresql-patterns.md)
⚡ **Optimization:** [postgresql-optimization.md](../../docs/references/postgresql-optimization.md)
```

---

### 3. Lazy Loading Pattern

**Inline (Always Loaded):**
- Core concepts
- Most common patterns (80% use cases)
- Critical warnings/gotchas
- Quick reference

**Reference (Load When Needed):**
- Full implementations
- Edge cases
- Multiple language examples
- Advanced optimizations
- Historical context

**Example:**

```markdown
## Caching Strategies

**Cache-Aside (Most Common):**
```typescript
const cached = await cache.get(key);
if (cached) return cached;
const data = await db.query(sql);
await cache.set(key, data, ttl);
return data;
```

Other patterns: Write-Through, Write-Behind, Refresh-Ahead
📚 [Full patterns with examples](../../docs/references/caching-patterns.md)
```

---

### 4. One Language, Multiple References

**❌ BEFORE:**
Show same example in TypeScript, Python, Go, Java, etc.

**✅ AFTER:**
Show one canonical example (TypeScript for web, Python for data/ML)
Reference others: "Go example: [link], Java example: [link]"

**Example:**
```markdown
## Connection Pool

```typescript
import { Pool } from 'pg';
const pool = new Pool({ max: 20, idleTimeoutMillis: 30000 });
await pool.query(sql, params);
```

**Other languages:** [Python](../ref/pg-python.md) | [Go](../ref/pg-go.md) | [Java](../ref/pg-java.md)
```

---

### 5. Pattern Templates

**Create reusable patterns:**

```markdown
## CRUD Operations

Follow standard CRUD pattern:
1. **Create:** `INSERT ... RETURNING *`
2. **Read:** `SELECT ... WHERE ... LIMIT ...`
3. **Update:** `UPDATE ... WHERE ... RETURNING *`
4. **Delete:** `DELETE ... WHERE ... RETURNING *`

```typescript
// Pattern template
async function create(data: T): Promise<T> {
  return db.query('INSERT INTO table ... RETURNING *', [data]);
}
```

📚 [Full CRUD implementation](../../docs/references/crud-patterns.md)
```

---

### 6. Comment-Based Variations

**❌ BEFORE:**
Multiple full examples for slight variations

**✅ AFTER:**
One example with inline variations

```typescript
// Parameterized query with pagination
const result = await pool.query(
  'SELECT * FROM users WHERE status = $1 LIMIT $2 OFFSET $3',
  [status, limit, offset]
);

// Variations:
// - No pagination: Remove LIMIT/OFFSET
// - Multiple filters: Add more WHERE clauses
// - Sorting: Add ORDER BY
// - Joins: Add JOIN clauses
```

---

## Optimization Checklist

### Agent Definition
- [ ] Remove redundant explanations
- [ ] Keep only 1-2 core examples inline
- [ ] Link to reference docs for details
- [ ] Use comments for variations
- [ ] Remove historical context (unless critical)
- [ ] Focus on patterns over implementations

### Code Examples
- [ ] Show one language (most common for domain)
- [ ] Reference other languages via links
- [ ] Use abbreviated syntax where clear
- [ ] Include only essential config
- [ ] Comment variations instead of multiple examples

### Documentation Structure
- [ ] Agent: Core competencies + patterns
- [ ] References: Full implementations
- [ ] Guides: Best practices across agents
- [ ] Avoid duplication between agents

### Links & References
- [ ] Use relative links (./path/to/doc.md)
- [ ] Create "See also" sections
- [ ] Link to external official docs when appropriate
- [ ] Don't duplicate what's already documented

---

## Optimization Targets

### High-Value Targets (Most Tokens)

1. **Database Specialists** - Multiple language examples
   - Current: ~800-1000 tokens each
   - Target: ~300-400 tokens each
   - Savings: ~60%

2. **Cloud Specialists (AWS/Azure/GCP)** - Verbose SDK examples
   - Current: ~1000-1500 tokens each
   - Target: ~400-600 tokens each
   - Savings: ~60%

3. **Framework Specialists** - Full component examples
   - Current: ~800-1200 tokens each
   - Target: ~300-500 tokens each
   - Savings: ~60%

4. **Infrastructure Specialists** - Config files
   - Current: ~1000-1500 tokens each
   - Target: ~400-600 tokens each
   - Savings: ~60%

### Medium-Value Targets

5. **Language Developers** - Multiple examples
6. **Testing Specialists** - Full test suites
7. **API Specialists** - Schema definitions

### Low-Value Targets (Already Concise)

8. **Compliance Specialists** - Mostly checklists
9. **Meta-Orchestrators** - High-level guidance
10. **Workflows** - Step-by-step instructions

---

## Example: Before & After

### BEFORE (Verbose Agent)

```markdown
---
name: redis-specialist
description: Expert Redis specialist
---

# Redis Specialist

## Connection

Here's how to connect to Redis in Node.js:

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'password',
  db: 0,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});
```

And in Python:

```python
import redis

r = redis.Redis(
    host='localhost',
    port=6379,
    password='password',
    db=0,
    decode_responses=True
)

try:
    r.ping()
    print('Connected to Redis')
except redis.ConnectionError as e:
    print(f'Error: {e}')
```

[... continues with many more examples ...]

**Token Count:** ~1200 tokens
```

### AFTER (Optimized Agent)

```markdown
---
name: redis-specialist
description: Redis caching, pub/sub, rate limiting, session management
---

# Redis Specialist

## Core Patterns

**Connection:**
```typescript
import Redis from 'ioredis';
const redis = new Redis({ host, port, retryStrategy });
```

**Caching:**
```typescript
// Cache-aside pattern
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
const data = await fetchData();
await redis.setex(key, ttl, JSON.stringify(data));
```

**Pub/Sub:**
```typescript
await subscriber.subscribe('channel');
subscriber.on('message', (channel, message) => handle(message));
await publisher.publish('channel', JSON.stringify(data));
```

**Rate Limiting:**
```typescript
const count = await redis.incr(`rate:${userId}`);
if (count === 1) await redis.expire(`rate:${userId}`, windowSeconds);
return count <= maxRequests;
```

## References

📚 **Full Examples:**
- [Node.js](../../docs/references/redis-nodejs.md) - Connection, patterns, advanced
- [Python](../../docs/references/redis-python.md) - redis-py implementation
- [Go](../../docs/references/redis-go.md) - go-redis client

🎯 **Patterns:** [Caching Patterns](../../docs/references/caching-patterns.md)
⚡ **Performance:** [Redis Optimization](../../docs/references/redis-optimization.md)

**Token Count:** ~300 tokens (75% reduction)
```

---

## Measuring Success

### Metrics

1. **Token Reduction:** Target 50-70% reduction per agent
2. **Agent Count:** Maintain all 72+ agents
3. **Quality:** No degradation in output quality
4. **Autonomy:** Agents still complete tasks independently
5. **Completeness:** All necessary knowledge accessible

### Testing

1. **Functional Test:** Agent completes standard task successfully
2. **Edge Case Test:** Agent handles complex scenarios
3. **Reference Test:** Agent correctly references external docs
4. **Quality Test:** Output matches pre-optimization quality
5. **Autonomy Test:** Agent doesn't need hand-holding

---

## Implementation Plan

### Phase 1: Infrastructure (Week 1)
- [ ] Create `/docs/references/` structure
- [ ] Define reference doc templates
- [ ] Establish linking conventions

### Phase 2: High-Value Agents (Week 2)
- [ ] Optimize database specialists (3 agents)
- [ ] Optimize cloud specialists (3 agents)
- [ ] Create reference docs for above
- [ ] Test quality maintenance

### Phase 3: Medium-Value Agents (Week 3)
- [ ] Optimize framework specialists (6 agents)
- [ ] Optimize infrastructure agents (8 agents)
- [ ] Create reference docs
- [ ] Measure token savings

### Phase 4: Remaining Agents (Week 4)
- [ ] Optimize remaining agents
- [ ] Create comprehensive reference library
- [ ] Update agent index
- [ ] Document optimization guidelines

### Phase 5: Validation (Week 5)
- [ ] End-to-end testing
- [ ] Token usage measurement
- [ ] Quality benchmarking
- [ ] Documentation updates

---

## Best Practices

### DO ✅
- Show clear, minimal examples
- Link to comprehensive references
- Use comments for variations
- Focus on patterns over code
- Keep critical warnings inline
- Maintain expert-level knowledge

### DON'T ❌
- Remove essential context
- Over-abbreviate to point of confusion
- Break working patterns
- Sacrifice quality for tokens
- Assume external docs are always available
- Make agents dependent on external tools

---

## Expected Results

### Token Savings
- **Current Total:** ~72 agents × ~800 tokens avg = ~57,600 tokens
- **Optimized Total:** ~72 agents × ~350 tokens avg = ~25,200 tokens
- **Savings:** ~32,400 tokens (56% reduction)

### Context Window
- More room for conversation history
- Longer task completion sessions
- Better multi-agent coordination
- Reduced token costs

### Maintainability
- Easier to update (reference docs separate)
- Less duplication
- Clearer structure
- Better organization

---

## Conclusion

By optimizing agent definitions while maintaining quality through reference documentation and lazy loading, we can reduce token usage by 50-70% while preserving full autonomy and expert-level skill.

**Key insight:** Most detailed examples aren't needed until execution time. Keep agents lean, make references accessible.
