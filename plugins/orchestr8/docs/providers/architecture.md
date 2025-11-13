# Provider System Architecture

> **Technical deep-dive into the multi-source resource loading system**

This document provides a comprehensive technical overview of the Orchestr8 provider architecture, including design decisions, implementation details, and integration patterns.

## Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
- [Provider Interface](#provider-interface)
- [Registry Architecture](#registry-architecture)
- [Caching Strategy](#caching-strategy)
- [Health Monitoring](#health-monitoring)
- [Priority Resolution](#priority-resolution)
- [Error Handling](#error-handling)
- [Integration with MCP](#integration-with-mcp)
- [Performance Characteristics](#performance-characteristics)

## Overview

The provider system is built on a plugin architecture that enables extensible, multi-source resource loading. It implements the **Repository Pattern** with **Strategy Pattern** for provider selection and **Observer Pattern** for health monitoring.

### Design Goals

1. **Extensibility**: Easy to add new providers without modifying core code
2. **Reliability**: Automatic fallback and health monitoring
3. **Performance**: Aggressive caching and parallel queries
4. **Observability**: Comprehensive metrics and health status
5. **Configurability**: Fine-grained control over provider behavior

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  (ResourceLoader, MCP Server, HTTP API)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Registry Layer                           │
│  (ProviderRegistry - Orchestration & Health Monitoring)     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Provider Layer                            │
│  (LocalProvider, AITMPLProvider, GitHubProvider)            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 Infrastructure Layer                        │
│  (Filesystem, HTTP Client, Cache, Rate Limiter)             │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. ResourceProvider Interface

The `ResourceProvider` interface defines the contract that all providers must implement:

```typescript
interface ResourceProvider {
  // Metadata
  readonly name: string;
  enabled: boolean;
  readonly priority: number;

  // Lifecycle
  initialize(): Promise<void>;
  shutdown(): Promise<void>;

  // Resource Operations
  fetchIndex(): Promise<RemoteResourceIndex>;
  fetchResource(id: string, category: string): Promise<RemoteResource>;
  search(query: string, options?: SearchOptions): Promise<SearchResponse>;

  // Health & Monitoring
  healthCheck(): Promise<ProviderHealth>;
  getStats(): ProviderStats;
  resetStats(): void;
}
```

**Key Design Decisions**:

- **Async by Design**: All operations return Promises for network requests
- **Lifecycle Methods**: Explicit initialization and cleanup for resource management
- **Health First**: Built-in health monitoring in the interface
- **Statistics Tracking**: Required for observability and debugging

### 2. ProviderRegistry

The registry manages all providers and coordinates their interactions.

#### Class Diagram

```typescript
class ProviderRegistry extends EventEmitter {
  private providers: Map<string, ResourceProvider>;
  private config: RegistryConfig;
  private healthCheckTimer?: NodeJS.Timeout;
  private consecutiveFailures: Map<string, number>;

  // Registration
  register(provider: ResourceProvider): Promise<void>
  unregister(name: string): Promise<boolean>
  getProvider(name: string): ResourceProvider | undefined
  getProviders(enabledOnly: boolean): ResourceProvider[]

  // Enable/Disable
  enable(name: string): boolean
  disable(name: string): boolean

  // Single Provider Operations
  fetchIndex(providerName: string): Promise<RemoteResourceIndex>
  fetchResource(providerName: string, id: string, category: string): Promise<RemoteResource>
  search(providerName: string, query: string, options?: SearchOptions): Promise<SearchResponse>

  // Multi-Provider Operations
  fetchAllIndexes(): Promise<RemoteResourceIndex[]>
  searchAll(query: string, options?: SearchOptions): Promise<SearchResponse>
  fetchResourceAny(id: string, category: string): Promise<RemoteResource>

  // Health & Monitoring
  checkHealth(name: string): Promise<ProviderHealth>
  checkAllHealth(): Promise<Map<string, ProviderHealth>>
  getProviderStats(name: string): ProviderStats
  getAggregateStats(): RegistryStats

  // Lifecycle
  shutdown(): Promise<void>
}
```

#### Responsibilities

1. **Provider Lifecycle Management**
   - Register/unregister providers
   - Initialize on registration
   - Clean shutdown on unregister

2. **Request Routing**
   - Route requests to appropriate providers
   - Coordinate multi-provider queries
   - Implement priority-based resolution

3. **Health Monitoring**
   - Periodic health checks (configurable interval)
   - Automatic disabling of unhealthy providers
   - Failure tracking and recovery

4. **Event Emission**
   - Provider registration/unregistration
   - Health status changes
   - Enable/disable events

### 3. Provider Implementations

#### LocalProvider

**Purpose**: Access local filesystem resources

**Architecture**:
```
LocalProvider
├── LRU Cache (resources)
├── Index Cache (metadata)
├── FuzzyMatcher (search)
└── Filesystem Scanner
```

**Key Features**:
- Highest priority (0) - checked first
- In-memory index loaded once at startup
- Parallel directory scanning for fast initialization
- Integration with FuzzyMatcher for semantic search
- No network dependencies

**Performance**:
- Cold fetch: ~5-10ms (filesystem read + parse)
- Cached: <1ms (LRU cache hit)
- Index load: ~100ms (parallel scan of all categories)

#### AITMPLProvider

**Purpose**: Access community resources from aitmpl.com

**Architecture**:
```
AITMPLProvider
├── HTTP Client (with retry)
├── LRU Cache (resources)
├── Index Cache (components.json)
├── Rate Limiter (token bucket)
└── Statistics Tracker
```

**Key Features**:
- Fetches from GitHub raw content (no auth required)
- Aggressive caching (24hr index, 7 day resources)
- Token bucket rate limiting (60/min, 1000/hr)
- Exponential backoff retry logic
- Format conversion (AITMPL → Orchestr8)

**Performance**:
- Cold fetch: ~50-200ms (network + parse)
- Cached: <1ms (LRU cache hit)
- Index load: ~100-300ms (one-time fetch of components.json)

**Data Source**:
- Primary: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/docs/components.json`
- Contains 400+ community-contributed components

#### GitHubProvider

**Purpose**: Access resources from arbitrary GitHub repositories

**Architecture**:
```
GitHubProvider
├── HTTP Client (with auth)
├── LRU Caches
│   ├── Resources
│   ├── Index per repo
│   └── Tree API responses
├── Rate Limiter
├── Structure Detector
└── Multi-Repo Manager
```

**Key Features**:
- Multi-repository support
- Optional authentication (5000 req/hr vs 60 req/hr)
- Auto-detect repository structure (orchestr8, claude-code-templates, flat)
- ETag support for conditional requests
- Tree API for efficient scanning

**Performance**:
- Cold fetch: ~100-500ms (network + parse)
- Cached: <1ms (LRU cache hit)
- Tree scan: ~200-800ms per repository (with caching)

**Supported Structures**:
1. **Orchestr8** - `agents/`, `skills/`, `patterns/`, etc.
2. **Claude Code Templates** - AITMPL format
3. **Flat** - Any markdown files

## Provider Interface

### Type Definitions

```typescript
// Resource metadata (without content)
interface RemoteResourceMetadata {
  id: string;
  category: "agent" | "skill" | "example" | "pattern" | "workflow";
  title: string;
  description: string;
  tags: string[];
  capabilities: string[];
  useWhen: string[];
  estimatedTokens: number;
  version?: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  source: string;
  sourceUri: string;
}

// Complete resource (with content)
interface RemoteResource extends RemoteResourceMetadata {
  content: string;
  dependencies?: string[];
  related?: string[];
}

// Resource index
interface RemoteResourceIndex {
  provider: string;
  totalCount: number;
  resources: RemoteResourceMetadata[];
  version: string;
  timestamp: Date;
  categories: Array<"agent" | "skill" | "example" | "pattern" | "workflow">;
  stats: {
    byCategory: Record<string, number>;
    totalTokens: number;
    topTags: Array<{ tag: string; count: number }>;
  };
}

// Search options
interface SearchOptions {
  query: string;
  categories?: Array<"agent" | "skill" | "example" | "pattern" | "workflow">;
  requiredTags?: string[];
  optionalTags?: string[];
  maxResults?: number;
  minScore?: number;
  maxTokens?: number;
  sortBy?: "relevance" | "date" | "tokens" | "popularity";
  sortOrder?: "asc" | "desc";
  offset?: number;
  limit?: number;
}

// Search result
interface SearchResult {
  resource: ResourceFragment;
  score: number;
  matchReason?: string[];
  highlights?: string[];
}

// Search response
interface SearchResponse {
  results: SearchResult[];
  totalMatches: number;
  query: string;
  searchTime: number;
  facets?: {
    categories?: Record<string, number>;
    tags?: Record<string, number>;
  };
}
```

### Error Types

```typescript
// Base error
class ProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public code?: string,
    public statusCode?: number,
    public cause?: Error
  )
}

// Specific errors
class ProviderTimeoutError extends ProviderError
class ProviderUnavailableError extends ProviderError
class ResourceNotFoundError extends ProviderError
class ProviderAuthenticationError extends ProviderError
class RateLimitError extends ProviderError
```

**Error Hierarchy**:
```
Error
└── ProviderError
    ├── ProviderTimeoutError
    ├── ProviderUnavailableError
    ├── ResourceNotFoundError
    ├── ProviderAuthenticationError
    └── RateLimitError
```

## Registry Architecture

### Registration Flow

```
1. Create provider instance
        ↓
2. Registry.register(provider)
        ↓
3. Check for duplicate name
        ↓
4. provider.initialize()
        ↓
5. Add to providers Map
        ↓
6. Initialize failure tracking
        ↓
7. Emit "provider-registered" event
        ↓
8. Start health checks (if first provider)
```

### Request Execution Flow

```typescript
// Single provider request
async executeWithErrorHandling<T>(
  provider: ResourceProvider,
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    const result = await operation();
    
    // Success - reset failure counter
    this.consecutiveFailures.set(provider.name, 0);
    
    return result;
  } catch (error) {
    // Track failure
    const failures = (this.consecutiveFailures.get(provider.name) || 0) + 1;
    this.consecutiveFailures.set(provider.name, failures);
    
    // Emit error event
    this.emitEvent({
      type: "provider-error",
      provider: provider.name,
      timestamp: new Date(),
      data: { operation: operationName, error: error.message }
    });
    
    // Auto-disable if threshold reached
    if (this.config.autoDisableUnhealthy && 
        failures >= this.config.maxConsecutiveFailures) {
      this.disable(provider.name);
    }
    
    throw error;
  }
}
```

### Multi-Provider Search Algorithm

```typescript
async searchAll(
  query: string,
  options?: SearchOptions
): Promise<SearchResponse> {
  const startTime = Date.now();
  const providers = this.getProviders(true); // Enabled only
  
  // 1. Query all providers in parallel
  const results = await Promise.allSettled(
    providers.map(p => 
      this.executeWithErrorHandling(
        p,
        () => p.search(query, options),
        "search"
      )
    )
  );
  
  // 2. Collect successful results
  const allResults = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value.results);
  
  // 3. Sort by relevance score (descending)
  allResults.sort((a, b) => b.score - a.score);
  
  // 4. Apply limits
  const maxResults = options?.maxResults || allResults.length;
  const limitedResults = allResults.slice(0, maxResults);
  
  // 5. Calculate aggregate facets
  const facets = this.calculateFacets(allResults);
  
  return {
    results: limitedResults,
    totalMatches: allResults.length,
    query,
    searchTime: Date.now() - startTime,
    facets
  };
}
```

**Key Points**:
- **Parallel Execution**: All providers queried simultaneously for minimum latency
- **Fault Tolerance**: `Promise.allSettled` ensures partial results on provider failures
- **Score-Based Merging**: Results merged by relevance, not provider priority
- **Configurable Limits**: Respect user-specified result limits
- **Faceted Results**: Aggregate statistics for filtering UI

### Priority-Based Resource Fetch

```typescript
async fetchResourceAny(
  id: string,
  category: string
): Promise<RemoteResource> {
  const providers = this.getProviders(true); // Enabled only, sorted by priority
  
  if (providers.length === 0) {
    throw new ProviderUnavailableError("registry", "No enabled providers");
  }
  
  const errors: Error[] = [];
  
  // Try each provider in priority order
  for (const provider of providers) {
    try {
      return await this.executeWithErrorHandling(
        provider,
        () => provider.fetchResource(id, category),
        "fetchResource"
      );
    } catch (error) {
      errors.push(error as Error);
      // Continue to next provider
    }
  }
  
  // All providers failed
  throw new ProviderError(
    `Failed to fetch resource ${id} from any provider: ${errors.map(e => e.message).join("; ")}`,
    "registry",
    "ALL_FAILED"
  );
}
```

**Behavior**:
- Try providers in priority order (Local → AITMPL → GitHub)
- Return immediately on first success
- Continue to next provider on failure
- Only throw if all providers fail

## Caching Strategy

### Cache Architecture

Each provider implements a multi-level cache:

```
Level 1: LRU Cache (Hot Data)
  ├── Resources (full content)
  ├── Index metadata
  └── API responses

Level 2: Application Cache (ResourceLoader)
  └── Assembled dynamic content

Level 3: HTTP Cache Headers (where applicable)
  └── ETag / Last-Modified
```

### Cache Configuration

```typescript
// LocalProvider
const resourceCache = new LRUCache<string, RemoteResource>({
  max: 200,                  // Max entries
  ttl: 4 * 60 * 60 * 1000,  // 4 hours
  updateAgeOnGet: true       // Reset TTL on access
});

// AITMPLProvider
const resourceCache = new LRUCache<string, CachedResource>({
  max: 1000,                 // More community resources
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days (stable content)
  updateAgeOnGet: true
});

// GitHubProvider
const indexCache = new LRUCache<string, RepositoryIndex>({
  max: 100,                  // Per repository
  ttl: 24 * 60 * 60 * 1000, // 24 hours
});

const resourceCache = new LRUCache<string, CachedResource>({
  max: 1000,
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Cache Key Strategy

```typescript
// Resource cache key
const cacheKey = `${category}:${id}`;
// Example: "agent:typescript-developer"

// Provider-specific keys
const aitmplKey = `${category}:${componentName}`;
const githubKey = `${owner}/${repo}:${category}:${path}`;
const localKey = `${category}:${relativePath}`;
```

### Cache Invalidation

**Time-Based (TTL)**:
- Automatic expiration after TTL
- Different TTLs for different content types
- Configurable per provider

**Event-Based**:
- Provider disable → Clear that provider's cache
- Registry shutdown → Clear all caches
- Manual reset → `provider.resetStats()` (for testing)

**Conditional Requests** (GitHub only):
```typescript
headers["If-None-Match"] = cachedEtag;

if (response.status === 304) {
  // Not modified - use cached version
  return cache.get(key);
}
```

## Health Monitoring

### Health Check Architecture

```
ProviderRegistry
    │
    ├── healthCheckTimer (configurable interval, default 60s)
    │
    └── checkAllHealth()
            │
            ├── provider1.healthCheck()
            ├── provider2.healthCheck()
            └── provider3.healthCheck()
                    │
                    └── Returns ProviderHealth
                            │
                            ├── status: healthy | degraded | unhealthy | unknown
                            ├── responseTime
                            ├── reachable
                            ├── authenticated
                            └── metrics
```

### Health Status Determination

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
    lastSuccess?: Date;
  };
}
```

**Status Algorithm**:

```typescript
function determineHealth(metrics: Metrics): HealthStatus {
  // Check reachability
  if (!reachable) return "unhealthy";
  
  // Check consecutive failures
  if (consecutiveFailures >= 3) return "unhealthy";
  
  // Check success rate
  const successRate = successfulRequests / totalRequests;
  
  if (successRate < 0.5) return "unhealthy";
  if (successRate < 0.9) return "degraded";
  
  // Check response time
  if (avgResponseTime > 5000) return "degraded"; // > 5 seconds
  
  return "healthy";
}
```

### Auto-Disable Logic

```typescript
// In registry health check loop
for (const provider of providers) {
  const health = await provider.healthCheck();
  
  if (health.status === "unhealthy") {
    const failures = (this.consecutiveFailures.get(provider.name) || 0) + 1;
    this.consecutiveFailures.set(provider.name, failures);
    
    if (this.config.autoDisableUnhealthy && 
        failures >= this.config.maxConsecutiveFailures) {
      
      // Auto-disable
      this.disable(provider.name);
      
      // Emit event
      this.emitEvent({
        type: "provider-disabled",
        provider: provider.name,
        timestamp: new Date(),
        data: { 
          reason: "auto-disabled",
          consecutiveFailures: failures 
        }
      });
    }
  } else if (health.status === "healthy") {
    // Reset failure counter on recovery
    this.consecutiveFailures.set(provider.name, 0);
  }
}
```

## Priority Resolution

### Priority Levels

| Priority | Provider | Rationale |
|----------|----------|-----------|
| 0 | Local | Fastest, most reliable, custom resources |
| 10 | AITMPL | Community-proven, stable, no auth required |
| 15 | GitHub | Flexible but slower, requires auth for scale |

**Lower number = Higher priority**

### Resolution Strategy

#### Single Resource Fetch (fetchResourceAny)

```
Request: "agent:typescript-developer"
    ↓
1. Query Local (priority 0)
    ├─ Found? → Return immediately ✓
    └─ Not found? → Continue
            ↓
2. Query AITMPL (priority 10)
    ├─ Found? → Return ✓
    └─ Not found? → Continue
            ↓
3. Query GitHub (priority 15)
    ├─ Found? → Return ✓
    └─ Not found? → Error: Resource not found
```

**Benefits**:
- Minimum latency (stop on first hit)
- Prefer local/faster sources
- Automatic fallback chain

#### Multi-Provider Search (searchAll)

```
Request: "typescript api authentication"
    ↓
1. Query ALL providers in PARALLEL
    ├─ Local: 15 results
    ├─ AITMPL: 23 results
    └─ GitHub: 8 results
            ↓
2. Merge results (46 total)
    ↓
3. Sort by RELEVANCE SCORE (not priority)
    ├─ AITMPL result: score 95
    ├─ Local result: score 92
    ├─ GitHub result: score 88
    └─ ...
            ↓
4. Return top N (e.g., maxResults=10)
```

**Benefits**:
- Maximum coverage (all sources)
- Best results rise to top (relevance > priority)
- Parallel execution for minimum latency

## Error Handling

### Error Hierarchy

```typescript
ProviderError (base)
├── ProviderTimeoutError          // Request timeout
├── ProviderUnavailableError      // Network/service down
├── ResourceNotFoundError         // Resource doesn't exist
├── ProviderAuthenticationError   // Auth failed
└── RateLimitError               // Rate limit hit
```

### Error Handling Strategy

#### Provider Level

```typescript
class LocalProvider implements ResourceProvider {
  async fetchResource(id: string, category: string): Promise<RemoteResource> {
    try {
      // Attempt to load resource
      const content = await fs.readFile(filePath, "utf-8");
      return parseResource(content);
      
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // File not found - specific error
        throw new ResourceNotFoundError(this.name, id, category);
      }
      
      // Generic error - wrap in ProviderError
      throw new ProviderError(
        `Failed to fetch resource: ${error.message}`,
        this.name,
        "FETCH_FAILED",
        undefined,
        error
      );
    }
  }
}
```

#### Registry Level

```typescript
async executeWithErrorHandling<T>(
  provider: ResourceProvider,
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Track metrics
    this.trackFailure(provider.name);
    
    // Emit event for monitoring
    this.emitEvent({
      type: "provider-error",
      provider: provider.name,
      data: { operation: operationName, error }
    });
    
    // Auto-disable if threshold reached
    if (shouldAutoDisable(provider.name)) {
      this.disable(provider.name);
    }
    
    // Re-throw for caller to handle
    throw error;
  }
}
```

### Retry Logic

**Exponential Backoff**:

```typescript
async httpFetch(url: string, options: RequestOptions): Promise<string> {
  const maxRetries = options.retries ?? 3;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s, ...
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await sleep(delay);
      } else {
        throw error; // Final attempt failed
      }
    }
  }
}
```

## Integration with MCP

### ResourceLoader Integration

```typescript
class ResourceLoader {
  private registry: ProviderRegistry;
  
  async initializeProviders(): Promise<void> {
    // Create registry
    this.registry = new ProviderRegistry({
      enableHealthChecks: true,
      healthCheckInterval: 60000,
      autoDisableUnhealthy: true,
      maxConsecutiveFailures: 3
    });
    
    // Register LocalProvider (always enabled)
    const localProvider = new LocalProvider(config, logger);
    await this.registry.register(localProvider);
    
    // Register AITMPL (if enabled in config)
    if (aitmplConfig.enabled) {
      const aitmplProvider = new AITMPLProvider(aitmplConfig, logger);
      await this.registry.register(aitmplProvider);
    }
    
    // Register GitHub (if enabled in config)
    if (githubConfig.enabled) {
      const githubProvider = new GitHubProvider(githubConfig, logger);
      await this.registry.register(githubProvider);
    }
  }
  
  async loadResourceContent(uri: string): Promise<string> {
    const parsed = this.uriParser.parse(uri);
    
    if (parsed.type === "static") {
      // Static URI: orchestr8://agents/typescript-developer
      if (uri.startsWith("aitmpl://")) {
        return await this.loadFromProvider("aitmpl", parsed);
      } else if (uri.startsWith("github://")) {
        return await this.loadFromProvider("github", parsed);
      } else {
        return await this.loadFromProvider("local", parsed);
      }
    } else {
      // Dynamic URI: orchestr8://match?query=...
      return await this.loadDynamicResource(parsed);
    }
  }
}
```

### HTTP API Integration

```typescript
// In http.ts
this.app.get("/api/providers", async (req, res) => {
  const providers = await this.mcpServer.getProviders();
  res.json({ providers });
});

this.app.get("/api/search/multi", async (req, res) => {
  const { q, categories, maxResults } = req.query;
  const results = await this.mcpServer.searchAllProviders(q, {
    categories: categories?.split(","),
    maxResults: parseInt(maxResults) || 50
  });
  res.json({ results });
});

this.app.get("/api/providers/:name/health", async (req, res) => {
  const health = await this.mcpServer.getProviderHealth(req.params.name);
  res.json(health);
});
```

## Performance Characteristics

### Latency Breakdown

#### Cold Start (No Cache)

| Provider | Index Load | Resource Fetch | Search |
|----------|-----------|----------------|---------|
| Local | ~100ms | ~5-10ms | ~15ms |
| AITMPL | ~100-300ms | ~50-200ms | ~100-300ms |
| GitHub | ~500-2000ms | ~100-500ms | ~500-1500ms |

#### Warm (Cached)

| Provider | Index Load | Resource Fetch | Search |
|----------|-----------|----------------|---------|
| Local | <1ms | <1ms | ~10ms |
| AITMPL | <1ms | <1ms | ~10ms |
| GitHub | <1ms | <1ms | ~10ms |

### Memory Usage

```
LocalProvider:
- Index: ~1-2MB (200 resources × 5KB metadata)
- Cache: ~20MB (200 resources × 100KB avg)

AITMPLProvider:
- Index: ~2-3MB (400 components × 5KB metadata)
- Cache: ~100MB (1000 resources × 100KB avg)

GitHubProvider:
- Index: ~5-10MB (multiple repos)
- Cache: ~100MB (1000 resources × 100KB avg)

Total: ~250MB (worst case, full caches)
```

### Throughput

| Operation | Throughput | Bottleneck |
|-----------|-----------|------------|
| Local fetch | 1000+ req/s | Filesystem I/O |
| AITMPL fetch | 60 req/min | Rate limiter |
| GitHub fetch | 5000 req/hr (auth) | GitHub API |
| Cache hit | 100,000+ req/s | Memory |
| Multi-provider search | 20-30 req/s | Network |

### Optimization Techniques

1. **Parallel Scanning** - Load provider indexes concurrently
2. **LRU Eviction** - Keep hot data in cache
3. **ETag Caching** - Avoid re-fetching unchanged GitHub content
4. **Token Bucket** - Smooth rate limit usage
5. **Promise.allSettled** - Parallel multi-provider queries
6. **Lazy Loading** - Initialize providers on-demand
7. **Index Preloading** - Background index refresh

---

## Next Steps

- **[Configuration Guide](./configuration.md)** - Configure providers and registry
- **[Usage Guide](./usage.md)** - Practical usage examples
- **[API Reference](./api.md)** - Complete HTTP API documentation
- **[Development Guide](./development.md)** - Build custom providers

---

**Questions about architecture?** Open an issue or check the [main documentation](../README.md).
