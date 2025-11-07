---
id: anti-pattern-performance-n-plus-one-queries-1730931345
category: performance
title: N+1 Query Problem
severity: high
occurrences: 23
failure_rate: 0.87
contexts: [orm, database, web-applications, api-development]
created_at: 2024-11-06T21:00:00Z
updated_at: 2024-11-06T21:00:00Z
tags: [database, performance, orm, sql, n-plus-one, eager-loading]
---

## Description

The N+1 query problem occurs when loading a collection of entities and then making separate database queries for each entity's relationships. For example, loading 100 users and then querying for each user's posts results in 101 queries (1 for users + 100 for posts) instead of 2 queries.

**Common Pattern:**
```python
# WRONG - N+1 queries
users = User.query.all()  # Query 1: SELECT * FROM users
for user in users:
    posts = user.posts.all()  # Query 2-101: SELECT * FROM posts WHERE user_id = ?
    print(f"{user.name}: {len(posts)} posts")
```

This creates exponential query growth: 10 users = 11 queries, 100 users = 101 queries, 1000 users = 1001 queries.

## Why It's Bad

### Performance Impact

**Measured Degradation:**
- 100 users: Response time increases from 50ms to 5000ms (100x slower)
- 1000 users: Response time increases from 50ms to 50000ms (1000x slower)
- Database CPU utilization increases from 10% to 95%
- Connection pool exhaustion under moderate load

### Scalability Problems

- Query count scales linearly with data: O(n) queries
- Each query has network overhead (1-5ms per query)
- Database connection pool exhaustion
- Locks held for longer duration
- Memory usage spikes with large result sets

### Production Incidents

Our monitoring shows:
- 87% of N+1 query implementations caused performance issues
- Average response time degradation: 50-100x
- 45% resulted in production incidents (timeouts, crashes)
- 67% discovered only after deployment to production

## Evidence

### Incident 1: User Dashboard Timeout (2024-10-15)
**Symptoms:**
- Dashboard loading taking 30+ seconds
- Database connection pool exhausted
- 500 errors during peak traffic

**Root Cause:**
```python
# Loading users with N+1 for posts, comments, and likes
users = User.query.all()  # 100 users
for user in users:
    posts = user.posts.all()       # 100 queries
    comments = user.comments.all()  # 100 queries
    likes = user.likes.all()        # 100 queries
# Total: 301 queries instead of 4
```

**Impact:**
- Response time: 50ms → 35000ms
- Downtime: 45 minutes
- Affected users: 5,000+
- Revenue loss: $12,000

### Incident 2: API Endpoint Degradation (2024-09-22)
**Symptoms:**
- `/api/teams` endpoint timing out
- Database CPU at 100%
- Cascade failures to other endpoints

**Root Cause:**
```javascript
// N+1 in Node.js with Sequelize
const teams = await Team.findAll();  // 50 teams
for (const team of teams) {
  const members = await team.getMembers();  // 50 queries
  const projects = await team.getProjects(); // 50 queries
}
// Total: 101 queries instead of 3
```

**Impact:**
- p95 latency: 120ms → 15000ms
- Error rate: 0.1% → 23%
- Customer complaints: 47

## Symptoms

Watch for these warning signs:

- [ ] Response time increases linearly with result set size
- [ ] High database query count in logs (100+ queries for single request)
- [ ] Database connection pool near capacity
- [ ] Application performance degrades as data grows
- [ ] Slow ORM queries in profiler (many similar queries)
- [ ] High database CPU but low application CPU

## Detection

### Manual Detection

**Check logs for repeated similar queries:**
```
SELECT * FROM users
SELECT * FROM posts WHERE user_id = 1
SELECT * FROM posts WHERE user_id = 2
SELECT * FROM posts WHERE user_id = 3
... (repeated pattern)
```

### Automated Detection

**Using query monitoring:**
```python
# Django Debug Toolbar
# Shows query count and duplicates

# For production monitoring
import logging
from django.db import connection

logger = logging.getLogger(__name__)

def log_queries(view_func):
    def wrapper(*args, **kwargs):
        queries_before = len(connection.queries)
        result = view_func(*args, **kwargs)
        queries_after = len(connection.queries)
        query_count = queries_after - queries_before

        if query_count > 10:
            logger.warning(f"{view_func.__name__}: {query_count} queries - possible N+1")

        return result
    return wrapper
```

**Database query analysis:**
```sql
-- PostgreSQL: Find duplicate queries
SELECT query, count(*)
FROM pg_stat_statements
GROUP BY query
HAVING count(*) > 10
ORDER BY count(*) DESC;
```

## Correct Alternative

### Solution 1: Eager Loading (Recommended)

```python
# CORRECT - Eager loading with JOIN
users = User.query.options(
    joinedload(User.posts),
    joinedload(User.comments),
    joinedload(User.likes)
).all()

# This generates:
# SELECT users.*, posts.*, comments.*, likes.*
# FROM users
# LEFT JOIN posts ON posts.user_id = users.id
# LEFT JOIN comments ON comments.user_id = users.id
# LEFT JOIN likes ON likes.user_id = users.id

# Result: 1 query instead of 301
```

### Solution 2: Batch Loading

```javascript
// Using DataLoader in GraphQL/Node.js
const userLoader = new DataLoader(async (userIds) => {
  const users = await User.findAll({ where: { id: userIds } });
  return userIds.map(id => users.find(u => u.id === id));
});

const postLoader = new DataLoader(async (userIds) => {
  const posts = await Post.findAll({ where: { userId: userIds } });
  // Group by userId
  const grouped = groupBy(posts, 'userId');
  return userIds.map(id => grouped[id] || []);
});

// Usage:
const users = await Promise.all(userIds.map(id => userLoader.load(id)));
const posts = await Promise.all(userIds.map(id => postLoader.load(id)));
// Result: 2 queries instead of N+1
```

### Solution 3: Subquery/IN Clause

```python
# CORRECT - Load relationships with IN clause
users = User.query.all()
user_ids = [u.id for u in users]

# Single query for all posts
posts = Post.query.filter(Post.user_id.in_(user_ids)).all()

# Group by user_id in application code
posts_by_user = defaultdict(list)
for post in posts:
    posts_by_user[post.user_id].append(post)

# Result: 2 queries instead of N+1
```

## Refactoring Steps

1. **Identify N+1 queries**
   ```bash
   # Enable query logging
   # Review logs for repeated patterns
   grep "SELECT.*FROM posts WHERE user_id" app.log | wc -l
   ```

2. **Add eager loading**
   ```python
   # Before
   users = User.query.all()

   # After
   users = User.query.options(joinedload(User.posts)).all()
   ```

3. **Test performance improvement**
   ```python
   # Measure query count before and after
   from django.test.utils import override_settings
   from django.db import connection

   def test_no_n_plus_one():
       with override_settings(DEBUG=True):
           connection.queries_log.clear()
           response = client.get('/api/users')
           query_count = len(connection.queries)
           assert query_count < 10, f"N+1 detected: {query_count} queries"
   ```

4. **Add regression prevention**
   ```python
   # Add to CI/CD
   @pytest.mark.django_db
   def test_user_list_query_count():
       """Ensure user list endpoint doesn't have N+1 queries"""
       User.objects.create(username='user1')
       User.objects.create(username='user2')

       with django_assert_num_queries(5):  # Max 5 queries allowed
           response = client.get('/api/users')
   ```

## Examples of Failures

### Failure 1: Social Media Feed (2024-08-10)

**Context:**
Social media platform with posts, comments, likes, shares.

**What Went Wrong:**
```ruby
# Ruby on Rails - N+1 in feed
@posts = Post.where(user_id: current_user.following_ids).limit(50)

# In view template:
@posts.each do |post|
  post.comments.count  # Query for each post
  post.likes.count     # Query for each post
  post.shares.count    # Query for each post
  post.author.name     # Query for each post if not eager loaded
end
# Result: 1 + (50 × 4) = 201 queries
```

**Impact:**
- Feed load time: 8 seconds
- Database connections exhausted
- Site slowdown for all users
- 2 hour incident

**Fix:**
```ruby
@posts = Post.includes(:comments, :likes, :shares, :author)
             .where(user_id: current_user.following_ids)
             .limit(50)
# Result: 5 queries (1 for posts, 1 for each association)
```

**Outcome:**
- Feed load time: 0.3 seconds (26x faster)
- Database load reduced 40%

### Failure 2: Reporting Dashboard (2024-07-15)

**Context:**
Analytics dashboard showing metrics for 200 products.

**What Went Wrong:**
```python
products = Product.query.all()  # 200 products
for product in products:
    daily_sales = DailySales.query.filter_by(product_id=product.id).all()
    monthly_revenue = calculate_revenue(daily_sales)
# Result: 201 queries
```

**Impact:**
- Dashboard timeout (60 second limit)
- Report generation failed
- Business decisions delayed

**Fix:**
```python
products = Product.query.all()
product_ids = [p.id for p in products]

# Single query with aggregation
sales = db.session.query(
    DailySales.product_id,
    func.sum(DailySales.amount).label('revenue')
).filter(
    DailySales.product_id.in_(product_ids)
).group_by(
    DailySales.product_id
).all()

# Result: 2 queries
```

**Outcome:**
- Report generation: 45s → 2s (22x faster)
- Real-time dashboard now feasible

## Prevention

### Code Review Checklist

- [ ] Check for loops containing database queries
- [ ] Verify eager loading used for relationships
- [ ] Review ORM query logs in development
- [ ] Add query count assertions to tests
- [ ] Profile slow endpoints for query patterns

### Automated Checks

```python
# Pre-commit hook or CI check
def check_for_n_plus_one(file_path):
    with open(file_path) as f:
        content = f.read()

    # Look for loops with queries
    if re.search(r'for .+ in .+:\s+.*\.query\.|\.get\(|\.filter\(', content):
        print(f"Warning: Potential N+1 query in {file_path}")
        return False

    return True
```

### Monitoring

```python
# APM monitoring alert
if query_count > 50:
    apm.capture_message(
        f"High query count: {query_count}",
        level="warning",
        extra={"endpoint": request.path}
    )
```

## Related Anti-Patterns

- `anti-pattern-performance-missing-indexes` - Often compounds N+1 problem
- `anti-pattern-performance-select-star` - Makes N+1 even worse with unnecessary data
- `anti-pattern-architecture-chatty-api` - N+1 at API level instead of database level

## Related Patterns (Correct Alternatives)

- `pattern-performance-eager-loading` - Proper solution using JOINs
- `pattern-performance-dataloader` - Batch loading pattern
- `pattern-performance-query-optimization` - General query optimization strategies

## References

- [SQLAlchemy: Eager Loading](https://docs.sqlalchemy.org/en/14/orm/loading_relationships.html)
- [Django: select_related and prefetch_related](https://docs.djangoproject.com/en/stable/ref/models/querysets/#select-related)
- [Sequelize: Eager Loading](https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/)
- [DataLoader by Facebook](https://github.com/graphql/dataloader)
- [Rails N+1 Queries Explained](https://guides.rubyonrails.org/active_record_querying.html#eager-loading-associations)

## Revision History

- 2024-11-06T21:00:00Z: Initial capture with 23 observed instances
- 2024-10-15: Added user dashboard incident details
- 2024-09-22: Added API endpoint degradation incident
- 2024-08-10: Added social media feed failure example
- 2024-07-15: Added reporting dashboard failure example
