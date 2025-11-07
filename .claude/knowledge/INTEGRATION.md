# Knowledge System Integration Guide

This guide explains how to integrate the knowledge capture and learning system into orchestr8 agents and workflows.

## Overview

The knowledge system automatically captures, indexes, and retrieves organizational learnings from:
- Successful patterns and approaches
- Anti-patterns and failures
- Performance baselines and trends
- Validated assumptions
- Technology decisions
- Refactoring opportunities

## For Agent Developers

### Adding Knowledge Capture to Agents

#### 1. Load Knowledge Libraries

Add to agent initialization:

```bash
# At the top of your agent or workflow
source .claude/knowledge/lib/knowledge-capture.sh
source .claude/knowledge/lib/pattern-recognition.sh
init_knowledge_system
```

#### 2. Query Knowledge Before Work

Before starting implementation, query relevant knowledge:

```bash
# Example: Architecture agent querying patterns
echo "Searching for relevant architectural patterns..."
search_knowledge "microservices authentication" "patterns"

# Check for anti-patterns to avoid
search_knowledge "microservices" "anti-patterns"

# Review past technology decisions
search_knowledge "database" "technology-comparisons"
```

Better yet, delegate to knowledge-researcher agent:

```markdown
**Research Task**: Query knowledge base for insights on [topic]

Use knowledge-researcher agent to:
1. Search for relevant patterns
2. Identify anti-patterns to avoid
3. Review validated assumptions
4. Check past technology decisions
5. Synthesize findings into recommendations

This ensures evidence-based decision making.
```

#### 3. Capture Knowledge During Execution

Capture successful approaches:

```bash
# When a pattern works well
if [ "$implementation_status" = "success" ]; then
    capture_pattern \
        "architecture" \
        "Event-Driven Microservices" \
        "Services need async communication" \
        "Use event bus with Kafka" \
        "$implementation_code" \
        "[microservices, events]" \
        "[kafka, async, messaging]"
fi
```

Capture failures as anti-patterns:

```bash
# When something fails
if [ "$implementation_status" = "failed" ]; then
    capture_anti_pattern \
        "performance" \
        "Synchronous Cascade Calls" \
        "Service A calls B calls C synchronously" \
        "Latency compounds, timeout risk increases" \
        "Use async messaging or batch operations" \
        "high" \
        "[microservices, performance]"
fi
```

Capture performance baselines:

```bash
# After performance testing
capture_performance_baseline \
    "user-api" \
    "GET /api/users" \
    "production" \
    "45" \
    "120" \
    "250" \
    "1500" \
    "[api, users, critical-path]"
```

#### 4. Validate Assumptions

When testing assumptions:

```bash
# After A/B test or experiment
capture_assumption \
    "performance" \
    "Redis caching will reduce DB load by 80%" \
    "validated" \
    "Load test with 1000 concurrent users" \
    "DB queries reduced 84%, response time improved 3x" \
    "Assumption validated with high confidence" \
    "0.95" \
    "[caching, redis, performance]"
```

#### 5. Document Technology Decisions

After comparing technologies:

```bash
# After POC or evaluation
capture_technology_comparison \
    "database" \
    "PostgreSQL vs MongoDB" \
    "User profile storage with complex queries" \
    "PostgreSQL" \
    "ACID guarantees, complex joins, JSON support for flexibility" \
    "[database, postgresql, mongodb]"
```

#### 6. Identify Refactoring Opportunities

During code review or analysis:

```bash
# When identifying technical debt
capture_refactoring_opportunity \
    "src/services/auth-service.ts" \
    "maintainability" \
    "high" \
    "3 days" \
    "high" \
    "Auth service has 1200 lines, mixed responsibilities" \
    "Split into AuthN, AuthZ, Token, Password services (SRP)" \
    "[refactoring, solid, auth]"
```

## For Workflow Developers

### Integrating Knowledge into Workflows

#### Pattern: Knowledge-Informed Workflow

```markdown
## Phase 1: Pre-Implementation Research (10%)

**Query knowledge base for insights**:

Invoke knowledge-researcher agent:
```
Task: Research [domain/technology] for this implementation

Requirements from user: [requirements]

Research objectives:
1. Find relevant successful patterns
2. Identify anti-patterns to avoid
3. Review past technology decisions
4. Check validated assumptions
5. Get performance baselines if available

Provide: Evidence-based recommendations with confidence levels
```

**CHECKPOINT**: Research complete, recommendations reviewed ✓

## Phase 2: Implementation (60%)

[Normal implementation steps]

**Knowledge Capture During Implementation**:

```bash
# Capture successful patterns as they emerge
if [ "$pattern_successful" = "true" ]; then
    source .claude/knowledge/lib/knowledge-capture.sh
    capture_pattern "$category" "$title" "$problem" "$solution" "$code"
fi
```

## Phase 3: Quality Gates (20%)

**Capture quality insights**:

```bash
# After each quality gate
source .claude/knowledge/lib/pattern-recognition.sh

auto_capture_from_quality_gate \
    "code-review" \
    "$status" \
    "code-review-report.md"

auto_capture_from_quality_gate \
    "testing" \
    "$status" \
    "test-report.md"

auto_capture_from_quality_gate \
    "security" \
    "$status" \
    "security-report.md"

auto_capture_from_quality_gate \
    "performance" \
    "$status" \
    "performance-report.md"
```

## Phase 4: Post-Implementation Learning (10%)

**Capture learnings**:

```bash
# Analyze what worked
recognize_success_pattern \
    "$project_context" \
    "$implementation_summary" \
    "$success_metrics"

# Analyze what didn't work
if [ -n "$challenges" ]; then
    recognize_failure_antipattern \
        "$challenge_context" \
        "$problematic_approach" \
        "$failure_reason" \
        "$severity"
fi

# Identify future refactoring opportunities
identify_refactoring_opportunities \
    "$component_name" \
    "$source_file"
```

**CHECKPOINT**: Knowledge captured for future reference ✓
```

#### Example: Updated new-project.md with Knowledge Integration

Add to Phase 1 (Requirements Analysis):

```markdown
### Knowledge Research

**Query for similar projects**:

```bash
source .claude/knowledge/lib/knowledge-capture.sh

# Search for patterns used in similar projects
echo "Researching patterns for $PROJECT_TYPE..."
search_knowledge "$PROJECT_TYPE" "patterns"

# Check common anti-patterns
search_knowledge "$PROJECT_TYPE" "anti-patterns"

# Review technology decisions
search_knowledge "$PROJECT_TYPE" "technology-comparisons"
```

**Invoke knowledge-researcher for comprehensive analysis**:

Use knowledge-researcher agent to synthesize findings and provide recommendations.
```

Add to Phase 8 (Deployment):

```markdown
### Capture Project Knowledge

**Document successful approaches**:

```bash
# Capture architecture pattern
capture_pattern \
    "architecture" \
    "$PROJECT_TYPE Architecture Pattern" \
    "Building $PROJECT_TYPE with $TECH_STACK" \
    "$ARCHITECTURE_APPROACH" \
    "$(cat architecture.md)" \
    "[$PROJECT_TYPE, $TECH_STACK]"

# Capture technology decisions
capture_technology_comparison \
    "framework" \
    "$CHOSEN_FRAMEWORK vs $ALTERNATIVE_FRAMEWORK" \
    "$PROJECT_TYPE project with $REQUIREMENTS" \
    "$CHOSEN_FRAMEWORK" \
    "$DECISION_RATIONALE"

# Capture performance baselines
for component in $COMPONENTS; do
    capture_performance_baseline \
        "$component" \
        "baseline" \
        "production" \
        "$P50" \
        "$P95" \
        "$P99" \
        "$THROUGHPUT"
done
```
```

## For Research Agents

### Using the Knowledge Researcher Agent

The knowledge-researcher agent is your interface to the knowledge base. Use it to:

```markdown
**Invoke knowledge-researcher for**:

**Task**: Research [topic] for [purpose]

**Objectives**:
1. Find relevant patterns with confidence scores
2. Identify anti-patterns to avoid
3. Review performance baselines
4. Check validated assumptions
5. Review past technology decisions
6. Identify high-ROI refactoring opportunities

**Expected Output**:
- Comprehensive research report
- Evidence-based recommendations
- Confidence levels for all claims
- Source references for deep dive
- Knowledge gaps identified
```

## Knowledge Capture Checklist

Use this checklist for each project/feature:

### Before Starting
- [ ] Query knowledge base for relevant patterns
- [ ] Check for anti-patterns to avoid
- [ ] Review similar technology decisions
- [ ] Check validated assumptions
- [ ] Get performance baselines if available

### During Implementation
- [ ] Capture successful patterns as they emerge
- [ ] Document anti-patterns encountered
- [ ] Record technology decisions made
- [ ] Validate assumptions with tests
- [ ] Establish performance baselines

### After Completion
- [ ] Capture final architecture patterns
- [ ] Document technology comparison results
- [ ] Record performance benchmarks
- [ ] Validate or invalidate assumptions
- [ ] Identify refactoring opportunities

### Post-Mortem (if failure)
- [ ] Capture anti-patterns that caused issues
- [ ] Invalidate incorrect assumptions
- [ ] Document what should have been done differently
- [ ] Update existing knowledge with new evidence

## Knowledge Management Commands

### For Users

```bash
# Capture new knowledge
/orchestr8:knowledge-capture pattern "..."
/orchestr8:knowledge-capture anti-pattern "..."
/orchestr8:knowledge-capture performance "..."
/orchestr8:knowledge-capture assumption "..."
/orchestr8:knowledge-capture comparison "..."
/orchestr8:knowledge-capture refactoring "..."

# Search knowledge
/orchestr8:knowledge-search "query"
/orchestr8:knowledge-search "query" "category"

# Generate reports
/orchestr8:knowledge-report full
/orchestr8:knowledge-report patterns
/orchestr8:knowledge-report anti-patterns
/orchestr8:knowledge-report performance
/orchestr8:knowledge-report refactorings
/orchestr8:knowledge-report health
```

### For Automation

```bash
# In scripts or workflows
source .claude/knowledge/lib/knowledge-capture.sh
source .claude/knowledge/lib/pattern-recognition.sh

# Capture knowledge
capture_pattern "$category" "$title" "$problem" "$solution" "$impl"
capture_anti_pattern "$category" "$title" "$desc" "$why_bad" "$alt"
capture_performance_baseline "$component" "$operation" "$env" "$p50" "$p95" "$p99" "$throughput"
capture_assumption "$category" "$assumption" "$status" "$method" "$results" "$conclusion"
capture_technology_comparison "$category" "$comparison" "$context" "$decision" "$rationale"
capture_refactoring_opportunity "$component" "$category" "$priority" "$effort" "$impact" "$desc" "$solution"

# Query knowledge
search_knowledge "$query" "$category"
query_knowledge "$category" "$tags"
get_top_refactorings 10
knowledge_stats

# Pattern recognition
recognize_success_pattern "$context" "$implementation" "$metrics"
recognize_failure_antipattern "$context" "$implementation" "$failure_reason"
detect_code_antipatterns "$file_path"
identify_refactoring_opportunities "$component" "$file_path"
synthesize_knowledge "$topic"
```

## Best Practices

### 1. Be Evidence-Based
- Always cite sources
- Quantify benefits when possible
- Track confidence levels
- Update with new evidence

### 2. Capture Continuously
- Don't wait until project end
- Capture insights as they occur
- Small frequent captures > large infrequent ones

### 3. Tag Appropriately
- Use consistent, searchable tags
- Include technology names
- Add domain/category tags
- Enable multi-dimensional search

### 4. Link Related Knowledge
- Cross-reference patterns and anti-patterns
- Link assumptions to validation results
- Connect refactorings to patterns

### 5. Keep Knowledge Fresh
- Update confidence scores with new data
- Revalidate assumptions periodically
- Archive outdated comparisons
- Update baselines regularly

### 6. Query Before Acting
- Always search before implementing
- Learn from past successes and failures
- Apply proven patterns
- Avoid known anti-patterns

## Metrics to Track

Monitor knowledge system effectiveness:

- **Capture Rate**: New knowledge items per week
- **Reuse Rate**: Pattern applications / pattern definitions
- **Avoidance Rate**: Known anti-patterns avoided
- **Coverage**: Categories represented in knowledge base
- **Staleness**: Age of knowledge items
- **Quality**: Average confidence scores
- **Impact**: Time/cost saved from pattern reuse

## Troubleshooting

### Knowledge not found
- Check search query (try broader terms)
- Verify knowledge was actually captured
- Check category filter
- Try knowledge-researcher for better synthesis

### Duplicate knowledge items
- Search before capturing
- Update existing items instead of creating new
- Use unique, descriptive titles
- Consolidate similar items

### Low quality knowledge
- Add more evidence and examples
- Quantify benefits and trade-offs
- Increase sample size (occurrences)
- Link to supporting documentation

### Knowledge not being used
- Promote knowledge-first culture
- Make search part of standard workflow
- Generate regular knowledge reports
- Celebrate knowledge reuse

## Next Steps

1. **Start Capturing**: Begin with high-impact patterns/anti-patterns
2. **Integrate into Workflows**: Add knowledge research to existing workflows
3. **Train Team**: Show how to search and capture knowledge
4. **Monitor Usage**: Track knowledge base growth and utilization
5. **Refine Continuously**: Improve knowledge quality over time

Remember: The knowledge base is only valuable if it's used. Make querying knowledge a habit, not an afterthought.
