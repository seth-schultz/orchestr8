---
description: Create new orchestration workflow with phase design, quality gates, and comprehensive documentation
argument-hint: [workflow-requirements-or-description]
model: claude-haiku-4-5-20251001
---

# Create Workflow

Autonomous workflow for creating new orchestration workflows with comprehensive phase design, quality gates, and plugin integration.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting Create Workflow Workflow"
echo "Requirements: $1"
echo "Workflow ID: $workflow_id"

# Query similar workflow patterns
```

---

## Phase 1: Requirements Analysis (0-20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the workflow-architect agent to:
1. Extract workflow specifications from user requirements
2. Identify workflow type (feature development, bug fixing, audit, deployment, optimization)
3. Assess complexity (simple/moderate/complex)
4. Determine required agents and quality gates
5. Research similar workflows for patterns

subagent_type: "meta-development:workflow-architect"
description: "Analyze requirements for new workflow"
prompt: "Analyze requirements for creating a new workflow:

Requirements: $1

Tasks:
1. **Extract Specifications**
   - What end-to-end process does this automate?
   - What are the inputs (arguments)?
   - What are the outputs (deliverables)?
   - What agents are needed?
   - What quality gates are required?

2. **Complexity Assessment**
   - Simple: 3-4 phases, 1-2 agents
   - Moderate: 5-7 phases, 3-5 agents
   - Complex: 8+ phases, 5+ agents, orchestrator needed

3. **Workflow Type Identification**
   - Feature Development: analysis → implement → test → deploy
   - Bug Fixing: triage → root cause → fix → test → deploy
   - Audit/Review: scan → review → report → remediate
   - Deployment: validate → stage → deploy → monitor → rollback
   - Optimization: profile → strategy → optimize → benchmark

4. **Research Similar Workflows**
   \`\`\`bash
   find /Users/seth/Projects/orchestr8/.claude/commands -name '*.md' | head -10
   \`\`\`

Expected outputs:
- Workflow specifications document
- Complexity assessment
- Workflow type identification
- List of required agents
- Quality gates needed
"
```

**Expected Outputs:**
- Workflow specifications document
- Complexity and type assessment
- Agent requirements list
- Quality gates list

**Quality Gate: Requirements Validation**
```bash
# Validate requirements provided
if [ -z "$1" ]; then
  echo "❌ Workflow requirements not provided"
  exit 1
fi

echo "✅ Requirements analyzed"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store requirements
  "Requirements for new workflow" \
  "Type: [identified], Complexity: [assessed], Agents: [list]"
```

---

## Phase 2: Workflow Design (20-45%)

**⚡ EXECUTE TASK TOOL:**
```
Use the workflow-architect agent to:
1. Design frontmatter with description and argument-hint
2. Break down workflow into phases (4-8 phases totaling 100%)
3. Design agent coordination strategy (sequential/parallel/conditional)
4. Design quality gates with pass/fail criteria
5. Define 8-12 specific success criteria

subagent_type: "meta-development:workflow-architect"
description: "Design workflow architecture and phases"
prompt: "Design the complete workflow architecture:

Based on Phase 1 requirements, create:

1. **Frontmatter Design**
   \`\`\`yaml
   ---
   description: [Action verb] [scope] with [capabilities] - [benefits]
   argument-hint: \"[argument-format or description]\"
   ---
   \`\`\`

2. **Phase Breakdown** (must total 100%)
   - Determine number of phases (typically 4-8)
   - Assign percentage to each phase
   - Define clear phase objectives

   Examples:
   - Feature: Analysis (20%), Implementation (50%), Quality Gates (20%), Deployment (10%)
   - Bug Fix: Triage (15%), Root Cause (20%), Implementation (25%), Testing (25%), Deployment (15%)
   - Audit: Reconnaissance (15%), Scan (30%), Review (25%), Report (20%), Remediation (10%)

3. **Agent Coordination Design**
   - Sequential: When dependencies exist
   - Parallel: When tasks are independent
   - Conditional: Based on workflow specifics
   - Orchestrator: For complex coordination

4. **Quality Gates Design**
   - Code Review (code-reviewer)
   - Testing (test-engineer)
   - Security (security-auditor)
   - Performance (performance-analyzer) if applicable
   - **All gates must PASS** - no escape hatches

5. **Success Criteria** (8-12 specific, measurable criteria)
   - Cover all aspects
   - Measurable and verifiable
   - Use ✅ checkbox format

Expected outputs:
- Complete workflow design document
- Phase breakdown with percentages
- Agent coordination strategy
- Quality gates specification
- Success criteria list (8-12 items)
"
```

**Expected Outputs:**
- `workflow-design.md` - Complete workflow design
- Phase breakdown (totaling 100%)
- Agent coordination strategy
- Quality gates specification
- Success criteria list

**Quality Gate: Design Validation**
```bash
# Validate design document exists
if [ ! -f "workflow-design.md" ]; then
  echo "❌ Workflow design document missing"
  exit 1
fi

# Validate phases total 100%
# (Manual validation - check design document)

echo "✅ Workflow design validated"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store design patterns
  "Workflow design architecture" \
  "$(head -n 50 workflow-design.md)"
```

---

## Phase 3: Implementation (45-75%)

**⚡ EXECUTE TASK TOOL:**
```
Use the plugin-developer agent to:
1. Create workflow markdown file in .claude/commands/
2. Implement frontmatter with description and argument-hint
3. Write Intelligence Database integration section
4. Implement all phases with explicit Task tool patterns
5. Add quality gates with bash validation
6. Include success criteria checklist
7. Add usage examples and anti-patterns

subagent_type: "meta-development:plugin-developer"
description: "Implement workflow markdown file"
prompt: "Implement the complete workflow file:

Based on workflow-design.md, create:

1. **File Location**: /Users/seth/Projects/orchestr8/.claude/commands/[workflow-name].md
   - Use kebab-case for filename
   - Extract workflow name from requirements

2. **Frontmatter** (from design):
   \`\`\`yaml
   ---
   description: [from design]
   argument-hint: \"[from design]\"
   ---
   \`\`\`

3. **Intelligence Database Integration**:
   \`\`\`bash
   \`\`\`

4. **Each Phase Structure**:
   \`\`\`markdown
   ## Phase N: Phase Name (X-Y%)

   **⚡ EXECUTE TASK TOOL:**
   \`\`\`
   Use the [agent-name] agent to:
   1. Specific deliverable
   2. Specific deliverable

   subagent_type: \"agent-name\"
   description: \"Brief 5-10 word description\"
   prompt: \"Detailed instructions...

   Expected outputs:
   - File 1
   - File 2
   \"
   \`\`\`

   **Expected Outputs:**
   - \`file1.md\` - Description
   - \`file2.json\` - Description

   **Quality Gate: Gate Name**
   \`\`\`bash
   if [ ! -f \"required-file\" ]; then
     echo \"❌ Phase failed\"
     exit 1
   fi
   echo \"✅ Phase validated\"
   \`\`\`

   **Track Progress:**
   \`\`\`bash
   TOKENS_USED=3000
   \`\`\`
   \`\`\`

5. **Workflow Completion Section**:
   \`\`\`bash
   \`\`\`

6. **Success Criteria Checklist** (from design, 8-12 items)

7. **Usage Examples** (2+ real-world examples)

8. **Anti-Patterns** (DO/DON'T lists)

Expected outputs:
- Complete workflow file (200-400 lines typical)
"
```

**Expected Outputs:**
- `/Users/seth/Projects/orchestr8/.claude/commands/[workflow-name].md` - Complete workflow file

**Quality Gate: Implementation Validation**
```bash
# Determine workflow name (simplified - extract from requirements)
WORKFLOW_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | head -c 30)
WORKFLOW_FILE="/Users/seth/Projects/orchestr8/.claude/commands/${WORKFLOW_NAME}.md"

# Validate workflow file exists
if [ ! -f "$WORKFLOW_FILE" ]; then
  echo "❌ Workflow file not created at $WORKFLOW_FILE"
  exit 1
fi

# Validate frontmatter
if ! grep -q "^---$" "$WORKFLOW_FILE"; then
  echo "❌ Invalid frontmatter structure"
  exit 1
fi

# Validate database integration
  echo "❌ Missing database integration"
  exit 1
fi

# Validate Task tool patterns
if ! grep -q "⚡ EXECUTE TASK TOOL" "$WORKFLOW_FILE"; then
  echo "❌ Missing explicit Task tool patterns"
  exit 1
fi

# Check file length
LINE_COUNT=$(wc -l < "$WORKFLOW_FILE")
if [ "$LINE_COUNT" -lt 100 ]; then
  echo "❌ Workflow file too short: $LINE_COUNT lines"
  exit 1
fi

echo "✅ Workflow implementation validated ($LINE_COUNT lines)"
```

**Track Progress:**
```bash
TOKENS_USED=8000

# Store implementation
  "Implementation of workflow with $(wc -l < \"$WORKFLOW_FILE\") lines" \
  "$(head -n 100 \"$WORKFLOW_FILE\")"
```

---

## Phase 4: Integration (75-90%)

**⚡ EXECUTE TASK TOOL:**
```
Use the plugin-developer agent to:
1. Update plugin.json with new workflow count
2. Increment VERSION file (MINOR version)
3. Add workflow to README.md if applicable
4. Update CHANGELOG.md with workflow details
5. Verify all integration points

subagent_type: "meta-development:plugin-developer"
description: "Integrate workflow into plugin"
prompt: "Integrate the new workflow into the Claude Code plugin:

Workflow file: $WORKFLOW_FILE

Integration tasks:

1. **Update plugin.json**
   - Increment features.workflows count
   - Path: /Users/seth/Projects/orchestr8/.claude/plugin.json
   - Current count: [read and increment]

2. **Update VERSION file**
   - Increment MINOR version (X.Y.Z -> X.Y+1.0)
   - Path: /Users/seth/Projects/orchestr8/.claude/VERSION
   - Current version: [read current]
   - New version: [increment minor, reset patch]

3. **Update README.md** (if major workflow)
   - Add workflow to usage guide
   - Include brief description
   - Path: /Users/seth/Projects/orchestr8/README.md

4. **Update CHANGELOG.md**
   - Add entry for new workflow
   - Include capabilities and use cases
   - Path: /Users/seth/Projects/orchestr8/.claude/CHANGELOG.md
   - Format:
     \`\`\`markdown
     ### 🔄 Workflows
     - **/workflow-name** - Description
       - Capability 1
       - Capability 2
       - Use case
     \`\`\`

5. **Verify Integration**
   - Check all files updated correctly
   - Validate version consistency
   - Ensure documentation complete

Expected outputs:
- Updated plugin.json
- Updated VERSION
- Updated README.md (if applicable)
- Updated CHANGELOG.md
"
```

**Expected Outputs:**
- `/Users/seth/Projects/orchestr8/.claude/plugin.json` - Updated workflow count
- `/Users/seth/Projects/orchestr8/.claude/VERSION` - Incremented version
- `/Users/seth/Projects/orchestr8/README.md` - Updated (if applicable)
- `/Users/seth/Projects/orchestr8/.claude/CHANGELOG.md` - Workflow documented

**Quality Gate: Integration Validation**
```bash
# Read new version
NEW_VERSION=$(cat /Users/seth/Projects/orchestr8/.claude/VERSION)

# Validate plugin.json updated
if ! grep -q "\"workflows\": [0-9]" /Users/seth/Projects/orchestr8/.claude/plugin.json; then
  echo "❌ plugin.json not updated"
  exit 1
fi

# Validate VERSION file
if [ -z "$NEW_VERSION" ]; then
  echo "❌ VERSION file not updated"
  exit 1
fi

# Validate CHANGELOG updated
WORKFLOW_BASENAME=$(basename "$WORKFLOW_FILE" .md)
if ! grep -q "$WORKFLOW_BASENAME" /Users/seth/Projects/orchestr8/.claude/CHANGELOG.md; then
  echo "❌ CHANGELOG not updated"
  exit 1
fi

echo "✅ Integration validated (version: $NEW_VERSION)"
```

**Track Progress:**
```bash
TOKENS_USED=3000

# Store integration info
  "Integration at version $NEW_VERSION" \
  "Version: $NEW_VERSION, Workflow: /$WORKFLOW_BASENAME"
```

---

## Phase 5: Testing & Documentation (90-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Test workflow invocation with sample input
2. Validate workflow delegation works correctly
3. Test quality gates can fail appropriately
4. Create workflow usage documentation
5. Generate test report

subagent_type: "orchestr8:quality:test-engineer"
description: "Test and document new workflow"
prompt: "Test the newly created workflow:

Workflow file: $WORKFLOW_FILE
Workflow command: /$WORKFLOW_BASENAME

Testing requirements:

1. **Invocation Test**
   - Test workflow can be invoked via slash command
   - Verify delegation to appropriate agents
   - Check error handling

2. **Quality Gate Tests**
   - Validate quality gates can fail workflow
   - Test rollback on failure
   - Verify exit codes

3. **Database Integration Tests**

4. **Documentation**
   - Create usage guide: workflow-usage-$WORKFLOW_BASENAME.md
   - Include invocation examples
   - Document expected behavior
   - Troubleshooting guide

Expected outputs:
- test-report-$WORKFLOW_BASENAME.md
- workflow-usage-$WORKFLOW_BASENAME.md
"
```

**Expected Outputs:**
- `test-report-[workflow-name].md` - Test results
- `workflow-usage-[workflow-name].md` - Usage documentation

**Quality Gate: Testing Validation**
```bash
# Validate test report exists
if [ ! -f "test-report-$WORKFLOW_BASENAME.md" ]; then
  echo "❌ Test report missing"
  exit 1
fi

# Validate usage documentation
if [ ! -f "workflow-usage-$WORKFLOW_BASENAME.md" ]; then
  echo "❌ Usage documentation missing"
  exit 1
fi

echo "✅ Testing and documentation complete"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store test results
  "Test results for workflow" \
  "$(head -n 50 \"test-report-$WORKFLOW_BASENAME.md\")"
```

---

## Workflow Complete

```bash
# Complete workflow tracking
WORKFLOW_END=$(date +%s)

  "Workflow created: /$WORKFLOW_BASENAME at version $NEW_VERSION"

echo "
✅ CREATE WORKFLOW COMPLETE

Workflow Created: /$WORKFLOW_BASENAME
Version: $NEW_VERSION
File: $WORKFLOW_FILE

Files Created:
- $WORKFLOW_FILE
- workflow-design.md
- test-report-$WORKFLOW_BASENAME.md
- workflow-usage-$WORKFLOW_BASENAME.md

Files Updated:
- /Users/seth/Projects/orchestr8/.claude/plugin.json
- /Users/seth/Projects/orchestr8/.claude/VERSION
- /Users/seth/Projects/orchestr8/.claude/CHANGELOG.md

Next Steps:
1. Review test-report-$WORKFLOW_BASENAME.md
2. Test workflow: /$WORKFLOW_BASENAME \"[test input]\"
3. Review workflow-usage-$WORKFLOW_BASENAME.md
4. Commit changes: git add . && git commit -m 'feat: add /$WORKFLOW_BASENAME workflow'
5. Create PR for review
"

# Display metrics
```

## Success Criteria Checklist

- ✅ Requirements analyzed and workflow type identified
- ✅ Workflow designed with phases totaling 100%
- ✅ Agent assignments specific and appropriate
- ✅ Quality gates included and mandatory
- ✅ Workflow file created with explicit Task patterns
- ✅ Database integration included
- ✅ Success criteria defined (8-12 items)
- ✅ Usage examples provided (2+ examples)
- ✅ Anti-patterns documented
- ✅ Plugin metadata updated
- ✅ VERSION incremented (MINOR bump)
- ✅ CHANGELOG.md updated
- ✅ Testing completed
- ✅ Usage documentation created
- ✅ Workflow ready for use via /workflow-name

## Workflow Type Patterns

**Feature Development:**
- Analysis & Design (20%) → Implementation (50%) → Quality Gates (20%) → Deployment (10%)

**Bug Fixing:**
- Triage & Reproduction (15%) → Root Cause (20%) → Implementation (25%) → Testing (25%) → Deployment (15%)

**Audit/Review:**
- Reconnaissance (15%) → Scan (30%) → Review (25%) → Report (20%) → Remediation (10%)

**Deployment:**
- Validation (20%) → Staging (15%) → Production (30%) → Post-Deployment (20%) → Monitoring (15%)

**Optimization:**
- Profiling (20%) → Strategy (15%) → Implementation (40%) → Benchmarking (15%) → Documentation (10%)
