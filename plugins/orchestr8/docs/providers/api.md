# Provider HTTP API Reference

> **Complete reference for the provider HTTP API**

This document provides comprehensive documentation for all HTTP endpoints exposed by the Orchestr8 provider system.

## Base URL

```
http://localhost:3000
```

Default port can be changed via `ORCHESTR8_HTTP_PORT` environment variable.

## Authentication

Currently, the HTTP API does not require authentication. It's intended for local development and testing.

**Security Note**: The HTTP API should only be exposed on localhost. Never expose it publicly without authentication.

## Endpoints

### Provider Management

#### List All Providers

Get information about all registered providers.

**Endpoint**: `GET /api/providers`

**Response**:
```json
{
  "providers": [
    {
      "name": "local",
      "enabled": true,
      "priority": 0,
      "health": {
        "status": "healthy",
        "responseTime": 2,
        "reachable": true
      },
      "stats": {
        "totalRequests": 150,
        "cacheHitRate": 0.87
      }
    },
    {
      "name": "aitmpl",
      "enabled": true,
      "priority": 10,
      "health": {
        "status": "healthy",
        "responseTime": 145
      },
      "stats": {
        "totalRequests": 85,
        "cacheHitRate": 0.82
      }
    }
  ]
}
```

**Example**:
```bash
curl http://localhost:3000/api/providers
```

---

#### Get Provider Resources

Get resources from a specific provider.

**Endpoint**: `GET /api/providers/:name/resources`

**Parameters**:
- `name` (path) - Provider name: `local`, `aitmpl`, `github`
- `category` (query, optional) - Filter by category: `agent`, `skill`, `pattern`, `workflow`, `example`

**Response**:
```json
{
  "provider": "aitmpl",
  "totalCount": 42,
  "resources": [
    {
      "id": "rust-pro",
      "category": "agent",
      "title": "Rust Pro Agent",
      "description": "Expert Rust developer",
      "tags": ["rust", "systems", "performance"],
      "estimatedTokens": 1250,
      "source": "aitmpl",
      "sourceUri": "https://github.com/davila7/claude-code-templates/..."
    }
  ]
}
```

**Examples**:
```bash
# All resources from AITMPL
curl http://localhost:3000/api/providers/aitmpl/resources

# Only agents from AITMPL
curl "http://localhost:3000/api/providers/aitmpl/resources?category=agent"

# GitHub resources
curl http://localhost:3000/api/providers/github/resources
```

---

#### Enable Provider

Enable a disabled provider.

**Endpoint**: `POST /api/providers/:name/enable`

**Parameters**:
- `name` (path) - Provider name

**Response**:
```json
{
  "success": true,
  "message": "Provider github enabled"
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/providers/github/enable
```

---

#### Disable Provider

Disable an enabled provider.

**Endpoint**: `POST /api/providers/:name/disable`

**Parameters**:
- `name` (path) - Provider name

**Response**:
```json
{
  "success": true,
  "message": "Provider github disabled"
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/providers/aitmpl/disable
```

---

### Search

#### Multi-Provider Search

Search across all enabled providers.

**Endpoint**: `GET /api/search/multi`

**Parameters**:
- `q` (query, required) - Search query
- `sources` (query, optional) - Comma-separated provider names or `all` (default: `all`)
- `categories` (query, optional) - Comma-separated categories
- `maxResults` (query, optional) - Maximum results (default: 50)
- `minScore` (query, optional) - Minimum relevance score 0-100 (default: 15)

**Response**:
```json
{
  "query": "typescript api",
  "totalResults": 15,
  "byProvider": {
    "local": [
      {
        "resource": {
          "id": "typescript-developer",
          "category": "agent",
          "tags": ["typescript", "api", "rest"]
        },
        "score": 95,
        "matchReason": ["Tag match: typescript", "Tag match: api"]
      }
    ],
    "aitmpl": [...],
    "github": [...]
  },
  "results": [...]
}
```

**Examples**:
```bash
# Basic search
curl "http://localhost:3000/api/search/multi?q=typescript+api"

# Filter by categories
curl "http://localhost:3000/api/search/multi?q=authentication&categories=pattern,skill"

# Specific providers only
curl "http://localhost:3000/api/search/multi?q=rust&sources=aitmpl,github"

# High relevance only
curl "http://localhost:3000/api/search/multi?q=security&minScore=70&maxResults=10"
```

---

#### Single Resource Search

Search within a single provider (local resources only).

**Endpoint**: `GET /api/search`

**Parameters**:
- `q` (query, required) - Search query

**Response**:
```json
{
  "results": [
    {
      "id": "typescript-developer",
      "uri": "orchestr8://agents/typescript-developer",
      "category": "agent",
      "tags": ["typescript", "api"],
      "capabilities": ["REST API development"],
      "tokens": 1500
    }
  ]
}
```

**Example**:
```bash
curl "http://localhost:3000/api/search?q=typescript"
```

---

### Health Monitoring

#### Get All Providers Health

Check health status of all providers.

**Endpoint**: `GET /api/providers/health/all`

**Response**:
```json
{
  "local": {
    "provider": "local",
    "status": "healthy",
    "lastCheck": "2025-01-15T10:30:00Z",
    "responseTime": 2,
    "reachable": true,
    "authenticated": true,
    "metrics": {
      "successRate": 1.0,
      "avgResponseTime": 2,
      "consecutiveFailures": 0,
      "lastSuccess": "2025-01-15T10:29:58Z"
    }
  },
  "aitmpl": {
    "provider": "aitmpl",
    "status": "healthy",
    "lastCheck": "2025-01-15T10:30:00Z",
    "responseTime": 156,
    "reachable": true,
    "authenticated": true,
    "metrics": {
      "successRate": 0.98,
      "avgResponseTime": 145,
      "consecutiveFailures": 0
    }
  },
  "github": {
    "provider": "github",
    "status": "degraded",
    "lastCheck": "2025-01-15T10:30:00Z",
    "responseTime": 2340,
    "reachable": true,
    "authenticated": true,
    "error": "Response time > 2s",
    "metrics": {
      "successRate": 0.95,
      "avgResponseTime": 1250,
      "consecutiveFailures": 0
    }
  }
}
```

**Health Status Values**:
- `healthy` - Provider is operating normally
- `degraded` - Provider is working but with issues (slow, low success rate)
- `unhealthy` - Provider is not functioning (unreachable, auth failure, etc.)
- `unknown` - Health status cannot be determined

**Example**:
```bash
curl http://localhost:3000/api/providers/health/all
```

---

#### Get Specific Provider Health

Check health of a single provider.

**Endpoint**: `GET /api/providers/:name/health`

**Parameters**:
- `name` (path) - Provider name

**Response**:
```json
{
  "provider": "github",
  "status": "healthy",
  "lastCheck": "2025-01-15T10:30:00Z",
  "responseTime": 245,
  "reachable": true,
  "authenticated": true,
  "metrics": {
    "successRate": 0.96,
    "avgResponseTime": 235,
    "consecutiveFailures": 0,
    "lastSuccess": "2025-01-15T10:29:55Z"
  }
}
```

**Example**:
```bash
curl http://localhost:3000/api/providers/github/health
```

---

### Statistics

#### Get Provider Statistics

Get detailed statistics for a specific provider.

**Endpoint**: `GET /api/providers/:name/stats`

**Parameters**:
- `name` (path) - Provider name

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
    "resetAt": "2025-01-15T11:00:00Z"
  },
  "statsResetAt": "2025-01-15T00:00:00Z"
}
```

**Example**:
```bash
curl http://localhost:3000/api/providers/aitmpl/stats
```

---

#### Get Aggregate Statistics

Get combined statistics across all providers.

**Endpoint**: `GET /api/stats`

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

**Example**:
```bash
curl http://localhost:3000/api/stats
```

---

### Resource Access

#### Get Resource Content

Fetch content of a specific resource.

**Endpoint**: `GET /api/resource`

**Parameters**:
- `uri` (query, required) - Resource URI

**Response**:
```json
{
  "content": "# Rust Pro Agent\n\nExpert Rust developer...\n\n## Capabilities\n- Systems programming\n..."
}
```

**Examples**:
```bash
# Local resource
curl "http://localhost:3000/api/resource?uri=orchestr8://agents/typescript-developer"

# AITMPL resource
curl "http://localhost:3000/api/resource?uri=aitmpl://agents/rust-pro"

# GitHub resource
curl "http://localhost:3000/api/resource?uri=github://myorg/resources/agents/custom"

# Dynamic resource (fuzzy match)
curl "http://localhost:3000/api/resource?uri=orchestr8://match?query=typescript+api"
```

---

### Category Browsing

#### List Agents

Get all available agents.

**Endpoint**: `GET /api/agents`

**Response**:
```json
{
  "agents": [
    {
      "id": "typescript-developer",
      "uri": "orchestr8://agents/typescript-developer",
      "tags": ["typescript", "javascript", "node"],
      "capabilities": ["TypeScript API development"],
      "tokens": 1500
    }
  ]
}
```

**Example**:
```bash
curl http://localhost:3000/api/agents
```

---

#### List Skills

Get all available skills.

**Endpoint**: `GET /api/skills`

**Response**:
```json
{
  "skills": [
    {
      "id": "error-handling",
      "uri": "orchestr8://skills/error-handling",
      "tags": ["errors", "exceptions", "async"],
      "capabilities": ["Error handling patterns"],
      "tokens": 850
    }
  ]
}
```

**Example**:
```bash
curl http://localhost:3000/api/skills
```

---

#### List Workflows

Get all available workflows.

**Endpoint**: `GET /api/workflows`

**Response**:
```json
{
  "workflows": [
    {
      "id": "new-project",
      "uri": "orchestr8://workflows/new-project",
      "description": "Create new project from scratch"
    }
  ]
}
```

**Example**:
```bash
curl http://localhost:3000/api/workflows
```

---

#### List Patterns

Get all available patterns.

**Endpoint**: `GET /api/patterns`

**Response**:
```json
{
  "patterns": [
    {
      "id": "authentication",
      "uri": "orchestr8://patterns/security/authentication",
      "tags": ["security", "auth", "jwt"],
      "tokens": 950
    }
  ]
}
```

**Example**:
```bash
curl http://localhost:3000/api/patterns
```

---

### System

#### Health Check

Check if the server is running.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "uptime": 3600.5
}
```

**Example**:
```bash
curl http://localhost:3000/health
```

---

## WebSocket API

### Real-Time Statistics

Connect to WebSocket for real-time statistics updates.

**Endpoint**: `ws://localhost:3000/ws`

**Message Format**:
```json
{
  "type": "stats",
  "data": {
    "totalProviders": 3,
    "enabledProviders": 3,
    "healthyProviders": 2,
    "aggregate": {...},
    "providers": {
      "local": { "status": "healthy", ... },
      "aitmpl": { "status": "healthy", ... },
      "github": { "status": "degraded", ... }
    }
  }
}
```

**Update Frequency**: Every 2 seconds

**Example (JavaScript)**:
```javascript
const ws = new WebSocket("ws://localhost:3000/ws");

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "stats") {
    console.log("Stats update:", message.data);
  }
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Missing required parameter |
| 404 | Not Found | Provider or resource not found |
| 429 | Rate Limit | Rate limit exceeded |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Provider unavailable |

### Example Error Responses

**Missing Parameter**:
```json
{
  "error": "Missing query parameter"
}
```

**Provider Not Found**:
```json
{
  "error": "Provider not-exist not found"
}
```

**Resource Not Found**:
```json
{
  "error": "Resource not-found in category agent not found in provider aitmpl"
}
```

**Rate Limit Exceeded**:
```json
{
  "error": "Rate limit exceeded for provider aitmpl, retry after 30000ms"
}
```

---

## Rate Limiting

### Provider-Level Rate Limits

Each provider implements its own rate limiting:

**AITMPL**:
- 60 requests per minute
- 1000 requests per hour

**GitHub (unauthenticated)**:
- 60 requests per hour

**GitHub (authenticated)**:
- 5000 requests per hour

**Local**:
- No rate limiting (filesystem access)

### Rate Limit Headers

Rate limit information is included in statistics:

```json
{
  "rateLimit": {
    "remaining": 850,
    "limit": 1000,
    "resetAt": "2025-01-15T11:00:00Z"
  }
}
```

---

## JavaScript SDK Example

```javascript
class Orchestr8Client {
  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl;
  }

  async searchAll(query, options = {}) {
    const params = new URLSearchParams({ q: query, ...options });
    const response = await fetch(`${this.baseUrl}/api/search/multi?${params}`);
    return response.json();
  }

  async getProviders() {
    const response = await fetch(`${this.baseUrl}/api/providers`);
    return response.json();
  }

  async getProviderHealth(name) {
    const response = await fetch(`${this.baseUrl}/api/providers/${name}/health`);
    return response.json();
  }

  async enableProvider(name) {
    const response = await fetch(`${this.baseUrl}/api/providers/${name}/enable`, {
      method: "POST"
    });
    return response.json();
  }

  async getResource(uri) {
    const params = new URLSearchParams({ uri });
    const response = await fetch(`${this.baseUrl}/api/resource?${params}`);
    return response.json();
  }
}

// Usage
const client = new Orchestr8Client();

const results = await client.searchAll("typescript api", {
  categories: "agent,skill",
  maxResults: 10
});

const health = await client.getProviderHealth("github");
console.log(`GitHub status: ${health.status}`);
```

---

## Next Steps

- **[Usage Guide](./usage.md)** - Practical usage examples
- **[Configuration](./configuration.md)** - Configure providers
- **[Development Guide](./development.md)** - Build custom providers

---

**API questions?** Check the [main documentation](../README.md) or open an issue.
