# orchestr8

> Enterprise-grade autonomous software orchestration for Claude Code

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-green.svg)](https://claude.ai)

Transform Claude Code into a fully autonomous software engineering team. orchestr8 provides 74 specialized agents (JIT loaded via Rust MCP server) coordinated through intelligent orchestration, achieving 91.9% token reduction, <1ms agent discovery, and enterprise-scale project delivery.

## 🚀 Key Features

- **74 Specialized Agents (JIT Loaded)** - Language experts, cloud specialists, compliance agents, QA engineers, and more
- **Single MCP Plugin** - Rust-based stdio server with zero port conflicts
- **20 Discoverable Workflows** - Type `/` to see all workflows; `/orchestr8:new-project`, `/orchestr8:add-feature`, `/orchestr8:fix-bug`, `/orchestr8:security-audit`, etc.
- **Workflow Discovery via MCP** - All workflows auto-discovered as slash commands (prompts/list + prompts/get)
- **<1ms Agent Discovery** - Ultra-fast MCP queries via in-memory DuckDB
- **<10ms Agent Loading** - Cold definition load, <1ms cached via LRU
- **91.9% Token Reduction** - Only active agents in context, 73% memory savings
- **Enterprise Compliance** - Built-in FedRAMP, ISO 27001, SOC2, GDPR, PCI-DSS
- **Cross-Platform** - macOS, Linux, Windows support
- **Zero Configuration** - MCP server auto-initializes on session start

## 📦 What You Get

| Capability | Details |
|-----------|---------|
| **Languages** | Python, TypeScript, Java, Go, Rust, C#, Swift, Kotlin, Ruby, PHP, C++ |
| **Frontend** | React, Next.js, Vue, Angular |
| **Mobile** | SwiftUI, Jetpack Compose |
| **Backends** | Microservices, serverless, APIs (REST, GraphQL, gRPC) |
| **Databases** | PostgreSQL, MySQL, MongoDB, DynamoDB, Neo4j, Redis, Cassandra, Oracle, SQL Server |
| **Cloud** | AWS, Azure, GCP (with Terraform IaC) |
| **DevOps** | Docker, Kubernetes, CI/CD, monitoring (Prometheus, ELK) |
| **Quality** | Code review, testing, security audits, performance optimization |
| **AI/ML** | LangChain, LlamaIndex, data pipelines, MLOps |
| **Blockchain** | Solidity, Web3 |
| **Compliance** | FedRAMP, ISO 27001, SOC2, GDPR, PCI-DSS |

## 🎯 Use Cases

### Build New Projects End-to-End
```
/orchestr8:new-project "Build a payment processing microservice"
→ Requirements analysis → Architecture design → Implementation
→ Testing → Security audit → Deployment
```

### Add Features Safely
```
/orchestr8:add-feature "User authentication with OAuth2"
→ Design → Frontend + Backend implementation → Tests → Code review
→ Security validation → Documentation
```

### Fix Bugs Systematically
```
/orchestr8:fix-bug "Authentication tokens expiring too early"
→ Reproduce → Root cause analysis → Fix → Tests → Validation
```

### Security Audits
```
/orchestr8:security-audit
→ Dependency scanning → Static analysis → Secret detection
→ Vulnerability remediation → Compliance check
```

## 💻 Installation

### Via Claude Code

1. Open Claude Code
2. Go to Settings → Plugins → Browse Marketplace
3. Search for "orchestr8"
4. Click Install

### Manual

```bash
# Clone into your project workspace
git clone https://github.com/seth-schultz/orchestr8.git
cp -r orchestr8/.claude .

# Or install as git submodule
git submodule add https://github.com/seth-schultz/orchestr8.git .claude
```

## 🎮 Quick Start

### Discover All Workflows

Type `/` in Claude Code to see all 20 discoverable workflows as slash commands:

```
/orchestr8:add-feature           - Add new features safely
/orchestr8:build-ml-pipeline     - Build ML pipelines and models
/orchestr8:create-agent          - Create specialized agents
/orchestr8:create-plugin         - Create plugins
/orchestr8:create-skill          - Create reusable skills
/orchestr8:create-workflow       - Create workflows
/orchestr8:deploy                - Deploy to production
/orchestr8:fix-bug               - Fix bugs systematically
/orchestr8:modernize-legacy      - Modernize legacy systems
/orchestr8:new-project           - Start new projects
/orchestr8:optimize-costs        - Optimize infrastructure costs
/orchestr8:optimize-performance  - Optimize performance
/orchestr8:refactor              - Refactor code safely
/orchestr8:review-architecture   - Review architecture
/orchestr8:review-code           - Review code quality
/orchestr8:review-pr             - Review pull requests
/orchestr8:security-audit        - Run security audits
/orchestr8:setup-cicd            - Setup CI/CD pipelines
/orchestr8:setup-monitoring      - Setup monitoring
/orchestr8:test-web-ui           - Test web UI
```

### Example: Create a New Project

```
/orchestr8:new-project "Build a real-time chat application"
```

The orchestrator will:
1. Analyze requirements and design architecture
2. Implement backend, frontend, and database
3. Write comprehensive tests (unit, integration, e2e)
4. Run quality gates (code review, security, performance)
5. Update documentation
6. Prepare for deployment

### Example: Add a Feature

```
/orchestr8:add-feature "User authentication with OAuth2"
```

Automatically handles:
- Design and requirements
- Backend + frontend implementation
- Testing and code review
- Security validation
- Documentation

### Example: Run Security Audit

```
/orchestr8:security-audit
```

Performs:
- Dependency vulnerability scanning
- Static analysis
- Secret detection
- Compliance verification

## 🏗️ System Architecture

```
Claude Code Session
        ↓
MCP Server (Rust, stdio)
        ↓
DuckDB Agent Registry
        ↓
/agent-definitions/ Directory (74 definitions)
        ↓
  ┌─────────────────────┐
  │ Meta-Orchestrators  │
  │ (Strategic Layer)   │
  └─────────────────────┘
        ↓ Query MCP
  ┌─────────────────────┐
  │ JIT-Loaded Agents   │
  │ (20 max in memory)  │
  │ (Tactical Layer)    │
  └─────────────────────┘
        ↓
  ┌─────────────────────┐
  │  Skills             │
  │  (Auto-Activated)   │
  └─────────────────────┘
        ↓
  ┌─────────────────────┐
  │  20 Workflows       │
  │  (Slash Commands)   │
  └─────────────────────┘
```

### How MCP-Powered JIT Loading Works

1. **Auto-Initialize** - MCP server launches when plugin loads (<500ms)
2. **Build Registry** - Scans 74 agents in `/agent-definitions/`, indexes metadata in DuckDB (<1ms queries)
3. **Discover Workflows** - All 20 workflows auto-discovered as MCP prompts via `prompts/list` (<50ms)
4. **Discover Fast** - Orchestrators query MCP for agents (<1ms via DuckDB)
5. **Load On-Demand** - Full definition loaded only when needed (<10ms cold, <1ms cached)
6. **Execute** - Specialized agents handle their domain
7. **Release** - Definition removed from memory after use (constant ~100MB peak)
8. **Optimize** - 91.9% token reduction through JIT specialization

### Workflow Discovery (MCP Prompts)

When you type `/` in Claude Code:

1. Claude Code queries MCP: `prompts/list`
2. MCP server scans `/commands/` directory (20 workflows)
3. Returns all workflows as discoverable slash commands
4. User selects workflow → Claude Code calls `prompts/get "workflow-name"`
5. Full workflow markdown injected into conversation
6. Workflow executes and orchestrates agents via JIT loading

### Just-In-Time Agent Loading

All 74 agents are loaded on-demand when workflows need them, not at startup:

- **Startup Time:** <500ms (7.83ms measured)
- **Discovery:** <1ms queries via in-memory DuckDB
- **Agent Loading:** <10ms cold, <1ms cached
- **Memory:** Only active agents in memory (~5MB per agent, 20 max = 100MB peak)
- **Scalability:** Works with 1000+ agents without performance degradation

Workflows query the MCP server for agent definitions, ensuring all discovery goes through MCP. This three-tier architecture (metadata → discovery → definition loading) enables massive scaling while keeping context lightweight.

## 📊 Performance (JIT-Optimized)

| Metric | Value | Details |
|--------|-------|---------|
| Agent Discovery Latency | <1ms | DuckDB in-memory queries |
| Cold Definition Load | <10ms | First-time agent load from disk |
| Cached Definition Load | <1ms | LRU cache hit |
| MCP Server Startup | <500ms | Auto-initialized on session start |
| Memory per Active Agent | ~5MB | Only loaded agents in memory |
| Max Concurrent Agents | 20 | Configurable LRU cache size |
| Peak Memory Usage | ~100MB | vs 370MB without JIT (73% savings) |
| Context Bloat Reduction | 91.9% | Only active agents in context |
| Concurrent Task Capacity | 118 | vs 9 before orchestration |
| Token Savings per Task | ~19,000 | Through JIT specialization |

## 🔒 Security & Compliance

- **No Secrets Stored** - Credentials via environment variables
- **No External Dependencies** - Works completely offline
- **Compliance Built-In** - FedRAMP, ISO 27001, SOC2, GDPR, PCI-DSS agents
- **Zero Port Conflicts** - Stdio-based MCP (no TCP binding, project-scoped)
- **Context Isolation** - Each agent in separate, forked context
- **MCP Security** - All agent access through MCP server (no direct file access)
- **Memory Safety** - Rust MCP server prevents memory vulnerabilities

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and deep dive
- **[MCP_PROMPTS_IMPLEMENTATION.md](MCP_PROMPTS_IMPLEMENTATION.md)** - Workflow discovery via MCP
- **[CLAUDE.md](.claude/CLAUDE.md)** - System instructions and patterns
- **[CHANGELOG.md](.claude/CHANGELOG.md)** - Release history and features

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- Additional language/framework specialists
- More cloud provider integrations
- Custom workflow templates
- Performance optimizations

## 📄 License

MIT - See [LICENSE](LICENSE) file

## 🙋 Support

- **GitHub Issues** - Report bugs and request features
- **Documentation** - Check CLAUDE.md for system instructions
- **Examples** - See `.claude/examples/` for workflow samples

---

**Made with ❤️ for autonomous software engineering**
