# Agent Creation Guide

## Overview

Create high-quality, token-efficient agents that maintain full autonomy and expert-level skill.

---

## Agent Structure Template

```markdown
---
name: agent-name
description: Concise one-line description (what + when to use)
model: sonnet
---

# Agent Name

Brief intro (1-2 sentences) explaining role and expertise.

## Core Competencies

**Pattern 1: Most Common Use Case**
```language
// Minimal, clear example showing the pattern
code_here();
```

**Pattern 2: Second Most Common**
```language
another_pattern();
```

## Key Patterns

- **Pattern Name:** Brief explanation
- **Another Pattern:** Brief explanation

## References

📚 **Full Examples:** [link-to-reference-doc.md]
🎯 **Patterns:** [link-to-patterns-doc.md]
⚡ **Optimization:** [link-to-optimization-doc.md]

## Best Practices

### DO ✅
- Use this
- Do that

### DON'T ❌
- Avoid this
- Don't do that

[Optional: Critical warnings or gotchas that MUST be inline]
```

---

## Token Optimization Rules

### 1. Keep It Lean

**Target:** 300-500 tokens per agent

**Include Inline:**
- Core competencies (2-3 patterns)
- Most common use cases (80% scenarios)
- Critical warnings/gotchas
- Links to full references

**Move to References:**
- Full implementations
- Multiple language examples
- Edge cases
- Historical context
- Exhaustive config options

### 2. One Example Per Pattern

**❌ DON'T:**
```markdown
## Authentication

TypeScript:
```typescript
// 50 lines of TypeScript...
```

Python:
```python
# 50 lines of Python...
```

Go:
```go
// 50 lines of Go...
```
```

**✅ DO:**
```markdown
## Authentication

```typescript
// JWT pattern
const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
const verified = jwt.verify(token, secret);
```

**Other languages:** [Python](../ref/auth-python.md) | [Go](../ref/auth-go.md)
```

### 3. Progressive Disclosure

**Level 1 (Always Loaded):** Core pattern
**Level 2 (On Request):** Full implementation
**Level 3 (On Request):** Advanced optimization

```markdown
## Caching

**Basic Pattern:**
```typescript
const cached = await cache.get(key);
if (!cached) {
  cached = await db.query(sql);
  await cache.set(key, cached, ttl);
}
```

**Advanced:** See [caching-patterns.md](../ref/caching-patterns.md) for:
- Write-through, write-behind patterns
- Cache invalidation strategies
- Distributed caching with Redis Cluster
```

### 4. Comment-Based Variations

**❌ DON'T:** Show 5 separate examples for minor variations

**✅ DO:** Show one example with inline comments

```typescript
// User query with filters and pagination
const users = await db.query(
  'SELECT * FROM users WHERE status = $1 LIMIT $2 OFFSET $3',
  [status, limit, offset]
  // Add more filters: AND email = $4
  // Remove pagination: Remove LIMIT/OFFSET
  // Add sorting: ORDER BY created_at DESC
);
```

### 5. Use Standard Patterns

Don't reinvent the wheel. Reference established patterns:

- **CRUD:** Standard create/read/update/delete
- **Auth:** JWT, OAuth2, session-based
- **Caching:** Cache-aside, write-through, write-behind
- **Testing:** Arrange-Act-Assert (AAA)
- **API:** RESTful, GraphQL, gRPC conventions

```markdown
## CRUD Operations

Follow standard CRUD pattern (see [crud-patterns.md](../ref/crud.md)):

```typescript
async function create(data: T) {
  return db.query('INSERT INTO ... RETURNING *', [data]);
}
// read(), update(), delete() follow same pattern
```
```

---

## Cross-Platform Guidelines

**Always prefer:**
1. Docker (works everywhere)
2. Language package managers (npm, pip, cargo)
3. Client libraries (not shell commands)
4. Path libraries (`path.join()`, `pathlib`)

**OS-specific only when necessary:**
```typescript
// Show all platforms with OS detection
import os from 'os';
const command = os.platform() === 'darwin'
  ? 'brew install package'
  : os.platform() === 'win32'
    ? 'choco install package'
    : 'apt-get install package';

// Better: Use Docker
docker run package  // Works everywhere
```

---

## Code Example Guidelines

### Minimal But Complete

**❌ TOO VERBOSE:**
```typescript
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users');
    res.json({ users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**✅ CONCISE:**
```typescript
import express from 'express';
const app = express();

app.use(express.json());
app.use(cors(), helmet(), compression());

app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json({ users });
});

app.listen(3000);
// Full setup: See [express-setup.md](../ref/express.md)
```

### Essential Config Only

**❌ DON'T:**
```typescript
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'postgres',
  password: 'password',
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  allowExitOnIdle: false,
  application_name: 'myapp',
  statement_timeout: 30000,
  query_timeout: 30000,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync('ca.pem'),
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  },
});
```

**✅ DO:**
```typescript
const pool = new Pool({
  host, port, database, user, password,
  max: 20,  // Connection pool size
  idleTimeoutMillis: 30000,  // Close idle connections
});
// Full config: [pg-config.md](../ref/pg-config.md)
```

---

## Description Guidelines

### Agent Description (Frontmatter)

**Format:** `What it does + When to use it`

**✅ GOOD:**
```yaml
description: Expert PostgreSQL specialist for query optimization, replication, pgvector for AI embeddings, and production database management. Use for PostgreSQL-specific tasks, performance tuning, and troubleshooting.
```

**❌ BAD (Too Vague):**
```yaml
description: Database expert
```

**❌ BAD (Too Verbose):**
```yaml
description: This agent is a PostgreSQL database specialist with extensive knowledge of SQL queries, database design, normalization, indexes, query optimization, replication strategies, high availability configurations, backup and restore procedures, and more. Use this agent whenever you need help with PostgreSQL databases.
```

### Agent Title

Use descriptive, searchable names:
- `postgresql-specialist` ✅ (clear, specific)
- `db-agent` ❌ (vague)
- `postgres-sql-database-expert-agent` ❌ (too verbose)

---

## File Organization

```
.claude/
├── agents/
│   ├── development/
│   │   ├── languages/
│   │   │   └── python-developer.md         # Lean agent
│   │   ├── frontend/
│   │   │   └── react-specialist.md         # Lean agent
│   │   └── backend/
│   │       └── api-designer.md             # Lean agent
│   ├── infrastructure/
│   │   ├── database/
│   │   │   └── postgresql-specialist.md    # Lean agent
│   │   └── cloud/
│   │       └── aws-specialist.md           # Lean agent
│   └── quality/
│       └── test-engineer.md                # Lean agent
├── docs/
│   ├── references/                         # Full examples
│   │   ├── postgresql-nodejs.md
│   │   ├── postgresql-python.md
│   │   ├── postgresql-patterns.md
│   │   ├── react-patterns.md
│   │   └── aws-examples.md
│   └── guides/                             # Best practices
│       ├── database-best-practices.md
│       ├── api-design-principles.md
│       └── testing-strategies.md
```

---

## Testing Your Agent

### Functional Test

```
Task: "Use the [agent-name] agent to [complete a standard task]"

Expected:
- Agent completes task successfully
- Output is high quality
- No errors or confusion
- Doesn't ask for information it should have
```

### Edge Case Test

```
Task: "Use the [agent-name] agent to [complex edge case]"

Expected:
- Agent handles complexity
- Uses appropriate patterns
- May reference external docs
- Still completes autonomously
```

### Token Efficiency Test

```
Measure:
- Agent markdown token count
- Aim for 300-500 tokens
- Verify no quality loss compared to verbose version
```

### Autonomy Test

```
Criteria:
- Completes task without hand-holding
- Doesn't need you to fill in blanks
- Makes appropriate decisions
- References external docs when needed (but doesn't require them)
```

---

## Common Mistakes

### 1. Too Much Inline Documentation

**Problem:** Agent becomes a tutorial, not a specialist

**Solution:** Keep patterns inline, move tutorials to references

### 2. Multiple Language Examples

**Problem:** Same example in 5 languages = 5x tokens

**Solution:** One canonical example + links to others

### 3. Exhaustive Configuration

**Problem:** Showing every possible config option

**Solution:** Essential config only + link to full reference

### 4. Historical Context

**Problem:** Explaining why things evolved this way

**Solution:** Focus on current best practices only

### 5. Over-Explanation

**Problem:** Explaining obvious things

**Solution:** Assume expert-level audience

---

## Example: Well-Optimized Agent

```markdown
---
name: redis-specialist
description: Redis caching patterns, pub/sub, rate limiting, session storage. Use for distributed caching, real-time features, and high-performance data storage.
model: sonnet
---

# Redis Specialist

Expert in Redis for caching, pub/sub, and distributed systems.

## Core Patterns

**Cache-Aside:**
```typescript
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
const data = await db.query(sql);
await redis.setex(key, 3600, JSON.stringify(data));
return data;
```

**Pub/Sub:**
```typescript
await subscriber.subscribe('channel');
subscriber.on('message', (ch, msg) => handle(JSON.parse(msg)));
await publisher.publish('channel', JSON.stringify(data));
```

**Rate Limiting (Fixed Window):**
```typescript
const count = await redis.incr(`rate:${userId}:${window}`);
if (count === 1) await redis.expire(`rate:${userId}:${window}`, windowSec);
return { allowed: count <= maxRequests, remaining: maxRequests - count };
```

## Key Concepts

- **Persistence:** RDB (snapshots) vs AOF (append-only file)
- **Replication:** Master-replica with automatic failover
- **Clustering:** Horizontal scaling with hash slots
- **Data Types:** String, Hash, List, Set, Sorted Set, Stream

## References

📚 [Full Examples](../../docs/references/redis-examples.md) - Node.js, Python, Go
🎯 [Caching Patterns](../../docs/references/caching-patterns.md) - All strategies
⚡ [Optimization](../../docs/references/redis-optimization.md) - Performance tuning

## Best Practices

### DO ✅
- Use connection pooling
- Set appropriate TTLs
- Handle cache misses gracefully
- Use pipelines for bulk operations
- Monitor memory usage

### DON'T ❌
- Store large objects (>1MB) in cache
- Use Redis as primary database
- Block with KEYS in production
- Ignore eviction policies
- Skip persistence configuration

**Critical:** Use `SCAN` instead of `KEYS` in production (non-blocking).

---

**Token Count:** ~350 tokens
**Completeness:** ✅ Expert-level
**Autonomy:** ✅ Fully autonomous
**References:** ✅ Available for deep dives
```

---

## Checklist for New Agents

- [ ] Agent name is clear and specific
- [ ] Description includes "what" and "when to use"
- [ ] Core patterns (2-4) are inline
- [ ] Examples are minimal but complete
- [ ] Cross-platform by default (Docker/client libraries)
- [ ] One example per pattern (not multiple languages)
- [ ] Links to reference docs for full examples
- [ ] Best practices (DO/DON'T) are clear
- [ ] Critical warnings are inline
- [ ] Target 300-500 tokens
- [ ] Tested for quality and autonomy
- [ ] Follows file organization conventions

---

## Resources

- [Token Optimization Strategy](./TOKEN_OPTIMIZATION.md)
- [Cross-Platform Guide](./CROSS_PLATFORM.md)
- [Architecture Documentation](../ARCHITECTURE.md)
- [CLAUDE.md](../CLAUDE.md) - System principles

---

**Remember:** Lean agents with rich references = optimal token usage + full capability!
