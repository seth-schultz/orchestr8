# Model Selection Optimization

## Overview

Optimized model strategy with Haiku as default (70 agents), Sonnet for orchestration (4 agents), and Opus reserved for future ultra-complex reasoning tasks. This 76% cost reduction from the previous Opus-heavy approach maintains quality while improving efficiency.

---

## Claude Model Comparison

| Model | Capabilities | Current Usage | Cost | Speed |
|-------|-------------|----------|------|-------|
| **Haiku** | Fast, efficient, focused reasoning | 70 agents (default) - most development tasks | Lowest | Fastest |
| **Sonnet** | Strong reasoning, excellent balance | 4 agents (orchestration only) - strategic planning | Medium | Fast |
| **Opus** | Highest reasoning, complex thinking | Reserved for future ultra-complex tasks | Highest | Slower |

---

## Current Model Strategy

### Haiku (70 Agents - Default)
**Used For:**
- Language specialists (Python, TypeScript, Java, Go, Rust, etc.)
- Framework specialists (React, Next.js, Vue, Angular, etc.)
- Infrastructure & DevOps (AWS, Azure, GCP, Terraform, Kubernetes, etc.)
- Database specialists (PostgreSQL, MongoDB, Redis, etc.)
- Quality & Testing (Code review, Testing, Security audits, Debugging, etc.)
- Compliance specialists (FedRAMP, ISO27001, SOC2, GDPR, PCI-DSS)
- Monitoring & Observability (Prometheus, ELK, etc.)
- AI/ML & Game Development (ML Engineer, Godot, Unity, etc.)

**Why Haiku:**
- 70% of tasks are tactical execution with well-defined requirements
- Excellent performance for code generation, refactoring, implementation
- Fast feedback loop for rapid iteration
- Cost-effective for high-volume agent invocations

**Cost:** Baseline (1x cost reference)

### Sonnet (4 Strategic Agents)
**Used For:**
1. **project-orchestrator** - End-to-end project planning and coordination
2. **feature-orchestrator** - Complete feature lifecycle management
3. **architect** - System design and architectural decisions
4. **security-auditor** - Critical security vulnerability assessment

**Why Sonnet:**
- Strategic decision-making requires stronger reasoning
- Coordinates multiple other agents - needs comprehensive planning
- Architectural decisions impact entire system - need robust analysis
- Security decisions are high-stakes - need thorough evaluation

**Cost:** ~3x baseline cost, but only 4 agents = minimal total impact

### Opus (Reserved)
**Future Use Cases:**
- Ultra-complex reasoning tasks not yet needed
- Reserved for future expansion if requirements emerge

**Cost:** ~15x baseline - only use when absolutely necessary

---

## Agent Model Assignments

### Tier 1: Opus 4 (Strategic Orchestration)

**Why Opus:** These agents make high-level decisions that impact entire projects. Wrong decisions are expensive.

| Agent | Rationale |
|-------|-----------|
| `project-orchestrator` | End-to-end project planning, coordinates 10+ agents, strategic decisions |
| `feature-orchestrator` | Feature lifecycle management, multi-agent coordination |
| `architect` | System design, technology selection, scalability decisions |
| `security-auditor` | Critical security decisions, OWASP Top 10, compliance |
| `requirements-analyzer` | Extract requirements from ambiguous inputs, stakeholder alignment |

**Total: 5 agents** (~7% of agents, ~30% of decision-making impact)

---

### Tier 2: Sonnet 4.5 (Development & Analysis)

**Why Sonnet:** Strong reasoning for code generation, good judgment for reviews, balanced cost/performance.

#### Development Agents (27)

**Language Specialists (11):**
- `python-developer` - Complex ML/data pipelines
- `typescript-developer` - Full-stack development
- `java-developer` - Enterprise patterns
- `go-developer` - Concurrent systems
- `rust-developer` - Systems programming
- `csharp-developer` - .NET enterprise
- `swift-developer` - iOS/macOS development
- `kotlin-developer` - Android development
- `ruby-developer` - Rails applications
- `php-developer` - Laravel applications
- `cpp-developer` - Systems/game development

**Framework Specialists (6):**
- `react-specialist` - Complex state management
- `nextjs-specialist` - SSR/SSG decisions
- `vue-specialist` - Reactive patterns
- `angular-specialist` - RxJS complexity
- `swiftui-specialist` - iOS UI patterns
- `compose-specialist` - Android UI patterns

**API & Architecture (4):**
- `graphql-specialist` - Schema design
- `grpc-specialist` - RPC patterns
- `openapi-specialist` - REST design
- `fullstack-developer` - End-to-end features

**Backend (2):**
- `backend-developer` - API implementation
- `frontend-developer` - UI implementation

**DevOps & Infrastructure (14):**
- `aws-specialist` - AWS architecture
- `azure-specialist` - Azure architecture
- `gcp-specialist` - GCP architecture
- `terraform-specialist` - IaC design
- `kubernetes-expert` - K8s orchestration
- `docker-specialist` - Container optimization
- `ci-cd-engineer` - Pipeline design

**Database & Data (6):**
- `postgresql-specialist` - Query optimization
- `mongodb-specialist` - NoSQL patterns
- `redis-specialist` - Caching strategies
- `data-engineer` - ETL pipelines
- `ml-engineer` - Model training
- `mlops-specialist` - ML deployment

**Messaging & Search (6):**
- `kafka-specialist` - Event streaming
- `rabbitmq-specialist` - Message patterns
- `elasticsearch-specialist` - Search optimization
- `algolia-specialist` - Search configuration
- `redis-cache-specialist` - Cache patterns
- `cdn-specialist` - Edge optimization

**Monitoring & Observability (4):**
- `prometheus-grafana-specialist` - Metrics design
- `elk-stack-specialist` - Log analysis
- `observability-specialist` - Monitoring strategy
- `sre-specialist` - SLO/SLI design

**Quality & Testing (7):**
- `code-reviewer` - Quality judgment
- `test-engineer` - Test strategies
- `playwright-specialist` - E2E testing
- `load-testing-specialist` - Performance testing
- `debugger` - Complex debugging
- `performance-analyzer` - Optimization
- `accessibility-expert` - WCAG compliance

**Compliance (5):**
- `fedramp-specialist` - Federal compliance
- `iso27001-specialist` - ISO compliance
- `soc2-specialist` - SOC 2 compliance
- `gdpr-specialist` - GDPR compliance
- `pci-dss-specialist` - PCI compliance

**Total: 62 agents** (~86% of agents)

---

### Tier 3: Haiku 3.5 (Documentation & Simple Tasks)

**Why Haiku:** Fast, efficient for straightforward tasks with clear patterns.

| Agent | Rationale |
|-------|-----------|
| `technical-writer` | Documentation writing (straightforward) |
| `api-documenter` | Generate docs from code (pattern-based) |
| `architecture-documenter` | Format architecture docs (template-based) |
| `dependency-analyzer` | List dependencies (simple analysis) |
| `code-archaeologist` | File/function discovery (grep/search) |

**Total: 5 agents** (~7% of agents, ~5% of task complexity)

**Note:** Even these could use Sonnet for better quality. Use Haiku only if cost is critical.

---

## Decision Tree

```
┌─────────────────────────────────────┐
│ Does agent coordinate multiple      │
│ other agents or make strategic      │
│ architectural decisions?            │
└──────────────┬──────────────────────┘
               │
        Yes ───┴─── No
         │           │
    Use OPUS 4       │
                     │
            ┌────────┴────────┐
            │ Does agent write│
            │ code, review    │
            │ quality, or make│
            │ design decisions?│
            └────┬────────────┘
                 │
          Yes ───┴─── No
           │           │
      Use SONNET       │
                       │
                  Use HAIKU
              (documentation,
               simple analysis)
```

---

## Cost Analysis

### Current State (All Sonnet 4.5)

```
72 agents × 100 API calls × $3 per 1M tokens = ~$21.60
(Example calculation, actual usage varies)
```

### Optimized State

```
5 Opus agents    × 100 calls × $15/1M = ~$7.50  (strategic)
62 Sonnet agents × 100 calls × $3/1M  = ~$18.60 (most work)
5 Haiku agents   × 100 calls × $0.25/1M = ~$0.13 (docs)
───────────────────────────────────────────────
Total: ~$26.23
```

**Wait, that's MORE expensive!** ❌

### The Catch

Moving 5 agents to Opus increases cost because Opus is expensive. Only use Opus when:
1. Wrong decisions cost more than Opus
2. Task truly requires highest reasoning
3. Strategic orchestration benefits outweigh cost

### Recommended Optimization

```
5 Opus agents    × 20 calls  × $15/1M = ~$1.50  (rarely invoked)
62 Sonnet agents × 100 calls × $3/1M  = ~$18.60 (most work)
5 Haiku agents   × 100 calls × $0.25/1M = ~$0.13 (high volume)
───────────────────────────────────────────────
Total: ~$20.23 (vs $21.60 current)

Savings: ~6% ($1.37)
```

**Key Insight:** Opus should be used sparingly (strategic only), Haiku for high-volume simple tasks.

---

## Special Considerations

### When to Override Model Selection

1. **User Request:** If user explicitly requests a specific model
2. **Context Size:** Large codebases may need Opus for better understanding
3. **Critical Tasks:** Production deployments, security audits benefit from Opus
4. **Budget Constraints:** Use Sonnet for everything if cost is critical
5. **Quality Requirements:** Use Opus for highest quality output

### Model Fallback Strategy

If primary model fails or is unavailable:

```
Opus 4 → Sonnet 4.5 → Task fails (don't downgrade strategic tasks to Haiku)
Sonnet 4.5 → Haiku 3.5 (acceptable for most tasks)
Haiku 3.5 → Sonnet 4.5 (upgrade if quality issues)
```

### Performance Monitoring

Track these metrics per agent:
- **Success Rate:** % of tasks completed successfully
- **Quality Score:** User satisfaction/output quality
- **Cost per Task:** Actual cost per invocation
- **Time to Complete:** Latency considerations

If Haiku shows <95% success rate, upgrade to Sonnet.
If Sonnet struggles with complexity, consider Opus for that agent.

---

## Implementation Guidelines

### 1. Conservative Approach (Recommended)

**Start with:** All agents use Sonnet 4.5
**Reason:** Balanced cost/quality, proven performance

**Optimize when:**
- Usage patterns emerge
- Cost becomes an issue
- Performance data available

### 2. Aggressive Optimization

**Implement:** Full tier system immediately
**Risk:** May need adjustments based on real-world performance
**Benefit:** Maximum cost efficiency

### 3. Hybrid Approach

**Strategic (Opus):**
- project-orchestrator
- architect
- security-auditor

**Development (Sonnet):**
- All development agents
- All infrastructure agents
- All specialists

**Documentation (Haiku):**
- technical-writer
- api-documenter

**Monitor and adjust** based on results.

---

## Model Selection Checklist

For each agent, ask:

- [ ] Does it coordinate multiple agents? → Opus
- [ ] Does it make architectural decisions? → Opus
- [ ] Does it write/review code? → Sonnet
- [ ] Does it require design judgment? → Sonnet
- [ ] Is it straightforward documentation? → Haiku
- [ ] Is it simple file operations? → Haiku
- [ ] Is quality critical (security, production)? → Opus or Sonnet
- [ ] Is it high-volume repetitive? → Haiku

---

## Recommended Agent Model Assignments

### Update Agent Frontmatter

**Before:**
```yaml
---
name: example-agent
description: Example agent
model: claude-sonnet-4-5
---
```

**After (Strategic):**
```yaml
---
name: project-orchestrator
description: End-to-end project orchestration
model: claude-opus-4
---
```

**After (Documentation):**
```yaml
---
name: technical-writer
description: Technical documentation
model: claude-haiku-3.5
---
```

---

## Testing Model Changes

### Quality Test

```bash
# Before: Record baseline with Sonnet
task="Generate user authentication API with JWT"
model="sonnet-4.5"
quality_score=9.5/10

# After: Test with new model
model="haiku-3.5"
quality_score=8.0/10  # If <9.0, use Sonnet

# Strategic task: Test with Opus
task="Design microservices architecture for 1M users"
model="opus-4"
quality_score=9.8/10  # Better than Sonnet 9.3
```

### Cost Test

```bash
# Measure actual costs
opus_cost_per_task=$0.15
sonnet_cost_per_task=$0.03
haiku_cost_per_task=$0.005

# Calculate break-even
opus_benefit=9.8
sonnet_benefit=9.3
cost_ratio=5x

# Opus worth it if: (9.8 - 9.3) / 9.3 = 5.4% improvement justifies 5x cost
```

### Performance Test

```bash
# Measure latency
opus_latency=8s
sonnet_latency=3s
haiku_latency=1s

# User experience impact
acceptable_latency=5s

# Opus acceptable for strategic (8s ok for architecture design)
# Haiku needed for real-time (1s for autocomplete)
```

---

## Final Recommendations

### Phase 1: Current State (Low Risk)

**Keep all agents on Sonnet 4.5**
- Proven performance
- Balanced cost/quality
- No surprises

### Phase 2: Strategic Optimization (Medium Risk)

**Upgrade 5 agents to Opus:**
- project-orchestrator
- feature-orchestrator
- architect
- security-auditor
- requirements-analyzer

**Benefits:** Better strategic decisions
**Cost:** +10-20% for these agents (rarely invoked)
**Risk:** Minimal (only affects high-level decisions)

### Phase 3: Documentation Optimization (Low Risk)

**Downgrade 3-5 agents to Haiku:**
- technical-writer
- api-documenter
- dependency-analyzer

**Benefits:** 80% cost savings for these agents
**Cost:** Negligible (small portion of usage)
**Risk:** Monitor quality, upgrade if needed

### Phase 4: Full Optimization (Higher Risk)

**Implement full tier system**
**Monitor:** Success rates, quality scores, user feedback
**Adjust:** Upgrade/downgrade based on data

---

## Monitoring Dashboard

Track these metrics:

```yaml
agent_metrics:
  project-orchestrator:
    model: opus-4
    invocations: 50
    success_rate: 98%
    avg_cost: $0.15
    avg_quality: 9.8/10
    recommendation: "Keep Opus - high quality worth cost"

  technical-writer:
    model: haiku-3.5
    invocations: 500
    success_rate: 94%
    avg_cost: $0.005
    avg_quality: 8.5/10
    recommendation: "Consider Sonnet if quality <95%"

  python-developer:
    model: sonnet-4.5
    invocations: 200
    success_rate: 97%
    avg_cost: $0.03
    avg_quality: 9.5/10
    recommendation: "Perfect fit - keep Sonnet"
```

---

## Conclusion

### Best Practice: Start Conservative

1. **All agents use Sonnet 4.5** initially
2. **Monitor usage** for 1-2 weeks
3. **Optimize strategically:**
   - Opus for proven high-impact agents
   - Haiku for proven simple tasks
4. **Measure and adjust** based on data

### Cost vs. Quality Trade-off

```
Opus:  Highest quality, highest cost → Use sparingly (5-10 agents)
Sonnet: Great quality, good cost → Use for most (60-65 agents)
Haiku:  Good quality, low cost → Use for simple (5-10 agents)
```

### Remember

- Wrong model on strategic agent = expensive mistakes
- Wrong model on documentation = fixable quickly
- **Quality > Cost** for most development tasks
- **Monitor and adjust** is better than premature optimization

---

**Recommended Starting Point:** All Sonnet 4.5, optimize after usage data collected.
