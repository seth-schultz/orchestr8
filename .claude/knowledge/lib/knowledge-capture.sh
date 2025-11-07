#!/bin/bash
# Knowledge Capture Library
# Provides functions for capturing organizational knowledge during agent execution

KNOWLEDGE_DIR="${KNOWLEDGE_DIR:-$HOME/Projects/orchestr8/.claude/knowledge}"

# Initialize knowledge directories if they don't exist
init_knowledge_system() {
    mkdir -p "$KNOWLEDGE_DIR"/{patterns,anti-patterns,performance-baselines,assumptions-validated,technology-comparisons,refactoring-opportunities}
}

# Generate unique ID for knowledge items
generate_knowledge_id() {
    local category="$1"
    local short_name="$2"
    local timestamp=$(date +%s)
    echo "${category}-${short_name}-${timestamp}"
}

# Capture a discovered pattern
capture_pattern() {
    local category="$1"  # architecture|code|deployment|testing|security|performance
    local title="$2"
    local problem="$3"
    local solution="$4"
    local implementation="$5"
    local contexts="${6:-[]}"
    local tags="${7:-[]}"

    local short_name=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
    local id=$(generate_knowledge_id "pattern-$category" "$short_name")
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local file_path="$KNOWLEDGE_DIR/patterns/${id}.md"

    cat > "$file_path" <<EOF
---
id: $id
category: $category
title: $title
confidence: 0.7
occurrences: 1
success_rate: 1.0
contexts: $contexts
created_at: $timestamp
updated_at: $timestamp
tags: $tags
---

## Problem
$problem

## Solution
$solution

## Implementation
$implementation

## Benefits
- [To be documented with more usage]

## Trade-offs
- [To be documented with more usage]

## When to Use
- [To be refined with more data]

## When NOT to Use
- [To be refined with more data]

## Examples
[To be added as pattern is reused]

## Related Patterns
[To be linked as knowledge base grows]

## References
- Captured from: [Agent or workflow name]
- Date: $timestamp

## Revision History
- $timestamp: Initial capture
EOF

    echo "$file_path"
}

# Capture an anti-pattern
capture_anti_pattern() {
    local category="$1"
    local title="$2"
    local description="$3"
    local why_bad="$4"
    local alternative="$5"
    local severity="${6:-medium}"
    local tags="${7:-[]}"

    local short_name=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
    local id=$(generate_knowledge_id "anti-pattern-$category" "$short_name")
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local file_path="$KNOWLEDGE_DIR/anti-patterns/${id}.md"

    cat > "$file_path" <<EOF
---
id: $id
category: $category
title: $title
severity: $severity
occurrences: 1
failure_rate: 1.0
contexts: []
created_at: $timestamp
updated_at: $timestamp
tags: $tags
---

## Description
$description

## Why It's Bad
$why_bad

## Evidence
- First observed: $timestamp
- [To be updated with more incidents]

## Symptoms
- [To be documented as more cases are observed]

## Correct Alternative
$alternative

## Refactoring Steps
[To be documented with remediation experience]

## Examples of Failures
[To be added as failures are observed]

## Related Anti-Patterns
[To be linked as knowledge base grows]

## References
- Captured from: [Agent or workflow name]
- Date: $timestamp

## Revision History
- $timestamp: Initial capture
EOF

    echo "$file_path"
}

# Capture performance baseline
capture_performance_baseline() {
    local component="$1"
    local operation="$2"
    local environment="$3"
    local p50="$4"
    local p95="$5"
    local p99="$6"
    local throughput="$7"
    local tags="${8:-[]}"

    local short_name=$(echo "${component}-${operation}" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
    local id=$(generate_knowledge_id "perf-$short_name" "$environment")
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local file_path="$KNOWLEDGE_DIR/performance-baselines/${id}.md"

    cat > "$file_path" <<EOF
---
id: $id
component: $component
operation: $operation
environment: $environment
baseline_date: $timestamp
last_measured: $timestamp
measurements: 1
tags: $tags
---

## Baseline Metrics

### Response Time
- **p50**: ${p50}ms - Median response time
- **p95**: ${p95}ms - 95th percentile
- **p99**: ${p99}ms - 99th percentile

### Throughput
- **Requests/second**: $throughput RPS

## Historical Trends

### $timestamp - Baseline Established
**Response Time:**
- p50: ${p50}ms
- p95: ${p95}ms
- p99: ${p99}ms

**Throughput:** $throughput RPS

**Notes:** Initial baseline measurement

## Degradation Alerts

### Critical Thresholds
- Response time p95 > $(echo "$p95 * 1.5" | bc)ms (baseline + 50%)
- Response time p99 > $(echo "$p99 * 2" | bc)ms (baseline + 100%)

## Optimization History
[To be added as optimizations are made]

## Revision History
- $timestamp: Baseline established
EOF

    echo "$file_path"
}

# Capture validated assumption
capture_assumption() {
    local category="$1"
    local assumption="$2"
    local status="$3"  # validated|invalidated|partially-validated|inconclusive
    local test_method="$4"
    local results="$5"
    local conclusion="$6"
    local confidence="${7:-0.7}"
    local tags="${8:-[]}"

    local short_name=$(echo "$assumption" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-' | cut -c1-50)
    local id=$(generate_knowledge_id "assumption-$category" "$short_name")
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local file_path="$KNOWLEDGE_DIR/assumptions-validated/${id}.md"

    cat > "$file_path" <<EOF
---
id: $id
assumption: $assumption
category: $category
status: $status
confidence: $confidence
tested_at: $timestamp
test_method: $test_method
sample_size: 0
tags: $tags
---

## Hypothesis
$assumption

## Test Design
Method: $test_method

[Additional test design details to be added]

## Results
$results

## Conclusion
Status: $status

$conclusion

## Impact
[How this affects our decisions going forward]

## Recommendations
- [To be documented]

## Related Assumptions
[To be linked as knowledge base grows]

## Revision History
- $timestamp: Initial test conducted
EOF

    echo "$file_path"
}

# Capture technology comparison
capture_technology_comparison() {
    local category="$1"
    local comparison="$2"  # "Tech A vs Tech B"
    local context="$3"
    local decision="$4"
    local rationale="$5"
    local tags="${6:-[]}"

    local short_name=$(echo "$comparison" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
    local id=$(generate_knowledge_id "comparison-$category" "$short_name")
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local file_path="$KNOWLEDGE_DIR/technology-comparisons/${id}.md"

    cat > "$file_path" <<EOF
---
id: $id
comparison: $comparison
category: $category
evaluated_at: $timestamp
context: $context
decision: $decision
tags: $tags
---

## Executive Summary

**Comparison**: $comparison

**Context**: $context

**Winner**: $decision

**Key Reasons**:
$rationale

## Options Evaluated
[Detailed evaluation to be added]

## Comparison Matrix
[To be populated with detailed comparison]

## Benchmark Results
[To be added if benchmarks were run]

## Decision Rationale
$rationale

## Outcome
[To be updated after implementation]

## Lessons Learned
[To be documented after experience with chosen technology]

## Revision History
- $timestamp: Initial evaluation
EOF

    echo "$file_path"
}

# Capture refactoring opportunity
capture_refactoring_opportunity() {
    local component="$1"
    local category="$2"
    local priority="$3"
    local estimated_effort="$4"
    local estimated_impact="$5"
    local description="$6"
    local proposed_solution="$7"
    local tags="${8:-[]}"

    # Calculate ROI score
    local impact_score=5
    case "$estimated_impact" in
        low) impact_score=3 ;;
        medium) impact_score=5 ;;
        high) impact_score=8 ;;
    esac

    local effort_score=5
    case "$estimated_effort" in
        *hour*) effort_score=2 ;;
        *day*) effort_score=5 ;;
        *week*) effort_score=8 ;;
    esac

    local roi_score=$(echo "scale=2; $impact_score / $effort_score" | bc)

    local short_name=$(echo "$component" | tr '[:upper:]' '[:lower:]' | tr ' /' '-' | tr -cd '[:alnum:]-' | cut -c1-50)
    local id=$(generate_knowledge_id "refactor-$category" "$short_name")
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local file_path="$KNOWLEDGE_DIR/refactoring-opportunities/${id}.md"

    cat > "$file_path" <<EOF
---
id: $id
component: $component
category: $category
priority: $priority
estimated_effort: $estimated_effort
estimated_impact: $estimated_impact
roi_score: $roi_score
identified_at: $timestamp
status: identified
tags: $tags
---

## Current State
$description

## Issues
[To be detailed with specific problems]

## Proposed Refactoring
$proposed_solution

## Benefits
- [To be quantified with more analysis]

## Estimated Effort
$estimated_effort

## Risks
- [To be assessed]

## ROI Calculation
\`\`\`
Impact Score: $impact_score/10
Effort Score: $effort_score/10
ROI = Impact / Effort = $roi_score
\`\`\`

## Priority Justification
Priority: $priority
ROI Score: $roi_score

## Dependencies
[To be identified]

## Related Refactorings
[To be linked as knowledge base grows]

## Revision History
- $timestamp: Opportunity identified
EOF

    echo "$file_path"
}

# Update an existing knowledge item (increment occurrences, update timestamp)
update_knowledge_item() {
    local file_path="$1"
    local field="$2"  # occurrences, success_rate, confidence, etc.
    local value="$3"

    if [ ! -f "$file_path" ]; then
        echo "Error: Knowledge item not found: $file_path" >&2
        return 1
    fi

    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Update the field in frontmatter using sed
    case "$field" in
        occurrences)
            # Increment occurrences
            local current=$(grep "^occurrences:" "$file_path" | cut -d: -f2 | tr -d ' ')
            local new_value=$((current + 1))
            sed -i.bak "s/^occurrences: .*/occurrences: $new_value/" "$file_path"
            ;;
        *)
            sed -i.bak "s/^${field}: .*/${field}: $value/" "$file_path"
            ;;
    esac

    # Update timestamp
    sed -i.bak "s/^updated_at: .*/updated_at: $timestamp/" "$file_path"

    # Add to revision history
    echo "- $timestamp: Updated $field to $value" >> "$file_path"

    rm "${file_path}.bak"
}

# Search knowledge base
search_knowledge() {
    local query="$1"
    local category="${2:-all}"  # patterns|anti-patterns|performance-baselines|etc|all

    if [ "$category" = "all" ]; then
        grep -r -i "$query" "$KNOWLEDGE_DIR"/ --include="*.md" | grep -v ".template.md"
    else
        grep -r -i "$query" "$KNOWLEDGE_DIR/$category/" --include="*.md" | grep -v ".template.md"
    fi
}

# Query knowledge by category and tags
query_knowledge() {
    local category="$1"
    local tags="$2"

    find "$KNOWLEDGE_DIR/$category" -name "*.md" ! -name ".template.md" | while read -r file; do
        if [ -n "$tags" ]; then
            # Check if file contains all tags
            if grep -q "tags:.*$tags" "$file"; then
                echo "$file"
            fi
        else
            echo "$file"
        fi
    done
}

# Get top refactoring opportunities by ROI
get_top_refactorings() {
    local limit="${1:-10}"

    find "$KNOWLEDGE_DIR/refactoring-opportunities" -name "*.md" ! -name ".template.md" | while read -r file; do
        local roi=$(grep "^roi_score:" "$file" | cut -d: -f2 | tr -d ' ')
        local priority=$(grep "^priority:" "$file" | cut -d: -f2 | tr -d ' ')
        local component=$(grep "^component:" "$file" | cut -d: -f2 | tr -d ' ')
        echo "$roi|$priority|$component|$file"
    done | sort -t'|' -k1 -rn | head -n "$limit"
}

# Get knowledge statistics
knowledge_stats() {
    echo "=== Knowledge Base Statistics ==="
    echo ""
    echo "Patterns: $(find "$KNOWLEDGE_DIR/patterns" -name "*.md" ! -name ".template.md" | wc -l)"
    echo "Anti-Patterns: $(find "$KNOWLEDGE_DIR/anti-patterns" -name "*.md" ! -name ".template.md" | wc -l)"
    echo "Performance Baselines: $(find "$KNOWLEDGE_DIR/performance-baselines" -name "*.md" ! -name ".template.md" | wc -l)"
    echo "Validated Assumptions: $(find "$KNOWLEDGE_DIR/assumptions-validated" -name "*.md" ! -name ".template.md" | wc -l)"
    echo "Technology Comparisons: $(find "$KNOWLEDGE_DIR/technology-comparisons" -name "*.md" ! -name ".template.md" | wc -l)"
    echo "Refactoring Opportunities: $(find "$KNOWLEDGE_DIR/refactoring-opportunities" -name "*.md" ! -name ".template.md" | wc -l)"
    echo ""

    local total=$(find "$KNOWLEDGE_DIR" -name "*.md" ! -name ".template.md" ! -name "README.md" | wc -l)
    echo "Total Knowledge Items: $total"
}

# Export functions for use in other scripts
export -f init_knowledge_system
export -f generate_knowledge_id
export -f capture_pattern
export -f capture_anti_pattern
export -f capture_performance_baseline
export -f capture_assumption
export -f capture_technology_comparison
export -f capture_refactoring_opportunity
export -f update_knowledge_item
export -f search_knowledge
export -f query_knowledge
export -f get_top_refactorings
export -f knowledge_stats
