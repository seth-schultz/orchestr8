---
# Command Description: Brief description shown in command listing
# This is required - users see this when browsing commands
description: ${Brief-description-of-command-purpose-and-usage}

# Optional: Command name (inferred from filename if omitted)
name: ${command-name}

# Optional: Arguments for parameterized commands
# Define all inputs the command accepts
arguments:
  - name: ${arg-name}
    description: ${What-this-argument-represents}
    required: true
  - name: ${optional-arg}
    description: ${What-this-optional-argument-is}
    required: false

# Optional: Tags for categorization
tags: [${category}, ${keywords}]
---

# ${Command-Title}

**${Context-label}:** $ARGUMENTS

## ${Section-1-Title}

${Primary-content-or-instructions}

${More-details-or-structure}

## ${Section-2-Title}

${Additional-content}

---

## Command Template Guidelines

Commands come in different types. Choose the appropriate template below:

---

## Template 1: Simple Tool/Utility Command

**Use for:** Commands that launch tools, utilities, or perform simple actions

```markdown
---
description: Brief description of what tool does
---

# ${Tool-Name}

**Purpose:** ${What-this-tool-provides}

## Instructions

1. **${Step-1-Title}:**
   \`\`\`bash
   ${command-to-run}
   \`\`\`

2. **${Step-2-Title}:**
   ${What-to-do}

3. **${Step-3-Title}:**
   ${Next-action}

## Features

- **${Feature-1}:** ${Description}
- **${Feature-2}:** ${Description}
- **${Feature-3}:** ${Description}

## Usage Notes

- ${Important-note-1}
- ${Important-note-2}
- ${Important-note-3}
```

**Example: MCP UI Command**
```markdown
---
description: Launch the Orchestr8 MCP web UI for interactive testing
---

# Orchestr8 MCP Web UI

**Purpose:** Interactive interface for testing MCP resources and fragment matching.

## Instructions

1. **Start the UI:**
   \`\`\`bash
   cd plugins/orchestr8/web-ui && npm run dev
   \`\`\`

2. **Access the interface:**
   Visit http://localhost:3000

3. **Test fragment matching:**
   - Enter queries
   - Adjust scores
   - View results

## Features

- **Resource Matching:** Test fuzzy matching in real-time
- **Category Filtering:** Filter by type
- **Score Adjustment:** Tune thresholds
```

---

## Template 2: Workflow Command

**Use for:** Multi-phase workflows with JIT expertise loading

```markdown
---
description: Brief workflow description
arguments:
  - name: ${main-arg}
    description: ${Description}
    required: true
---

# ${Workflow-Title}: $ARGUMENTS

**Task:** $ARGUMENTS

## Phase 1: ${Phase-Name} (0-X%)

**→ JIT Load:** orchestr8://match?query=${query}&maxTokens=${budget}

**Activities:**
- ${Activity-1}
- ${Activity-2}
- ${Activity-3}

**→ Checkpoint:** ${Completion-criteria}

## Phase 2: ${Phase-Name} (X%-Y%)

**→ JIT Load:** orchestr8://agents/match?query=${query}&maxTokens=${budget}

**Activities:**
- ${Activity-1}
- ${Activity-2}

**→ Checkpoint:** ${Completion-criteria}

## Phase 3-N: ${More-Phases}

...

## Success Criteria

✅ ${Criterion-1}
✅ ${Criterion-2}
✅ ${Criterion-3}
```

**Example: Bug Fix Workflow**
```markdown
---
description: Fix bug with systematic analysis and testing
arguments:
  - name: bug-description
    required: true
---

# Bug Fix: $ARGUMENTS

**Bug:** ${bug-description}

## Phase 1: Analysis (0-30%)

**→ JIT Load:** orchestr8://skills/match?query=debugging&maxTokens=800

**Activities:**
- Reproduce bug: ${bug-description}
- Analyze root cause
- Document findings

**→ Checkpoint:** Root cause identified

## Phase 2: Implementation (30-70%)

**→ JIT Load:** orchestr8://match?query=${bug-description}+fix&maxTokens=1500

**Activities:**
- Implement fix
- Add regression test
- Test locally

**→ Checkpoint:** Fix implemented with test

## Phase 3: Validation (70-100%)

**→ JIT Load:** orchestr8://skills/match?query=testing&maxTokens=600

**Activities:**
- Run full test suite
- Manual testing
- Code review

**→ Checkpoint:** Fix validated

## Success Criteria

✅ Bug no longer reproducible
✅ Regression test added
✅ All tests passing
✅ Code reviewed
```

---

## Template 3: Autonomous Workflow Command

**Use for:** Complex autonomous workflows with organization structure

```markdown
---
description: Autonomous workflow with dynamic coordination
---

# ${Workflow-Title}: $ARGUMENTS

**Request:** $ARGUMENTS

## Your Role

You are the **${Role-Title}** ${role-description}. You ${responsibilities}.

## Dynamic Expertise System

Load expertise on-demand via MCP:

\`\`\`
orchestr8://match?query=<need>&categories=<cats>&minScore=15
\`\`\`

The catalog indexes ${resource-types} with ${metadata-types} for selective loading.

## Execution Workflow

### 1. ${Step-Name}

**REQUIRED:** ${Critical-first-step}
\`\`\`
orchestr8://...
\`\`\`

**Optional:** ${Additional-resources}

### 2. ${Step-Name}

**Analyze:**
- ${Analysis-point-1}
- ${Analysis-point-2}
- ${Analysis-point-3}

**Plan:**
- ${Planning-point-1}
- ${Planning-point-2}

### 3. ${Step-Name}

${Instructions-for-execution}

**Wave 1:** ${First-wave-description}
**Wave 2+:** ${Subsequent-waves}

### 4. ${Step-Name}

${Final-integration-steps}

## Key Principles

✅ ${Principle-1}
✅ ${Principle-2}
✅ ${Principle-3}
```

**Example: Orchestr8 Now**
```markdown
---
description: Orchestr8 autonomous workflow with dynamic expertise assembly
---

# Orchestr8 Now - Autonomous Organization

**Request:** $ARGUMENTS

## Your Role

You are the **Chief Orchestrator** coordinating Project Managers. You manage organization structure and dependency flow.

## Dynamic Expertise System

Load expertise on-demand:
\`\`\`
orchestr8://match?query=<need>&categories=<cats>&minScore=15
\`\`\`

## Execution Workflow

### 1. Initialize Organization

**REQUIRED:** Load autonomous organization pattern
\`\`\`
orchestr8://patterns/autonomous-organization
\`\`\`

### 2. Analyze Request & Dependencies

- Understand requirements
- Identify dependencies
- Group into waves

### 3. Launch PMs in Waves

- Wave 1: Independent PMs
- Wave 2+: Dependent PMs

### 4. Final Integration

- Collect outputs
- Validate
- Report

## Key Principles

✅ JIT loading
✅ Hierarchical coordination
✅ Wave-based execution
```

---

## Command Features

### Argument Handling

**Backward compatible ($ARGUMENTS):**
```markdown
**Request:** $ARGUMENTS
**Task:** $ARGUMENTS
```
Receives all user input after command.

**Named arguments (${arg-name}):**
```markdown
---
arguments:
  - name: technology
    required: true
  - name: feature
    required: false
---

# Project: ${technology} - ${feature}

**Technology:** ${technology}
**Feature:** ${feature}

## Phase 1: Research ${technology}
**→ Load:** orchestr8://match?query=${technology}+${feature}
```

### JIT Loading in Commands

**Per-phase loading:**
```markdown
## Phase 1: Research
**→ Load:** orchestr8://skills/match?query=research&maxTokens=1000

## Phase 2: Implementation
**→ Load:** orchestr8://agents/match?query=${tech}&maxTokens=2000

## Phase 3: Testing
**→ Load:** orchestr8://skills/match?query=testing&maxTokens=800
```

**With constraints:**
```markdown
orchestr8://match?query=${need}&categories=agent,skill&maxTokens=1500&minScore=20
```

### Command Locations

**Commands directory:**
```
plugins/orchestr8/commands/
├── now.md → /orchestr8:now
├── mcp-ui.md → /orchestr8:mcp-ui
└── workflow-name.md → /workflow-name
```

**Namespacing:**
```
commands/plugin-name/command.md → /plugin-name:command
```

### Testing Commands

**Manual test:**
```bash
# Run command
/command-name "test input"

# Verify:
✅ Arguments substitute correctly
✅ JIT loading works
✅ Phases execute
✅ Output correct
```

**Test cases:**
```markdown
1. Standard input
2. Edge cases
3. Missing optional args
4. Special characters
5. Very long input
```

### Quality Checklist

Before committing command:

- [ ] Description clear and concise
- [ ] Arguments defined (if parameterized)
- [ ] $ARGUMENTS placeholder used
- [ ] Named args use ${arg-name} syntax
- [ ] JIT loading strategy (if workflow)
- [ ] Clear instructions or phases
- [ ] Success criteria (if applicable)
- [ ] Tested with sample inputs
- [ ] Argument substitution verified
- [ ] Saved to commands/ directory

### Best Practices

✅ **Clear description:** Users see this in listings
✅ **Show user input:** Echo back with $ARGUMENTS
✅ **Named arguments:** Use ${arg-name} for clarity
✅ **JIT loading:** Load expertise per phase
✅ **Checkpoints:** Track progress
✅ **Success criteria:** Define "done"

❌ **Don't load all upfront:** Use JIT
❌ **Don't skip arg definitions:** Document them
❌ **Don't forget testing:** Verify substitution
❌ **Don't create without purpose:** Be reusable

## Common Command Types

**Utility/Tool:**
- Launches UI, service, or tool
- Simple instructions
- No complex workflow

**Simple Workflow:**
- 2-3 phases
- Basic JIT loading
- Clear success criteria

**Complex Workflow:**
- 4-6 phases
- Extensive JIT loading
- Parallelism
- Detailed checkpoints

**Autonomous Workflow:**
- Organizational structure
- Dynamic coordination
- Wave-based execution
- Hierarchical delegation
