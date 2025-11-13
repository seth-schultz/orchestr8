# Provider System Overview

> **Multi-source resource loading with automatic fallback and caching**

The Orchestr8 provider system enables dynamic resource discovery from multiple sources - local filesystem, community repositories (AITMPL), and GitHub repositories. Resources are loaded on-demand with intelligent caching, health monitoring, and priority-based fallback.

## Table of Contents

- [Why Multiple Resource Sources?](#why-multiple-resource-sources)
- [Available Providers](#available-providers)
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Key Features](#key-features)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Next Steps](#next-steps)

## Why Multiple Resource Sources?

The provider system solves several critical challenges:

### Token Efficiency
- **Problem**: Loading all resources upfront consumes massive token budgets
- **Solution**: Fetch resources on-demand from multiple sources, only when needed

### Resource Discovery
- **Problem**: Users don't know what resources exist or where to find them
- **Solution**: Unified search across all providers with relevance scoring

### Community Sharing
- **Problem**: No easy way to share and discover community resources
- **Solution**: Direct integration with AITMPL (400+ components) and GitHub

### Offline Support
- **Problem**: Network issues break workflows
- **Solution**: Local filesystem provider with aggressive caching

### Extensibility
- **Problem**: Limited to built-in resources
- **Solution**: Plugin architecture for custom providers

## Available Providers

### 1. LocalProvider (Priority: 0)

**Purpose**: Access resources from local filesystem

**Use Cases**:
- Offline development
- Custom private resources
- Fastest access (no network latency)
- Development and testing

**Statistics**:
- **Resources**: Project-specific (typically 50-200)
- **Latency**: <1ms (cached), ~5-10ms (cold)
- **Availability**: 100% (local filesystem)

**URI Format**:
```
orchestr8://agents/typescript-developer
orchestr8://skills/error-handling
orchestr8://match?query=typescript+api&maxTokens=2000
```

---

### 2. AITMPLProvider (Priority: 10)

**Purpose**: Access 400+ community-contributed components from aitmpl.com

**Use Cases**:
- Discovering proven patterns and templates
- Learning from community examples
- Quick prototyping with battle-tested components
- Popular frameworks and languages

**Statistics**:
- **Resources**: 400+ components (agents, skills, commands, templates)
- **Latency**: ~50-200ms (first fetch), <1ms (cached)
- **Cache TTL**: 24 hours (index), 7 days (resources)
- **Rate Limit**: 60 req/min, 1000 req/hour

**Source**: [github.com/davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)

**URI Format**:
```
aitmpl://agents/rust-pro
aitmpl://skills/api-design
```

---

### 3. GitHubProvider (Priority: 15)

**Purpose**: Fetch resources from arbitrary GitHub repositories

**Use Cases**:
- Company-specific internal resources
- Team-shared workflows and patterns
- Forked and customized resource collections
- Version-controlled resource management

**Statistics**:
- **Resources**: Unlimited (any accessible repo)
- **Latency**: ~100-500ms (first fetch), <1ms (cached)
- **Cache TTL**: 24 hours (index), 7 days (resources)
- **Rate Limit**: 60 req/hour (unauthenticated), 5000 req/hour (authenticated)

**URI Format**:
```
github://owner/repo/agents/custom-agent
github://mycompany/resources/skills/internal-api
```

---

## Quick Start

### 1. Basic Configuration

Create `orchestr8.config.json` in your project root:

```json
{
  "providers": {
    "local": {
      "enabled": true
    },
    "aitmpl": {
      "enabled": true,
      "cacheTTL": 86400000,
      "rateLimit": {
        "requestsPerMinute": 60,
        "requestsPerHour": 1000
      }
    },
    "github": {
      "enabled": true,
      "repos": [
        "davila7/claude-code-templates",
        "mycompany/resources"
      ],
      "branch": "main",
      "auth": {
        "token": "${GITHUB_TOKEN}",
        "type": "personal"
      }
    }
  }
}
```

### 2. Environment Variables

```bash
# GitHub authentication (optional but recommended)
export GITHUB_TOKEN="ghp_your_personal_access_token"

# Custom resource path (optional)
export RESOURCES_PATH="./resources"
```

### 3. Test Provider Access

Start the MCP server with HTTP transport:

```bash
cd plugins/orchestr8
npm run dev:http
```

Open http://localhost:3000 and navigate to:
- **Providers** tab → View all registered providers
- **Health** tab → Check provider status
- **Search** tab → Test multi-provider search

### 4. Use in Workflows

Workflows automatically use the provider system:

```bash
# Claude Code will search across all providers
/orchestr8:new-project Build a Rust web server with PostgreSQL

# System automatically:
# 1. Searches LocalProvider for "rust" resources
# 2. Falls back to AITMPLProvider (finds rust-pro agent)
# 3. Caches results for 7 days
# 4. Assembles relevant fragments
```

## Architecture Overview

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        ResourceLoader                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              ProviderRegistry                            │   │
│  │  - Manages all providers                                 │   │
│  │  - Priority-based ordering                               │   │
│  │  - Health monitoring                                     │   │
│  │  - Aggregate statistics                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                     │
│         ┌──────────────────┼──────────────────┐                 │
│         │                  │                  │                 │
│  ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐           │
│  │Local (P:0)  │   │AITMPL(P:10) │   │GitHub(P:15) │           │
│  │             │   │             │   │             │           │
│  │ Filesystem  │   │ aitmpl.com  │   │ GitHub API  │           │
│  │ LRU Cache   │   │ components  │   │ Multi-repo  │           │
│  │ 4hr TTL     │   │ 24hr index  │   │ 24hr index  │           │
│  └─────────────┘   └─────────────┘   └─────────────┘           │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                  ┌─────────▼──────────┐                          │
│                  │  Unified Results   │                          │
│                  │  - Merged          │                          │
│                  │  - Sorted by score │                          │
│                  │  - Deduplicated    │                          │
│                  └────────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
1. Request: "orchestr8://match?query=rust+api"
              ↓
2. ResourceLoader.loadResourceContent()
              ↓
3. URIParser.parse() → Dynamic URI detected
              ↓
4. ProviderRegistry.searchAll()
              ↓
5. Query all enabled providers in priority order:
   - LocalProvider (priority 0)   → Search local resources
   - AITMPLProvider (priority 10)  → Search aitmpl.com
   - GitHubProvider (priority 15)  → Search GitHub repos
              ↓
6. Merge results by relevance score
              ↓
7. Apply filters (categories, tags, token budget)
              ↓
8. Cache assembled content
              ↓
9. Return to workflow
```

### Fallback Behavior

```
Primary → Secondary → Tertiary
  ↓          ↓          ↓
Local → AITMPL → GitHub

If resource found in Local:
  ✓ Return immediately (highest priority)

If not found in Local:
  → Check AITMPL
  → If found, return and cache

If not found in AITMPL:
  → Check GitHub
  → If found, return and cache

If not found in any provider:
  → Return error with suggestions
```

## Key Features

### 1. Priority-Based Resolution

Providers are queried in priority order (lower = higher priority):

| Priority | Provider | Use Case |
|----------|----------|----------|
| 0        | Local    | Custom resources, offline work |
| 10       | AITMPL   | Community patterns, proven solutions |
| 15       | GitHub   | Team resources, version-controlled |

**Smart Loading**: Higher priority providers are checked first. If a resource is found, lower-priority providers are skipped (saves API calls and latency).

### 2. Intelligent Caching

Each provider has its own cache with optimized TTLs:

```typescript
// Index caching (metadata only)
Local:  In-memory (single load at startup)
AITMPL: 24 hours (daily refresh)
GitHub: 24 hours (daily refresh)

// Resource caching (full content)
Local:  4 hours (frequent local changes)
AITMPL: 7 days (stable community content)
GitHub: 7 days (version-controlled)
```

**Cache Benefits**:
- Sub-millisecond response times for cached content
- Reduced API calls (saves rate limits)
- Offline capability after initial fetch

### 3. Health Monitoring

Each provider reports health status:

```typescript
interface ProviderHealth {
  provider: string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  lastCheck: Date;
  responseTime?: number;
  reachable: boolean;
  authenticated: boolean;
  error?: string;
  metrics?: {
    successRate: number;
    avgResponseTime: number;
    consecutiveFailures: number;
  };
}
```

**Auto-Disable**: Unhealthy providers are automatically disabled after 3 consecutive failures (prevents timeout cascades).

### 4. Rate Limit Protection

Providers implement rate limiting to prevent hitting API limits:

```typescript
// AITMPL (GitHub raw content)
- 60 requests per minute
- 1000 requests per hour

// GitHub API (authenticated)
- 5000 requests per hour
- Automatic retry with exponential backoff

// Local (no limits)
- Unlimited (filesystem access)
```

**Token Bucket Algorithm**: Smooth request distribution, prevents bursts.

### 5. Statistics Tracking

Comprehensive metrics for monitoring and optimization:

```typescript
interface ProviderStats {
  totalRequests: number;        // All requests
  successfulRequests: number;   // Successful fetches
  failedRequests: number;       // Failed fetches
  cachedRequests: number;       // Cache hits
  resourcesFetched: number;     // Unique resources
  tokensFetched: number;        // Total tokens loaded
  avgResponseTime: number;      // Average latency (ms)
  cacheHitRate: number;         // 0-1 (percentage)
  uptime: number;               // 0-1 (percentage)
}
```

**Real-time Dashboard**: View live statistics via HTTP API or WebSocket.

## Configuration

### Minimal Configuration

```json
{
  "providers": {
    "local": { "enabled": true },
    "aitmpl": { "enabled": true },
    "github": { "enabled": false }
  }
}
```

### Full Configuration Example

```json
{
  "providers": {
    "local": {
      "enabled": true,
      "resourcesPath": "./resources",
      "cacheSize": 200,
      "cacheTTL": 14400000
    },
    "aitmpl": {
      "enabled": true,
      "cacheTTL": 86400000,
      "timeout": 30000,
      "retryAttempts": 3,
      "rateLimit": {
        "requestsPerMinute": 60,
        "requestsPerHour": 1000
      }
    },
    "github": {
      "enabled": true,
      "repos": [
        "davila7/claude-code-templates",
        "mycompany/internal-resources",
        "awesome-org/patterns"
      ],
      "branch": "main",
      "auth": {
        "token": "${GITHUB_TOKEN}",
        "type": "personal"
      },
      "cacheTTL": 86400000,
      "timeout": 30000,
      "retryAttempts": 3
    }
  },
  "registry": {
    "enableHealthChecks": true,
    "healthCheckInterval": 60000,
    "autoDisableUnhealthy": true,
    "maxConsecutiveFailures": 3
  }
}
```

See [Configuration Guide](./configuration.md) for detailed options.

## Usage Examples

### Example 1: Search Across All Providers

```typescript
// In a workflow or dynamic resource request
const results = await registry.searchAll("typescript rest api", {
  categories: ["agent", "skill"],
  maxResults: 10,
  minScore: 50
});

// Results automatically merged from:
// - Local filesystem
// - AITMPL community components
// - GitHub repositories
```

### Example 2: Fetch from Specific Provider

```typescript
// Fetch from AITMPL only
const resource = await registry.fetchResource(
  "aitmpl",
  "rust-pro",
  "agent"
);

// Fetch from GitHub
const resource = await registry.fetchResource(
  "github",
  "mycompany/resources/skills/internal-api",
  "skill"
);
```

### Example 3: Dynamic URI with Fallback

```markdown
<!-- In workflow markdown -->
**Dynamic Resource:**
orchestr8://match?query=python+fastapi+validation&maxTokens=2500

**What happens:**
1. LocalProvider searches local resources for "python fastapi validation"
2. If not found, AITMPLProvider searches community components
3. If not found, GitHubProvider searches configured repos
4. Results merged, sorted by relevance, and assembled
5. Content cached for 7 days
```

### Example 4: Check Provider Health

```bash
# Via HTTP API
curl http://localhost:3000/api/providers/health/all

# Response:
{
  "local": {
    "status": "healthy",
    "responseTime": 2,
    "reachable": true
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
    "error": "Rate limit approaching (45 remaining)"
  }
}
```

## Next Steps

### Learn More

- **[Architecture](./architecture.md)** - Deep dive into provider system design
- **[Configuration Guide](./configuration.md)** - All configuration options explained
- **[Usage Guide](./usage.md)** - Detailed usage examples and patterns
- **[API Reference](./api.md)** - Complete HTTP API documentation
- **[Development Guide](./development.md)** - Create custom providers

### Common Tasks

- [Enable/Disable Providers](./usage.md#enabling-and-disabling-providers)
- [Configure GitHub Authentication](./configuration.md#github-authentication)
- [Monitor Provider Health](./usage.md#health-monitoring)
- [Optimize Cache Settings](./configuration.md#cache-configuration)
- [Create Custom Provider](./development.md#creating-a-provider)

### Troubleshooting

Having issues? Check the [Troubleshooting Guide](../guides/troubleshooting.md#provider-issues) or common problems:

- [Provider won't start](../guides/troubleshooting.md#provider-wont-start)
- [Resources not loading](../guides/troubleshooting.md#resources-not-loading)
- [Rate limit errors](../guides/troubleshooting.md#rate-limit-errors)
- [Authentication failures](../guides/troubleshooting.md#authentication-failures)

---

**Questions?** Open an issue or check the [main documentation](../README.md).
