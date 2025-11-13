---
description: Capture organizational knowledge including patterns, anti-patterns, performance
  baselines, validated assumptions, technology comparisons, and refactoring opportunities
argument-hint: '[type] [details]'
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- Write
---

# Knowledge Capture: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Knowledge Curator** responsible for capturing organizational knowledge to build a searchable, evidence-based knowledge base that improves decision-making and prevents repeated mistakes.

## Dynamic Resource Loading (JIT Pattern)

This command uses **Just-In-Time (JIT) resource loading** for maximum token efficiency:

**Traditional Approach (WASTEFUL):**
- Load all knowledge management agents upfront: ~8,000 tokens
- Load all documentation skills: ~5,000 tokens
- Load all validation patterns: ~3,000 tokens
- **Total: ~16,000 tokens loaded, only ~20% used**

**JIT Approach (OPTIMAL):**
- Load lightweight resource catalog: ~300 tokens
- Dynamically fetch only needed expertise: ~1,200 tokens
- **Total: ~1,500 tokens - 91% reduction!**

### Resources Loaded On-Demand

```
# Phase 0: Discovery (if knowledge type needs expertise)
orchestr8://match?query=knowledge+management+capture&mode=index&maxResults=3&categories=agent,skill

# Phase 2: Load specific expertise based on knowledge type
orchestr8://agents/knowledge-base-agent              # Knowledge capture methodology (~800 tokens)
orchestr8://skills/technical-writing-principles      # Documentation quality (~600 tokens)
orchestr8://skills/fragment-metadata-optimization    # Metadata structuring (~400 tokens)

# Phase 3: Validation resources (if needed)
orchestr8://skills/fragment-discoverability-testing  # Searchability validation (~500 tokens)
```

**Token Efficiency:**
- Without JIT: ~16,000 tokens loaded upfront
- With JIT: ~1,500 tokens loaded progressively
- **Savings: 91% fewer tokens**

## Knowledge Types

### 1. Pattern
Successful approaches that work well in practice.

**Required fields:**
- `category`: architecture|code|deployment|testing|security|performance
- `title`: Pattern name
- `problem`: What problem does this solve?
- `solution`: How does this pattern address it?
- `implementation`: Code/config examples

### 2. Anti-Pattern
Approaches that should be avoided, with evidence of failures.

**Required fields:**
- `category`: architecture|code|deployment|testing|security|performance
- `title`: Anti-pattern name
- `description`: What is this anti-pattern?
- `why_bad`: Why should it be avoided?
- `alternative`: What to do instead

### 3. Performance Baseline
Performance benchmarks and historical trends.

**Required fields:**
- `component`: Component name
- `operation`: Operation being measured
- `environment`: development|staging|production
- `p50`, `p95`, `p99`: Response time percentiles (ms)
- `throughput`: Requests per second

### 4. Validated Assumption
Tested assumptions with validation results.

**Required fields:**
- `category`: architecture|performance|scalability|security|user-behavior|cost
- `assumption`: The assumption being tested
- `status`: validated|invalidated|partially-validated|inconclusive
- `test_method`: How was this tested?
- `results`: What did the test show?
- `conclusion`: What does this mean?

### 5. Technology Comparison
Comparative analysis of technology choices.

**Required fields:**
- `category`: language|framework|database|infrastructure|tool
- `comparison`: Technology A vs Technology B
- `context`: Use case or project context
- `decision`: Which option was chosen
- `rationale`: Why was it chosen?

### 6. Refactoring Opportunity
Identified improvements ranked by ROI.

**Required fields:**
- `component`: Component or file path
- `category`: code-smell|architecture|performance|security|maintainability
- `priority`: low|medium|high|critical
- `estimated_effort`: Time estimate
- `estimated_impact`: low|medium|high
- `description`: Current problematic state
- `proposed_solution`: What changes should be made

## Phase 1: Parse Input (0-10%)

**→ Load (if needed):** orchestr8://match?query=input+validation+parsing&mode=index&maxResults=3&categories=skill

**Activities:**
- Extract knowledge type
- Parse all required fields for that type
- Parse optional fields if provided
- Validate all required fields are present

**→ Checkpoint:** Input validated, all required fields present

## Phase 2: Knowledge Capture (10-80%)

**→ Load:** orchestr8://match?query=knowledge+management+documentation+metadata&mode=index&maxResults=5

**Recommended resources based on knowledge type:**
```
# For patterns/anti-patterns
orchestr8://agents/knowledge-base-agent
orchestr8://skills/technical-writing-principles

# For performance baselines
orchestr8://skills/performance-profiling-techniques

# For technology comparisons
orchestr8://skills/technology-evaluation
orchestr8://skills/competitive-analysis
```

**Activities:**
- Create knowledge file with proper frontmatter
- Format content according to type template
- Add timestamp and unique ID
- Include all required and optional fields
- Add searchable tags
- Cross-reference related knowledge

**→ Checkpoint:** Knowledge file created successfully

## Phase 3: Verification (80-95%)

**→ Load (if quality issues):** orchestr8://match?query=metadata+validation+discoverability&mode=index&maxResults=3

**Validation resources (load if needed):**
```
orchestr8://skills/fragment-discoverability-testing  # Test searchability
orchestr8://skills/fragment-metadata-optimization    # Validate metadata quality
```

**Activities:**
- Verify file was created
- Validate frontmatter structure
- Display capture summary
- Preview captured content
- Provide enhancement suggestions

**→ Checkpoint:** Knowledge verified and indexed

## Phase 4: Knowledge Base Update (95-100%)

**Activities:**
- Update knowledge base statistics
- Rebuild search index
- Display updated statistics

**→ Checkpoint:** Knowledge base updated

## Success Criteria

✅ Knowledge type identified and validated
✅ All required fields extracted
✅ Knowledge file created successfully
✅ File contains properly formatted frontmatter
✅ Content is searchable and retrievable
✅ Knowledge base statistics updated
✅ User can immediately search for this knowledge

## Example Usage

### Capture a Pattern
```
/orchestr8:knowledge-capture pattern "category:architecture title:'API Gateway Pattern' problem:'Multiple microservices need single entry point' solution:'Centralized API Gateway for routing' implementation:'Using Kong Gateway with circuit breaker'"
```

### Record an Anti-Pattern
```
/orchestr8:knowledge-capture anti-pattern "category:performance title:'N+1 Query Problem' description:'Loading list then separate queries per entity' why_bad:'Exponential query growth, 50-100x slower' alternative:'Use eager loading with JOIN or IN clauses'"
```

### Establish Performance Baseline
```
/orchestr8:knowledge-capture performance "component:user-api operation:'GET /api/users' environment:production p50:45 p95:120 p99:250 throughput:1500"
```
