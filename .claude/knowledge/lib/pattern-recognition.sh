#!/bin/bash
# Pattern Recognition Engine
# Automatically discovers patterns and anti-patterns from code and execution data

KNOWLEDGE_DIR="${KNOWLEDGE_DIR:-$HOME/Projects/orchestr8/.claude/knowledge}"

# Source knowledge capture library
source "$(dirname "$0")/knowledge-capture.sh"

# Recognize patterns from successful implementations
recognize_success_pattern() {
    local context="$1"
    local implementation="$2"
    local metrics="$3"
    local tags="${4:-[]}"

    echo "Analyzing successful implementation for patterns..."

    # Extract key characteristics
    local technology=$(echo "$implementation" | grep -i "technology:" | cut -d: -f2 | tr -d ' ')
    local approach=$(echo "$implementation" | grep -i "approach:" | cut -d: -f2)

    # Check if this pattern already exists
    local existing_patterns=$(search_knowledge "$technology $approach" "patterns")

    if [ -n "$existing_patterns" ]; then
        echo "Similar pattern found. Updating confidence and occurrences..."
        while read -r pattern_file; do
            update_knowledge_item "$pattern_file" "occurrences" ""
            # Recalculate success rate
            local occurrences=$(grep "^occurrences:" "$pattern_file" | cut -d: -f2 | tr -d ' ')
            local success_rate=$(echo "scale=2; ($occurrences - 1 + 1) / $occurrences" | bc)
            update_knowledge_item "$pattern_file" "success_rate" "$success_rate"
            update_knowledge_item "$pattern_file" "confidence" "$(echo "scale=2; 0.5 + ($success_rate * 0.4) + (0.1 * ($occurrences / 10))" | bc)"
        done <<< "$existing_patterns"
    else
        echo "New pattern discovered. Capturing..."
        # Extract pattern details from implementation
        local category="code"
        local title="$technology $approach Pattern"
        local problem="$context"
        local solution="$approach"

        capture_pattern "$category" "$title" "$problem" "$solution" "$implementation" "[]" "$tags"
    fi
}

# Recognize anti-patterns from failures
recognize_failure_antipattern() {
    local context="$1"
    local implementation="$2"
    local failure_reason="$3"
    local severity="${4:-medium}"
    local tags="${5:-[]}"

    echo "Analyzing failure for anti-patterns..."

    # Extract key characteristics
    local problematic_approach=$(echo "$implementation" | head -5)

    # Check if this anti-pattern already exists
    local existing_antipatterns=$(search_knowledge "$problematic_approach" "anti-patterns")

    if [ -n "$existing_antipatterns" ]; then
        echo "Similar anti-pattern found. Updating evidence..."
        while read -r antipattern_file; do
            update_knowledge_item "$antipattern_file" "occurrences" ""
            local occurrences=$(grep "^occurrences:" "$antipattern_file" | cut -d: -f2 | tr -d ' ')
            local failure_rate=$(echo "scale=2; $occurrences / ($occurrences + 1)" | bc)
            update_knowledge_item "$antipattern_file" "failure_rate" "$failure_rate"

            # Add to evidence section
            local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
            echo "" >> "$antipattern_file"
            echo "### Failure Evidence $timestamp" >> "$antipattern_file"
            echo "$failure_reason" >> "$antipattern_file"
        done <<< "$existing_antipatterns"
    else
        echo "New anti-pattern discovered. Capturing..."
        local category=$(detect_antipattern_category "$failure_reason")
        local title=$(generate_antipattern_title "$implementation")
        local description="$implementation"
        local why_bad="$failure_reason"
        local alternative="[To be determined from successful patterns]"

        capture_anti_pattern "$category" "$title" "$description" "$why_bad" "$alternative" "$severity" "$tags"
    fi
}

# Detect anti-pattern category from failure reason
detect_antipattern_category() {
    local failure="$1"

    if echo "$failure" | grep -qi "performance\|slow\|timeout\|latency"; then
        echo "performance"
    elif echo "$failure" | grep -qi "security\|vulnerability\|breach\|exploit"; then
        echo "security"
    elif echo "$failure" | grep -qi "architecture\|design\|coupling\|cohesion"; then
        echo "architecture"
    elif echo "$failure" | grep -qi "maintain\|complex\|technical debt"; then
        echo "maintainability"
    elif echo "$failure" | grep -qi "test\|coverage\|quality"; then
        echo "testing"
    else
        echo "code"
    fi
}

# Generate anti-pattern title from implementation
generate_antipattern_title() {
    local implementation="$1"

    # Try to extract a meaningful title
    local first_line=$(echo "$implementation" | head -1 | cut -c1-50)
    echo "$first_line Anti-Pattern"
}

# Analyze code for common anti-patterns
detect_code_antipatterns() {
    local file_path="$1"

    echo "Analyzing $file_path for anti-patterns..."

    # Check for N+1 queries (common in ORM code)
    if grep -q "for.*in.*:" "$file_path" && grep -q "\.query\|\.get\|\.find" "$file_path"; then
        echo "Potential N+1 query detected in $file_path"
        # Could capture this as an anti-pattern observation
    fi

    # Check for hardcoded credentials
    if grep -qi "password\s*=\s*['\"].\|api.*key\s*=\s*['\"].\|secret\s*=\s*['\"]." "$file_path"; then
        echo "Potential hardcoded credential in $file_path"
    fi

    # Check for SELECT *
    if grep -q "SELECT \*" "$file_path"; then
        echo "SELECT * usage detected in $file_path"
    fi

    # Check for God Object (file too long)
    local line_count=$(wc -l < "$file_path")
    if [ "$line_count" -gt 1000 ]; then
        echo "Potential God Object: $file_path has $line_count lines"
    fi
}

# Identify refactoring opportunities through code analysis
identify_refactoring_opportunities() {
    local component="$1"
    local file_path="$2"

    echo "Identifying refactoring opportunities in $component..."

    local issues=()
    local category="code-smell"
    local priority="medium"
    local estimated_impact="medium"

    # Check complexity
    local line_count=$(wc -l < "$file_path")
    if [ "$line_count" -gt 500 ]; then
        issues+=("File too large: $line_count lines (>500)")
        category="maintainability"
        priority="high"
        estimated_impact="high"
    fi

    # Check for code duplication
    local dup_count=$(grep -c "TODO\|FIXME\|HACK" "$file_path" 2>/dev/null || echo 0)
    if [ "$dup_count" -gt 5 ]; then
        issues+=("Multiple TODOs/FIXMEs: $dup_count (>5)")
        priority="medium"
    fi

    # If issues found, capture as refactoring opportunity
    if [ ${#issues[@]} -gt 0 ]; then
        local description=$(printf '%s\n' "${issues[@]}")
        local estimated_effort="2 days"

        if [ "$line_count" -gt 1000 ]; then
            estimated_effort="1 week"
        fi

        capture_refactoring_opportunity \
            "$component" \
            "$category" \
            "$priority" \
            "$estimated_effort" \
            "$estimated_impact" \
            "$description" \
            "Refactor to improve maintainability and reduce complexity" \
            "[refactoring, maintainability]"

        echo "Refactoring opportunity captured for $component"
    fi
}

# Mine patterns from historical data
mine_patterns_from_history() {
    local history_file="$1"

    echo "Mining patterns from historical data..."

    # Look for repeated successful approaches
    local successful_approaches=$(grep -i "success\|completed\|passed" "$history_file" | sort | uniq -c | sort -rn | head -10)

    echo "Top successful approaches:"
    echo "$successful_approaches"

    # Look for repeated failures
    local failed_approaches=$(grep -i "fail\|error\|issue" "$history_file" | sort | uniq -c | sort -rn | head -10)

    echo "Top failure modes:"
    echo "$failed_approaches"
}

# Correlate patterns with success metrics
correlate_pattern_success() {
    local pattern_id="$1"
    local success_metric="$2"  # e.g., "test_pass_rate", "performance_improvement"

    echo "Correlating pattern $pattern_id with $success_metric..."

    # Find all uses of this pattern
    local pattern_file="$KNOWLEDGE_DIR/patterns/${pattern_id}.md"
    if [ ! -f "$pattern_file" ]; then
        echo "Pattern not found: $pattern_id"
        return 1
    fi

    # Extract success rate
    local success_rate=$(grep "^success_rate:" "$pattern_file" | cut -d: -f2 | tr -d ' ')
    echo "Current success rate: $success_rate"

    # Could be extended to track specific metrics per usage
}

# Synthesize knowledge from multiple sources
synthesize_knowledge() {
    local topic="$1"

    echo "Synthesizing knowledge about: $topic"

    # Gather all related knowledge
    local patterns=$(search_knowledge "$topic" "patterns")
    local antipatterns=$(search_knowledge "$topic" "anti-patterns")
    local comparisons=$(search_knowledge "$topic" "technology-comparisons")
    local assumptions=$(search_knowledge "$topic" "assumptions-validated")

    # Create synthesis report
    echo "=== Knowledge Synthesis: $topic ===" > "/tmp/knowledge-synthesis-${topic}.md"
    echo "" >> "/tmp/knowledge-synthesis-${topic}.md"

    echo "## Patterns" >> "/tmp/knowledge-synthesis-${topic}.md"
    echo "$patterns" >> "/tmp/knowledge-synthesis-${topic}.md"
    echo "" >> "/tmp/knowledge-synthesis-${topic}.md"

    echo "## Anti-Patterns" >> "/tmp/knowledge-synthesis-${topic}.md"
    echo "$antipatterns" >> "/tmp/knowledge-synthesis-${topic}.md"
    echo "" >> "/tmp/knowledge-synthesis-${topic}.md"

    echo "## Technology Decisions" >> "/tmp/knowledge-synthesis-${topic}.md"
    echo "$comparisons" >> "/tmp/knowledge-synthesis-${topic}.md"
    echo "" >> "/tmp/knowledge-synthesis-${topic}.md"

    echo "## Validated Assumptions" >> "/tmp/knowledge-synthesis-${topic}.md"
    echo "$assumptions" >> "/tmp/knowledge-synthesis-${topic}.md"

    echo "Synthesis complete: /tmp/knowledge-synthesis-${topic}.md"
}

# Auto-capture from successful quality gate
auto_capture_from_quality_gate() {
    local gate_type="$1"  # code-review|testing|security|performance
    local status="$2"     # passed|failed
    local report_file="$3"

    if [ "$status" = "passed" ]; then
        echo "Quality gate passed. Extracting patterns..."

        case "$gate_type" in
            "code-review")
                # Extract code quality patterns
                local good_patterns=$(grep -i "excellent\|good\|well-structured" "$report_file")
                if [ -n "$good_patterns" ]; then
                    echo "Code quality patterns found:"
                    echo "$good_patterns"
                    # Could auto-capture these as patterns
                fi
                ;;
            "testing")
                # Extract testing patterns
                local coverage=$(grep -i "coverage" "$report_file" | grep -o "[0-9]\+%" | head -1)
                echo "Test coverage: $coverage"
                # Could track coverage patterns
                ;;
            "security")
                # Extract security patterns
                local security_practices=$(grep -i "no vulnerabilities\|secure" "$report_file")
                echo "Security practices validated"
                ;;
            "performance")
                # Extract performance patterns
                local perf_metrics=$(grep -i "p95\|throughput" "$report_file")
                echo "Performance metrics:"
                echo "$perf_metrics"
                # Could auto-capture as baseline
                ;;
        esac
    else
        echo "Quality gate failed. Extracting anti-patterns..."

        # Extract issues that caused failure
        local issues=$(grep -i "error\|fail\|issue\|problem" "$report_file")
        echo "Issues found:"
        echo "$issues"

        # Could auto-capture these as anti-patterns
    fi
}

# Export functions
export -f recognize_success_pattern
export -f recognize_failure_antipattern
export -f detect_antipattern_category
export -f generate_antipattern_title
export -f detect_code_antipatterns
export -f identify_refactoring_opportunities
export -f mine_patterns_from_history
export -f correlate_pattern_success
export -f synthesize_knowledge
export -f auto_capture_from_quality_gate
