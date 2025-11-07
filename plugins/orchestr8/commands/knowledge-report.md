---
description: Generate comprehensive knowledge base reports with visualizations, trends, and insights for organizational learning
argument-hint: [report-type] [optional-filters]
model: claude-sonnet-4-5-20250929
---

# Knowledge Report Command

Generate comprehensive reports from the organizational knowledge base to visualize patterns, track trends, identify gaps, and measure learning effectiveness.

## Usage

```bash
# Generate full knowledge base report
/orchestr8:knowledge-report full

# Generate pattern effectiveness report
/orchestr8:knowledge-report patterns

# Generate anti-pattern frequency report
/orchestr8:knowledge-report anti-patterns

# Generate performance trends report
/orchestr8:knowledge-report performance

# Generate ROI analysis for refactorings
/orchestr8:knowledge-report refactorings

# Generate knowledge health report
/orchestr8:knowledge-report health

# Generate learning effectiveness report
/orchestr8:knowledge-report learning
```

## Report Types

### 1. Full Knowledge Base Report
Comprehensive overview of all knowledge captured.

### 2. Pattern Effectiveness Report
Analysis of pattern success rates and confidence scores.

### 3. Anti-Pattern Frequency Report
Most common anti-patterns and their impact.

### 4. Performance Trends Report
Performance baseline trends over time.

### 5. Refactoring ROI Analysis
Refactoring opportunities ranked by ROI.

### 6. Knowledge Health Report
Health metrics for the knowledge base.

### 7. Learning Effectiveness Report
Metrics showing how knowledge is improving outcomes.

## Execution Instructions

### Phase 1: Initialize (5%)

**Load knowledge systems**:
```bash
source .claude/knowledge/lib/knowledge-capture.sh
source .claude/knowledge/lib/pattern-recognition.sh
init_knowledge_system
```

**Parse report type**:
```bash
REPORT_TYPE="${1:-full}"
FILTERS="${2:-}"

echo "Generating knowledge report: $REPORT_TYPE"
echo ""
```

**CHECKPOINT**: System initialized ✓

### Phase 2: Data Collection (30%)

**Collect data based on report type**:

#### For Full Report
```bash
echo "Collecting comprehensive knowledge data..."

knowledge_stats > /tmp/knowledge-stats.txt

# Collect all knowledge items
find "$KNOWLEDGE_DIR" -name "*.md" ! -name ".template.md" ! -name "README.md" > /tmp/all-knowledge.txt

# Parse frontmatter from each item
TOTAL_ITEMS=$(wc -l < /tmp/all-knowledge.txt)
echo "Total knowledge items: $TOTAL_ITEMS"
```

#### For Pattern Effectiveness
```bash
echo "Analyzing pattern effectiveness..."

find "$KNOWLEDGE_DIR/patterns" -name "*.md" ! -name ".template.md" | while read -r file; do
    local id=$(grep "^id:" "$file" | cut -d: -f2 | tr -d ' ')
    local title=$(grep "^title:" "$file" | cut -d: -f2)
    local confidence=$(grep "^confidence:" "$file" | cut -d: -f2 | tr -d ' ')
    local success_rate=$(grep "^success_rate:" "$file" | cut -d: -f2 | tr -d ' ')
    local occurrences=$(grep "^occurrences:" "$file" | cut -d: -f2 | tr -d ' ')

    echo "$confidence|$success_rate|$occurrences|$title|$file"
done > /tmp/pattern-effectiveness.txt

sort -t'|' -k1 -rn /tmp/pattern-effectiveness.txt > /tmp/pattern-effectiveness-sorted.txt
```

#### For Anti-Pattern Frequency
```bash
echo "Analyzing anti-pattern frequency..."

find "$KNOWLEDGE_DIR/anti-patterns" -name "*.md" ! -name ".template.md" | while read -r file; do
    local id=$(grep "^id:" "$file" | cut -d: -f2 | tr -d ' ')
    local title=$(grep "^title:" "$file" | cut -d: -f2)
    local severity=$(grep "^severity:" "$file" | cut -d: -f2 | tr -d ' ')
    local occurrences=$(grep "^occurrences:" "$file" | cut -d: -f2 | tr -d ' ')
    local failure_rate=$(grep "^failure_rate:" "$file" | cut -d: -f2 | tr -d ' ')

    echo "$occurrences|$severity|$failure_rate|$title|$file"
done > /tmp/antipattern-frequency.txt

sort -t'|' -k1 -rn /tmp/antipattern-frequency.txt > /tmp/antipattern-frequency-sorted.txt
```

#### For Performance Trends
```bash
echo "Analyzing performance trends..."

find "$KNOWLEDGE_DIR/performance-baselines" -name "*.md" ! -name ".template.md" | while read -r file; do
    local component=$(grep "^component:" "$file" | cut -d: -f2 | tr -d ' ')
    local operation=$(grep "^operation:" "$file" | cut -d: -f2 | tr -d ' ')
    local measurements=$(grep "^measurements:" "$file" | cut -d: -f2 | tr -d ' ')

    # Extract latest metrics
    local p95=$(grep "p95:" "$file" | tail -1 | grep -o "[0-9]\+")

    echo "$component|$operation|$measurements|$p95|$file"
done > /tmp/performance-trends.txt
```

#### For Refactoring ROI
```bash
echo "Analyzing refactoring ROI..."

get_top_refactorings 20 > /tmp/refactoring-roi.txt
```

**CHECKPOINT**: Data collected ✓

### Phase 3: Analysis and Visualization (50%)

**Invoke knowledge-researcher agent for analysis**:

Use knowledge-researcher agent to:
1. Analyze collected data
2. Identify trends and patterns
3. Generate insights and recommendations
4. Create visualizations (text-based charts)
5. Calculate health metrics
6. Produce comprehensive report

**Generate visualizations**:

```bash
# Example: Pattern confidence distribution
echo "=== Pattern Confidence Distribution ===" > /tmp/report-visualizations.txt
echo "" >> /tmp/report-visualizations.txt

# ASCII histogram of confidence scores
awk -F'|' '{
    conf = $1
    if (conf >= 0.8) high++
    else if (conf >= 0.5) medium++
    else low++
}
END {
    total = high + medium + low
    print "High (0.8-1.0):   [" high "/" total "] " high*100/total "%"
    print "Medium (0.5-0.8): [" medium "/" total "] " medium*100/total "%"
    print "Low (0.0-0.5):    [" low "/" total "] " low*100/total "%"
}' /tmp/pattern-effectiveness-sorted.txt >> /tmp/report-visualizations.txt

echo "" >> /tmp/report-visualizations.txt

# Example: Anti-pattern severity distribution
echo "=== Anti-Pattern Severity Distribution ===" >> /tmp/report-visualizations.txt
echo "" >> /tmp/report-visualizations.txt

awk -F'|' '{
    sev = $2
    sev_count[sev]++
}
END {
    for (sev in sev_count) {
        print sev ": " sev_count[sev]
    }
}' /tmp/antipattern-frequency-sorted.txt >> /tmp/report-visualizations.txt
```

**CHECKPOINT**: Analysis complete ✓

### Phase 4: Report Generation (15%)

**Generate final report**:

The report format depends on type. Example structure for full report:

```markdown
# Organizational Knowledge Base Report

Generated: [timestamp]

## Executive Summary

Total Knowledge Items: [count]
- Patterns: [count] (avg confidence: [score])
- Anti-Patterns: [count] (avg severity: [level])
- Performance Baselines: [count]
- Validated Assumptions: [count]
- Technology Comparisons: [count]
- Refactoring Opportunities: [count]

## Knowledge Health Metrics

### Coverage
- Categories covered: [count/6]
- Knowledge density: [items per category]
- Staleness: [% items not updated in 6+ months]

### Quality
- Average pattern confidence: [0.0-1.0]
- Evidence-based items: [%]
- Cross-referenced items: [%]

### Utilization
- Items referenced in last 30 days: [count]
- Knowledge reuse rate: [%]
- New knowledge captured: [count in last 30 days]

## Pattern Effectiveness

### Top Performing Patterns
[List top 10 patterns by confidence × success_rate]

1. [Pattern name] - Confidence: [score], Success: [rate], Uses: [count]
2. [Pattern name] - Confidence: [score], Success: [rate], Uses: [count]
...

### Pattern Confidence Distribution
[ASCII visualization]

High (0.8-1.0):   [████████████] 60%
Medium (0.5-0.8): [████████] 30%
Low (0.0-0.5):    [████] 10%

### Emerging Patterns
[Patterns with < 5 occurrences but high success rate]

## Anti-Pattern Impact

### Most Frequent Anti-Patterns
[Top 10 by occurrence]

1. [Anti-pattern] - Occurrences: [count], Severity: [level], Failure Rate: [rate]
2. [Anti-pattern] - Occurrences: [count], Severity: [level], Failure Rate: [rate]
...

### Severity Distribution
Critical: [count]
High: [count]
Medium: [count]
Low: [count]

### Avoidance Rate
[How often are known anti-patterns avoided in new code]

## Performance Insights

### Baseline Coverage
Components with baselines: [count]
Operations measured: [count]

### Performance Trends
[Components with improving/degrading trends]

Improving: [list]
Stable: [list]
Degrading: [list] ⚠️

### Optimization Opportunities
[From refactoring-opportunities with performance category]

## Validated Assumptions

### Validation Status
Validated: [count]
Invalidated: [count]
Partially Validated: [count]
Inconclusive: [count]

### High-Impact Assumptions
[Assumptions that significantly changed decisions]

### Assumptions Needing Revalidation
[Assumptions validated > 6 months ago]

## Technology Decisions

### Technologies Evaluated
[List of all compared technologies]

### Decision Outcomes
Positive: [count] ([%])
Mixed: [count] ([%])
Negative: [count] ([%])

### Lessons Learned
[Key learnings from technology comparisons]

## Refactoring Pipeline

### ROI Distribution
High ROI (>2.0): [count]
Medium ROI (1.0-2.0): [count]
Low ROI (<1.0): [count]

### Top Opportunities
[From get_top_refactorings]

1. [Component] - ROI: [score], Priority: [level], Effort: [estimate]
2. [Component] - ROI: [score], Priority: [level], Effort: [estimate]
...

### Completed Refactorings
[Refactorings marked as completed]

Actual ROI vs Estimated: [comparison]

## Learning Effectiveness

### Knowledge Growth
- New patterns captured: [count in last 30 days]
- New anti-patterns identified: [count]
- Baselines established: [count]
- Assumptions validated: [count]

### Knowledge Reuse
- Patterns applied: [count of reuses]
- Anti-patterns avoided: [estimated from code reviews]
- Technology decisions informed by comparisons: [count]

### Impact Metrics
- Estimated time saved from pattern reuse: [hours]
- Estimated failures prevented: [count]
- Estimated performance improvements: [%]

## Knowledge Gaps

### Underrepresented Categories
[Categories with < 10% of total items]

### Missing Baselines
[Critical components without performance baselines]

### Unvalidated Assumptions
[Common assumptions that haven't been tested]

### Technology Comparison Gaps
[Technologies in use but not compared]

## Recommendations

### High Priority
1. [Recommendation 1]
2. [Recommendation 2]
...

### Medium Priority
1. [Recommendation 1]
2. [Recommendation 2]
...

### Low Priority
1. [Recommendation 1]
2. [Recommendation 2]
...

## Appendix

### Methodology
[How metrics were calculated]

### Data Sources
[All knowledge files analyzed]

### Definitions
[Definitions of key metrics]
```

**CHECKPOINT**: Report generated ✓

## Success Criteria

Knowledge report is complete when:
- ✅ All requested data collected
- ✅ Analysis performed with statistical rigor
- ✅ Trends identified and visualized
- ✅ Health metrics calculated
- ✅ Insights and recommendations provided
- ✅ Gaps explicitly identified
- ✅ Report formatted for readability
- ✅ Actionable next steps provided

## Example Usage

### Example 1: Full Knowledge Base Report
```bash
/orchestr8:knowledge-report full
```

**Output**: Comprehensive 5-10 page report covering all aspects of the knowledge base.

**Duration**: ~3-5 minutes

### Example 2: Pattern Effectiveness Report
```bash
/orchestr8:knowledge-report patterns
```

**Output**: Focused report on pattern confidence, success rates, and recommendations for pattern improvement.

**Duration**: ~1-2 minutes

### Example 3: Knowledge Health Check
```bash
/orchestr8:knowledge-report health
```

**Output**: Health metrics showing knowledge base quality, coverage, staleness, and utilization.

**Duration**: ~1 minute

## Anti-Patterns

### DON'T ❌
- Generate reports without interpreting data
- Present raw numbers without context
- Ignore trends and patterns in the data
- Skip recommendations and next steps
- Forget to identify knowledge gaps

### DO ✅
- Provide context and interpretation for all metrics
- Visualize data for better understanding
- Identify actionable trends
- Include specific, prioritized recommendations
- Highlight both successes and gaps
- Use statistical rigor in analysis
- Make reports easy to scan and digest

## Integration

**Monthly Review**:
```bash
/orchestr8:knowledge-report full
```
Review comprehensive knowledge base state.

**Sprint Planning**:
```bash
/orchestr8:knowledge-report refactorings
```
Identify high-ROI refactorings to schedule.

**Architecture Review**:
```bash
/orchestr8:knowledge-report patterns
/orchestr8:knowledge-report anti-patterns
```
Review pattern effectiveness and anti-pattern frequency.

**Performance Review**:
```bash
/orchestr8:knowledge-report performance
```
Track performance trends and identify degradations.

## Notes

- Reports are snapshot in time - knowledge base evolves continuously
- Health metrics help ensure knowledge quality and relevance
- Regular reporting drives organizational learning culture
- Visualizations make trends immediately apparent
- Recommendations should be prioritized and actionable
- Knowledge gaps are as important as knowledge captured
