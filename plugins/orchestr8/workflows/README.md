# Research-Oriented Workflows

This directory contains advanced research and exploration workflows for orchestr8. These workflows enable systematic investigation, comparison, and validation of technical approaches through parallel experimentation and evidence-based decision making.

## Workflow Overview

### 1. Research (/orchestr8:research)

**Purpose:** Parallel hypothesis testing for exploring multiple approaches simultaneously.

**File:** `research.md`

**Use When:**
- Evaluating multiple technical approaches for a problem
- Testing competing hypotheses about system behavior
- Exploring alternative architectural patterns
- Comparing different algorithm implementations
- Validating design decisions with empirical evidence

**Key Features:**
- Formulates 3-5 testable hypotheses
- Executes all hypothesis tests in parallel for maximum speed
- Collects empirical evidence for each approach
- Performs comparative analysis with scoring matrix
- Makes evidence-based recommendations
- Captures learnings in knowledge base

**Example Usage:**
```bash
/orchestr8:research "What's the best architecture for our e-commerce platform: microservices, modular monolith, or serverless?"
```

**Workflow Phases:**
1. Hypothesis Formulation (0-15%)
2. Parallel Hypothesis Testing (15-70%)
3. Comparative Analysis (70-85%)
4. Recommendation & Knowledge Capture (85-100%)

**Speed Advantage:** 5x speedup through parallel execution (5 hypotheses tested simultaneously instead of sequentially)

---

### 2. Benchmark (/orchestr8:benchmark)

**Purpose:** Technology and pattern comparison through empirical performance and feature analysis.

**File:** `benchmark.md`

**Use When:**
- Comparing web frameworks (Next.js vs Remix vs SvelteKit)
- Evaluating databases (PostgreSQL vs MySQL vs MongoDB)
- Testing algorithm performance (sorting, searching, compression)
- Comparing cloud providers (AWS vs GCP vs Azure)
- Evaluating state management solutions (Redux vs Zustand vs Jotai)
- Testing API patterns (REST vs GraphQL vs gRPC)

**Key Features:**
- Systematic benchmark design with realistic workloads
- Parallel execution of all candidate benchmarks
- Performance metrics (latency, throughput, resource usage)
- Feature completeness analysis
- Developer experience assessment
- Total cost of ownership comparison
- Multi-criteria scoring and trade-off analysis

**Example Usage:**
```bash
/orchestr8:benchmark "Compare Next.js, Remix, and SvelteKit for building our new dashboard"
```

**Workflow Phases:**
1. Benchmark Definition (0-15%)
2. Parallel Benchmark Execution (15-70%)
3. Comparative Analysis (70-85%)
4. Reporting & Decision Support (85-100%)

**Speed Advantage:** 4x speedup (4 candidates benchmarked in parallel)

---

### 3. Validate Assumptions (/orchestr8:validate-assumptions)

**Purpose:** Systematic validation of technical assumptions and constraints through empirical testing.

**File:** `validate-assumptions.md`

**Use When:**
- Validating performance assumptions ("Can it handle 10k concurrent users?")
- Testing scalability claims ("Will it scale to 1M records?")
- Verifying technology constraints ("Does it support our use case?")
- Checking architectural assumptions ("Is microservices overkill?")
- Validating cost estimates ("Will it stay under budget?")
- Testing security assumptions ("Is this approach secure?")

**Key Features:**
- Identifies and classifies assumptions by risk and impact
- Tests critical assumptions empirically in parallel
- Provides clear pass/fail determination with confidence levels
- Creates mitigation plans for invalidated assumptions
- Reassesses project risk based on findings
- Supports continuous validation

**Example Usage:**
```bash
/orchestr8:validate-assumptions "
We're building an e-commerce platform with these assumptions:
1. PostgreSQL can handle 50M products efficiently
2. Stripe can process 1000 transactions/sec
3. AWS costs will be under $10k/month at 100k users
"
```

**Workflow Phases:**
1. Assumption Identification & Classification (0-15%)
2. Parallel Validation Execution (15-70%)
3. Evidence Synthesis & Risk Assessment (70-85%)
4. Action Plan & Knowledge Capture (85-100%)

**Speed Advantage:** 5x speedup (5 assumptions validated simultaneously)

---

### 4. Explore Alternatives (/orchestr8:explore-alternatives)

**Purpose:** Multi-approach exploration for discovering optimal solutions through parallel experimentation.

**File:** `explore-alternatives.md`

**Use When:**
- Finding optimal algorithm for a specific problem
- Discovering best data structure for use case
- Exploring UI/UX design alternatives
- Identifying optimal API design pattern
- Finding best deployment strategy
- Discovering performance optimization approaches

**Key Features:**
- Creative solution space exploration (5-10 alternatives)
- Parallel prototyping and testing of alternatives
- Multi-criteria evaluation (performance, cost, complexity, risk)
- Pareto analysis to find optimal solutions
- Sensitivity analysis for robustness testing
- Phased implementation roadmap

**Example Usage:**
```bash
/orchestr8:explore-alternatives "How should we optimize our API response time?"
```

**Workflow Phases:**
1. Problem Framing & Solution Discovery (0-20%)
2. Parallel Alternative Exploration (20-65%)
3. Multi-Criteria Evaluation (65-80%)
4. Recommendation & Implementation Roadmap (80-100%)

**Speed Advantage:** 5x speedup (5 alternatives explored in parallel)

---

## Common Patterns Across All Workflows

### Parallel Execution Architecture

All workflows leverage parallel execution for maximum speed:

```
Main Orchestrator
  ├─→ Agent 1 (parallel) → Results 1
  ├─→ Agent 2 (parallel) → Results 2
  ├─→ Agent 3 (parallel) → Results 3
  └─→ Agent 4 (parallel) → Results 4

[All agents execute simultaneously in isolated contexts]
```

**Key Benefit:** N-way parallelism provides N× speedup for embarrassingly parallel work.

### Evidence-Based Decision Making

All workflows emphasize empirical evidence over speculation:

- **Hypotheses/Assumptions:** Test with real data
- **Benchmarks:** Measure actual performance
- **Alternatives:** Prototype and validate
- **Results:** Quantitative metrics + qualitative insights

### Knowledge Capture

All workflows integrate with the knowledge base:

```bash
# Store findings for future reference
db_store_knowledge "workflow-type" "category" "topic" \
  "Description of findings" \
  "$(cat results.md)"

# Query similar past work
db_query_knowledge "workflow-type" "topic" 10
```

### Fire-and-Forget Pattern

All workflows support async execution for long-running tasks:

```bash
# Launch workflow in background
/orchestr8:workflow-name "problem description"

# Workflow runs autonomously:
# - Executes all phases
# - Tests in parallel
# - Generates recommendations

# Returns when complete with comprehensive report
```

## Workflow Selection Guide

### Decision Tree

```
Need to compare specific technologies/frameworks?
├─ Yes → Use /orchestr8:benchmark
└─ No
    └─ Need to test existing assumptions?
        ├─ Yes → Use /orchestr8:validate-assumptions
        └─ No
            └─ Have predefined hypotheses to test?
                ├─ Yes → Use /orchestr8:research
                └─ No → Use /orchestr8:explore-alternatives
```

### Comparison Matrix

| Aspect | Research | Benchmark | Validate-Assumptions | Explore-Alternatives |
|--------|----------|-----------|---------------------|---------------------|
| **Starting Point** | Hypotheses defined | Candidates identified | Assumptions stated | Problem/goal defined |
| **Focus** | Testing theories | Comparing options | Validating beliefs | Discovering solutions |
| **Exploration** | Targeted | Focused comparison | Verification | Broad discovery |
| **Output** | Validated hypothesis | Winner + trade-offs | Pass/fail + risks | Optimal solution + roadmap |
| **Time** | 2-4 hours | 3-6 hours | 2-4 hours | 3-6 hours |
| **Best For** | Architectural decisions | Technology selection | Risk mitigation | Problem solving |

## Integration with Main Workflows

These research workflows complement existing orchestr8 workflows:

- **Before /orchestr8:new-project:** Use /orchestr8:research to validate architecture
- **Before /orchestr8:add-feature:** Use /orchestr8:explore-alternatives to find optimal approach
- **During /orchestr8:refactor:** Use /orchestr8:benchmark to compare patterns
- **Before major decisions:** Use /orchestr8:validate-assumptions to test claims

## Best Practices

### DO
- Run workflows early in decision-making process
- Use parallel execution for maximum speed
- Collect both quantitative and qualitative data
- Document methodology for reproducibility
- Capture learnings in knowledge base
- Share findings with stakeholders
- Re-run workflows when context changes

### DON'T
- Skip workflows to "save time" (pay later in rework)
- Use single-criterion evaluation (e.g., just performance)
- Ignore negative findings
- Forget to test at realistic scale
- Make decisions without evidence
- Skip knowledge capture

## Quality Gates

All workflows enforce quality gates:

1. **Planning Quality:** Clear criteria, testable hypotheses
2. **Execution Quality:** Realistic tests, empirical data, reproducibility
3. **Analysis Quality:** Objective comparison, honest trade-offs, evidence-based recommendations

## File Organization

```
workflows/
├── README.md (this file)
├── research.md
├── benchmark.md
├── validate-assumptions.md
└── explore-alternatives.md
```

## Example Scenarios

### Scenario 1: New Project Architecture

```bash
# Step 1: Research architectural options
/orchestr8:research "Should we use microservices, modular monolith, or serverless?"

# Step 2: Validate assumptions
/orchestr8:validate-assumptions "
1. Team can handle distributed system complexity
2. Service boundaries are clear
3. Infrastructure costs stay under budget
"

# Step 3: Benchmark specific technologies
/orchestr8:benchmark "Compare Kubernetes vs ECS vs Lambda for deployment"

# Result: Evidence-based architecture decision
```

### Scenario 2: Performance Optimization

```bash
# Step 1: Explore optimization alternatives
/orchestr8:explore-alternatives "How to reduce API latency from 500ms to <100ms?"

# Step 2: Benchmark top candidates
/orchestr8:benchmark "Compare Redis caching vs CDN caching vs query optimization"

# Step 3: Validate performance assumptions
/orchestr8:validate-assumptions "
1. Caching reduces latency by 80%
2. Cache hit rate will be >85%
3. No data consistency issues
"

# Result: Optimal optimization strategy with confidence
```

### Scenario 3: Technology Migration

```bash
# Step 1: Research migration strategies
/orchestr8:research "Compare big-bang rewrite vs strangler pattern vs modular migration"

# Step 2: Validate migration assumptions
/orchestr8:validate-assumptions "
1. Can migrate one module per sprint
2. New and old systems can coexist
3. Zero-downtime migration is possible
"

# Step 3: Explore implementation alternatives
/orchestr8:explore-alternatives "Best approach for gradual database migration?"

# Result: Safe migration strategy with fallback plans
```

## Contributing

To add new research workflows:

1. Create new `.md` file in this directory
2. Follow existing workflow structure:
   - Frontmatter with description, argument-hint, model
   - Overview and use cases
   - Workflow phases (4 phases typical)
   - Agent coordination patterns
   - Example usage
   - Best practices
3. Support parallel execution where possible
4. Include knowledge base integration
5. Add to this README

## Support

For questions or issues with research workflows:
- Review existing workflow documentation
- Check example scenarios in this README
- Consult main orchestr8 documentation
- Open GitHub issue

---

**Remember:** These workflows are tools for systematic decision-making. Use them to replace "we think" with "we know" through empirical evidence and rigorous analysis.
