# Create Skill

Autonomous workflow for creating new auto-activated skills that augment agent capabilities with reusable expertise.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting Create Skill Workflow"
echo "Requirements: $1"
echo "Workflow ID: $workflow_id"

# Query similar skill patterns
```

---

## Phase 1: Skill Validation (0-15%)

**⚡ EXECUTE TASK TOOL:**
```
Use the skill-architect agent to:
1. Analyze requirements to determine if this should be a skill vs an agent
2. Validate skill is reusable across multiple agents
3. Determine skill type (methodology, pattern, best practice, framework knowledge)
4. Identify trigger conditions for auto-activation

subagent_type: "meta-development:skill-architect"
description: "Validate skill requirements and determine if skill is appropriate"
prompt: "Validate if the following requirements should be implemented as a skill:

Requirements: $1

Tasks:
1. **Skill vs Agent Decision Matrix**

   Should be a SKILL if:
   - ✅ Provides reusable knowledge/methodology
   - ✅ Activates based on context (file types, keywords, patterns)
   - ✅ Augments multiple agents' capabilities
   - ✅ No specific tools required (just knowledge)
   - ✅ Represents patterns, best practices, or methodologies

   Should be an AGENT if:
   - ❌ Requires specific tool access
   - ❌ Performs concrete actions (read, write, execute)
   - ❌ Handles single domain exclusively
   - ❌ Needs stateful execution
   - ❌ Requires orchestration of other agents

2. **Skill Type Classification**
   - **Methodology Skill**: TDD, BDD, Domain-Driven Design, Clean Architecture
   - **Pattern Skill**: Design patterns (SOLID, Gang of Four), architectural patterns
   - **Best Practice Skill**: Security practices, performance optimization, accessibility
   - **Framework Knowledge**: React patterns, Spring Boot best practices, Django conventions
   - **Domain Expertise**: Financial systems, healthcare compliance, e-commerce patterns

3. **Auto-Activation Context Design**
   - What file types should trigger this skill? (.py, .ts, .java, etc.)
   - What keywords indicate need for this skill? (test, security, performance, etc.)
   - What project patterns trigger this? (package.json, requirements.txt, etc.)
   - What conversation contexts activate this? (user mentions specific topic)

4. **Cross-Agent Applicability**
   - Which agents would benefit from this skill?
   - How does this skill augment existing agent capabilities?
   - Does this overlap with existing skills? (check .claude/skills/)

5. **Validation Decision**
   - ✅ PROCEED: This should be a skill (provide justification)
   - ❌ REJECT: This should be an agent instead (provide alternative recommendation)

Provide a structured validation report with clear decision and reasoning.
"
```

**Expected Outputs:**
- Skill validation report with decision (PROCEED or REJECT)
- Skill type classification
- Auto-activation context design
- Cross-agent applicability analysis

**Quality Gate: Skill Validation**
```bash
# Validation script should create validation-report.txt with decision
if [ ! -f "validation-report.txt" ]; then
  echo "❌ Skill validation report missing"
  exit 1
fi

# Check if validation passed
if ! grep -q "✅ PROCEED" validation-report.txt; then
  echo "❌ Skill validation failed - requirements should be implemented as agent instead"

  # Extract alternative recommendation
  ALTERNATIVE=$(grep -A 5 "❌ REJECT" validation-report.txt)
  echo "$ALTERNATIVE"

  # Store this for learning
    "Requirements rejected as skill: $1" \
    "$ALTERNATIVE"

  exit 1
fi

echo "✅ Skill validation passed - proceeding with skill creation"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store validation results
SKILL_TYPE=$(grep "Skill Type:" validation-report.txt | cut -d: -f2 | xargs)
  "Validated skill: Type=$SKILL_TYPE" \
  "$(cat validation-report.txt | head -100)"
```

---

## Phase 2: Skill Design (15-35%)

**⚡ EXECUTE TASK TOOL:**
```
Use the skill-architect agent to:
1. Design skill structure and sections
2. Define auto-activation rules with specificity
3. Create methodology/pattern documentation outline
4. Design 5+ code example scenarios
5. Define DO/DON'T patterns

subagent_type: "meta-development:skill-architect"
description: "Design skill structure, auto-activation, and content outline"
prompt: "Design the structure and auto-activation rules for the validated skill:

Requirements: $1
Skill Type: [from validation report]

Tasks:
1. **Skill Structure Design**

   Required Sections:
   - Frontmatter (name, description ONLY - no model, tools, or other fields)
   - Introduction (1-2 paragraphs)
   - Core Concept or Core Methodology
   - Best Practices (DO/DON'T sections)
   - Application Workflows or Scenarios
   - When to Use This Skill
   - Remember (key takeaways)

   **File Structure:**
   - Directory: `.claude/skills/[category]/[skill-name]/`
   - File: `SKILL.md` (uppercase, exactly this name)

2. **Frontmatter Design (CRITICAL)**

   **Simple structure (NO model or tools):**
   ```yaml
   ---
   name: skill-name
   description: Expertise in [methodology/pattern/practice]. Activate when [context/task]. [What it guides you to do], ensuring [quality outcome].
   ---
   ```

   **Description Pattern:**
   ```
   \"Expertise in [what].
   Activate when [when].
   [Guidance], ensuring [outcome].\"
   ```

3. **Category Selection**
   - `practices/` - Development methodologies (TDD, BDD, etc.)
   - `patterns/` - Design patterns, architectural patterns
   - `languages/` - Language-specific idioms
   - `frameworks/` - Framework-specific patterns
   - `tools/` - Tool usage patterns
   - `domains/` - Domain-specific knowledge
   - `meta/` - System-level patterns

4. **Code Example Planning (5+ required)**

   Each example should show:
   - ✅ DO: Correct implementation with explanation
   - ❌ DON'T: Wrong implementation with why it's wrong
   - Real-world context
   - Multiple languages if applicable
   - 50-150 lines per major example

5. **Content Outline**

   Create detailed outline for:
   - Core concept explanation
   - Key principles (3-7 principles)
   - Patterns and practices (5-10 patterns)
   - Code examples (5+ with DO/DON'T)
   - Application scenarios (3-5 scenarios)
   - When to use guidance
   - Key takeaways

Provide a comprehensive skill design document with structure, category, and detailed content outline.
"
```

**Expected Outputs:**
- `skill-design.md` - Complete skill structure and outline
- `content-outline.md` - Detailed section-by-section plan
- `examples-plan.md` - Code examples detailed planning

**Quality Gate: Skill Design Review**
```bash
if [ ! -f "skill-design.md" ]; then
  echo "❌ Skill design document missing"
  exit 1
fi

# Validate design completeness
REQUIRED_SECTIONS=("Introduction" "Core Concept" "Best Practices" "Application" "When to Use")
for section in "${REQUIRED_SECTIONS[@]}"; do
  if ! grep -q "$section" skill-design.md; then
    echo "❌ Missing required section: $section"
    exit 1
  fi
done

# Validate minimum 5 code examples outlined
EXAMPLE_COUNT=$(grep -c "Example [0-9]" examples-plan.md 2>/dev/null || echo "0")
if [ "$EXAMPLE_COUNT" -lt 5 ]; then
  echo "❌ Insufficient code examples: $EXAMPLE_COUNT (minimum 5)"
  exit 1
fi

echo "✅ Skill design validated with $EXAMPLE_COUNT code examples"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store design patterns
SKILL_NAME=$(grep "^# " skill-design.md | head -1 | sed 's/^# //' | tr -dc '[:alnum:]' | head -c 30)
  "Skill design completed with examples plan" \
  "$(cat skill-design.md | head -150)"
```

---

## Phase 3: Skill Implementation (35-65%)

**⚡ EXECUTE TASK TOOL:**
```
Use the skill-architect agent to:
1. Create skill directory and SKILL.md file
2. Implement all sections from design (200-300 lines typical)
3. Write 5+ detailed code examples with DO/DON'T patterns
4. Ensure cross-agent applicability
5. Follow wshobson/agents skill pattern

subagent_type: "meta-development:skill-architect"
description: "Implement complete skill markdown file with examples"
prompt: "Implement the skill based on the design document:

Skill Name: [from skill-design.md]
Requirements: $1
Design Document: skill-design.md
Content Outline: content-outline.md
Examples Plan: examples-plan.md

Tasks:
1. **Create Skill File Structure**

   **CRITICAL File Structure:**
   - Directory: `.claude/skills/[category]/[skill-name]/`
   - File: `SKILL.md` (uppercase, exactly this name)

   **Categories:**
   - `practices/` - TDD, BDD, pair programming, code review practices
   - `patterns/` - Design patterns, architectural patterns, coding patterns
   - `languages/` - Python idioms, JavaScript patterns, Go conventions
   - `frameworks/` - React patterns, Django best practices, Spring Boot patterns
   - `tools/` - Git workflows, Docker patterns, Kubernetes best practices
   - `domains/` - Web security, API design, database optimization
   - `meta/` - Agent design, workflow orchestration, plugin architecture

2. **Frontmatter Structure (CRITICAL - Keep Simple)**

   ```yaml
   ---
   name: skill-name
   description: Expertise in [what]. Activate when [when]. [Guidance], ensuring [outcome].
   ---
   ```

   **DO NOT add:**
   - model field
   - tools field
   - activation_context field (this was in my earlier version but wshobson doesn't use it)
   - applicable_agents field
   - categories field
   - ANY other fields

   **ONLY name and description!**

3. **Content Implementation (200-300 lines typical)**

   ## Section 1: Title and Introduction (20-30 lines)
   ```markdown
   # Skill Name

   [1-2 paragraph introduction explaining what this skill covers
   and how it helps agents]
   ```

   ## Section 2: Core Concept (50-75 lines)
   ```markdown
   ## Core Concept / Core Methodology

   [Fundamental principle or approach]

   ### Subsection: [Aspect]

   [Detailed explanation]

   ```language
   // Code example
   ```

   [Explanation]
   ```

   ## Section 3: Best Practices (50-75 lines)
   ```markdown
   ## Best Practices

   ### DO ✅

   ```language
   // Good example
   ```

   - Explanation and benefits

   ### DON'T ❌

   ```language
   // Bad example
   ```

   - Explanation and problems
   ```

   ## Section 4: Application Workflows/Scenarios (40-60 lines)
   ```markdown
   ## Application Workflows

   ### Workflow 1: [Scenario]

   1. Step 1
   2. Step 2

   ```language
   // Code example
   ```

   ### Workflow 2: [Different Scenario]
   [...]
   ```

   ## Section 5: When to Use (20-30 lines)
   ```markdown
   ## When to Use [Skill Name]

   **Use [skill name] for:**
   - ✅ Situation 1
   - ✅ Situation 2

   **[Skill name] Less Critical for:**
   - Optional situation 1
   ```

   ## Section 6: Summary/Remember (20-30 lines)
   ```markdown
   ## Remember

   1. **Key Point 1** - Explanation
   2. **Key Point 2** - Explanation
   3. **Key Point 3** - Explanation

   [Closing statement]
   ```

4. **Code Examples (5+ required, 50-150 lines each)**

   For each example:
   - ✅ DO: Show correct approach with full explanation
   - ❌ DON'T: Show wrong approach with why it fails
   - Use real-world scenarios
   - Include comments explaining key points
   - Multiple languages if applicable
   - Varied complexity (simple, complex, edge cases)

5. **Quality Checklist**
   - [ ] Frontmatter: name and description ONLY
   - [ ] File: `.claude/skills/[category]/[skill-name]/SKILL.md`
   - [ ] 200-300 lines total content
   - [ ] 5+ code examples with DO/DON'T patterns
   - [ ] All code examples include explanations
   - [ ] Clear, actionable guidance throughout
   - [ ] Examples use realistic code (not trivial)
   - [ ] Covers both simple and complex scenarios

Create the complete `.claude/skills/[category]/[skill-name]/SKILL.md` file.
"
```

**Expected Outputs:**
- `.claude/skills/[category]/[skill-name]/SKILL.md` - Complete skill file (200-300 lines)

**Quality Gate: Skill Implementation Validation**
```bash
# Find the skill file
SKILL_FILE=$(find .claude/skills -name "SKILL.md" -type f -newer skill-design.md 2>/dev/null | head -1)

if [ -z "$SKILL_FILE" ]; then
  echo "❌ SKILL.md file not created"
  exit 1
fi

echo "Found skill file: $SKILL_FILE"

# Validate file length (minimum 200 lines)
LINE_COUNT=$(wc -l < "$SKILL_FILE")
if [ "$LINE_COUNT" -lt 200 ]; then
  echo "❌ Skill file too short: $LINE_COUNT lines (minimum 200)"
  exit 1
fi

echo "✅ Skill file length: $LINE_COUNT lines"

# Validate frontmatter (should be simple)
if ! grep -q "^name:" "$SKILL_FILE"; then
  echo "❌ Missing name in frontmatter"
  exit 1
fi

if ! grep -q "^description:" "$SKILL_FILE"; then
  echo "❌ Missing description in frontmatter"
  exit 1
fi

# Check for incorrect fields (should not have model, tools, etc.)
if grep -q "^model:" "$SKILL_FILE"; then
  echo "❌ Skill should not have model field"
  exit 1
fi

if grep -q "^tools:" "$SKILL_FILE"; then
  echo "❌ Skill should not have tools field"
  exit 1
fi

# Validate code examples (minimum 5 DO/DON'T pairs)
DO_COUNT=$(grep -c "✅.*DO:" "$SKILL_FILE" || grep -c "### DO" "$SKILL_FILE" || echo "0")
DONT_COUNT=$(grep -c "❌.*DON'T:" "$SKILL_FILE" || grep -c "### DON'T" "$SKILL_FILE" || echo "0")

if [ "$DO_COUNT" -lt 1 ]; then
  echo "❌ No DO examples found"
  exit 1
fi

if [ "$DONT_COUNT" -lt 1 ]; then
  echo "❌ No DON'T examples found"
  exit 1
fi

echo "✅ Code examples validated: $DO_COUNT DO sections, $DONT_COUNT DON'T sections"

# Validate required sections
REQUIRED_SECTIONS=("Core Concept" "Best Practices" "When to Use" "Remember")
MISSING_SECTIONS=()

for section in "${REQUIRED_SECTIONS[@]}"; do
  if ! grep -qi "## .*$section" "$SKILL_FILE"; then
    MISSING_SECTIONS+=("$section")
  fi
done

if [ ${#MISSING_SECTIONS[@]} -gt 0 ]; then
  echo "❌ Missing required sections: ${MISSING_SECTIONS[*]}"
  exit 1
fi

echo "✅ All required sections present"
echo "✅ Skill implementation validated"
```

**Track Progress:**
```bash
TOKENS_USED=8000

# Store implementation metrics
SKILL_NAME=$(basename "$(dirname "$SKILL_FILE")")
SKILL_CATEGORY=$(basename "$(dirname "$(dirname "$SKILL_FILE")")")

  "Skill implemented: Category=$SKILL_CATEGORY, Lines=$LINE_COUNT" \
  "$(cat "$SKILL_FILE" | head -100)"
```

---

## Phase 4: Testing & Validation (65-85%)

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Validate skill provides value and is not redundant
2. Test code examples are valid and instructive
3. Verify frontmatter is correct (simple structure)
4. Check for overlaps with existing skills
5. Ensure cross-agent applicability

subagent_type: "quality-assurance:test-engineer"
description: "Test skill content and validate quality"
prompt: "Test and validate the newly created skill:

Skill File: $SKILL_FILE
Requirements: $1

Tasks:
1. **Content Quality Validation**

   Verify skill provides:
   - Clear core concept or methodology explanation
   - Practical code examples (not trivial)
   - DO/DON'T patterns with explanations
   - Application scenarios or workflows
   - When to use guidance
   - Key takeaways (Remember section)

   Quality Metrics:
   - Clarity score (1-10)
   - Practicality score (1-10)
   - Example quality score (1-10)

2. **Code Example Validation**

   For each code example:
   - Does it demonstrate a real-world scenario?
   - Is it well-commented and explained?
   - Does the DO example show best practice?
   - Does the DON'T example show actual problem?
   - Are explanations accurate?

   Report examples with issues.

3. **Frontmatter Validation (CRITICAL)**

   **Should have:**
   - ✅ name field (kebab-case)
   - ✅ description field (expertise/activate/outcome pattern)

   **Should NOT have:**
   - ❌ model field
   - ❌ tools field
   - ❌ activation_context field
   - ❌ applicable_agents field
   - ❌ categories field
   - ❌ Any other fields

   If incorrect fields present, this is a CRITICAL error.

4. **File Structure Validation**

   - Directory: `.claude/skills/[category]/[skill-name]/`
   - File: `SKILL.md` (uppercase, not skill.md or Skill.md)
   - Category appropriate for content
   - Directory name matches skill name

5. **Overlap Detection**

   Compare with existing skills in .claude/skills/:
   - Does new skill duplicate existing knowledge?
   - Are there conflicts with existing skills?
   - Should existing skills be updated/consolidated?
   - Is this skill additive or redundant?

   Recommendation:
   - ✅ UNIQUE: No significant overlap, proceed
   - ⚠️  CONSOLIDATE: Merge with skill [name]
   - ❌ REDUNDANT: Reject, use existing skill [name]

6. **Cross-Agent Applicability**

   - Would multiple agent types benefit?
   - Is it too specific to one agent?
   - Does it provide reusable expertise?
   - Is it broadly applicable?

Provide comprehensive testing report with validation results and quality scores.
"
```

**Expected Outputs:**
- `skill-test-report.md` - Complete testing results
- `quality-metrics.txt` - Quality scores
- `overlap-analysis.txt` - Comparison with existing skills

**Quality Gate: Testing Validation**
```bash
if [ ! -f "skill-test-report.md" ]; then
  echo "❌ Testing report missing"
  exit 1
fi

# Check for critical failures
if grep -q "❌ REDUNDANT" skill-test-report.md; then
  echo "❌ Skill is redundant with existing skill"
  EXISTING_SKILL=$(grep "use existing skill" skill-test-report.md | grep -oP '\[.*?\]' | tr -d '[]')
  echo "Use existing skill: $EXISTING_SKILL"
  exit 1
fi

# Check frontmatter validation
if grep -q "CRITICAL.*frontmatter" skill-test-report.md; then
  echo "❌ Frontmatter has incorrect fields"
  exit 1
fi

# Check quality scores (should be >= 7)
CLARITY_SCORE=$(grep "Clarity score" quality-metrics.txt | grep -oP '\d+' | head -1 || echo "0")
if [ "$CLARITY_SCORE" -lt 7 ]; then
  echo "⚠️  Warning: Low clarity score: $CLARITY_SCORE/10"
fi

# Check for consolidation recommendation
if grep -q "⚠️  CONSOLIDATE" skill-test-report.md; then
  echo "⚠️  Warning: Skill should be consolidated with existing skill"
  CONSOLIDATE_WITH=$(grep "⚠️  CONSOLIDATE" skill-test-report.md | grep -oP 'skill \K\[.*?\]' | tr -d '[]' || echo "unknown")
  echo "Consider consolidating with: $CONSOLIDATE_WITH"
fi

echo "✅ Testing validation passed"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store testing metrics
CLARITY_SCORE=$(grep "Clarity score" quality-metrics.txt | grep -oP '\d+' | head -1 || echo "0")
PRACTICALITY_SCORE=$(grep "Practicality score" quality-metrics.txt | grep -oP '\d+' | head -1 || echo "0")

  "Skill tested: Clarity=$CLARITY_SCORE, Practicality=$PRACTICALITY_SCORE" \
  "$(cat skill-test-report.md | head -100)"
```

---

## Phase 5: Integration (85-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the plugin-developer agent to:
1. Count skills and update .claude/plugin.json (if tracked)
2. Increment .claude/VERSION file (MINOR version for new skill)
3. Update .claude/CHANGELOG.md with skill details
4. Validate plugin.json syntax
5. Create integration summary

subagent_type: "meta-development:plugin-developer"
description: "Integrate skill into plugin and update metadata"
prompt: "Integrate the new skill into the orchestr8 plugin:

Skill File: $SKILL_FILE
Skill Name: $SKILL_NAME
Category: $SKILL_CATEGORY
Requirements: $1

Tasks:
1. **Increment VERSION (MINOR bump)**

   File: `.claude/VERSION`

   Increment MINOR version (X.Y.Z -> X.Y+1.0):
   ```bash
   CURRENT_VERSION=\$(cat .claude/VERSION)
   MAJOR=\$(echo \$CURRENT_VERSION | cut -d. -f1)
   MINOR=\$(echo \$CURRENT_VERSION | cut -d. -f2)
   NEW_MINOR=\$((MINOR + 1))
   NEW_VERSION=\"\$MAJOR.\$NEW_MINOR.0\"
   echo \$NEW_VERSION > .claude/VERSION
   echo \"Version updated: \$CURRENT_VERSION -> \$NEW_VERSION\"
   ```

2. **Update plugin.json**

   File: `.claude/plugin.json`

   Update version to match VERSION file:
   ```bash
   NEW_VERSION=\$(cat .claude/VERSION)
   jq \".version = \\\"\$NEW_VERSION\\\"\" .claude/plugin.json > tmp.json && mv tmp.json .claude/plugin.json
   ```

   **Note:** Skills may not have explicit count in plugin.json yet. That's OK.

3. **Update CHANGELOG.md**

   File: `.claude/CHANGELOG.md`

   Add new section at top:
   ```markdown
   ## [\$NEW_VERSION] - \$(date +%Y-%m-%d)

   ### 📚 New Skill

   **\$SKILL_CATEGORY/\$SKILL_NAME**
   - [Brief description from frontmatter]
   - [Key benefit 1]
   - [Key benefit 2]
   - [Key benefit 3]

   **Provides:**
   - Core concept explanation
   - Best practices with DO/DON'T examples
   - [Number] detailed code examples
   - Application workflows and scenarios
   - When to use guidance
   ```

4. **Validate Integration**

   Run validation checks:
   ```bash
   # Check VERSION and plugin.json match
   VERSION_FILE=\$(cat .claude/VERSION)
   VERSION_JSON=\$(jq -r '.version' .claude/plugin.json)

   if [ \"\$VERSION_FILE\" != \"\$VERSION_JSON\" ]; then
     echo \"❌ Version mismatch: VERSION=\$VERSION_FILE, plugin.json=\$VERSION_JSON\"
     exit 1
   fi

   # Count skills
   ACTUAL_SKILLS=\$(find .claude/skills -name \"SKILL.md\" -type f | wc -l)

   # Validate plugin.json is valid JSON
   if ! jq empty .claude/plugin.json 2>/dev/null; then
     echo \"❌ plugin.json is not valid JSON\"
     exit 1
   fi

   echo \"✅ Integration validated\"
   echo \"Version: \$VERSION_FILE\"
   echo \"Total skills: \$ACTUAL_SKILLS\"
   ```

5. **Create Integration Summary**

   Generate summary document:
   ```markdown
   # Skill Integration Summary

   **Skill:** \$SKILL_CATEGORY/\$SKILL_NAME
   **Version:** \$NEW_VERSION
   **Created:** \$(date)

   ## File Locations
   - Skill file: \$SKILL_FILE
   - Category: \$SKILL_CATEGORY
   - Lines: \$LINE_COUNT

   ## Content Summary
   [From skill file]

   ## Quality Metrics
   - Clarity Score: \$CLARITY_SCORE/10
   - Practicality Score: \$PRACTICALITY_SCORE/10

   ## Next Steps
   - ✅ Skill file created and validated
   - ✅ Plugin metadata updated
   - ✅ VERSION incremented to \$NEW_VERSION
   - ✅ CHANGELOG updated
   - Ready for commit and testing
   ```

Provide integration summary with validation results.
"
```

**Expected Outputs:**
- Updated `.claude/plugin.json` with new version
- Updated `.claude/VERSION` with incremented MINOR version
- Updated `.claude/CHANGELOG.md` with skill details
- `integration-summary.md` - Complete integration report

**Quality Gate: Integration Validation**
```bash
# Validate VERSION and plugin.json sync
VERSION_FILE=$(cat .claude/VERSION)
VERSION_JSON=$(jq -r '.version' .claude/plugin.json)

if [ "$VERSION_FILE" != "$VERSION_JSON" ]; then
  echo "❌ Version mismatch: VERSION=$VERSION_FILE, plugin.json=$VERSION_JSON"
  exit 1
fi

# Validate CHANGELOG has new entry
if ! grep -q "\[$VERSION_FILE\]" .claude/CHANGELOG.md; then
  echo "❌ CHANGELOG not updated with version $VERSION_FILE"
  exit 1
fi

# Validate plugin.json is valid JSON
if ! jq empty .claude/plugin.json 2>/dev/null; then
  echo "❌ plugin.json is not valid JSON"
  exit 1
fi

echo "✅ Integration validated"
echo "Version: $VERSION_FILE"
```

**Track Progress:**
```bash
TOKENS_USED=3000

# Store integration results
  "Skill integrated: Version=$VERSION_FILE" \
  "$(cat integration-summary.md)"
```

---

## Workflow Complete

```bash
# Mark workflow complete

# Display final metrics
echo ""
echo "=========================================="
echo "✅ SKILL CREATION COMPLETE"
echo "=========================================="
echo ""
echo "Skill: $SKILL_CATEGORY/$SKILL_NAME"
echo "Version: $VERSION_FILE"
echo "File: $SKILL_FILE"
echo "Lines: $LINE_COUNT"
echo ""
echo "Quality Metrics:"
echo "  - Clarity Score: $CLARITY_SCORE/10"
echo "  - Practicality Score: $PRACTICALITY_SCORE/10"
echo ""
echo "Token Usage:"
echo "  - Total Tokens: $TOTAL_TOKENS"
echo "  - Avg per Phase: $((TOTAL_TOKENS / 5))"
echo ""
echo "Next Steps:"
echo "  1. Review skill file: $SKILL_FILE"
echo "  2. Test skill in real scenarios"
echo "  3. Commit: git add . && git commit -m 'feat: add $SKILL_NAME skill'"
echo "  4. Monitor skill effectiveness"
echo ""
echo "=========================================="
```

---

## Success Criteria Checklist

Skill creation is complete when:

- ✅ **Skill validated as appropriate** (not better as agent)
- ✅ **Skill file created** (200-300 lines typical)
- ✅ **Frontmatter correct** (name and description ONLY)
- ✅ **File structure correct** (`.claude/skills/[category]/[skill-name]/SKILL.md`)
- ✅ **Core concept explained** clearly
- ✅ **Best practices included** with DO/DON'T patterns
- ✅ **Code examples provided** (5+ examples)
- ✅ **Application scenarios** or workflows documented
- ✅ **When to use guidance** included
- ✅ **Remember/summary section** present
- ✅ **No redundancy** with existing skills
- ✅ **Cross-agent applicability** confirmed
- ✅ **VERSION incremented** (MINOR version)
- ✅ **plugin.json updated** with new version
- ✅ **Version files synchronized** (VERSION == plugin.json version)
- ✅ **CHANGELOG updated** with skill details
- ✅ **All quality gates passed**

---

## Notes

- Skills have simple frontmatter: name and description ONLY
- Skills are auto-activated based on context (no explicit invocation)
- Skills provide knowledge and patterns, not executable actions
- Skills augment multiple agents' capabilities
- File must be named `SKILL.md` (uppercase) in `.claude/skills/[category]/[skill-name]/` directory
- Version bumps are always MINOR for new skills (X.Y.Z -> X.Y+1.0)
- Skills reduce token usage by codifying common patterns
- Good skills save 80-90% of tokens vs explaining each time
- Follow wshobson/agents patterns for consistency
- **This workflow makes the orchestr8 plugin self-extending with reusable expertise!**
