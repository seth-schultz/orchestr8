# Provider Usage Guide

> **Practical examples for working with multiple resource providers**

This guide provides hands-on examples for using the Orchestr8 provider system in workflows, scripts, and applications.

## Quick Reference

```bash
# Search across all providers
orchestr8://match?query=typescript+api&maxResults=10

# Load from specific provider
aitmpl://agents/rust-pro
github://myorg/resources/agents/custom-agent
orchestr8://agents/typescript-developer  # Local

# Check provider health
curl http://localhost:3000/api/providers/health/all

# Multi-provider search
curl "http://localhost:3000/api/search/multi?q=authentication&categories=pattern"
```

## Loading Resources

### Static URIs (Direct Load)

**Local filesystem**:
```markdown
**Agent:** `orchestr8://agents/typescript-developer`
**Skill:** `orchestr8://skills/error-handling`
**Pattern:** `orchestr8://patterns/security/authentication`
```

**AITMPL community**:
```markdown
**Agent:** `aitmpl://agents/rust-pro`
**Skill:** `aitmpl://skills/api-design`
```

**GitHub repository**:
```markdown
**Agent:** `github://myorg/resources/agents/custom-agent`
**Pattern:** `github://company/patterns/microservices`
```

### Dynamic URIs (Fuzzy Matching)

**Basic search**:
```
orchestr8://match?query=typescript+rest+api
```

**With filters**:
```
orchestr8://match?query=python+async&categories=agent,skill&maxTokens=2500
```

**Required tags**:
```
orchestr8://match?query=authentication&tags=security,jwt&maxResults=5
```

## Multi-Provider Search

### Via HTTP API

**Search all providers**:
```bash
curl "http://localhost:3000/api/search/multi?q=typescript+api&maxResults=20"
```

**Filter by categories**:
```bash
curl "http://localhost:3000/api/search/multi?q=authentication&categories=pattern,skill"
```

**Response format**:
```json
{
  "query": "typescript api",
  "totalResults": 15,
  "byProvider": {
    "local": [{ "id": "typescript-developer", "score": 95 }],
    "aitmpl": [{ "id": "rust-pro", "score": 88 }],
    "github": [{ "id": "custom-agent", "score": 82 }]
  },
  "results": [...]
}
```

### Via TypeScript/JavaScript

```typescript
import { ResourceLoader } from "@orchestr8/core";

const loader = new ResourceLoader(logger);
await loader.initializeProviders();

// Search all providers
const results = await loader.searchAllProviders("typescript api", {
  categories: ["agent", "skill"],
  maxResults: 10,
  minScore: 50
});

// Search specific provider
const aitmplResults = await loader.searchProvider("aitmpl", "rust patterns", {
  maxResults: 5
});
```

## Health Monitoring

### Check All Providers

**HTTP API**:
```bash
curl http://localhost:3000/api/providers/health/all
```

**Response**:
```json
{
  "local": {
    "status": "healthy",
    "responseTime": 2,
    "reachable": true,
    "authenticated": true
  },
  "aitmpl": {
    "status": "healthy",
    "responseTime": 156,
    "reachable": true,
    "metrics": {
      "successRate": 0.98,
      "avgResponseTime": 145
    }
  },
  "github": {
    "status": "degraded",
    "responseTime": 2340,
    "reachable": true,
    "error": "Rate limit approaching"
  }
}
```

### Check Specific Provider

```bash
curl http://localhost:3000/api/providers/github/health
```

### TypeScript/JavaScript

```typescript
// Check all providers
const health = await loader.getProvidersHealth();

for (const [name, status] of Object.entries(health)) {
  console.log(`${name}: ${status.status} (${status.responseTime}ms)`);
}

// Check specific provider
const githubHealth = await loader.getProviderHealth("github");
if (githubHealth.status !== "healthy") {
  console.warn(`GitHub provider unhealthy: ${githubHealth.error}`);
}
```

## Statistics Tracking

### Provider Statistics

**HTTP API**:
```bash
curl http://localhost:3000/api/providers/aitmpl/stats
```

**Response**:
```json
{
  "provider": "aitmpl",
  "totalRequests": 450,
  "successfulRequests": 442,
  "failedRequests": 8,
  "cachedRequests": 380,
  "resourcesFetched": 62,
  "tokensFetched": 125000,
  "avgResponseTime": 145,
  "cacheHitRate": 0.84,
  "uptime": 0.98,
  "rateLimit": {
    "remaining": 850,
    "limit": 1000,
    "resetAt": "2025-01-15T10:30:00Z"
  }
}
```

### Aggregate Statistics

```bash
curl http://localhost:3000/api/providers/stats/aggregate
```

**Response**:
```json
{
  "totalProviders": 3,
  "enabledProviders": 3,
  "healthyProviders": 2,
  "aggregate": {
    "totalRequests": 1250,
    "successfulRequests": 1205,
    "failedRequests": 45,
    "totalResourcesFetched": 156,
    "totalTokensFetched": 312000,
    "avgResponseTime": 87
  }
}
```

## Enabling/Disabling Providers

### HTTP API

**Enable provider**:
```bash
curl -X POST http://localhost:3000/api/providers/github/enable
```

**Disable provider**:
```bash
curl -X POST http://localhost:3000/api/providers/aitmpl/disable
```

### TypeScript/JavaScript

```typescript
// Disable provider temporarily
await loader.disableProvider("github");

// Re-enable later
await loader.enableProvider("github");

// Get list of enabled providers
const enabled = loader.getProviderNames(true);
console.log("Enabled providers:", enabled);
```

## Workflow Integration

### Example Workflow with Multi-Provider Support

```markdown
---
id: orchestr8:build-api
name: Build REST API
---

# Build REST API Workflow

## Phase 1: Gather Expertise

**Dynamic Resource Loading** (searches all providers):

orchestr8://match?query=typescript+rest+api+authentication&maxTokens=3000&categories=agent,skill

**What happens:**
1. LocalProvider searches local resources
2. AITMPLProvider searches community components (400+)
3. GitHubProvider searches configured repos
4. Results merged by relevance, top resources assembled
5. Content cached for 7 days

## Phase 2: Implementation

**Static Resource Reference** (specific provider):

aitmpl://skills/api-design-rest

**Fallback behavior:**
- Tries AITMPL first
- Falls back to Local if unavailable
- Falls back to GitHub if both fail

## Phase 3: Security Patterns

**Multi-Source Pattern**:

orchestr8://match?query=jwt+authentication+security&tags=security&maxTokens=2000

**Benefits:**
- Finds best security patterns across all sources
- Combines community knowledge with local standards
- Automatic caching reduces latency
```

## Best Practices

### 1. Use Dynamic URIs for Discovery

```markdown
<!-- Good: Dynamic discovery -->
orchestr8://match?query=python+async+error+handling

<!-- Less flexible: Hard-coded reference -->
orchestr8://agents/python-developer
```

### 2. Leverage Caching

```typescript
// Resources are cached automatically
// Subsequent requests are <1ms
const agent1 = await loader.loadResourceContent("aitmpl://agents/rust-pro");
const agent2 = await loader.loadResourceContent("aitmpl://agents/rust-pro"); // Cache hit
```

### 3. Monitor Health Proactively

```typescript
setInterval(async () => {
  const health = await loader.getProvidersHealth();
  
  for (const [name, status] of Object.entries(health)) {
    if (status.status !== "healthy") {
      console.warn(`Provider ${name} unhealthy: ${status.error}`);
      // Alert, disable, or fallback
    }
  }
}, 60000); // Every minute
```

### 4. Handle Errors Gracefully

```typescript
try {
  const resource = await loader.loadResourceContent(uri);
  return resource;
} catch (error) {
  if (error.code === "RESOURCE_NOT_FOUND") {
    // Try alternative source
    return await loader.loadResourceContent(fallbackUri);
  } else if (error.code === "RATE_LIMIT") {
    // Wait and retry
    await sleep(error.retryAfter);
    return await loader.loadResourceContent(uri);
  } else {
    // Log and fallback to default
    logger.error("Failed to load resource", error);
    return defaultResource;
  }
}
```

### 5. Optimize Search Queries

```typescript
// Specific query (better)
orchestr8://match?query=typescript+express+validation+zod&categories=example

// Vague query (worse)
orchestr8://match?query=typescript
```

## Common Patterns

### Pattern: Fallback Chain

```typescript
async function loadAgentWithFallback(agentId: string): Promise<string> {
  const sources = [
    `orchestr8://agents/${agentId}`,      // Local first
    `aitmpl://agents/${agentId}`,         // Community second
    `github://backup/agents/${agentId}`   // GitHub third
  ];
  
  for (const uri of sources) {
    try {
      return await loader.loadResourceContent(uri);
    } catch (error) {
      continue; // Try next source
    }
  }
  
  throw new Error(`Agent ${agentId} not found in any provider`);
}
```

### Pattern: Parallel Search

```typescript
async function searchEverywhere(query: string) {
  const [localResults, aitmplResults, githubResults] = await Promise.all([
    loader.searchProvider("local", query),
    loader.searchProvider("aitmpl", query),
    loader.searchProvider("github", query)
  ]);
  
  // Merge and deduplicate
  return mergeResults([localResults, aitmplResults, githubResults]);
}
```

### Pattern: Progressive Enhancement

```typescript
// Start with local resources (fast)
const localAgents = await loader.searchProvider("local", "typescript", {
  maxResults: 5
});

// If not enough results, search remote
if (localAgents.length < 3) {
  const remoteAgents = await loader.searchAllProviders("typescript", {
    maxResults: 5,
    minScore: 60
  });
  return [...localAgents, ...remoteAgents];
}

return localAgents;
```

---

## Next Steps

- **[Configuration Guide](./configuration.md)** - Configure providers
- **[API Reference](./api.md)** - Complete HTTP API docs
- **[Development Guide](./development.md)** - Build custom providers
- **[Architecture](./architecture.md)** - System design deep-dive

---

**Usage questions?** Check the [troubleshooting guide](../guides/troubleshooting.md) or open an issue.
