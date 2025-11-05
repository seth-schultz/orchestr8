# orchestr8

> Enterprise-grade autonomous software orchestration for Claude Code

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-green.svg)](https://claude.ai)

Transform Claude Code into a fully autonomous software engineering team. orchestr8 provides 74 specialized agents coordinated through intelligent MCP-based orchestration, achieving 91.9% token reduction and enabling enterprise-scale project delivery.

## 🚀 Key Features

- **74 Specialized Agents** - Language experts, cloud specialists, compliance agents, QA engineers, and more
- **18 Modular Plugins** - Install only what you need (80-90% context reduction)
- **20 Autonomous Workflows** - `/new-project`, `/add-feature`, `/fix-bug`, `/security-audit`, and more
- **<1ms Agent Discovery** - Ultra-fast MCP-based agent selection via DuckDB
- **91.9% Token Reduction** - Intelligent context optimization for massive scaling
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
/new-project "Build a payment processing microservice"
→ Requirements analysis → Architecture design → Implementation
→ Testing → Security audit → Deployment
```

### Add Features Safely
```
/add-feature "User authentication with OAuth2"
→ Design → Frontend + Backend implementation → Tests → Code review
→ Security validation → Documentation
```

### Fix Bugs Systematically
```
/fix-bug "Authentication tokens expiring too early"
→ Reproduce → Root cause analysis → Fix → Tests → Validation
```

### Security Audits
```
/security-audit
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

### 1. Create a New Project
```
/new-project "Build a real-time chat application"
```

### 2. Add Features
```
/add-feature "User authentication with JWT tokens"
/add-feature "PostgreSQL database with message history"
/add-feature "WebSocket real-time updates"
```

### 3. Run Quality Gates
```
/security-audit
/optimize-performance
```

### 4. Deploy
```
/deploy
```

## 🏗️ System Architecture

```
Claude Code Session
        ↓
    MCP Server (Rust)
        ↓
  DuckDB Agent Registry
        ↓
  ┌─────────────────────┐
  │ Meta-Orchestrators  │
  │ (Strategic Layer)   │
  └─────────────────────┘
        ↓
  ┌─────────────────────┐
  │  74 Agents          │
  │  (18 Plugins)       │
  │  (Tactical Layer)   │
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

### How MCP Works

1. **Auto-Initialize** - MCP server launches when plugin loads
2. **Build Registry** - Scans 74 agents, indexes by role/capability
3. **Query Fast** - Orchestrators query MCP for agents (<1ms)
4. **Load Smart** - Only relevant agents loaded in context
5. **Execute** - Specialized agents handle their domain
6. **Optimize** - 91.9% token reduction through specialization

## 📊 Performance

| Metric | Value |
|--------|-------|
| Agent Discovery Latency | <1ms (DuckDB) |
| MCP Server Startup | <500ms |
| Context Bloat Reduction | 91.9% |
| Concurrent Task Capacity | 118 (vs 9 before) |
| Token Savings per Task | ~19,000 tokens |

## 🔒 Security & Compliance

- **No Secrets Stored** - Credentials via environment variables
- **No External Dependencies** - Works completely offline
- **Compliance Built-In** - FedRAMP, ISO 27001, SOC2, GDPR, PCI-DSS agents
- **Zero Port Conflicts** - Stdio-based MCP (no port binding)
- **Context Isolation** - Each agent in separate, forked context

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and deep dive
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
