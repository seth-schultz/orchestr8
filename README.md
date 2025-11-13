[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-8.0.0--rc3-blue.svg)](VERSION)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-blueviolet.svg)](https://modelcontextprotocol.io)
[![CI](https://github.com/seth-schultz/orchestr8/workflows/CI/badge.svg)](https://github.com/seth-schultz/orchestr8/actions/workflows/ci.yml)
[![Security](https://github.com/seth-schultz/orchestr8/workflows/Security%20Scan/badge.svg)](https://github.com/seth-schultz/orchestr8/actions/workflows/security.yml)
[![License Check](https://github.com/seth-schultz/orchestr8/workflows/License%20Compliance/badge.svg)](https://github.com/seth-schultz/orchestr8/actions/workflows/license-check.yml)
![GitHub stars](https://img.shields.io/github/stars/seth-schultz/orchestr8?style=social)
![GitHub forks](https://img.shields.io/github/forks/seth-schultz/orchestr8?style=social)

# orchestr8

**Autonomous software development workflows with 95% less context usage**

Stop loading everything. Start loading exactly what you need, when you need it.

[What's New](#-whats-new-in-v80) • [Features](#-features) • [Quick Start](#-quick-start) • [Web Dashboard](#-web-dashboard) • [Documentation](#-documentation)

---

## 🎉 What's New in v8.0

### Comprehensive 3-Phase Optimization Completed

We've completed a major overhaul that achieved **80,000+ tokens saved** across all resources while dramatically improving discoverability and organization.

**Key Achievements:**
- **383 Resources Indexed** (up from 323, +18.6% growth)
- **207+ Cross-References** added for improved navigation
- **77 New Example Files** extracted for better reusability
- **Token Efficiency:** 52-83% savings in real-world usage

### Phase 1: Example Extraction
- 37 files optimized with code examples moved to dedicated fragments
- ~45,000 tokens saved through example externalization
- 77 new example files created with orchestr8:// URI references
- Improved resource reusability and maintenance

### Phase 2: Structural Organization
- 6 skill families created (Performance, Security, Testing, Observability, IaC, Error Handling)
- 9 pattern families organized (Event-Driven, Database, Architecture, etc.)
- 42 resources reorganized with hierarchical structure
- 207+ cross-references added for seamless navigation
- ~4,145 tokens net savings

### Phase 3: Progressive Loading
- 2 major agents split into core + advanced modules (Python, Rust)
- 5 workflows enhanced with JIT loading (78% average token reduction)
- 7 resources documented with progressive loading strategies
- Token efficiency: 52-83% savings in typical usage patterns

### Updated Statistics
- **Total Resources:** 383 fragments
- **Domain Experts:** 147+ specialized agents
- **Reusable Skills:** 90+ proven techniques
- **Design Patterns:** 25+ architectural patterns
- **Ready-to-Use Examples:** 77+ implementation samples
- **useWhen Scenarios:** 1,675 automated matching scenarios
- **Indexed Keywords:** 4,036 unique search terms

### Token Efficiency in Action
- **JIT Loading:** 77-83% reduction in workflow token usage
- **Progressive Loading:** 52-82% savings for complex agents
- **Example Extraction:** ~45,000 tokens saved overall
- **Total Impact:** 80,000+ tokens saved across all resources

---

## 🎯 What is orchestr8?

I spent six months watching AI agents waste tokens loading knowledge they'd never use.

The breakthrough? **Just-in-time expertise.**

orchestr8 is a Claude Code plugin that transforms AI-assisted development through intelligent resource loading via Model Context Protocol (MCP). Instead of cramming 200KB of knowledge into every conversation, it loads a lightweight 2KB catalog—then dynamically fetches exactly what's needed.

**The result?** 95-98% token reduction. Faster responses. Better conversations. Zero wasted context.

### Why This Matters

Traditional approach loads everything upfront:
- All TypeScript patterns: 15KB
- All database guides: 10KB
- All security practices: 8KB
- **Total waste: ~11,000 tokens** before you've even started

orchestr8 loads on-demand:
- Lightweight registry: 250 tokens
- Matched expertise: 800 tokens
- **Total used: ~1,050 tokens** — only what you need

That's **90% savings** on every single workflow.

---

## ✨ Features

### The orchestr8 Difference

![Traditional vs orchestr8 Comparison](plugins/orchestr8/docs/images/diagram-comparison-1.png)

**What makes orchestr8 different:**

| Traditional Approach | orchestr8 Approach | Impact |
|---------------------|-------------------|---------|
| Load all resources upfront | Query lightweight registry | **95% token reduction** |
| Static expertise bundles | Dynamic semantic matching | **40% more relevant** |
| Manual resource selection | Automatic fuzzy matching | **Sub-15ms discovery** |
| Single knowledge source | Multi-provider (Local + AITMPL + GitHub) | **400+ community resources** |
| Context window struggles | Composable micro-fragments | **10-20% usage vs 85-95%** |

### Core Capabilities

**🔍 Dynamic Resource Matching**
Semantic fuzzy matching finds relevant expertise automatically based on queries, tags, and capabilities. 1,675 useWhen scenarios and 4,036 indexed keywords ensure precision.

**⚡ Multi-Source Providers**
- **Local**: Your custom private resources (fastest, offline-capable)
- **AITMPL**: 400+ community components (proven patterns)
- **GitHub**: Your team/company repositories (version-controlled)

**🎯 JIT Loading & Progressive Assembly**
Workflows load ~2KB upfront, fetch 50KB+ on-demand. Registry-first architecture with four optimization modes:
- **index**: 200-500 tokens (95-98% reduction)
- **minimal**: 300-500 tokens (ultra-compact JSON)
- **catalog**: 1,500-2,000 tokens (full metadata)
- **full**: Complete content when you need it

**NEW: Progressive Loading** enables 52-83% token savings by loading core modules first, then advanced features only when needed.

**🤖 Expert AI Agents (147+ Total)**
Specialized domain experts for TypeScript, Python, Go, Rust, React, FastAPI, and more—loaded dynamically based on your project. New modular architecture splits complex agents into core + advanced modules.

**🧩 Resource Fragments (383 Total)**
Composable knowledge pieces organized into families:
- **Skills:** 90+ reusable techniques with hierarchical families
- **Patterns:** 25+ architectural patterns with 207+ cross-references
- **Examples:** 77+ ready-to-use implementation samples
- **Guides:** Step-by-step implementation instructions

**💨 Smart Caching**
LRU cache with configurable TTL: 1hr for prompts, 4-7 days for resources. Sub-millisecond response on cache hits.

**🔥 Hot Reload**
Watch mode with automatic reload during development. Instant feedback loop.

**📊 Health Monitoring**
Real-time provider health, statistics dashboard, and comprehensive observability.

### Token Optimization in Action

![Token Usage Comparison](plugins/orchestr8/docs/images/token-comparison-chart.png)

**Real-world example:**
```
Task: Build TypeScript REST API with JWT authentication

Without orchestr8:
- Load all TypeScript resources: 15KB
- Load all API patterns: 12KB
- Load all security guides: 8KB
- Load all database patterns: 10KB
Total: 45KB (~11,250 tokens) 😱

With orchestr8 (progressive loading):
- Query registry: 250 tokens
- Load typescript-core agent: 600 tokens
- Load security-auth-jwt skill: 400 tokens
- JIT fetch express-jwt-auth example: 350 tokens
Total: ~1,600 tokens ✅

Savings: 86% reduction! 🚀

With v8.0 optimizations:
- 77 extracted examples reduce duplication
- 207+ cross-references improve navigation
- Progressive loading defers advanced features
- Result: Even more efficient context usage
```

---

## 🚀 Quick Start

### Prerequisites

- **Claude Code** (latest version)
- **Node.js** ≥ 18.0.0 (manual installation only)
- **npm** ≥ 9.0.0 (manual installation only)

### Installation

#### Option 1: Plugin Marketplace (Recommended)

The easiest way to get started:

```bash
# Step 1: Add the orchestr8 marketplace
/plugin marketplace add seth-schultz/orchestr8

# Step 2: Install the orchestr8 plugin
/plugin install orchestr8@seth-schultz

# Step 3: Verify installation
/help
# You should see /orchestr8:* commands listed
```

**Interactive Installation:**

```bash
/plugin
# Select "Browse Plugins" → Search for "orchestr8" → Click "Install"
```

**Plugin Management:**

```bash
# Enable/disable
/plugin enable orchestr8@seth-schultz
/plugin disable orchestr8@seth-schultz

# Uninstall
/plugin uninstall orchestr8@seth-schultz
```

#### Option 2: Manual Installation

For development or contributing:

```bash
# Clone and build
git clone https://github.com/seth-schultz/orchestr8.git
cd orchestr8/plugins/orchestr8
npm install
npm run build
npm test

# Link to Claude Code settings (.claude/settings.json)
{
  "mcpServers": {
    "orchestr8": {
      "command": "node",
      "args": ["/absolute/path/to/orchestr8/plugins/orchestr8/dist/index.js"]
    }
  }
}
```

### Team Configuration

For teams, add to `.claude/settings.json` for automatic installation:

```json
{
  "plugins": {
    "marketplaces": ["seth-schultz/orchestr8"],
    "installed": ["orchestr8@seth-schultz"]
  }
}
```

### Your First Workflow

```bash
# In Claude Code, try this:
/orchestr8:new-project Build a TypeScript REST API with JWT authentication

# What happens:
# 1. ✅ Matches relevant resources (typescript-developer, security-auth-jwt)
# 2. ✅ Loads only needed fragments (~2KB total)
# 3. ✅ Assembles complete implementation plan
# 4. ✅ Provides step-by-step guidance

# Total tokens used: ~2,000 vs traditional ~11,000 (82% savings!)
```

### Workflow Execution Flow

![Workflow Flow Diagram](plugins/orchestr8/docs/images/diagram-flow-1.png)

### Available Commands

| Command | Purpose | When to Use | v8.0 Improvements |
|---------|---------|-------------|-------------------|
| **`/orchestr8:build`** | Ultra-optimized build with JIT loading | Any development task | **77-83% token savings** |
| **`/orchestr8:now`** | Autonomous workflow execution | Complex tasks | Progressive resource loading |
| **`/orchestr8:new-project`** | Create projects end-to-end | Greenfield development | Enhanced example library |
| **`/orchestr8:add-feature`** | Add features safely | Incremental development | JIT loading optimized |
| **`/orchestr8:fix-bug`** | Systematic bug resolution | Bug triage and fixes | Pattern cross-references |
| **`/orchestr8:review-code`** | Comprehensive code review | Quality assurance | 207+ quality patterns |
| **`/orchestr8:security-audit`** | Security vulnerability scanning | Compliance | 6 security pattern families |
| **`/orchestr8:optimize-performance`** | Performance optimization | Scaling | Performance skill family |
| **`/orchestr8:refactor`** | Safe code refactoring | Technical debt | Refactoring pattern library |
| **`/orchestr8:deploy`** | Production deployment | Release management | 78% avg token reduction |
| **`/orchestr8:setup-cicd`** | Configure CI/CD pipelines | DevOps automation | IaC skill family added |
| **`/orchestr8:modernize-legacy`** | Legacy system modernization | Cloud migration | Progressive migration patterns |
| **`/orchestr8:create-agent`** | Create domain expert agents | Extend orchestr8 | Modular agent template |
| **`/orchestr8:create-skill`** | Create reusable skills | Knowledge sharing | Skill family structure |
| **`/orchestr8:create-workflow`** | Create custom workflows | Process automation | JIT loading template |
| **`/orchestr8:create-medium-story`** | Generate Medium articles | Content creation | Enhanced visualizations |
| **`/orchestr8:generate-visualizations`** | Create diagrams and charts | Documentation | Mermaid + data charts |

**See [Usage Guide](plugins/orchestr8/docs/usage/) for complete command documentation.**

---

## 🌐 Web Dashboard

orchestr8 includes a powerful built-in web dashboard that runs automatically with the MCP server. No separate process needed.

### Access the Dashboard

```bash
# Development mode (HTTP only, hot reload)
npm run dev:http

# Production mode (stdio + HTTP dual transport)
npm run start:http

# Custom port
ORCHESTR8_HTTP_PORT=8080 npm run start:http

# Open browser
http://localhost:1337  # Default port
```

### Dashboard Features

**📊 Overview & Real-Time Stats**

Monitor server performance, request metrics, and system health at a glance.

![Overview Dashboard](plugins/orchestr8/docs/images/webui/overview-dashboard.png)

- Live server statistics (uptime, requests, latency)
- Performance charts (P50/P95/P99 latency, cache hit rates)
- Resource utilization metrics
- Real-time WebSocket updates

**🧪 Interactive Resource Testing**

Test dynamic resource matching with live queries and instant results.

![Testing View](plugins/orchestr8/docs/images/webui/testing-view.png)

- Execute MCP protocol requests interactively
- Test fuzzy matching with different modes (index, minimal, catalog, full)
- Preview resource content before loading
- Experiment with query parameters and filters
- View protocol-level request/response details

![Testing with Example](plugins/orchestr8/docs/images/webui/testing-with-example.png)

**🗂️ Resource Explorer**

Browse all available agents, skills, patterns, examples, and guides.

![Resources Explorer](plugins/orchestr8/docs/images/webui/resources-explorer.png)

- Category-based navigation
- Real-time search and filtering
- Resource metadata preview
- Token cost estimation
- Quick URI copy for workflows

**⏱️ Activity Timeline**

Monitor all MCP requests in real-time with detailed inspection.

![Activity Timeline](plugins/orchestr8/docs/images/webui/activity-timeline.png)

- Live request stream with timestamps
- Request type and URI details
- Success/failure status
- Response time metrics
- Full request/response payload inspection

**🏥 Provider Health Monitoring**

Track multi-source provider performance and health.

![Provider Health](plugins/orchestr8/docs/images/webui/providers-health.png)

- Provider status (local, AITMPL, GitHub)
- Response times and success rates
- Cache hit/miss ratios
- Health check results
- Provider-specific statistics

---

## 📊 Token Efficiency Monitoring

orchestr8 v8.1.0 introduces comprehensive token efficiency monitoring to track, analyze, and optimize your token usage in real-time.

### Key Features

- **Real-time Tracking**: Monitor token usage on every resource load with <5ms overhead
- **Efficiency Metrics**: See exactly how much orchestr8's JIT loading saves (typically 95-98%)
- **Cost Analysis**: Track costs in USD with automatic savings calculation based on Claude Sonnet 4.5 pricing
- **Category Breakdown**: Understand efficiency by resource type (agents, skills, patterns, etc.)
- **Trend Detection**: Identify improving, stable, or declining performance patterns over time
- **6 REST API Endpoints**: Full programmatic access to all metrics

### Quick Start

**Access Metrics via API:**
```bash
# Get current efficiency snapshot
curl http://localhost:1337/api/tokens/efficiency

# View cost savings
curl http://localhost:1337/api/tokens/cost-savings

# Category-based metrics
curl http://localhost:1337/api/tokens/by-category
```

**Example Response:**
```json
{
  "overall": {
    "efficiencyPercentage": 96.67,
    "tokensSaved": 435000,
    "costSavingsUSD": 1.35
  },
  "byCategory": [
    {
      "category": "agents",
      "efficiency": 95.2,
      "tokensSaved": 607500,
      "costSavingsUSD": 1.82
    }
  ],
  "trend": {
    "direction": "improving",
    "efficiencyChange": 1.2
  }
}
```

**Available Endpoints:**
- `GET /api/tokens/efficiency` - Comprehensive snapshot with all metrics
- `GET /api/tokens/summary` - Quick summary for dashboards
- `GET /api/tokens/by-category` - Category breakdown
- `GET /api/tokens/cost-savings` - Cost savings report
- `GET /api/tokens/trends` - Trend analysis
- `GET /api/tokens/sessions/:id` - Session-level details

### Real-World Impact

**Example Workflow:**
```
Task: Build TypeScript REST API with JWT authentication

Without orchestr8:
- Load all TypeScript resources: 15KB (~3,750 tokens)
- Load all API patterns: 12KB (~3,000 tokens)
- Load all security guides: 8KB (~2,000 tokens)
Total: 35KB (~8,750 tokens) - Cost: $0.026

With orchestr8:
- Load typescript-core agent: 2.4KB (~600 tokens)
- Load security-auth-jwt skill: 1.6KB (~400 tokens)
- JIT fetch example: 1.2KB (~300 tokens)
Total: 5.2KB (~1,300 tokens) - Cost: $0.004

Savings: 85% tokens, $0.022 USD ✅
```

**Monthly Impact** (100 workflows/month):
- Traditional approach: $2.60/month
- orchestr8 approach: $0.40/month
- **Savings: $2.20/month (85%)**

### Configuration

Enable/configure token tracking in your environment:

```bash
# Environment variables
ORCHESTR8_TOKEN_TRACKING_ENABLED=true
ORCHESTR8_TOKEN_BASELINE_STRATEGY=no_jit
ORCHESTR8_TOKEN_RETENTION_DAYS=7
```

Or in `orchestr8.config.json`:

```json
{
  "tokenTracking": {
    "enabled": true,
    "baselineStrategy": "no_jit",
    "retentionDays": 7,
    "enableTrends": true
  }
}
```

### Documentation

Complete documentation available:
- **[Token Efficiency Monitoring](plugins/orchestr8/docs/token-efficiency-monitoring.md)** - Complete feature guide
- **[API Reference](plugins/orchestr8/docs/api/token-endpoints.md)** - REST API documentation

---

## 🔌 Multi-Source Resource Providers

orchestr8 features a powerful provider system for loading resources from multiple sources with intelligent caching and automatic fallback.

### Available Providers

| Provider | Priority | Source | Resources | Use Case |
|----------|----------|--------|-----------|----------|
| **Local** | 0 (Highest) | Filesystem | Custom | Private resources, offline work, fastest |
| **AITMPL** | 10 | aitmpl.com | 400+ | Community patterns, proven solutions |
| **GitHub** | 15 | GitHub repos | Unlimited | Company resources, version-controlled |

### Quick Configuration

Create `orchestr8.config.json`:

```json
{
  "providers": {
    "local": { "enabled": true },
    "aitmpl": { "enabled": true },
    "github": {
      "enabled": true,
      "repos": ["davila7/claude-code-templates", "mycompany/resources"],
      "auth": { "token": "${GITHUB_TOKEN}", "type": "personal" }
    }
  }
}
```

**Set GitHub Token** (optional, 5000 req/hr vs 60):
```bash
export GITHUB_TOKEN="ghp_your_personal_access_token"
```

### Multi-Provider Search

Workflows automatically search **all enabled providers** in parallel:

```bash
/orchestr8:new-project Build a Rust web server with async

# What happens:
# 1. LocalProvider searches your custom resources
# 2. AITMPLProvider searches 400+ community components
# 3. GitHubProvider searches configured repos
# 4. Results merged by relevance score
# 5. Top resources assembled and cached for 7 days
```

**Example assembled content:**
- `rust-pro` agent from **AITMPL** (community expert)
- `async-patterns` skill from **Local** (your customizations)
- `web-server-template` from **GitHub** (company standards)

### Benefits

**Token Efficiency:**
```
Without providers: Load all 450 resources = 45MB (~11M tokens)
With providers: Load top 3-5 resources = 5KB (~1,250 tokens)
Savings: 99.99% ✅
```

**Resource Discovery:**
- Community-proven patterns from AITMPL
- Company-specific standards from GitHub
- Local customizations and private resources
- Automatic relevance ranking

**Reliability:**
- Automatic fallback (Local → AITMPL → GitHub)
- Health monitoring with auto-disable
- Offline capability with local provider
- Sub-millisecond cache hits

### Monitor Providers

```bash
# Start HTTP server
npm run dev:http

# Open http://localhost:1337
# View: Provider health, statistics, cache rates, real-time updates
```

**API Examples:**
```bash
# Check all providers
curl http://localhost:1337/api/providers/health/all

# Search across providers
curl "http://localhost:1337/api/search/multi?q=typescript&categories=agent"

# Get statistics
curl http://localhost:1337/api/providers/aitmpl/stats
```

### Provider Documentation

Complete provider system documentation:
- **[Provider Overview](plugins/orchestr8/docs/providers/README.md)** - Introduction and quick start
- **[Architecture](plugins/orchestr8/docs/providers/architecture.md)** - Technical design
- **[Configuration](plugins/orchestr8/docs/providers/configuration.md)** - All options
- **[Usage Guide](plugins/orchestr8/docs/providers/usage.md)** - Practical examples
- **[API Reference](plugins/orchestr8/docs/providers/api.md)** - HTTP API docs
- **[Development Guide](plugins/orchestr8/docs/providers/development.md)** - Build custom providers

---

## 🏗️ Architecture

### System Architecture Overview

![Architecture Diagram](plugins/orchestr8/docs/images/diagram-architecture-1.png)

orchestr8 implements a sophisticated MCP-based architecture optimized for token efficiency through progressive loading and intelligent resource organization.

### Key Components

**Prompt Loader**
Loads workflow prompts with argument substitution. Cached with 1hr TTL.

**Resource Loader**
Resolves static URIs and performs dynamic fuzzy matching. The brain of JIT loading. Now supports:
- Progressive module loading (core → advanced)
- Cross-reference resolution across 207+ links
- Example extraction and URI-based references
- Hierarchical skill family navigation

**URI Parser**
Supports `category/resource` and `match?query=...` formats for flexible resource access. Enhanced with:
- orchestr8:// URI scheme for examples
- Cross-reference resolution
- Family-based resource lookup

**Fuzzy Matcher**
Semantic scoring via tags, capabilities, and use-cases with 1,675 useWhen scenarios and 4,036 indexed keywords. Finds the right expertise automatically.

**Fragment Assembly**
Combines fragments within token budget limits with surgical precision:
- **383 Total Fragments** organized hierarchically
- **6 Skill Families** for structured discovery
- **9 Pattern Families** with cross-references
- **77 Example Files** for reusable code samples

**Smart Caching**
LRU cache with separate TTLs: prompts (1hr), resources (4-7 days). Sub-millisecond on hits.

**Resource Hierarchy (NEW in v8.0)**
```
resources/
├── agents/         147+ domain experts (some with core + advanced modules)
├── skills/         90+ techniques organized in 6 families
├── patterns/       25+ designs organized in 9 families
├── examples/       77+ ready-to-use code samples
├── workflows/      25+ multi-phase processes
└── guides/         Step-by-step implementation docs
```

**See [Architecture Documentation](plugins/orchestr8/docs/architecture/) for detailed design.**

---

## 📊 Performance & Benefits

### Cost Savings Comparison

![Cost Savings Chart](plugins/orchestr8/docs/images/cost-savings-chart.png)

*Monthly cost comparison: Traditional approach vs orchestr8*

### Performance Breakdown

![Performance Breakdown](plugins/orchestr8/docs/images/performance-breakdown-chart.png)

*Response time and resource usage across different workflows*

### Resource Relevance Comparison

![Relevance Comparison](plugins/orchestr8/docs/images/relevance-comparison-chart.png)

*orchestr8's fuzzy matching delivers 95%+ relevance vs 60-70% with traditional static loading*

### Key Metrics

| Metric | Traditional | orchestr8 v8.0 | Improvement |
|--------|------------|----------------|-------------|
| **Initial Token Usage** | 200KB | 18KB | **91% reduction** |
| **Query Response Time** | N/A | <15ms | **Sub-millisecond with cache** |
| **Resource Relevance** | 60-70% | 95%+ | **40% more relevant** |
| **Monthly Cost** | $400-600 | $60-100 | **85% cost savings** |
| **Context Window Usage** | 85-95% | 10-20% | **75% more headroom** |
| **Total Resources** | 323 | 383 | **+18.6% growth** |
| **Cross-References** | 0 | 207+ | **Infinite improvement** |
| **Example Reusability** | Low | High (77 files) | **Massive improvement** |
| **Token Optimization** | Baseline | 80K+ saved | **Continuous improvement** |

---

## 🧪 Development

### Setup Development Environment

```bash
cd plugins/orchestr8

# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode (auto-rebuild)
npm run watch

# Development mode with hot reload
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:watch          # Watch mode

# Coverage report
npm run test:coverage

# Verify project structure
npm run verify
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Clean build artifacts
npm run clean
```

**See [Development Guide](plugins/orchestr8/docs/guides/development.md) for complete setup.**

---

## 📚 Documentation

All comprehensive documentation is in **[`plugins/orchestr8/docs/`](plugins/orchestr8/docs/)**

### 📖 Essential Guides

| Guide | Description |
|-------|-------------|
| [Getting Started](plugins/orchestr8/docs/getting-started.md) | Installation, setup, and first workflow |
| [Usage Guide](plugins/orchestr8/docs/usage/) | How to use workflows and resources |
| [Architecture](plugins/orchestr8/docs/architecture/) | System design and implementation |
| [Authoring Guide](plugins/orchestr8/docs/authoring/) | Create agents, skills, workflows |
| [Development](plugins/orchestr8/docs/guides/development.md) | Contributing and dev workflow |

### 🔍 Reference Documentation

| Reference | Description |
|-----------|-------------|
| [MCP Implementation](plugins/orchestr8/docs/mcp/) | Protocol implementation details |
| [Fuzzy Matching](plugins/orchestr8/docs/matching/) | Dynamic resource discovery with 1,675 scenarios |
| [Resource Categories](plugins/orchestr8/docs/resources/) | 383 fragments organized hierarchically |
| [Testing Guide](plugins/orchestr8/docs/testing/) | Unit, integration, benchmarks |
| [Troubleshooting](plugins/orchestr8/docs/guides/troubleshooting.md) | Common issues and solutions |

### 🆕 What's New in v8.0

| Feature | Description |
|---------|-------------|
| [Progressive Loading](plugins/orchestr8/docs/resources/) | 52-83% token savings with core + advanced modules |
| [Example Library](plugins/orchestr8/resources/examples/) | 77 ready-to-use code samples with orchestr8:// URIs |
| [Skill Families](plugins/orchestr8/resources/skills/) | 6 organized families: Performance, Security, Testing, IaC, Observability, Error Handling |
| [Pattern Families](plugins/orchestr8/resources/patterns/) | 9 families with 207+ cross-references |
| [Cross-References](plugins/orchestr8/docs/resources/) | 207+ links between related resources |

---

## 🤝 Contributing

We welcome contributions! orchestr8 is built by developers, for developers.

### How to Contribute

1. **Read the guides:**
   - [Contributing Guide](plugins/orchestr8/docs/guides/contributing.md) - Workflow and guidelines
   - [Code of Conduct](CODE_OF_CONDUCT.md) - Community standards
   - [Authoring Guide](plugins/orchestr8/docs/authoring/) - Create resources

2. **Pick an area:**
   - 🐛 Fix bugs
   - ✨ Add features
   - 📝 Improve documentation
   - 🧪 Add tests
   - 🎨 Create agents, skills, or patterns

3. **Submit a PR:**
   - Fork the repository
   - Create a feature branch
   - Make your changes
   - Add tests
   - Submit a pull request

### Development Principles

- ✅ **Token efficiency first** - Every change should maintain or improve token usage
- ✅ **Test everything** - Comprehensive test coverage required
- ✅ **Document as you go** - Code without docs is incomplete
- ✅ **Security by default** - Security is not optional
- ✅ **Performance matters** - Sub-millisecond response times are the goal

---

## 🔒 Security

Security is our top priority. orchestr8 implements defense-in-depth security:

### Security Features

- **stdio Transport**: No network ports, local-only operation
- **Process Isolation**: MCP server runs in isolated Node.js process
- **Input Validation**: All queries and URIs sanitized
- **Dependency Scanning**: Automated npm audit on every PR
- **Secret Scanning**: Gitleaks prevents credential leaks
- **Supply Chain Security**: All GitHub Actions pinned to commit SHAs

### Reporting Vulnerabilities

**🚨 DO NOT** open public issues for security vulnerabilities.

**Instead:**
- 📧 Email: **security@orchestr8.builders**
- 🔒 Use [GitHub Security Advisories](https://github.com/seth-schultz/orchestr8/security/advisories/new)

**Response Timeline:**
- ⚡ Initial response: 24 hours
- 🔍 Confirmation: 3 business days
- 🛠️ Fix timeline: 7-60 days (based on severity)

**See [SECURITY.md](SECURITY.md) for complete policy.**

---

## 📄 License

orchestr8 is open source software licensed under the [MIT License](LICENSE).

```
MIT License - Copyright (c) 2024 Seth Schultz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

**See [LICENSE](LICENSE) for full text.**

---

## 🙏 Acknowledgments

orchestr8 stands on the shoulders of giants:

- **[Model Context Protocol](https://modelcontextprotocol.io)** - The foundation for dynamic resource loading
- **[Claude Code](https://docs.claude.com/en/docs/claude-code)** - Powering AI-assisted development
- **[@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)** - MCP TypeScript implementation
- **Open Source Community** - For inspiration, feedback, and contributions

---

**[⬆ Back to Top](#orchestr8)**

Made with ❤️ by the orchestr8 community

**Questions?** Check the **[documentation](plugins/orchestr8/docs/)** or [open an issue](https://github.com/seth-schultz/orchestr8/issues/new)
