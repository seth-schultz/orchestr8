# Token Efficiency Monitoring

**Complete guide to token efficiency tracking in orchestr8**

## Overview

Token efficiency monitoring is a comprehensive system that tracks, analyzes, and optimizes token usage in orchestr8's JIT (Just-In-Time) resource loading architecture. By measuring actual token consumption against baseline scenarios, orchestr8 provides real-time insights into cost savings and performance optimization.

### What is Token Efficiency Monitoring?

Token efficiency monitoring captures detailed metrics on every resource load operation, comparing actual token usage against what would have been consumed without orchestr8's optimization strategies. The system tracks:

- **Input/Output Tokens**: Complete token consumption data from Claude SDK
- **Cache Metrics**: Prompt caching effectiveness with read/creation tracking
- **Baseline Comparison**: Tokens that would be used without JIT loading
- **Cost Analysis**: Real USD cost and savings based on Claude Sonnet 4.5 pricing
- **Category Breakdown**: Efficiency by resource type (agents, skills, patterns, etc.)
- **Trend Detection**: Performance improvements or degradations over time

### Why It Matters for orchestr8

orchestr8's core value proposition is **95-98% token reduction** through dynamic resource loading. Token efficiency monitoring validates this claim with empirical data and provides:

1. **Proof of Value**: Quantify actual token and cost savings
2. **Optimization Insights**: Identify resources needing performance improvements
3. **Trend Analysis**: Track efficiency improvements over time
4. **Cost Transparency**: Understand real costs vs savings in USD
5. **Quality Assurance**: Ensure JIT loading delivers expected benefits

### Key Metrics Tracked

| Metric | Description | Typical Value |
|--------|-------------|---------------|
| **Efficiency Percentage** | `(tokensSaved / baseline) × 100` | 95-98% |
| **Tokens Saved** | Baseline tokens - actual tokens | 30K-45K per workflow |
| **Cost Savings (USD)** | Money saved vs traditional loading | $0.09-$0.14 per workflow |
| **Cache Hit Rate** | Percentage of cache hits | 60-90% |
| **Category Efficiency** | Efficiency by resource type | Varies by category |
| **Trend Direction** | Improving, stable, or declining | Target: improving/stable |

## Features

### 1. Real-time Token Tracking

Every resource load operation is tracked with microsecond precision:

```typescript
{
  messageId: "msg_01ABC123",
  timestamp: "2025-11-12T21:30:00.000Z",
  inputTokens: 1200,
  outputTokens: 350,
  cacheReadTokens: 2500,      // 10x cheaper than input
  cacheCreationTokens: 1200,   // One-time cache creation
  totalTokens: 5250,
  category: "agent",
  resourceUri: "orchestr8://agents/typescript-developer",
  baselineTokens: 15000,       // Without JIT loading
  tokensSaved: 9750,
  efficiencyPercentage: 65.0,
  costUSD: 0.0158,
  costSavingsUSD: 0.0293
}
```

**Deduplication**: Message IDs prevent double-counting when the same request is processed multiple times.

### 2. Efficiency Percentage Calculation

The efficiency engine calculates how much orchestr8 saves compared to traditional approaches:

```
Efficiency % = (Tokens Saved / Baseline Tokens) × 100
Tokens Saved = Baseline Tokens - Actual Tokens Used

Example:
- Baseline (load all resources): 45,000 tokens
- Actual (JIT loading): 2,000 tokens
- Tokens Saved: 43,000 tokens
- Efficiency: 95.56%
```

**Baseline Strategies**:
- `no_jit`: All resources loaded upfront (default)
- `no_cache`: JIT loading without prompt caching
- `custom`: User-defined baseline calculation

### 3. Cost Savings Reports

Real-time cost tracking based on Claude Sonnet 4.5 pricing (Jan 2025):

| Token Type | Cost per Million | Cost Factor |
|------------|------------------|-------------|
| Input Tokens | $3.00 | 1× |
| Output Tokens | $15.00 | 5× |
| Cache Read Tokens | $0.30 | 0.1× |
| Cache Creation Tokens | $3.75 | 1.25× |

**Cost Calculation Example**:
```
Input: 1,200 tokens × $3.00/1M = $0.0036
Output: 350 tokens × $15.00/1M = $0.0053
Cache Read: 2,500 tokens × $0.30/1M = $0.0008
Cache Creation: 1,200 tokens × $3.75/1M = $0.0045
───────────────────────────────────────
Total Cost: $0.0142

Baseline Cost (45K tokens): $0.135
Cost Savings: $0.1208 (89.5% reduction)
```

### 4. Category-based Analysis

Token usage grouped by resource type for granular insights:

```json
{
  "category": "agents",
  "loadCount": 45,
  "totalTokens": 67500,
  "inputTokens": 45000,
  "outputTokens": 15000,
  "cacheTokens": 7500,
  "baselineTokens": 675000,
  "tokensSaved": 607500,
  "efficiency": 90.0,
  "costUSD": 0.2025,
  "costSavingsUSD": 2.0250,
  "topResources": [
    {
      "uri": "orchestr8://agents/typescript-developer",
      "loadCount": 15,
      "tokens": 22500
    }
  ]
}
```

**Available Categories**:
- `agents`: Domain expert agents (147+)
- `skills`: Reusable techniques (90+)
- `patterns`: Architectural patterns (25+)
- `examples`: Code samples (77+)
- `workflows`: Multi-phase processes (25+)
- `guides`: Implementation docs

### 5. Trend Detection

Compare current performance against previous periods:

```json
{
  "efficiencyChange": +2.3,        // Percentage point improvement
  "tokenSavingsChange": +5234,     // Additional tokens saved
  "costSavingsChange": +0.0157,    // Additional USD saved
  "direction": "improving"         // improving | stable | declining
}
```

**Trend Thresholds**:
- **Improving**: Efficiency change > +1%
- **Stable**: Efficiency change ±1%
- **Declining**: Efficiency change < -1%

### 6. Performance Insights

Identify optimization opportunities:

**Top Performers** (highest efficiency):
```json
[
  {
    "uri": "orchestr8://skills/api-optimization",
    "category": "skill",
    "efficiency": 98.2,
    "tokensSaved": 15234
  }
]
```

**Needs Optimization** (frequently used but low efficiency):
```json
[
  {
    "uri": "orchestr8://agents/legacy-system-analyst",
    "category": "agent",
    "efficiency": 52.1,
    "loadCount": 8
  }
]
```

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                   Token System                          │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Tracker    │  │   Metrics    │  │  Efficiency  │  │
│  │              │  │   Engine     │  │   Engine     │  │
│  │ • Records    │  │ • Aggregates │  │ • Calculates │  │
│  │   usage      │  │   data       │  │   % savings  │  │
│  │ • Dedupes    │  │ • Snapshots  │  │ • Trends     │  │
│  │   messages   │  │ • Summaries  │  │ • Insights   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│         └─────────────────┼──────────────────┘          │
│                           │                             │
│                    ┌──────▼───────┐                     │
│                    │   Store      │                     │
│                    │              │                     │
│                    │ • In-memory  │                     │
│                    │ • Sessions   │                     │
│                    │ • Cleanup    │                     │
│                    └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐      ┌────▼─────┐      ┌────▼─────┐
   │  HTTP    │      │   Stats  │      │Resource  │
   │  API     │      │Collector │      │ Loader   │
   │          │      │          │      │          │
   │• 6 REST  │      │• WebSocket│      │• Tracks  │
   │  endpoints│      │  broadcast│      │  loads   │
   └──────────┘      └──────────┘      └──────────┘
```

### Component Responsibilities

**Token Tracker** (`tracker.ts`):
- Records individual token usage events
- Handles message ID deduplication
- Calculates per-request efficiency
- Computes costs based on token types

**Metrics Engine** (`metrics.ts`):
- Aggregates usage records by time period
- Generates efficiency snapshots
- Produces summary reports
- Filters by category and timeframe

**Efficiency Engine** (`efficiency.ts`):
- Calculates efficiency percentages
- Groups data by category
- Identifies top performers
- Detects optimization opportunities
- Compares trends across periods

**Token Store** (`store.ts`):
- In-memory storage with Map/Set
- Session-level aggregation
- Automatic cleanup (7-day retention)
- Thread-safe operations

**HTTP API** (`http.ts`):
- 6 REST endpoints for metrics access
- Real-time WebSocket broadcasting
- Error handling and validation
- CORS and security headers

**Stats Collector** (`stats.ts`):
- Integrates token metrics into dashboard
- Broadcasts updates to WebSocket clients
- Combines with server statistics

### Data Flow

```
1. Resource Load Request
   │
   ├─→ ResourceLoader.loadResource()
   │   │
   │   ├─→ Read from cache OR fetch from provider
   │   │
   │   └─→ TokenTracker.trackUsage()
   │       │
   │       ├─→ Calculate baseline (what would be used)
   │       ├─→ Calculate actual (what was used)
   │       ├─→ Compute efficiency & cost
   │       └─→ TokenStore.recordUsage()
   │
2. Metrics Request (via API or WebSocket)
   │
   ├─→ MetricsEngine.getEfficiencySnapshot()
   │   │
   │   ├─→ TokenStore.getUsageRecords(period)
   │   │
   │   ├─→ EfficiencyEngine.generateSnapshot()
   │   │   │
   │   │   ├─→ Calculate overall metrics
   │   │   ├─→ Group by category
   │   │   ├─→ Compute cache effectiveness
   │   │   ├─→ Detect trends
   │   │   └─→ Identify top/bottom performers
   │   │
   │   └─→ Return EfficiencySnapshot
   │
3. Stats Broadcast (every 5 seconds)
   │
   └─→ StatsCollector.broadcastUpdate()
       │
       └─→ Include token metrics in stats
           │
           └─→ WebSocket → Dashboard UI
```

### Integration Points

**ResourceLoader Integration**:
```typescript
// In ResourceLoader.loadResource()
const startTime = Date.now();
const resource = await this.fetchResource(uri);
const endTime = Date.now();

if (this.tokenSystem) {
  await this.tokenSystem.tracker.trackUsage({
    messageId: context.messageId,
    category: resource.category,
    resourceUri: uri,
    actualTokens: resource.tokens,
    baselineTokens: this.calculateBaseline(resource),
  });
}
```

**Stats Collector Integration**:
```typescript
// In StatsCollector.collectStats()
if (this.mcpServer.tokenSystem) {
  const snapshot = await this.mcpServer.tokenSystem.metrics
    .getEfficiencySnapshot({ period: 'last_hour' });

  stats.tokenEfficiency = {
    efficiency: snapshot.overall.efficiencyPercentage,
    tokensSaved: snapshot.overall.tokensSaved,
    costSavingsUSD: snapshot.overall.costSavingsUSD,
  };
}
```

## Configuration

### Environment Variables

```bash
# Token tracking configuration
ORCHESTR8_TOKEN_TRACKING_ENABLED=true
ORCHESTR8_TOKEN_BASELINE_STRATEGY=no_jit
ORCHESTR8_TOKEN_DEDUPLICATION=true
ORCHESTR8_TOKEN_RETENTION_DAYS=7
ORCHESTR8_TOKEN_ENABLE_TRENDS=true

# Custom pricing (optional)
ORCHESTR8_TOKEN_INPUT_COST_PER_M=3.00
ORCHESTR8_TOKEN_OUTPUT_COST_PER_M=15.00
ORCHESTR8_TOKEN_CACHE_READ_COST_PER_M=0.30
ORCHESTR8_TOKEN_CACHE_CREATION_COST_PER_M=3.75
```

### Configuration Options

**In `orchestr8.config.json`**:

```json
{
  "tokenTracking": {
    "enabled": true,
    "baselineStrategy": "no_jit",
    "deduplication": true,
    "retentionDays": 7,
    "enableTrends": true,
    "customCosts": {
      "inputCostPerMillion": 3.00,
      "outputCostPerMillion": 15.00,
      "cacheReadCostPerMillion": 0.30,
      "cacheCreationCostPerMillion": 3.75
    }
  }
}
```

**Configuration Fields**:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable token tracking |
| `baselineStrategy` | string | `"no_jit"` | How baseline is calculated |
| `deduplication` | boolean | `true` | Prevent duplicate message tracking |
| `retentionDays` | number | `7` | Days to retain tracking data |
| `enableTrends` | boolean | `true` | Enable trend analysis |
| `customCosts` | object | (see above) | Override Claude pricing |

### Baseline Strategies Explained

**1. `no_jit` (Default)**
```
Baseline = Total tokens if all resources loaded upfront
Example: Load all 383 resources = 450KB = ~112,500 tokens
Actual: Load 3 matched resources = 5KB = ~1,250 tokens
Efficiency: 98.9%
```

**2. `no_cache`**
```
Baseline = JIT loading but no prompt caching
Example: Load 3 resources without cache = 5KB = ~1,250 tokens
Actual: Load with cache (2.5K cache reads) = ~500 tokens
Efficiency: 60%
```

**3. `custom`**
```typescript
// Define your own baseline calculation
tokenTracker.setBaselineCalculator((resource) => {
  // Your custom logic
  return customBaselineTokens;
});
```

### Customization

**Custom Token Costs** (for different models):
```typescript
import { TokenSystem } from './token';

const tokenSystem = new TokenSystem({
  customCosts: {
    inputCostPerMillion: 5.00,      // GPT-4 Turbo pricing
    outputCostPerMillion: 15.00,
    cacheReadCostPerMillion: 0.50,
    cacheCreationCostPerMillion: 5.00,
  },
});
```

**Retention Period**:
```bash
# Keep data for 30 days
ORCHESTR8_TOKEN_RETENTION_DAYS=30
```

**Disable Tracking**:
```bash
# For development/testing
ORCHESTR8_TOKEN_TRACKING_ENABLED=false
```

## Usage

### Accessing Metrics via API

**1. Get Current Efficiency Snapshot**
```bash
curl http://localhost:1337/api/tokens/efficiency?period=last_hour

# Response:
{
  "timestamp": "2025-11-12T21:30:00Z",
  "period": "last_hour",
  "overall": {
    "totalTokens": 15000,
    "baselineTokens": 450000,
    "tokensSaved": 435000,
    "efficiencyPercentage": 96.67,
    "costUSD": 0.045,
    "costSavingsUSD": 1.350
  },
  "byCategory": [...],
  "cache": {...},
  "trend": {...},
  "topPerformers": [...],
  "needsOptimization": [...]
}
```

**2. Get Summary Report**
```bash
curl http://localhost:1337/api/tokens/summary?period=last_day

# Response:
{
  "period": "last_day",
  "totalTokens": 125000,
  "baselineTokens": 3600000,
  "tokensSaved": 3475000,
  "efficiency": 96.53,
  "costUSD": 0.375,
  "costSavingsUSD": 10.800,
  "messageCount": 150,
  "cacheHitRate": 78.5
}
```

**3. Get Cost Savings**
```bash
curl http://localhost:1337/api/tokens/cost-savings?period=last_week

# Response:
{
  "period": "last_week",
  "totalCostUsd": 2.625,
  "totalCostSavingsUsd": 75.600,
  "baselineCostUsd": 78.225,
  "efficiency": 96.65,
  "tokensSaved": 24325000,
  "timestamp": "2025-11-12T21:30:00Z"
}
```

**4. Get Category Breakdown**
```bash
curl http://localhost:1337/api/tokens/by-category

# Response:
{
  "categories": [
    {
      "category": "agents",
      "loadCount": 45,
      "efficiency": 95.2,
      "tokensSaved": 607500,
      "costSavingsUSD": 1.823
    },
    ...
  ],
  "timestamp": "2025-11-12T21:30:00Z"
}
```

**5. Get Trend Analysis**
```bash
curl http://localhost:1337/api/tokens/trends?period=last_day

# Response:
{
  "trend": {
    "efficiencyChange": +1.2,
    "tokenSavingsChange": +12500,
    "costSavingsChange": +0.038,
    "direction": "improving"
  },
  "overall": {...},
  "timestamp": "2025-11-12T21:30:00Z"
}
```

**6. Get Session Details**
```bash
curl http://localhost:1337/api/tokens/sessions/sess_abc123

# Response:
{
  "sessionId": "sess_abc123",
  "startTime": "2025-11-12T20:00:00Z",
  "endTime": "2025-11-12T21:00:00Z",
  "messageCount": 15,
  "totalTokens": 18750,
  "sessionEfficiency": 96.8,
  "totalCostSavingsUSD": 0.563,
  "usageRecords": [...]
}
```

### Interpreting Efficiency Data

**Efficiency Ratings**:
- **Excellent (90-100%)**: orchestr8 is working optimally
- **Good (70-89%)**: Solid performance, room for improvement
- **Fair (50-69%)**: Acceptable but investigate optimization opportunities
- **Needs Improvement (<50%)**: Review resource structure and caching

**What to Look For**:

✅ **Positive Indicators**:
- Efficiency > 95%
- Cache hit rate > 70%
- Trend direction: improving or stable
- Token savings > 30K per workflow

⚠️ **Warning Signs**:
- Efficiency < 70%
- Cache hit rate < 50%
- Trend direction: declining
- Frequently loaded resources with low efficiency

**Action Items by Efficiency**:

| Efficiency | Action |
|-----------|--------|
| 95-100% | **Perfect** - Monitor and maintain |
| 85-94% | **Good** - Consider minor optimizations |
| 70-84% | **Investigate** - Review resource sizing |
| 50-69% | **Optimize** - Split large resources, improve caching |
| <50% | **Urgent** - Major refactoring needed |

### Dashboard Walkthrough

**Access the Dashboard**:
```bash
npm run start:http
# Open http://localhost:1337
```

**Overview Tab**:
- **Token Efficiency Card**: Current efficiency percentage
- **Tokens Saved Card**: Total tokens saved today
- **Cost Saved Card**: USD savings
- **Efficiency Chart**: Trend over time
- **Category Breakdown**: Pie chart by resource type

**Activity Tab**:
- Real-time token usage stream
- Filter by category
- Click for detailed metrics

**Testing Tab**:
- Execute test queries
- View token consumption
- Compare efficiency across queries

**Providers Tab**:
- Provider-specific efficiency
- Cache hit rates by provider
- Cost breakdown

### Exporting Reports

**JSON Export**:
```bash
curl http://localhost:1337/api/tokens/summary?period=last_week > report.json
```

**CSV Export** (via jq):
```bash
curl http://localhost:1337/api/tokens/by-category | \
  jq -r '.categories[] | [.category, .efficiency, .tokensSaved, .costSavingsUSD] | @csv' > report.csv
```

**Markdown Report**:
```bash
cat << 'EOF' > report.md
# Token Efficiency Report
$(curl -s http://localhost:1337/api/tokens/summary | jq -r '"
## Summary
- Efficiency: \(.efficiency)%
- Tokens Saved: \(.tokensSaved)
- Cost Savings: $\(.costSavingsUSD)
"')
EOF
```

## Best Practices

### Monitoring Strategies

**1. Establish Baselines**
```bash
# Week 1: Collect baseline metrics
# Track typical workflows and their efficiency
# Document expected efficiency ranges per category
```

**2. Set Alerts**
```typescript
// Monitor efficiency drops
if (snapshot.overall.efficiencyPercentage < 85) {
  console.warn('Efficiency below threshold:', snapshot);
}

// Track trend degradation
if (snapshot.trend.direction === 'declining') {
  console.warn('Efficiency declining:', snapshot.trend);
}
```

**3. Regular Reviews**
```bash
# Daily: Check overall efficiency
curl http://localhost:1337/api/tokens/summary

# Weekly: Analyze trends
curl http://localhost:1337/api/tokens/trends?period=last_week

# Monthly: Review category breakdown
curl http://localhost:1337/api/tokens/by-category?period=last_month
```

**4. Optimization Sprints**
```bash
# Identify low-performing resources
curl http://localhost:1337/api/tokens/efficiency | \
  jq '.needsOptimization[]'

# Target resources with:
# - High load count
# - Low efficiency
# - Declining trends
```

### Performance Optimization

**1. Split Large Resources**
```markdown
<!-- Before: Monolithic agent (15KB) -->
orchestr8://agents/python-expert

<!-- After: Modular approach (2KB core + 5KB advanced) -->
orchestr8://agents/python-expert-core
orchestr8://agents/python-expert-advanced (loaded only when needed)

Efficiency improvement: 75% → 92%
```

**2. Leverage Progressive Loading**
```typescript
// Load core first
const core = await loader.load('agent/typescript-core');

// Load advanced only if needed
if (context.requiresAdvanced) {
  const advanced = await loader.load('agent/typescript-advanced');
}
```

**3. Optimize Example Extraction**
```markdown
<!-- Before: Inline examples (10KB) -->
# Skill: API Security
... (content with embedded examples)

<!-- After: External examples (2KB skill + 3KB examples) -->
# Skill: API Security
See examples:
- orchestr8://examples/security/jwt-auth
- orchestr8://examples/security/oauth-flows

Efficiency improvement: 68% → 89%
```

**4. Improve Cache Effectiveness**
```typescript
// Use cache-friendly resource organization
// Group frequently co-loaded resources
// Standardize resource structure for better cache hits
```

### Troubleshooting

**Issue: Low Efficiency (<70%)**

**Diagnosis**:
```bash
# Check category breakdown
curl http://localhost:1337/api/tokens/by-category

# Identify culprit category
# agents: 95% ✓
# skills: 92% ✓
# workflows: 55% ⚠️
```

**Solutions**:
1. Review resource size: `wc -c workflows/*.md`
2. Split large workflows into phases
3. Extract examples to separate files
4. Use progressive loading pattern

**Issue: Declining Trends**

**Diagnosis**:
```bash
curl http://localhost:1337/api/tokens/trends

# trend.direction: "declining"
# trend.efficiencyChange: -3.5
```

**Possible Causes**:
- Resources growing without optimization
- Cache not being utilized
- Baseline strategy mismatch

**Solutions**:
1. Audit recent resource changes
2. Verify cache configuration
3. Review baseline strategy

**Issue: High Cost Despite High Efficiency**

**Diagnosis**:
```bash
curl http://localhost:1337/api/tokens/cost-savings

# efficiency: 96.5% ✓
# costUSD: 5.50 ⚠️
```

**Cause**: High volume of requests

**Solutions**:
1. Increase cache TTL
2. Implement request batching
3. Review resource reuse patterns

## Examples

### API Request/Response Examples

**Example 1: Quick Efficiency Check**
```bash
$ curl -s http://localhost:1337/api/tokens/efficiency | jq '{
  efficiency: .overall.efficiencyPercentage,
  saved: .overall.tokensSaved,
  cost_saved: .overall.costSavingsUSD
}'

{
  "efficiency": 96.67,
  "saved": 435000,
  "cost_saved": 1.35
}
```

**Example 2: Category Analysis**
```bash
$ curl -s http://localhost:1337/api/tokens/by-category | jq '.categories[] | {
  category: .category,
  efficiency: .efficiency,
  loads: .loadCount
}'

{
  "category": "agents",
  "efficiency": 95.2,
  "loads": 45
}
{
  "category": "skills",
  "efficiency": 97.8,
  "loads": 67
}
```

**Example 3: Weekly Report**
```bash
$ curl -s http://localhost:1337/api/tokens/summary?period=last_week | jq

{
  "period": "last_week",
  "totalTokens": 875000,
  "baselineTokens": 25200000,
  "tokensSaved": 24325000,
  "efficiency": 96.53,
  "costUSD": 26.25,
  "costSavingsUSD": 756.00,
  "messageCount": 1050,
  "cacheHitRate": 82.3
}

# Translation:
# - Processed 1,050 messages
# - Used 875K tokens vs 25.2M baseline
# - Saved $756 in API costs
# - 82% cache hit rate
```

### Common Queries

**1. Daily Efficiency Report**
```bash
#!/bin/bash
# daily-report.sh
echo "=== Orchestr8 Daily Report $(date +%Y-%m-%d) ==="
echo ""

summary=$(curl -s http://localhost:1337/api/tokens/summary?period=last_day)
echo "Efficiency: $(echo $summary | jq -r '.efficiency')%"
echo "Tokens Saved: $(echo $summary | jq -r '.tokensSaved')"
echo "Cost Savings: $$(echo $summary | jq -r '.costSavingsUSD')"
echo "Messages: $(echo $summary | jq -r '.messageCount')"
```

**2. Find Optimization Candidates**
```bash
curl -s http://localhost:1337/api/tokens/efficiency | \
  jq -r '.needsOptimization[] |
    "⚠️ \(.uri) - Efficiency: \(.efficiency)% - Loads: \(.loadCount)"'

# Output:
# ⚠️ orchestr8://agents/legacy-system - Efficiency: 52.1% - Loads: 8
# ⚠️ orchestr8://workflows/cloud-migration - Efficiency: 64.7% - Loads: 5
```

**3. Monitor Cost in Real-time**
```bash
watch -n 5 'curl -s http://localhost:1337/api/tokens/cost-savings | \
  jq "{cost: .totalCostUsd, saved: .totalCostSavingsUsd}"'
```

### Dashboard Screenshots

*Coming soon: Visual examples of the dashboard UI*

---

## Summary

Token efficiency monitoring provides comprehensive visibility into orchestr8's performance, validating the 95-98% token reduction claim with empirical data. Use the metrics, trends, and insights to continuously optimize your resource library and maximize cost savings.

**Quick Reference**:
- **API Docs**: [Token Endpoints](/plugins/orchestr8/docs/api/token-endpoints.md)
- **Architecture**: [System Design](/plugins/orchestr8/docs/architecture/system-design.md)
- **Dashboard**: [Web UI Guide](/plugins/orchestr8/docs/web-ui.md)
- **Troubleshooting**: [Common Issues](/plugins/orchestr8/docs/guides/troubleshooting.md)

**Need Help?**
- Check [Troubleshooting](#troubleshooting) section
- Review [Best Practices](#best-practices)
- Open an issue: [GitHub Issues](https://github.com/seth-schultz/orchestr8/issues)
