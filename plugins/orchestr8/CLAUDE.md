# Orchestr8: Enterprise Multi-Agent Orchestration System

This is an enterprise-grade orchestration system that enables autonomous end-to-end project completion through hierarchical multi-agent coordination.

## Core Philosophy

**Parallelism First**: Execute independent tasks concurrently for maximum speed. When multiple agents can work simultaneously, always invoke them in parallel using multiple Task tool calls in a single message.

**Quality Gates**: Every deliverable passes through automated quality validation before proceeding.

**Specialized Expertise**: 74+ specialized agents organized by domain, each optimized for specific tasks.

## System Architecture

```
Claude Code Session
    ↓
Orchestr8 Plugin (This Plugin)
    ↓
    ├─ Meta-Orchestrators (Layer 1) - Coordinate entire workflows
    ├─ Specialized Agents (Layer 2) - Execute specific tasks
    │   └─ Research Agents (NEW) - Exploratory development
    ├─ Skills (Layer 3) - Auto-activated expertise
    │   └─ Research Skills (NEW) - Exploration & validation
    ├─ Workflows (Layer 4) - End-to-end automation
    │   └─ Research Workflows (NEW) - Hypothesis testing
    └─ Knowledge System (NEW) - Organizational learning
```

## Agent Hierarchy

### Layer 1: Meta-Orchestrators

**Purpose**: Coordinate complex workflows spanning multiple domains.

**When to Use**:
- End-to-end project creation
- Complete feature implementation (design → code → test → deploy)
- Multi-phase operations requiring coordination

**Available Meta-Orchestrators:**
- `project-orchestrator` - Full project lifecycle (requirements → deployment)
- `feature-orchestrator` - Complete feature development
- `workflow-coordinator` - Cross-domain task coordination

**Pattern**: Meta-orchestrators coordinate specialized agents based on task requirements.

### Layer 2: Specialized Agents (79+ Agents)

**All agents stored in `/agents/` directory, organized by domain:**

**Research Agents** (`/agents/research/`) - NEW:
- `code-researcher` - Explores 3-5 implementation alternatives in parallel
- `performance-researcher` - Benchmarks approaches empirically
- `assumption-validator` - Tests architectural assumptions through POCs
- `pattern-experimenter` - Compares design patterns with real implementations
- `pattern-learner` - Extracts and documents organizational patterns

**Development** (`/agents/development/`):
- `architect` - System design, technology decisions, ADRs
- `fullstack-developer` - End-to-end feature implementation
- `backend-developer` - Server-side logic, APIs, databases
- `frontend-developer` - UI/UX, client-side logic
- `api-designer` - RESTful/GraphQL API design
- `database-specialist` - Schema design, optimization, migrations

**Quality Assurance** (`/agents/quality/`):
- `code-reviewer` - Clean code, SOLID principles, best practices
- `test-engineer` - Test strategy, coverage, quality validation
- `security-auditor` - Vulnerability scanning, OWASP compliance
- `performance-analyzer` - Bottleneck identification, optimization
- `accessibility-expert` - WCAG compliance, inclusive design

**DevOps & Infrastructure** (`/agents/devops/`, `/agents/infrastructure/`):
- `ci-cd-engineer` - Pipeline automation, deployment workflows
- `docker-specialist` - Containerization, multi-stage builds
- `kubernetes-expert` - K8s deployments, scaling, monitoring
- `infrastructure-engineer` - Cloud architecture, IaC, networking

**Language Specialists** (`/agents/languages/`):
- Python, TypeScript, Rust, Go, Java, C++, Ruby, PHP, Kotlin, Swift, and more
- Each with language-specific best practices and idioms

**Framework Specialists** (`/agents/frameworks/`):
- React, Vue, Angular, Next.js, Django, FastAPI, Spring Boot, Rails, and more
- Framework-specific patterns and optimizations

**Domain Experts** (`/agents/domains/`):
- Machine Learning, Data Engineering, Blockchain, Game Development, Mobile, IoT, and more
- Specialized knowledge for specific application domains

### Layer 3: Skills

**Auto-Activated Expertise**: Skills provide context-specific knowledge automatically.

**Categories**:
- Languages: Python, TypeScript, Rust, Go, etc.
- Frameworks: React, Django, Spring, etc.
- Tools: Docker, Kubernetes, Git, etc.
- Practices: TDD, DDD, Clean Architecture, etc.
- Domains: ML, Blockchain, Mobile, etc.
- **Research Skills** (NEW):
  - `code-exploration` - Discovers patterns and anti-patterns
  - `technology-benchmarking` - Compares technologies empirically
  - `assumption-validation` - Tests hypotheses through POCs

**Usage**: Skills are automatically loaded when context matches. No explicit invocation needed.

### Layer 4: Workflows (Slash Commands)

**Pre-built automation for common tasks:**

**Project Lifecycle:**
- `/orchestr8:new-project` - Complete project from idea to deployment
- `/orchestr8:add-feature` - Full feature development lifecycle (with `--research` flag)
- `/orchestr8:refactor` - Safe code refactoring with tests (with `--explore-alternatives` flag)
- `/orchestr8:fix-bug` - Systematic debugging and fixes

**Research & Exploration** (NEW):
- `/orchestr8:research-solution` - Research and evaluate multiple approaches
- `/orchestr8:compare-approaches` - Empirical comparison of 2-3 approaches
- `/orchestr8:validate-architecture` - Validate architectural assumptions
- `/orchestr8:discover-patterns` - Discover patterns in codebase
- `/orchestr8:research` - Parallel hypothesis testing
- `/orchestr8:benchmark` - Technology/pattern comparison
- `/orchestr8:validate-assumptions` - Test assumptions systematically
- `/orchestr8:explore-alternatives` - Explore multiple alternatives

**Knowledge Management** (NEW):
- `/orchestr8:knowledge-capture` - Capture organizational knowledge
- `/orchestr8:knowledge-search` - Search knowledge base
- `/orchestr8:knowledge-report` - Generate knowledge reports

**Quality & Security:**
- `/orchestr8:review-code` - Multi-stage code review (with `--parallel-perspectives` flag)
- `/orchestr8:review-pr` - Comprehensive PR analysis with GitHub feedback
- `/orchestr8:security-audit` - Full security assessment
- `/orchestr8:review-architecture` - Architecture quality review

**DevOps & Deployment:**
- `/orchestr8:setup-cicd` - Complete CI/CD pipeline setup
- `/orchestr8:deploy` - Safe production deployment
- `/orchestr8:setup-monitoring` - Observability stack deployment

**Performance & Optimization:**
- `/orchestr8:optimize-performance` - End-to-end performance tuning (with `--test-approaches` flag)
- `/orchestr8:optimize-costs` - Cloud cost optimization

**Advanced:**
- `/orchestr8:modernize-legacy` - Legacy code transformation
- `/orchestr8:build-ml-pipeline` - Complete ML workflow
- `/orchestr8:test-web-ui` - Automated UI testing

## Research-Driven Development (NEW)

**Evidence-Based Decisions**: Test multiple approaches in parallel before committing to implementation.

### When to Use Research

✅ **Architecture Decisions**:
```bash
/orchestr8:research "microservices vs monolith for e-commerce platform"
→ Tests both approaches → Compares performance, complexity, cost
→ Recommends best approach with evidence
```

✅ **Technology Selection**:
```bash
/orchestr8:compare-approaches "React" "Vue" "Angular"
→ Builds same component in each → Measures bundle size, performance
→ Evaluates DX, ecosystem → Evidence-based recommendation
```

✅ **Performance Optimization**:
```bash
/orchestr8:optimize-performance --test-approaches "API response time"
→ Generates 3-5 optimization strategies → Tests each in isolation
→ Benchmarks improvements → Selects winning approach
```

### Knowledge Capture

Every research contributes to organizational knowledge:
```
.claude/knowledge/
├── patterns/              # What works
├── anti-patterns/         # What doesn't
├── performance-baselines/ # Historical metrics
├── assumptions-validated/ # Tested hypotheses
└── technology-comparisons/ # Decision records
```

### Async Execution

Long-running research tasks run in background:
- Submit task → Get ID immediately
- Context released for other work
- Check status or wait for webhook
- Results persist in DuckDB

## Parallelism: The Key to Speed

**CRITICAL**: Always execute independent tasks in parallel for maximum performance.

### When to Run Tasks in Parallel

✅ **Quality Gates** - Run all 5 gates simultaneously:
```
Single message with 5 Task calls:
1. code-reviewer → code-review-report.md
2. test-engineer → test-report.md
3. security-auditor → security-report.md
4. performance-analyzer → performance-report.md
5. accessibility-expert → accessibility-report.md

Result: 5x speedup (all complete at once)
```

✅ **Multi-Component Features** - Parallel implementation:
```
Single message with 3 Task calls:
1. backend-developer → API implementation
2. frontend-developer → UI components
3. database-specialist → Schema migrations

Result: 3x speedup (all develop simultaneously)
```

✅ **Documentation Tasks** - Parallel doc generation:
```
Single message with 4 Task calls:
1. api-documenter → API docs
2. architecture-documenter → Architecture docs
3. technical-writer → User guide
4. code-reviewer → Code comments

Result: 4x speedup
```

❌ **When NOT to Parallelize**:
- Tasks with dependencies (design must complete before implementation)
- Shared file modifications (multiple agents editing same file)
- Sequential workflows (each step needs previous output)

### Parallel Execution Pattern

```python
# ❌ SLOW - Sequential (5 units of time)
agent1()  # 1 unit
agent2()  # 1 unit
agent3()  # 1 unit
agent4()  # 1 unit
agent5()  # 1 unit
# Total: 5 units

# ✅ FAST - Parallel (1 unit of time)
# Single message with 5 Task calls
Task(agent1), Task(agent2), Task(agent3), Task(agent4), Task(agent5)
# Total: 1 unit (all execute simultaneously)
```


## Development Standards

### Code Quality Requirements

**SOLID Principles** (Always):
- Single Responsibility: One class/function, one purpose
- Open/Closed: Extend behavior, don't modify
- Liskov Substitution: Subtypes must be substitutable
- Interface Segregation: Many specific > one general
- Dependency Inversion: Depend on abstractions

**Clean Code** (Non-negotiable):
- Meaningful names (intention-revealing)
- Functions < 20 lines (focused, testable)
- No duplication (DRY principle)
- Minimal complexity (cyclomatic < 10)
- Clear error handling (no silent failures)

### Testing Standards

**Coverage Requirements:**
- Unit Tests: 80%+ coverage
- Integration Tests: All critical paths
- E2E Tests: Key user journeys
- Performance Tests: Critical operations

**Test Quality:**
- Independent (no order dependencies)
- Deterministic (same input = same output)
- Fast (milliseconds for unit tests)
- Clear (test name describes scenario)

### Security Standards

**OWASP Top 10** (Mandatory):
- No SQL injection (parameterized queries only)
- No XSS (proper output encoding)
- CSRF protection (tokens for state-changing ops)
- Secure authentication (OAuth2, JWT, MFA)
- Input validation (whitelist approach)

**Secrets Management:**
- Environment variables (never hardcode)
- Secret rotation (automated)
- Least privilege (minimal permissions)
- No secrets in logs/errors

### Performance Standards

**Response Time Targets:**
- API: p50 < 200ms, p95 < 500ms
- Database: Indexed queries only
- Frontend: Lighthouse > 90
- Bundle: Monitor size, code split

**Optimization:**
- No N+1 queries (eager loading)
- Caching strategy (Redis, CDN)
- Connection pooling (reuse connections)
- Async where appropriate (non-blocking)

### Accessibility Standards

**WCAG 2.1 AA** (Required for all UI):
- Semantic HTML (proper landmarks)
- ARIA labels (screen reader support)
- Keyboard navigation (all interactions)
- Color contrast (4.5:1 for text)
- Focus indicators (visible outlines)

## Quality Gates

Every deliverable must pass through quality validation:

### Gate 1: Design Review
- Architecture sound (patterns appropriate)
- Technology choices justified (ADRs)
- Scalability considered (growth plan)
- Security by design (threat modeling)

### Gate 2: Code Review
- Clean code principles (SOLID, DRY, KISS)
- Best practices followed (language-specific)
- No code smells (refactor opportunities)
- Documentation adequate (complex logic explained)

### Gate 3: Testing Validation
- Coverage >80% (all critical paths)
- All tests passing (green build)
- Edge cases covered (boundary conditions)
- Performance acceptable (meets SLAs)

### Gate 4: Security Audit
- No critical vulnerabilities (OWASP compliance)
- Input validation complete (all entry points)
- No secrets exposed (environment vars only)
- Dependencies updated (no known CVEs)

### Gate 5: Performance Analysis
- No bottlenecks (profiling complete)
- Response times acceptable (SLA met)
- Resource usage reasonable (no leaks)
- Scaling strategy defined (growth plan)

**Gate Execution**: Run in parallel for 5x speed improvement!

## Orchestration Best Practices

### 1. Plan Before Executing

❌ **Don't**: Start coding immediately
✅ **Do**: Analyze → Design → Plan → Execute

### 2. Use Appropriate Agents

❌ **Don't**: Use meta-orchestrator for simple tasks
✅ **Do**: Match task complexity to agent level

### 3. Execute in Parallel

❌ **Don't**: Run independent agents sequentially
✅ **Do**: Single message with multiple Task calls

### 4. Validate at Gates

❌ **Don't**: Skip quality gates to "move faster"
✅ **Do**: Automated validation catches issues early

### 5. Optimize Context

❌ **Don't**: Load all agents at startup
✅ **Do**: JIT loading (only what's needed)

### 6. Handle Errors Gracefully

❌ **Don't**: Fail silently or ignore errors
✅ **Do**: Retry logic, fallbacks, clear errors

### 7. Document Decisions

❌ **Don't**: Skip ADRs or inline docs
✅ **Do**: Architecture decisions and complex logic explained

## Common Workflows

### New Project Creation

```bash
/orchestr8:new-project "E-commerce platform with Next.js and Stripe"
```

**Automatic Execution:**
1. **Requirements Analysis** (architect)
2. **Project Scaffolding** (fullstack-developer)
3. **Core Implementation** (parallel: backend + frontend + database)
4. **Quality Gates** (parallel: 5 gates)
5. **Documentation** (technical-writer)
6. **Deployment Setup** (ci-cd-engineer)

**Duration**: ~30-45 minutes for complete MVP

### Add Feature

```bash
/orchestr8:add-feature "User authentication with OAuth2 (Google, GitHub)"
```

**Automatic Execution:**
1. **Design** (architect → requirements + design docs)
2. **Implement** (parallel: backend + frontend)
3. **Test** (test-engineer → unit + integration + e2e)
4. **Quality** (parallel: 5 quality gates)
5. **Document** (technical-writer → docs + deployment)

**Duration**: ~15-20 minutes for production-ready feature

### Fix Bug

```bash
/orchestr8:fix-bug "Users can't log out on mobile devices"
```

**Automatic Execution:**
1. **Reproduce** (test-engineer → repro steps)
2. **Root Cause** (code-archaeologist → analysis)
3. **Fix** (appropriate developer → patch)
4. **Test** (test-engineer → regression test)
5. **Validate** (code-reviewer → review)

**Duration**: ~10-15 minutes for complete fix with tests

## Agent Selection Guide

### When to Use Which Agent

**Architecture & Design:**
- New project → `architect`
- Major refactoring → `architect`
- Technology decision → `architect`
- Design patterns → `architect`

**Implementation:**
- Full-stack feature → `fullstack-developer`
- API only → `backend-developer`
- UI only → `frontend-developer`
- Database → `database-specialist`

**Quality:**
- Code review → `code-reviewer`
- Testing → `test-engineer`
- Security → `security-auditor`
- Performance → `performance-analyzer`
- Accessibility → `accessibility-expert`

**DevOps:**
- CI/CD → `ci-cd-engineer`
- Containers → `docker-specialist`
- Kubernetes → `kubernetes-expert`
- Infrastructure → `infrastructure-engineer`

**Specialized:**
- Machine Learning → `ml-engineer`
- Blockchain → `smart-contract-developer`
- Mobile → `ios-developer` or `android-developer`
- Game Dev → `game-developer`

## Installation

```bash
# In Claude Code
/plugin marketplace add seth-schultz/orchestr8
/plugin install orchestr8@seth-schultz/orchestr8

# Or browse interactively
/plugin
```

## Customization

### Add Custom Agents

1. Create agent file: `/agents/[category]/[name].md`
2. Add frontmatter with `model:` field
3. Write agent instructions
4. Use in workflows via dynamic loading

**Example:**
```yaml
---
name: custom-agent
model: claude-sonnet-4-5-20250929
description: Custom agent for specific domain
---

# Custom Agent

[Agent instructions here...]
```

### Create Custom Workflows

1. Create workflow: `/commands/my-workflow.md`
2. Add frontmatter with description
3. Use dynamic loading pattern for agents
4. Available as `/orchestr8:my-workflow`

### Add Custom Skills

1. Create skill: `/skills/[category]/SKILL.md`
2. Add skill metadata and instructions
3. Auto-activated when context matches

## Performance Optimization

### Speed Optimization

**Sequential Execution:**
- 5 quality gates × 2 minutes each = 10 minutes
- 3 implementation agents × 5 minutes each = 15 minutes
- Total: 25 minutes

**Parallel Execution:**
- 5 quality gates in parallel = 2 minutes (5x faster)
- 3 implementation agents in parallel = 5 minutes (3x faster)
- Total: 7 minutes (3.5x overall speedup)

## Troubleshooting

### Quality Gate Failures

**Check:**
1. Code meets standards (SOLID, clean code)
2. Tests passing (>80% coverage)
3. No security vulnerabilities (OWASP)
4. Performance acceptable (SLAs met)

## Support & Resources

- **Documentation**: `/README.md` - Comprehensive guide
- **Architecture**: `/CLAUDE.md` (this file) - System design
- **Agents**: `/agents/` - All 74+ specialized agents
- **Workflows**: `/commands/` - 20+ slash commands
- **Skills**: `/skills/` - Auto-activated expertise
- **Repository**: https://github.com/seth-schultz/orchestr8
- **Issues**: https://github.com/seth-schultz/orchestr8/issues

## Key Takeaways

✅ **Research-Driven Development**: Test multiple approaches before implementation
✅ **Parallelism First**: Execute independent tasks concurrently for maximum speed
✅ **Knowledge Capture**: Every project contributes to organizational learning
✅ **Async Execution**: Fire-and-forget long-running research tasks
✅ **Quality Gates**: Automated validation for all deliverables
✅ **Specialized Agents**: 79+ agents optimized for specific domains (including research)
✅ **Production Ready**: Enterprise-grade standards enforced
✅ **Comprehensive Workflows**: 31+ pre-built slash commands for common tasks
✅ **Flexible Architecture**: Extend with custom agents, skills, and workflows

**Start building with enterprise-grade orchestration and research-driven development today!**
