---
name: agent-design-patterns
description: Expertise in Claude Code agent design patterns, frontmatter structure, tool selection, and documentation standards. Activate when designing or creating new agents for the orchestr8 plugin system.
---

# Agent Design Patterns Skill

Expert knowledge of agent design patterns for the Claude Code orchestr8 plugin system, covering frontmatter structure, tool selection strategies, model choice, documentation patterns, and integration best practices.

## Core Agent Architecture

### Agent Frontmatter Structure

Every agent requires YAML frontmatter with these fields:

```yaml
---
name: agent-name                    # REQUIRED: kebab-case identifier
description: One-line description   # REQUIRED: Expert [role]... Use for...
model: claude-sonnet-4-5            # REQUIRED: model selection
tools:                              # REQUIRED: array of tools
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---
```

### Model Selection Pattern

**Two models are used in orchestr8:**

1. **claude-opus-4** - Strategic orchestrators ONLY
   - Project orchestrator
   - Feature orchestrator
   - Complex multi-agent coordination
   - High-level strategic decision-making

2. **claude-sonnet-4-5** - ALL specialized agents
   - Language specialists (Python, TypeScript, Java, Go, etc.)
   - Framework specialists (React, Next.js, Django, etc.)
   - Infrastructure specialists (PostgreSQL, Kubernetes, etc.)
   - Quality agents (code reviewer, test engineer, security auditor)
   - Compliance agents (GDPR, FedRAMP, ISO27001, etc.)

**Rule: Use Opus only for meta-orchestrators. Use Sonnet for everything else.**

### Tool Selection Patterns

**Technical Specialists (Languages, Frameworks, Infrastructure):**
```yaml
tools:
  - Read       # Read code and config files
  - Write      # Create new files
  - Edit       # Modify existing files
  - Bash       # Run tests, builds, installations
  - Glob       # Find files by pattern
  - Grep       # Search code content
```

**Quality/Review Agents (Read-Only):**
```yaml
tools:
  - Read       # Read code to review
  - Glob       # Find files to review
  - Grep       # Search for patterns
  - Bash       # Run analysis tools
  # NO Write/Edit - reviewers don't modify code
```

**Meta-Orchestrators:**
```yaml
tools:
  - Task       # Invoke other agents (listed FIRST)
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - TodoWrite  # Track progress
```

**Compliance Agents:**
```yaml
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task       # May need to invoke specialists
```

## Agent Type Patterns

### Pattern 1: Language/Framework Specialist

```markdown
---
name: technology-specialist
description: Expert [Technology] developer specializing in [key areas]. Use for [specific use cases].
model: claude-sonnet-4-5
tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# Technology Specialist

You are an expert [technology] developer...

## Core Competencies
- **Frameworks/Libraries**: A, B, C
- **Patterns**: X, Y, Z
- **Tooling**: Build tools, testing

## Development Standards
[Code style, conventions]

## Implementation Examples
[5-10 detailed examples, 50-200 lines each]

## Testing
[Testing approaches and examples]

## Best Practices
### DO ✅
[Best practices]

### DON'T ❌
[Anti-patterns]

Your deliverables should be production-ready, well-tested...
```

### Pattern 2: Quality/Review Agent

```markdown
---
name: review-specialist
description: Performs comprehensive [domain] review...
model: claude-sonnet-4-5
tools: [Read, Glob, Grep, Bash]  # NO Write/Edit
---

# Review Specialist

## Review Checklist
### Category 1
- [ ] Check 1
- [ ] Check 2

## Severity Classification
**CRITICAL**: ...
**HIGH**: ...
**MEDIUM**: ...
**LOW**: ...

## Review Process
1. [Step 1]
2. [Step 2]

## Output Format
[Structured report format]
```

### Pattern 3: Meta-Orchestrator

```markdown
---
name: meta-orchestrator
description: Orchestrates [scope]...
model: claude-opus-4          # NOTE: Opus for orchestrators
tools:
  - Task                     # Listed FIRST
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - TodoWrite               # For progress tracking
---

# Meta Orchestrator

## Core Responsibilities
1. [Responsibility 1]
2. [Responsibility 2]

## Operating Methodology
### Phase 1: [Name] (X%)
[Steps]
**CHECKPOINT**: [Validation] ✓

### Phase 2: [Name] (Y%)
[Steps]
**CHECKPOINT**: [Validation] ✓

## Agent Coordination Patterns
[How to invoke and coordinate agents]

## Message Passing Protocol
[How to communicate with agents]

## Error Handling
[Procedures for failures]

## Best Practices
[DO/DON'T lists]
```

## Directory Organization Pattern

```
.claude/agents/
├── development/
│   ├── languages/           # Python, TypeScript, Java, Go, etc.
│   ├── frontend/            # React, Vue, Angular, SwiftUI, etc.
│   ├── api/                 # GraphQL, gRPC, OpenAPI
│   ├── ai-ml/               # LangChain, LlamaIndex
│   ├── blockchain/          # Solidity, Web3
│   ├── game-engines/        # Unity, Unreal, Godot
│   ├── mobile/              # Mobile development
│   └── data/                # Data engineering
├── quality/
│   ├── [agents].md          # code-reviewer, test-engineer, etc.
│   ├── testing/             # Specialized testing agents
│   └── debugging/           # Debugging specialists
├── infrastructure/
│   ├── databases/           # PostgreSQL, MongoDB, Redis
│   ├── messaging/           # Kafka, RabbitMQ
│   ├── search/              # Elasticsearch, Algolia
│   ├── caching/             # Caching specialists
│   ├── monitoring/          # Observability
│   ├── sre/                 # SRE practices
│   └── cloud/               # Cloud infrastructure
├── devops/
│   ├── cloud/               # AWS, Azure, GCP
│   └── infrastructure/      # Terraform, Kubernetes, Docker
├── compliance/              # GDPR, FedRAMP, ISO27001, etc.
├── orchestration/           # project-orchestrator, feature-orchestrator
└── meta/                    # Meta-system agents
```

## Documentation Structure Pattern

### Required Sections

1. **Title and Introduction**
```markdown
# Agent Name

You are an expert [domain] specialist...
[1-2 sentence description]
```

2. **Core Competencies**
```markdown
## Core Competencies

- **Category 1**: Framework A, Tool B, Pattern C
- **Category 2**: Feature X, Feature Y
- **Category 3**: Best practices
```

3. **Domain-Specific Content**

For Technical Specialists:
- Development Standards
- Implementation Examples (5-10 examples, 50-200 lines each)
- Testing Patterns
- Configuration Examples

For Quality Agents:
- Review Checklists
- Severity Classification
- Review Process
- Output Format

For Orchestrators:
- Operating Methodology (phases)
- Agent Coordination Patterns
- Decision Frameworks
- Error Handling

4. **Best Practices**
```markdown
## Best Practices

### DO ✅
- Practice 1 with explanation
- Practice 2 with explanation

### DON'T ❌
- Anti-pattern 1 with explanation
- Anti-pattern 2 with explanation
```

5. **Closing Statement**
```markdown
Your deliverables should be [quality attributes: production-ready,
well-tested, secure, etc.] [domain] code/documentation following
[relevant standards].
```

## Best Practices

### DO ✅

**Agent Design:**
- Follow established patterns from similar agents in the same category
- Use Opus ONLY for meta-orchestrators, Sonnet for specialists
- Select tools appropriate for agent type (reviewers don't write code)
- Include 5-10 detailed code examples for technical specialists
- Write comprehensive documentation (300-500 lines for specialists)
- Use kebab-case for filenames and frontmatter name
- Place agents in correct category directory

**Documentation:**
- Start with "You are an expert [domain]..."
- Include Core Competencies section with bullet lists
- Provide real-world, runnable code examples
- Show DO/DON'T patterns with explanations
- End with deliverables statement
- Keep agent description concise but specific

**Tool Selection:**
- Technical specialists: Read, Write, Edit, Bash, Glob, Grep
- Quality agents: Read, Glob, Grep, Bash (NO Write/Edit)
- Orchestrators: Task (first), Read, Write, Bash, Glob, Grep, TodoWrite
- Compliance: Read, Write, Edit, Bash, Glob, Grep, Task

### DON'T ❌

**Agent Design:**
- Don't use Opus for specialized agents (only for orchestrators)
- Don't give Write/Edit tools to review agents
- Don't skip code examples for technical specialists
- Don't create agents with fewer than 300 lines (too thin)
- Don't place agents in wrong categories
- Don't use underscores in names (always kebab-case)
- Don't forget closing deliverables statement

**Documentation:**
- Don't skip Core Competencies section
- Don't use toy examples (use real-world patterns)
- Don't forget DO/DON'T best practices
- Don't create generic descriptions (be specific)
- Don't skip testing sections for technical agents
- Don't forget error handling for orchestrators

## Agent Description Formula

```
"Expert [role/specialty] specializing in [key areas/technologies].
Use for [specific use cases/problem domains]."
```

**Examples:**

```
"Expert Python developer specializing in Django, FastAPI, Flask, data science,
ML/AI, and backend services. Use for Python-specific development tasks, backend
APIs, data processing pipelines, ML model implementation, automation scripts,
and scientific computing."
```

```
"Expert React developer specializing in React 18+, hooks, performance optimization,
state management (Context, Zustand, Redux), Server Components, and modern patterns.
Use for React applications, component architecture, and frontend development."
```

```
"Performs comprehensive code reviews checking for best practices, clean code
principles, security issues, performance problems, and maintainability. Use after
implementation to validate code quality before merging or deployment."
```

## Naming Conventions

**File Names:**
- `kebab-case-name.md` (lowercase with hyphens)
- Examples: `python-developer.md`, `react-specialist.md`, `code-reviewer.md`

**Frontmatter Name:**
- Must match filename (without .md extension)
- Examples: `python-developer`, `react-specialist`, `code-reviewer`

**Directory Names:**
- Category: `development`, `quality`, `infrastructure`, `devops`, `compliance`, `orchestration`, `meta`
- Subcategory: `languages`, `frontend`, `databases`, `cloud`, etc.

## Validation Checklist

Before finalizing an agent:

- [ ] Frontmatter complete: name, description, model, tools
- [ ] Name is kebab-case and matches filename
- [ ] Description follows "Expert [role]... Use for..." pattern
- [ ] Model is Opus (orchestrators only) or Sonnet (specialists)
- [ ] Tools appropriate for agent type
- [ ] File placed in correct category directory
- [ ] Core Competencies section present
- [ ] 5+ code examples (for technical specialists)
- [ ] Best practices (DO/DON'T) included
- [ ] Closing deliverables statement present
- [ ] Documentation length appropriate (300-500 lines for specialists)

## Common Pitfalls

1. **Using Opus for Specialists** - Opus is only for meta-orchestrators
2. **Giving Write Tools to Reviewers** - Review agents should be read-only
3. **Thin Documentation** - Technical agents need 5+ detailed examples
4. **Wrong Category** - Research similar agents to find correct placement
5. **Generic Descriptions** - Be specific about capabilities and use cases
6. **Missing DO/DON'T** - Best practices are critical for quality
7. **Underscore Names** - Always use kebab-case, never underscores

## Remember

1. **Model Selection**: Opus for orchestrators, Sonnet for specialists
2. **Tool Selection**: Match tools to agent responsibilities
3. **Documentation**: 300-500 lines for specialists, 400+ for orchestrators
4. **Examples**: 5-10 detailed examples for technical agents
5. **Naming**: kebab-case for files and frontmatter names
6. **Structure**: Follow established patterns from similar agents
7. **Quality**: DO/DON'T sections are not optional

Well-designed agents follow consistent patterns, have appropriate tool access, comprehensive documentation with real-world examples, and integrate seamlessly with the orchestr8 plugin system.
