# Command/Prompt Creation Guide

Commands (slash commands) provide user-facing entry points to workflows and specialized functionality. This guide covers creating effective command prompts.

## Table of Contents

1. [What is a Command?](#what-is-a-command)
2. [Command Structure](#command-structure)
3. [Frontmatter](#frontmatter)
4. [Argument Definition](#argument-definition)
5. [Content Design](#content-design)
6. [Testing Commands](#testing-commands)
7. [Examples](#examples)

## What is a Command?

A **command** (also called **prompt** or **slash command**) is a user-facing entry point that:

- Provides a memorable shortcut (`/command-name`)
- Accepts arguments from users
- Executes workflows or specialized tasks
- Dynamically loads expertise as needed

**Examples:**
- `/orchestr8:now` - Autonomous organization workflow
- `/orchestr8:mcp-ui` - Launch MCP web UI
- `/workflow-fix-bug` - Bug fixing workflow
- `/workflow-add-feature` - Feature development workflow

**Key characteristics:**
- **User-facing:** Called directly by users via `/command-name`
- **Parameterized:** Accepts user input as arguments
- **Self-contained:** Complete instructions in single file
- **Dynamic:** Loads expertise via `orchestr8://` URIs

## Command Structure

### File Location

Commands are stored in the `commands/` directory:

```
plugins/orchestr8/
└── commands/
    ├── now.md
    ├── mcp-ui.md
    └── workflow-name.md
```

### Basic Structure

```markdown
---
description: Brief description of what this command does
---

# Command Title

**Request:** $ARGUMENTS

## Overview / Your Role

Describe what this command does and the user's context.

## Instructions / Workflow

Step-by-step instructions or workflow phases.

## Key Principles / Guidelines

Important rules and principles to follow.
```

## Frontmatter

### Minimal Frontmatter

**For simple commands:**

```yaml
---
description: Brief description of command purpose and usage
---
```

### Extended Frontmatter

**For complex commands with arguments:**

```yaml
---
name: command-name
description: Brief description
arguments:
  - name: arg-name
    description: What this argument is
    required: true
  - name: optional-arg
    description: Optional argument
    required: false
tags: [keyword1, keyword2]
---
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Optional | Command name (inferred from filename if omitted) |
| `description` | Required | Brief description for command listing |
| `arguments` | Optional | Argument definitions (name, description, required) |
| `tags` | Optional | Keywords for categorization |

## Argument Definition

### Defining Arguments

**In frontmatter:**

```yaml
arguments:
  - name: feature-description
    description: Description of feature to add
    required: true
  - name: technology
    description: Technology stack (typescript, python, etc.)
    required: false
```

### Using Arguments in Content

**Standard placeholder (`$ARGUMENTS`):**

```markdown
**Request:** $ARGUMENTS
**Task:** $ARGUMENTS
```

The `$ARGUMENTS` placeholder receives all user input after the command.

**Named argument substitution:**

```markdown
# Feature: ${feature-description}

**Technology:** ${technology}

## Phase 1: Research ${technology}
**→ Load:** orchestr8://match?query=${technology}+${feature}&maxTokens=1000
```

Named arguments use `${arg-name}` syntax and are substituted when the command runs.

### Argument Examples

**Example 1: Simple command (no arguments)**

```yaml
---
description: Launch the Orchestr8 MCP web UI for testing
---

# Orchestr8 MCP Web UI

**Task:** Launch interactive web UI for testing MCP resources and prompt matching.

## Instructions

1. Visit http://localhost:3000
2. Test resource matching
3. Explore available fragments

No arguments needed - just run the command.
```

**Example 2: Command with required argument**

```yaml
---
description: Fix a bug with systematic analysis and testing
arguments:
  - name: bug-description
    description: Description of the bug to fix
    required: true
---

# Bug Fix: $ARGUMENTS

**Bug:** ${bug-description}

## Phase 1: Analysis
Analyze and reproduce: ${bug-description}
...
```

**Example 3: Command with multiple arguments**

```yaml
---
description: Research and evaluate a technology
arguments:
  - name: technology
    description: Technology to research
    required: true
  - name: use-case
    description: Intended use case
    required: false
---

# Research: ${technology}

**Use Case:** ${use-case}

## Phase 1: Discovery
Research ${technology} for ${use-case} context
...
```

## Content Design

### Command Content Patterns

**Pattern 1: Workflow Command**

```markdown
---
description: Brief workflow description
---

# Workflow Title: $ARGUMENTS

**Task:** $ARGUMENTS

## Phase 1: Name (0-X%)
**→ JIT Load:** orchestr8://...

**Activities:**
- Activity 1
- Activity 2

**→ Checkpoint:** What complete

## Phase 2-N: ...

## Success Criteria
✅ Criterion 1
✅ Criterion 2
```

**Pattern 2: Tool/Utility Command**

```markdown
---
description: Brief tool description
---

# Tool Name

**Purpose:** What this tool does

## Instructions

1. Step 1
2. Step 2
3. Step 3

## Usage Notes

Important things to know
```

**Pattern 3: Autonomous Workflow**

```markdown
---
description: Autonomous execution workflow
---

# Autonomous Workflow: $ARGUMENTS

**Request:** $ARGUMENTS

## Your Role

You are the [ROLE]. You [RESPONSIBILITY].

## Dynamic Expertise System

Load expertise on-demand:
orchestr8://match?query=<need>&categories=<cats>

## Execution Workflow

### 1. Initialize
Load required resources

### 2. Analyze
Understand requirements

### 3-N: Execute phases...

## Key Principles

✅ Principle 1
✅ Principle 2
```

### JIT Loading in Commands

**Load expertise per phase:**

```markdown
## Phase 1: Research (0-30%)
**→ Load:** orchestr8://skills/match?query=research+${domain}&maxTokens=1000

## Phase 2: Implementation (30-80%)
**→ Load:** orchestr8://agents/match?query=${technology}+development&maxTokens=2000

## Phase 3: Validation (80-100%)
**→ Load:** orchestr8://skills/match?query=testing+${technology}&maxTokens=800
```

### Documentation Sections

**Essential sections:**

1. **Title and Request/Task**
   - Show what the command does
   - Display user input

2. **Role/Context** (if applicable)
   - Define the role/perspective
   - Set expectations

3. **Instructions/Workflow**
   - Step-by-step process
   - Clear phases if workflow

4. **Principles/Guidelines**
   - Key rules to follow
   - Important constraints

5. **Success Criteria** (if applicable)
   - What "done" looks like
   - Validation checklist

## Testing Commands

### Manual Testing

**Test the command:**

```bash
# Run command with test input
/workflow-fix-bug "Authentication fails for users with special characters in email"

# Verify:
✅ Argument substitution works
✅ JIT loading executes
✅ Phases execute in order
✅ Output is correct
```

### Argument Substitution Testing

**Verify placeholders:**

```markdown
# Test: Arguments replace correctly

Input:
/workflow-add-feature "user authentication" "typescript"

Expected:
- ${feature-description} → "user authentication"
- ${technology} → "typescript"

Verify these appear in:
- Phase titles
- JIT load queries
- Instructions
```

### Edge Cases

**Test with:**
- Empty input (if optional arguments)
- Very long input
- Special characters
- Multiple words/sentences

## Examples

### Example 1: Simple Tool Command

```markdown
---
description: Launch the Orchestr8 MCP web UI for interactive testing
---

# Orchestr8 MCP Web UI

**Purpose:** Interactive web interface for testing MCP resources, fragment matching, and dynamic loading.

## Instructions

1. **Start the UI:**
   ```bash
   cd plugins/orchestr8/web-ui
   npm run dev
   ```

2. **Access the interface:**
   Visit http://localhost:3000

3. **Test fragment matching:**
   - Enter queries in the search box
   - Adjust match scores and categories
   - View matched fragments

4. **Explore resources:**
   - Browse available fragments
   - Test different query patterns
   - Verify metadata optimization

## Features

- **Resource Matching:** Test fuzzy matching with real-time results
- **Category Filtering:** Filter by agent, skill, pattern, example
- **Score Adjustment:** Tune minimum match scores
- **Resource Viewing:** Inspect fragment content and metadata

## Usage Notes

- UI runs on port 3000 by default
- Changes to fragments require index rebuild
- Test queries match actual MCP behavior
```

### Example 2: Workflow Command

```markdown
---
description: Add new feature with planning, implementation, and testing
arguments:
  - name: feature-description
    description: Description of the feature to add
    required: true
---

# Add Feature: $ARGUMENTS

**Feature:** ${feature-description}

## Phase 1: Planning (0-25%)
**→ Load:** orchestr8://skills/match?query=feature+planning+requirements&maxTokens=800

**Activities:**
- Analyze requirements for ${feature-description}
- Break down into tasks
- Identify dependencies
- Plan implementation approach

**→ Checkpoint:** Feature scope defined, tasks identified

## Phase 2: Design (25-40%)
**→ Load:** orchestr8://patterns/match?query=design+architecture&maxTokens=1000

**Activities:**
- Design architecture for ${feature-description}
- Plan API contracts/interfaces
- Design data models
- Document design decisions

**→ Checkpoint:** Design documented and reviewed

## Phase 3: Implementation (40-75%)
**→ Load:** orchestr8://match?query=${feature-description}+implementation&categories=agent,skill,example&maxTokens=2500

**Activities:**
- Implement ${feature-description}
- Write unit tests
- Add integration tests
- Update documentation

**→ Checkpoint:** Feature implemented with tests

## Phase 4: Validation (75-100%)
**→ Load:** orchestr8://skills/match?query=testing+validation&maxTokens=800

**Activities:**
- Run full test suite
- Manual testing
- Code review
- Update CHANGELOG

**→ Checkpoint:** Feature validated and ready

## Success Criteria
✅ Feature fully implements ${feature-description}
✅ All tests passing (unit + integration)
✅ Documentation updated
✅ Code reviewed and approved
✅ No regression in existing functionality
```

### Example 3: Autonomous Workflow

```markdown
---
description: Orchestr8 autonomous workflow with dynamic expertise assembly
---

# Orchestr8 Now - Autonomous Organization

**Request:** $ARGUMENTS

## Your Role

You are the **Chief Orchestrator** coordinating Project Managers to execute this request. You manage organization structure and dependency flow—PMs manage workers and file conflicts.

## Dynamic Expertise System

Load expertise on-demand via MCP:

```
orchestr8://match?query=<need>&categories=<cats>&minScore=15
```

The catalog indexes agents, skills, patterns, and workflows with tags, capabilities, useWhen scenarios, and MCP URIs for selective loading.

## Execution Workflow

### 1. Initialize Organization

**REQUIRED FIRST STEP:** Load autonomous organization pattern
```
orchestr8://patterns/autonomous-organization
```

**Optional:** Query catalog for additional resources
```
orchestr8://match?query=autonomous organization project management&categories=patterns,agents&minScore=20
```

### 2. Analyze Request & Dependencies

**Analyze scope:**
- Understand requirements and technical domains
- Determine if project warrants autonomous organization (>10 files or complex coordination)
- If simple (<10 files): execute directly or use simple parallelism

**CRITICAL:** Analyze cross-PM dependencies before planning structure

For each potential PM scope:
1. **CONSUMES:** What this scope needs from others
2. **PRODUCES:** What this scope creates for others
3. **BLOCKING:** Which scopes must complete before this starts

**Group into waves:**
```
Wave 1 = PMs with ZERO dependencies
Wave 2 = PMs depending ONLY on Wave 1
Wave 3 = PMs depending ONLY on Waves 1 & 2
```

### 3. Load Agent Resources

```
orchestr8://agents/project-manager
orchestr8://agents/worker-developer
orchestr8://agents/worker-qa
```

### 4. Launch PMs in Waves

**CRITICAL:** Launch in waves based on dependencies, NOT all at once

**Wave 1:** Independent PMs (single message, multiple Task invocations)
**Wave 2+:** Dependent PMs after previous wave completes

### 5. Final Integration

- Collect PM outputs
- Cross-scope integration
- Final validation
- Report to user

## Key Principles

✅ Catalog-first architecture
✅ Just-in-time loading
✅ Hierarchical coordination
✅ File conflict prevention
✅ Maximum parallelism within safety constraints
✅ Specialized roles
✅ Wave-based execution
✅ Autonomous execution authority
```

## Command Creation Checklist

- [ ] Frontmatter with description (and arguments if needed)
- [ ] Clear title showing what command does
- [ ] $ARGUMENTS placeholder for user input
- [ ] Named argument substitution if using multiple args
- [ ] JIT loading strategy (if workflow)
- [ ] Clear instructions or phases
- [ ] Success criteria (if applicable)
- [ ] Tested with sample inputs
- [ ] Argument substitution verified
- [ ] Saved to commands/ directory

## Command Registration

Commands in the `commands/` directory are automatically available as slash commands:

```
File: commands/workflow-name.md
→ Command: /workflow-name "arguments"

File: commands/tool-name.md
→ Command: /tool-name
```

## Best Practices

✅ **Clear description:** Users see this in command list
✅ **Show user input:** Use $ARGUMENTS to echo back
✅ **Named arguments:** Use ${arg-name} for clarity
✅ **JIT loading:** Load expertise per phase
✅ **Checkpoints:** Track progress clearly
✅ **Success criteria:** Define what "done" looks like

❌ **Don't load all expertise upfront:** Use JIT loading
❌ **Don't skip argument definitions:** Document them
❌ **Don't forget testing:** Verify argument substitution
❌ **Don't create without purpose:** Commands should be reusable

## Next Steps

- Review [Workflow Guide](./workflows.md) for workflow patterns
- Use [Command Template](./templates/command-template.md) to get started
- See [Best Practices](./best-practices.md) for quality guidelines
- Test commands with various inputs
