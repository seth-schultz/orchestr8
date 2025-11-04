---
description: Complete agent creation lifecycle from requirements to integration with automated validation and plugin metadata updates
argumentHint: "[agent-requirements-description]"
---

# Create Agent Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the agent-architect using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "agent-architect"
- description: "Create new specialized agent with validation"
- prompt: "Execute the create-agent workflow for: [user's agent requirements].

Create a complete new agent:
1. Analyze requirements and determine agent specifications (20%)
2. Design agent with appropriate tools, model, and documentation structure (25%)
3. Implement agent file with frontmatter and comprehensive instructions (25%)
4. Validate agent design and test invocation (15%)
5. Update plugin.json metadata and VERSION (10%)
6. Update CHANGELOG.md with agent addition (5%)

Follow all phases, enforce quality gates, and meet all success criteria."
```

**After delegation:**
- The agent-architect will handle entire agent creation autonomously
- Returns to main context when complete or if user input required

---

## Agent Creation Instructions for Orchestrator

You are orchestrating the complete creation of a new Claude Code agent from requirements analysis to plugin integration.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting Create Agent Workflow"
echo "Requirements: $1"
echo "Workflow ID: $workflow_id"

# Query similar agent patterns
```

---

## Phase 1: Requirements Analysis (0-20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the agent-architect agent to:
1. Extract agent specifications from user requirements
2. Identify domain and specialty area
3. Determine appropriate category placement
4. Research similar agents in the same category
5. Ensure no duplicate agents exist
6. Select appropriate model (Opus vs Sonnet)
7. Determine required tools for agent type

subagent_type: "agent-architect"
description: "Analyze requirements for new agent"
prompt: "Analyze requirements for creating a new agent:

Requirements: $1

Tasks:

1. **Extract Agent Specifications**
   - What is the agent's domain? (language, framework, infrastructure, quality, etc.)
   - What is the primary specialty?
   - What are the key use cases?
   - What technical capabilities are needed?

2. **Category Determination**
   - Language specialist → development/languages/
   - Framework specialist → development/frontend/, development/api/, etc.
   - Game engine → development/game-engines/
   - AI/ML framework → development/ai-ml/
   - Blockchain → development/blockchain/
   - Quality assurance → quality/
   - Infrastructure → infrastructure/databases/, infrastructure/messaging/, etc.
   - DevOps → devops/cloud/, devops/infrastructure/
   - Compliance → compliance/
   - Meta-system → meta/

3. **Research Similar Agents**
   \`\`\`bash
   # Find agents in the same category
   find /Users/seth/Projects/orchestr8/.claude/agents/[determined-category] -name '*.md' | head -5

   # Read one similar agent as pattern
   cat /Users/seth/Projects/orchestr8/.claude/agents/[category]/[similar-agent].md
   \`\`\`

4. **Model Selection**
   - **Opus 4**: Meta-orchestrators only (project-orchestrator, feature-orchestrator)
   - **Sonnet 4.5**: ALL specialized agents (default)

5. **Tool Requirements**
   - **Technical Specialists**: Read, Write, Edit, Bash, Glob, Grep
   - **Quality/Review Agents**: Read, Glob, Grep, Bash (NO Write/Edit)
   - **Orchestrators**: Task, Read, Write, Bash, Glob, Grep, TodoWrite
   - **Compliance Agents**: Read, Write, Edit, Bash, Glob, Grep, Task

6. **Validate No Duplicates**
   \`\`\`bash
   # Search for similar agent names
   find /Users/seth/Projects/orchestr8/.claude/agents -name '*[keyword]*.md'
   \`\`\`

Expected outputs:
- Agent specifications document (agent-specs.md)
- Category placement determination
- Model selection (Opus/Sonnet)
- Tool list appropriate for agent type
- List of similar agents for reference
- Confirmation no duplicates exist
"
```

**Expected Outputs:**
- `agent-specs.md` - Complete agent specifications
- Category placement identified
- Model selection justified
- Tool list defined
- Similar agents identified

**Quality Gate: Requirements Validation**
```bash
# Validate requirements provided
if [ -z "$1" ]; then
  echo "❌ Agent requirements not provided"
  exit 1
fi

# Validate agent-specs document exists
if [ ! -f "agent-specs.md" ]; then
  echo "❌ Agent specifications document missing"
  exit 1
fi

echo "✅ Requirements analyzed and validated"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store requirements
  "Requirements for new agent" \
  "$(cat agent-specs.md)"
```

---

## Phase 2: Agent Design (20-45%)

**⚡ EXECUTE TASK TOOL:**
```
Use the agent-architect agent to:
1. Design frontmatter with all required fields
2. Design documentation structure (sections and content)
3. Plan code examples (5-10 for technical agents)
4. Design best practices (DO/DON'T lists)
5. Plan testing patterns section
6. Design closing deliverables statement

subagent_type: "agent-architect"
description: "Design complete agent architecture"
prompt: "Design the complete agent architecture:

Based on agent-specs.md, create agent design:

1. **Frontmatter Design**
   \`\`\`yaml
   ---
   name: agent-name  # kebab-case
   description: Expert [role] specializing in [capabilities]. Use when [use cases]. (subagent_type in Task tool)
   model: claude-sonnet-4-5  # or claude-opus-4 for orchestrators
   tools:
     - Read
     - Write
     - Edit
     - Bash
     - Glob
     - Grep
   ---
   \`\`\`

2. **Documentation Structure**
   - Title: # Agent Name
   - Introduction paragraph
   - Core Competencies (bullet list of 5-10 capabilities)
   - Development Standards (for technical agents)
   - Implementation Examples (5-10 detailed code examples)
   - Testing Patterns (testing approaches and examples)
   - Best Practices (DO/DON'T with explanations)
   - Closing Statement (deliverables expectations)

3. **Code Examples Planning**
   - Identify 5-10 key scenarios
   - Plan 50-200 lines per example
   - Include comments explaining patterns
   - Cover common use cases
   - Show best practices in action

4. **Best Practices Design**
   - 5-10 DO items with explanations
   - 5-10 DON'T items with explanations
   - Common pitfalls to avoid
   - Success patterns

5. **Testing Patterns**
   - Unit testing approaches
   - Integration testing patterns
   - Test organization
   - Coverage expectations

6. **Quality Checklist**
   - File should be 300-500 lines for technical specialists
   - File should be 200-300 lines for review/quality agents
   - File should be 400-600 lines for orchestrators

Expected outputs:
- agent-design.md with complete structure
- Code examples outline (5-10 examples)
- Best practices outline
- Testing patterns outline
"
```

**Expected Outputs:**
- `agent-design.md` - Complete agent design document
- Code examples outline
- Best practices structure
- Testing patterns plan

**Quality Gate: Design Validation**
```bash
# Validate design document exists
if [ ! -f "agent-design.md" ]; then
  echo "❌ Agent design document missing"
  exit 1
fi

# Validate design has all sections
required_sections=("Frontmatter" "Core Competencies" "Examples" "Best Practices" "Testing")
for section in "${required_sections[@]}"; do
  if ! grep -qi "$section" agent-design.md; then
    echo "❌ Missing section: $section"
    exit 1
  fi
done

echo "✅ Agent design validated"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store design patterns
  "Agent design architecture" \
  "$(head -n 50 agent-design.md)"
```

---

## Phase 3: Implementation (45-70%)

**⚡ EXECUTE TASK TOOL:**
```
Use the agent-architect agent to:
1. Create agent markdown file in correct category directory
2. Implement frontmatter with all required fields
3. Write title and introduction
4. Write Core Competencies section
5. Write Development Standards (for technical agents)
6. Implement 5-10 detailed code examples
7. Write Testing Patterns section
8. Write Best Practices (DO/DON'T) section
9. Write closing deliverables statement

subagent_type: "agent-architect"
description: "Implement complete agent file"
prompt: "Implement the complete agent markdown file:

Based on agent-design.md, create the agent file:

1. **Determine File Path**
   - Category from agent-specs.md
   - Filename: kebab-case agent name
   - Path: /Users/seth/Projects/orchestr8/.claude/agents/[category]/[subcategory]/[agent-name].md

2. **Implement Frontmatter** (from design):
   \`\`\`yaml
   ---
   name: agent-name
   description: [from design]
   model: [from design]
   tools:
     - [tools from design]
   ---
   \`\`\`

3. **Write Introduction**
   - Agent title (# Agent Name)
   - 1-2 paragraph introduction
   - Primary responsibilities
   - When to use this agent

4. **Core Competencies Section**
   \`\`\`markdown
   ## Core Competencies

   - Competency 1 with brief description
   - Competency 2 with brief description
   - [5-10 total competencies]
   \`\`\`

5. **Development Standards** (technical agents only)
   - Code quality standards
   - Architecture patterns
   - Performance considerations
   - Security requirements

6. **Implementation Examples**
   - 5-10 detailed code examples
   - 50-200 lines per example
   - Well-commented code
   - Cover key use cases
   - Use markdown code blocks with language

7. **Testing Patterns**
   - Unit testing approach
   - Integration testing
   - Test organization
   - Example test code

8. **Best Practices**
   \`\`\`markdown
   ## Best Practices

   ### DO ✅
   - Practice 1 with explanation
   - Practice 2 with explanation
   - [5-10 DO items]

   ### DON'T ❌
   - Anti-pattern 1 with explanation
   - Anti-pattern 2 with explanation
   - [5-10 DON'T items]
   \`\`\`

9. **Closing Statement**
   \"Your deliverables should be [quality attributes: production-ready, well-tested, secure, performant, maintainable, well-documented].\"

Expected outputs:
- Complete agent file (300-500 lines for specialists)
- All sections implemented
- 5-10 code examples included
- Best practices documented
"
```

**Expected Outputs:**
- `/Users/seth/Projects/orchestr8/.claude/agents/[category]/[agent-name].md` - Complete agent file

**Quality Gate: Implementation Validation**
```bash
# Determine agent name and path from specs
AGENT_NAME=$(grep "^name:" agent-design.md | head -1 | cut -d':' -f2 | tr -d ' ')
CATEGORY=$(grep "Category:" agent-specs.md | head -1 | cut -d':' -f2 | tr -d ' ')

# Find the agent file
AGENT_FILE=$(find /Users/seth/Projects/orchestr8/.claude/agents -name "${AGENT_NAME}.md" | head -1)

# Validate agent file exists
if [ ! -f "$AGENT_FILE" ]; then
  echo "❌ Agent file not created"
  exit 1
fi

# Validate frontmatter
if ! grep -q "^---$" "$AGENT_FILE"; then
  echo "❌ Invalid frontmatter structure"
  exit 1
fi

# Validate required frontmatter fields
required_fields=("name:" "description:" "model:" "tools:")
for field in "${required_fields[@]}"; do
  if ! grep -q "^$field" "$AGENT_FILE"; then
    echo "❌ Missing frontmatter field: $field"
    exit 1
  fi
done

# Validate content sections
if ! grep -q "## Core Competencies" "$AGENT_FILE"; then
  echo "❌ Missing Core Competencies section"
  exit 1
fi

if ! grep -q "## Best Practices" "$AGENT_FILE"; then
  echo "❌ Missing Best Practices section"
  exit 1
fi

# Check file length
LINE_COUNT=$(wc -l < "$AGENT_FILE")
if [ "$LINE_COUNT" -lt 200 ]; then
  echo "❌ Agent file too short: $LINE_COUNT lines (minimum 200)"
  exit 1
fi

echo "✅ Agent implementation validated ($LINE_COUNT lines)"
```

**Track Progress:**
```bash
TOKENS_USED=8000

# Store implementation
  "Implementation of agent with $(wc -l < \"$AGENT_FILE\") lines" \
  "$(head -n 100 \"$AGENT_FILE\")"
```

---

## Phase 4: Validation (70-85%)

**⚡ EXECUTE TASK TOOL:**
```
Use the agent-architect agent to:
1. Validate frontmatter completeness and correctness
2. Validate name matches filename
3. Validate description follows pattern
4. Validate model selection appropriate
5. Validate tools correctly selected for agent type
6. Validate content quality and completeness
7. Validate file placement in correct category
8. Test agent can be loaded (YAML valid)

subagent_type: "agent-architect"
description: "Validate agent implementation quality"
prompt: "Validate the implemented agent:

Agent file: $AGENT_FILE

Validation tasks:

1. **Frontmatter Validation**
   \`\`\`bash
   # Extract and validate frontmatter
   sed -n '/^---$/,/^---$/p' \"$AGENT_FILE\"

   # Check required fields
   grep -E '^(name|description|model|tools):' \"$AGENT_FILE\"
   \`\`\`

   Verify:
   - name: Matches filename (kebab-case)
   - description: Follows pattern \"Expert [role]... Use when...\"
   - model: claude-sonnet-4-5 or claude-opus-4
   - tools: Appropriate for agent type

2. **Content Quality Validation**
   - Core Competencies section present (5-10 items)
   - Implementation examples present (5+ for technical agents)
   - Best Practices section present (DO/DON'T)
   - Testing Patterns section present
   - Closing statement present
   - Appropriate detail level (300-500 lines for specialists)

3. **File Placement Validation**
   - Correct category directory
   - Kebab-case filename
   - No naming conflicts

   \`\`\`bash
   # Verify no duplicate names
   find /Users/seth/Projects/orchestr8/.claude/agents -name \"$(basename \"$AGENT_FILE\")\" | wc -l
   \`\`\`

4. **YAML Validation**
   - Frontmatter is valid YAML
   - No syntax errors
   - File is readable

Expected outputs:
- validation-report.md with all checks
- List of any issues found
- Confirmation agent is ready
"
```

**Expected Outputs:**
- `validation-report.md` - Complete validation results
- Issues list (should be empty)
- Confirmation of readiness

**Quality Gate: Validation Check**
```bash
# Validate validation report exists
if [ ! -f "validation-report.md" ]; then
  echo "❌ Validation report missing"
  exit 1
fi

# Check if validation passed
if grep -qi "failed\|error" validation-report.md; then
  echo "❌ Validation found issues"
  cat validation-report.md
  exit 1
fi

echo "✅ All validations passed"
```

**Track Progress:**
```bash
TOKENS_USED=3000

# Store validation results
  "Validation results for agent" \
  "$(cat validation-report.md)"
```

---

## Phase 5: Plugin Metadata Update (85-95%)

**⚡ EXECUTE TASK TOOL:**
```
Use the plugin-developer agent to:
1. Count total agents in the system
2. Update VERSION file (increment MINOR version)
3. Update plugin.json with new agent count and version
4. Add relevant keywords if new domain
5. Verify version synchronization

subagent_type: "plugin-developer"
description: "Update plugin metadata for new agent"
prompt: "Update plugin metadata for the new agent:

Agent file: $AGENT_FILE
Agent name: $(basename \"$AGENT_FILE\" .md)

Metadata update tasks:

1. **Count Agents**
   \`\`\`bash
   # Count all agent files
   find /Users/seth/Projects/orchestr8/.claude/agents -name '*.md' -type f | wc -l
   \`\`\`

2. **Update VERSION File**
   - Read current version: /Users/seth/Projects/orchestr8/.claude/VERSION
   - Increment MINOR version (e.g., 1.4.0 → 1.5.0)
   - Write new version to VERSION file

   \`\`\`bash
   # Read current version
   CURRENT_VERSION=\$(cat /Users/seth/Projects/orchestr8/.claude/VERSION)

   # Increment MINOR (X.Y.Z -> X.Y+1.0)
   # Write new version
   echo \"X.Y+1.0\" > /Users/seth/Projects/orchestr8/.claude/VERSION
   \`\`\`

3. **Update plugin.json**
   - Path: /Users/seth/Projects/orchestr8/.claude/plugin.json
   - Update version field to match VERSION
   - Update agent count in description
   - Add relevant keywords if new domain (e.g., \"game-dev\", \"blockchain\")

   \`\`\`json
   {
     \"version\": \"X.Y.0\",
     \"description\": \"... with N+ specialized agents...\",
     \"keywords\": [\"existing\", \"keywords\", \"new-keyword-if-applicable\"]
   }
   \`\`\`

4. **Verify Synchronization**
   - VERSION matches plugin.json version
   - Agent count accurate
   - JSON is valid

   \`\`\`bash
   # Verify versions match
   VERSION_FILE=\$(cat /Users/seth/Projects/orchestr8/.claude/VERSION)
   JSON_VERSION=\$(grep '\"version\":' /Users/seth/Projects/orchestr8/.claude/plugin.json | cut -d'\"' -f4)

   if [ \"\$VERSION_FILE\" != \"\$JSON_VERSION\" ]; then
     echo \"❌ Version mismatch\"
     exit 1
   fi
   \`\`\`

Expected outputs:
- Updated VERSION file
- Updated plugin.json
- metadata-update-report.md
"
```

**Expected Outputs:**
- `/Users/seth/Projects/orchestr8/.claude/VERSION` - Incremented version
- `/Users/seth/Projects/orchestr8/.claude/plugin.json` - Updated metadata
- `metadata-update-report.md` - Update summary

**Quality Gate: Metadata Validation**
```bash
# Read new version
NEW_VERSION=$(cat /Users/seth/Projects/orchestr8/.claude/VERSION)

# Validate VERSION file updated
if [ -z "$NEW_VERSION" ]; then
  echo "❌ VERSION file not updated"
  exit 1
fi

# Validate plugin.json version matches
JSON_VERSION=$(grep '"version":' /Users/seth/Projects/orchestr8/.claude/plugin.json | cut -d'"' -f4)
if [ "$NEW_VERSION" != "$JSON_VERSION" ]; then
  echo "❌ Version mismatch: VERSION=$NEW_VERSION, plugin.json=$JSON_VERSION"
  exit 1
fi

# Validate agent count updated
AGENT_COUNT=$(find /Users/seth/Projects/orchestr8/.claude/agents -name '*.md' -type f | wc -l)
if ! grep -q "$AGENT_COUNT" /Users/seth/Projects/orchestr8/.claude/plugin.json; then
  echo "⚠️  Warning: Agent count may not be updated in description"
fi

echo "✅ Plugin metadata updated (version: $NEW_VERSION, agents: $AGENT_COUNT)"
```

**Track Progress:**
```bash
TOKENS_USED=3000

# Store metadata info
  "Metadata update at version $NEW_VERSION" \
  "Version: $NEW_VERSION, Agents: $AGENT_COUNT"
```

---

## Phase 6: Documentation (95-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the plugin-developer agent to:
1. Add CHANGELOG entry for new agent
2. Update README.md if new major capability
3. Document agent capabilities and use cases
4. Include emoji category indicator

subagent_type: "plugin-developer"
description: "Document new agent in CHANGELOG"
prompt: "Document the new agent in CHANGELOG:

Agent file: $AGENT_FILE
Agent name: $(basename \"$AGENT_FILE\" .md)
Version: $NEW_VERSION

Documentation tasks:

1. **Add CHANGELOG Entry**
   - Path: /Users/seth/Projects/orchestr8/.claude/CHANGELOG.md
   - Create new ## [X.Y.Z] - YYYY-MM-DD section at top
   - Use appropriate emoji category:
     - 🎮 Game Development
     - 🤖 AI/ML
     - ⛓️  Blockchain/Web3
     - 🧪 Quality/Testing
     - 📊 Infrastructure
     - 🚀 DevOps
     - 📝 Documentation
     - 🔒 Security/Compliance

   Format:
   \`\`\`markdown
   ## [X.Y.Z] - YYYY-MM-DD

   ### [Emoji] [Category Name]

   **New [Type] (1 agent)**
   - **agent-name** - Brief description from frontmatter
     - Key capability 1
     - Key capability 2
     - Key capability 3
     - Primary use case
   \`\`\`

2. **Update README.md** (if applicable)
   - Add agent to relevant category lists
   - Update capability descriptions if major new feature
   - Path: /Users/seth/Projects/orchestr8/README.md

   Only update README if:
   - Agent represents new capability category
   - Agent is a major addition to system
   - Otherwise, CHANGELOG entry is sufficient

Expected outputs:
- Updated CHANGELOG.md
- Updated README.md (if applicable)
- documentation-report.md
"
```

**Expected Outputs:**
- `/Users/seth/Projects/orchestr8/.claude/CHANGELOG.md` - Updated with agent entry
- `/Users/seth/Projects/orchestr8/README.md` - Updated if applicable
- `documentation-report.md` - Documentation summary

**Quality Gate: Documentation Validation**
```bash
# Validate CHANGELOG updated
AGENT_BASENAME=$(basename "$AGENT_FILE" .md)
if ! grep -q "$AGENT_BASENAME" /Users/seth/Projects/orchestr8/.claude/CHANGELOG.md; then
  echo "❌ CHANGELOG not updated with agent"
  exit 1
fi

# Validate version in CHANGELOG
if ! grep -q "$NEW_VERSION" /Users/seth/Projects/orchestr8/.claude/CHANGELOG.md; then
  echo "❌ Version $NEW_VERSION not in CHANGELOG"
  exit 1
fi

echo "✅ Documentation complete"
```

**Track Progress:**
```bash
TOKENS_USED=2000

# Store documentation info
  "Documentation completed in CHANGELOG" \
  "Version: $NEW_VERSION, Agent: $AGENT_BASENAME"
```

---

## Workflow Complete

```bash
# Complete workflow tracking
WORKFLOW_END=$(date +%s)

  "Agent created: $(basename \"$AGENT_FILE\" .md) at version $NEW_VERSION"

echo "
✅ CREATE AGENT COMPLETE

Agent Created: $(basename \"$AGENT_FILE\" .md)
Version: $NEW_VERSION
File: $AGENT_FILE
Category: $(dirname \"$AGENT_FILE\" | sed 's|.*/agents/||')

Files Created:
- $AGENT_FILE
- agent-specs.md
- agent-design.md
- validation-report.md
- metadata-update-report.md
- documentation-report.md

Files Updated:
- /Users/seth/Projects/orchestr8/.claude/VERSION
- /Users/seth/Projects/orchestr8/.claude/plugin.json
- /Users/seth/Projects/orchestr8/.claude/CHANGELOG.md

Agent Details:
- Lines: $(wc -l < \"$AGENT_FILE\")
- Model: $(grep '^model:' \"$AGENT_FILE\" | cut -d':' -f2 | tr -d ' ')
- Tools: $(grep -A10 '^tools:' \"$AGENT_FILE\" | tail -n +2 | wc -l)

Next Steps:
1. Review $AGENT_FILE
2. Test agent invocation: Use Task tool with subagent_type: \"$(basename \"$AGENT_FILE\" .md)\"
3. Review validation-report.md
4. Commit changes: git add . && git commit -m 'feat: add $(basename \"$AGENT_FILE\" .md) agent'
5. Create PR for review
"

# Display metrics
```

## Success Criteria Checklist

- ✅ Requirements analyzed and validated
- ✅ Agent designed following established patterns
- ✅ Agent file created in correct category location
- ✅ Frontmatter complete and valid (name, description, model, tools)
- ✅ Core Competencies section documented (5-10 items)
- ✅ Documentation comprehensive (300-500 lines for specialists)
- ✅ 5+ code examples included (for technical agents)
- ✅ Best practices (DO/DON'T) documented (5-10 each)
- ✅ Testing patterns included
- ✅ Closing deliverables statement present
- ✅ All validations passed (frontmatter, content, placement)
- ✅ Plugin metadata updated (plugin.json)
- ✅ VERSION incremented (MINOR bump)
- ✅ VERSION and plugin.json synchronized
- ✅ CHANGELOG.md updated with agent details
- ✅ README.md updated if applicable
- ✅ Agent ready for git commit
- ✅ Agent immediately usable via Task tool

## Example Usage

### Example 1: Language Specialist

```bash
/create-agent "Create a Svelte framework specialist that can build Svelte applications with SvelteKit, focusing on reactive programming patterns, component design, and state management"
```

The workflow will autonomously:
1. Analyze requirements → Determine it's a frontend framework specialist
2. Design agent → Category: `development/frontend/`, Model: Sonnet 4.5, Tools: Read/Write/Edit/Bash/Glob/Grep
3. Implement agent → Create `svelte-specialist.md` with 400+ lines including:
   - Svelte component examples
   - SvelteKit routing patterns
   - Reactive state management
   - Testing with Vitest
   - Best practices
4. Validate → Check all requirements met
5. Update metadata → Increment version, update counts
6. Document → Add CHANGELOG entry

**Estimated Time**: ~10 minutes

### Example 2: Infrastructure Specialist

```bash
/create-agent "Create a HashiCorp Vault specialist for secrets management, dynamic credentials, encryption as a service, and security automation"
```

The workflow will create an infrastructure specialist in `infrastructure/security/vault-specialist.md` with:
- Vault architecture and deployment
- Secrets engine configuration
- Dynamic credential generation
- Encryption patterns
- Security best practices

**Estimated Time**: ~12 minutes

### Example 3: Quality Agent

```bash
/create-agent "Create an accessibility auditor that checks WCAG 2.1 compliance, reviews semantic HTML, validates ARIA labels, and ensures keyboard navigation support"
```

The workflow will create a quality agent in `quality/accessibility-auditor.md` with:
- WCAG 2.1 compliance checklist
- Accessibility review process
- Common issues and fixes
- Testing tools and techniques
- NO Write/Edit tools (review-only)

**Estimated Time**: ~10 minutes

## Anti-Patterns

### DON'T ❌

- Don't skip requirements analysis - understand the domain first
- Don't place in wrong category - research existing structure
- Don't use wrong model - Sonnet for specialists, Opus only for orchestrators
- Don't give review agents Write tools - they should only read and review
- Don't skip code examples - technical agents need 5+ examples
- Don't forget validation - frontmatter and content must be correct
- Don't skip metadata update - keep plugin.json synchronized
- Don't forget CHANGELOG - document all new agents
- Don't create duplicates - search for similar agents first
- Don't use underscores - always kebab-case

### DO ✅

- Research similar agents in the same category first
- Follow established patterns from existing agents
- Use appropriate tools for agent type
- Include rich code examples (5-10 for technical agents)
- Validate frontmatter and content quality
- Update plugin metadata immediately
- Document in CHANGELOG with details
- Use semantic versioning (MINOR bump for new agents)
- Test that agent file is valid and loadable
- Commit all related files together

## Agent Selection Guide

**Backend/API Agents:**
- Category: `development/languages/` or `development/api/`
- Model: Sonnet 4.5
- Tools: Read, Write, Edit, Bash, Glob, Grep
- Examples: Language patterns, API design, testing

**Frontend Agents:**
- Category: `development/frontend/`
- Model: Sonnet 4.5
- Tools: Read, Write, Edit, Bash, Glob, Grep
- Examples: Components, state, testing, accessibility

**Infrastructure Agents:**
- Category: `infrastructure/[subcategory]/`
- Model: Sonnet 4.5
- Tools: Read, Write, Edit, Bash, Glob, Grep
- Examples: Configuration, deployment, optimization

**Quality/Review Agents:**
- Category: `quality/`
- Model: Sonnet 4.5
- Tools: Read, Glob, Grep, Bash (NO Write/Edit)
- Content: Checklists, severity classification, review process

**Compliance Agents:**
- Category: `compliance/`
- Model: Sonnet 4.5
- Tools: Read, Write, Edit, Bash, Glob, Grep, Task
- Content: Regulations, compliance checks, remediation

## Notes

- **agent-architect** handles all design and implementation
- **plugin-developer** handles all metadata updates
- Version bumps are always MINOR for new agents
- All related files must be committed together
- Agent is immediately usable after creation via Task tool
- No user intervention needed unless requirements are ambiguous

**This workflow makes the orchestr8 plugin self-extending!**
