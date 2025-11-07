# orchestr8

> Enterprise-grade autonomous software orchestration for Claude Code with research-driven development

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-green.svg)](https://claude.ai)

Transform Claude Code into a fully autonomous software engineering team with research capabilities. orchestr8 provides 79+ specialized agents (including 5 research agents) coordinated through intelligent workflows, achieving 3-6x speedups through parallel execution, evidence-based decision making, and enterprise-scale project delivery.

## Key Features

- **79+ Specialized Agents** - Including 5 research agents for exploratory development
- **31 Automated Workflows** - Including 11 research workflows for hypothesis testing
- **Research-Driven Development** - Test multiple approaches in parallel before committing
- **Async Execution Architecture** - Fire-and-forget long-running research tasks
- **Knowledge Capture System** - Organizational learning from every project
- **Parallelism-First Architecture** - 3-6x speedups through intelligent task distribution
- **5-Stage Quality Gates** - Automated code review, security, testing, performance, and compliance validation
- **Enterprise Standards** - Built-in FedRAMP, ISO 27001, SOC2, GDPR, PCI-DSS compliance
- **Simple File-Based System** - Agents are markdown files, no complex infrastructure
- **Zero Configuration** - Works immediately after installation
- **Cross-Platform** - macOS, Linux, Windows support

## What You Get

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

## NEW: Research-Driven Development 🔬

orchestr8 now includes powerful research capabilities inspired by Simon Willison's async code research methodology:

### Research Before Implementation
```
/orchestr8:research-solution "How to handle 100K concurrent WebSocket connections"
→ Analyzes problem → Generates 4-6 approaches → Tests each in parallel
→ Compares results → Recommends best solution with evidence
```

### Compare Approaches Empirically
```
/orchestr8:compare-approaches "Redis" "RabbitMQ" "Kafka"
→ Implements same feature with each → Benchmarks performance
→ Measures code complexity → Provides scoring matrix → Evidence-based decision
```

### Validate Assumptions
```
/orchestr8:validate-architecture "Database can handle 10K connections"
→ Creates test harness → Runs stress tests → Validates or invalidates
→ Provides remediation plan if assumptions fail
```

### Discover Patterns
```
/orchestr8:discover-patterns ./src
→ Analyzes codebase → Identifies patterns and anti-patterns
→ Finds refactoring opportunities → Creates pattern library
```

### Knowledge Capture
Every project contributes to organizational knowledge:
- Successful patterns preserved for reuse
- Anti-patterns documented to avoid
- Performance baselines tracked
- Technology decisions recorded with rationale

## Use Cases

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

## Installation

### Via Claude Code Marketplace

Run the following commands in Claude Code to add and install orchestr8:

```bash
/plugin marketplace add seth-schultz/orchestr8
/plugin install orchestr8@seth-schultz/orchestr8
```

Or browse available plugins interactively:

```bash
/plugin
```

Then select `orchestr8` from the available plugins.

### Verification

After installation, verify orchestr8 is loaded by typing `/` in Claude Code. You should see all 20 workflows listed (e.g., `/orchestr8:new-project`, `/orchestr8:add-feature`, etc.).

## Quick Start

### Discover All Workflows

Type `/` in Claude Code to see all 31 automated workflows as slash commands:

**Core Workflows:**
```
/orchestr8:add-feature           - Add new features safely (with --research flag)
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
/orchestr8:optimize-performance  - Optimize performance (with --test-approaches flag)
/orchestr8:refactor              - Refactor code safely (with --explore-alternatives flag)
/orchestr8:review-architecture   - Review architecture
/orchestr8:review-code           - Review code quality (with --parallel-perspectives flag)
/orchestr8:review-pr             - Review pull requests
/orchestr8:security-audit        - Run security audits
/orchestr8:setup-cicd            - Setup CI/CD pipelines
/orchestr8:setup-monitoring      - Setup monitoring
/orchestr8:test-web-ui           - Test web UI
```

**Research Workflows (NEW):**
```
/orchestr8:research-solution     - Research multiple solution approaches
/orchestr8:compare-approaches    - Compare 2-3 approaches empirically
/orchestr8:validate-architecture - Validate architectural assumptions
/orchestr8:discover-patterns     - Discover patterns in codebase
/orchestr8:research              - Parallel hypothesis testing
/orchestr8:benchmark             - Technology/pattern comparison
/orchestr8:validate-assumptions  - Test assumptions systematically
/orchestr8:explore-alternatives  - Explore multiple alternatives

/orchestr8:knowledge-capture     - Capture organizational knowledge
/orchestr8:knowledge-search      - Search knowledge base
/orchestr8:knowledge-report      - Generate knowledge reports
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

## System Architecture

```
Claude Code Session
        ↓
Workflow Commands (/orchestr8:*)
        ↓
/agents/ Directory (74+ agent definitions)
        ↓
  ┌─────────────────────┐
  │ Meta-Orchestrators  │
  │ (Strategic Layer)   │
  └─────────────────────┘
        ↓
  ┌─────────────────────┐
  │ Specialized Agents  │
  │ (Tactical Layer)    │
  └─────────────────────┘
        ↓
  ┌─────────────────────┐
  │ Parallel Execution  │
  │ (3-6x Speedup)      │
  └─────────────────────┘
        ↓
  ┌─────────────────────┐
  │ Quality Gates       │
  │ (5 Validation Stages)│
  └─────────────────────┘
```

### .orchestr8 Folder Structure

orchestr8 organizes all generated documentation and artifacts in a `.orchestr8` folder to keep your project root clean:

```
.orchestr8/
├── docs/
│   ├── requirements/        # Requirements analysis (analysis.md, ml-requirements.md, etc.)
│   ├── design/             # Architecture and design documents
│   ├── quality/            # Code review, test reports, validation results
│   ├── security/           # Security audits, vulnerability findings, compliance reports
│   ├── performance/        # Performance analyses, cost optimizations, benchmarks
│   ├── accessibility/      # Accessibility audits, WCAG compliance reports
│   ├── deployment/         # Deployment guides, rollback procedures, commit messages
│   ├── analysis/           # Code analysis, refactoring plans, bug fixes
│   ├── infrastructure/     # CI/CD strategy, monitoring architecture, SLOs
│   └── testing/            # Test reports, debugging results, test coverage
├── intelligence.db         # SQLite database for organizational knowledge (tracked in git)
└── scripts/               # Helper scripts for directory setup
```

**Key Benefits:**
- **Clean Project Root** - Documentation kept in dedicated folder
- **Organized by Category** - Easy to find specific types of reports
- **Git-Friendly** - `.orchestr8/docs/` added to `.gitignore` by default
- **Knowledge Persistence** - `intelligence.db` tracked in git for organizational learning
- **Path Resolution** - Use `get_orchestr8_path()` function in scripts for consistent access

**Environment Variable:**
- `ORCHESTR8_BASE` - Override default `.orchestr8` location if needed (default: `.orchestr8`)

### How Orchestration Works

1. **Workflow Selection** - User invokes a workflow command (e.g., `/orchestr8:new-project`)
2. **Agent Assembly** - Workflow selects appropriate agents from `/agents/` directory
3. **Parallel Execution** - Tasks distributed across multiple agents simultaneously
4. **Quality Gates** - Automated validation at each stage (code review, security, testing, performance, compliance)
5. **Continuous Monitoring** - Progress tracking and error handling throughout execution
6. **Delivery** - Complete, production-ready output with documentation

### Parallelism-First Architecture

orchestr8 achieves 3-6x speedups by executing independent tasks in parallel:

- **Independent Analysis** - Multiple agents analyze different aspects simultaneously
- **Parallel Implementation** - Frontend, backend, and database work happens concurrently
- **Concurrent Testing** - Unit, integration, and e2e tests run in parallel
- **Simultaneous Validation** - All quality gates check different aspects at once

### 5-Stage Quality Gates

Every workflow includes automated validation stages:

1. **Code Review** - Style, logic, best practices, architecture patterns
2. **Security Audit** - Vulnerability scanning, secret detection, compliance checks
3. **Testing** - Unit, integration, e2e, coverage analysis
4. **Performance** - Profiling, optimization, resource usage
5. **Compliance** - FedRAMP, ISO 27001, SOC2, GDPR, PCI-DSS validation

## Agent Organization

Agents are organized by domain expertise in the `/agents/` directory:

### Core Orchestration (5 agents)
- Meta-orchestrators for strategic planning
- Workflow coordinators
- Task distribution managers

### Research & Exploration (6 agents) - NEW
- `code-researcher` - Explores 3-5 implementation alternatives
- `performance-researcher` - Benchmarks different approaches
- `assumption-validator` - Tests architectural assumptions
- `pattern-experimenter` - Compares design patterns
- `pattern-learner` - Extracts organizational patterns
- `knowledge-researcher` - Searches and synthesizes knowledge

### Language Specialists (15 agents)
- Python, TypeScript, Java, Go, Rust, C#
- Swift, Kotlin, Ruby, PHP, C++
- Domain-specific optimization experts

### Frontend & Mobile (8 agents)
- React, Next.js, Vue, Angular
- SwiftUI, Jetpack Compose
- UI/UX specialists

### Backend & APIs (10 agents)
- Microservices architecture
- REST, GraphQL, gRPC
- Serverless platforms

### Database & Storage (8 agents)
- PostgreSQL, MySQL, MongoDB
- DynamoDB, Neo4j, Redis
- Schema design and optimization

### Cloud & Infrastructure (12 agents)
- AWS, Azure, GCP specialists
- Terraform IaC
- Container orchestration

### DevOps & Monitoring (8 agents)
- Docker, Kubernetes
- CI/CD pipelines
- Prometheus, ELK, observability

### Quality & Security (8 agents)
- Code review automation
- Security auditing
- Performance optimization
- Compliance validation

## Performance Benefits

| Metric | Value | Details |
|--------|-------|---------|
| Speedup Through Parallelism | 3-6x | Independent tasks execute simultaneously |
| Research Speedup | 5x | Test 5 hypotheses in parallel |
| Quality Gate Coverage | 100% | Every output passes 5 validation stages |
| Concurrent Task Capacity | 118 | vs 9 without orchestration |
| Agent Specialization | 79+ | Including 5 research agents |
| Workflow Automation | 31 | Including 11 research workflows |
| Knowledge Capture | Automatic | Every project contributes to organizational learning |
| Async Execution | Fire-and-forget | Long-running research tasks |
| Enterprise Compliance | Built-in | FedRAMP, ISO 27001, SOC2, GDPR, PCI-DSS |

## Security & Compliance

- **No Secrets Stored** - Credentials via environment variables
- **No External Dependencies** - Works completely offline
- **Compliance Built-In** - FedRAMP, ISO 27001, SOC2, GDPR, PCI-DSS agents
- **Context Isolation** - Each agent operates in separate context
- **File-Based Security** - Simple markdown files, no complex infrastructure
- **Audit Trail** - Complete execution logs for compliance reporting

## Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and deep dive
- **[CLAUDE.md](.claude/CLAUDE.md)** - System instructions and patterns
- **[CHANGELOG.md](.claude/CHANGELOG.md)** - Release history and features

## Contributing

Contributions welcome! Areas for improvement:

- Additional language/framework specialists
- More cloud provider integrations
- Custom workflow templates
- Performance optimizations

## License

MIT - See [LICENSE](LICENSE) file

## Support

- **GitHub Issues** - Report bugs and request features
- **Documentation** - Check CLAUDE.md for system instructions
- **Examples** - See `.claude/examples/` for workflow samples

---

**Made with care for autonomous software engineering**
