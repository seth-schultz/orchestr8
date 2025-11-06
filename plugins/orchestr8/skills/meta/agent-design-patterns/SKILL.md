---
name: agent-design-patterns
description: Expertise in Claude Code agent design patterns, frontmatter structure, tool selection, and documentation standards. Activate when designing or creating new agents for the orchestr8 plugin system. Guides creation of production-ready agent definitions with proper architecture, ensuring agents integrate seamlessly with plugin discovery and follow v4.0.0 standards.
---

# Agent Design Patterns Skill

Expert knowledge of agent design patterns for the Claude Code orchestr8 plugin system, covering frontmatter structure, tool selection strategies, model choice, documentation patterns, and integration best practices.

## When to Use This Skill

**Use agent-design-patterns for:**
- ✅ Creating new specialized agents for the orchestr8 plugin
- ✅ Designing agent frontmatter structure and metadata
- ✅ Selecting appropriate models (opus/sonnet/haiku) for agent types
- ✅ Structuring agent documentation with examples and best practices
- ✅ Ensuring agents follow v4.0.0 standards and conventions
- ✅ Integrating agents with plugin discovery systems

**Less critical for:**
- ❌ Simple agent modifications (minor description changes)
- ❌ Agent invocation or usage (this is for creation/design only)
- ❌ Workflow or skill creation (use those specific skills instead)

## Core Agent Architecture

### Agent Frontmatter Structure

Every agent requires YAML frontmatter (delimited by triple dashes):

```yaml
---
name: agent-name
description: Expert [role]... Use for...
model: sonnet
---
```

**Key Requirements:**
- Use YAML format with triple dash delimiters (`---`)
- NO `tools:` field (tools are auto-discovered)
- Model names simplified: `opus`, `sonnet`, or `haiku` (not full IDs like `claude-opus-4-1-20250805`)
- Required fields: `name`, `description`, `model`

### Model Selection Pattern

**Three models are used in orchestr8:**

1. **opus** - Strategic orchestrators ONLY
   - Project orchestrator
   - Feature orchestrator
   - Complex multi-agent coordination
   - High-level strategic decision-making

2. **sonnet** - Most specialized agents (DEFAULT)
   - Language specialists (Python, TypeScript, Java, Go, etc.)
   - Framework specialists (React, Next.js, Django, etc.)
   - Infrastructure specialists (PostgreSQL, Kubernetes, etc.)
   - Quality agents (code reviewer, test engineer, security auditor)
   - Compliance agents (GDPR, FedRAMP, ISO27001, etc.)

3. **haiku** - Quick, straightforward tasks (cost optimization)
   - Simple file operations
   - Straightforward refactoring
   - Basic code generation
   - When speed and cost matter more than complexity

**Rule: Use Opus for orchestrators, Sonnet for most agents (default), Haiku for simple/fast tasks.**

### Tool Selection Pattern

**IMPORTANT: In the new format, there is NO `tools:` field in agent frontmatter.**

Tools are auto-discovered based on agent needs. However, agent designers should be aware of common tool patterns:

**Technical Specialists typically use:**
- Read, Write, Edit, Bash, Glob, Grep

**Quality/Review Agents typically use:**
- Read, Glob, Grep, Bash (NO Write/Edit - reviewers don't modify code)

**Meta-Orchestrators typically use:**
- Task (invoke other agents), Read, Write, Bash, Glob, Grep, TodoWrite

**Compliance Agents typically use:**
- Read, Write, Edit, Bash, Glob, Grep, Task

## Agent Type Patterns

### Pattern 1: Language/Framework Specialist

```markdown
---
name: technology-specialist
description: Expert [Technology] developer specializing in [key areas]. Use for [specific use cases].
model: sonnet
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
model: sonnet
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
model: opus
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

## Plugin Organization Pattern

**NEW: Plugin-based structure** - Each plugin is independently installable

```
plugins/
├── database-specialists/
│   └── agents/              # 9 database agents
├── language-developers/
│   └── agents/              # 11 language agents
├── frontend-frameworks/
│   └── agents/              # 4 frontend agents
├── mobile-development/
│   └── agents/              # 2 mobile agents
├── game-development/
│   └── agents/              # 3 game engine agents
├── ai-ml-engineering/
│   └── agents/              # 5 AI/ML agents
├── blockchain-web3/
│   └── agents/              # 2 blockchain agents
├── api-design/
│   └── agents/              # 3 API agents
├── quality-assurance/
│   ├── agents/              # 8 QA agents
│   └── commands/            # QA workflows
├── devops-cloud/
│   ├── agents/              # 4 cloud agents
│   └── commands/            # DevOps workflows
├── infrastructure-messaging/
│   └── agents/              # 2 messaging agents
├── infrastructure-search/
│   └── agents/              # 2 search agents
├── infrastructure-caching/
│   └── agents/              # 2 caching agents
├── infrastructure-monitoring/
│   └── agents/              # 4 monitoring agents
├── compliance/
│   └── agents/              # 5 compliance agents
├── orchestration/
│   ├── agents/              # 2 orchestrators
│   └── commands/            # Orchestration workflows
├── meta-development/
│   ├── agents/              # 4 meta agents
│   └── commands/            # Meta workflows
└── development-core/
    └── agents/              # 2 core development agents
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
- Use YAML frontmatter with triple dashes (NOT markdown tables)
- NO `tools:` field in frontmatter (tools are auto-discovered)
- Use simplified model names: `opus`, `sonnet`, or `haiku` (not full IDs)
- Follow established patterns from similar agents in the same category
- Use `opus` for orchestrators, `sonnet` for specialists (default), `haiku` for simple/fast tasks
- Include 5-10 detailed code examples for technical specialists
- Write comprehensive documentation (300-500 lines for specialists)
- Use kebab-case for filenames and frontmatter name
- Place agents in correct plugin directory

**Documentation:**
- Start with "You are an expert [domain]..."
- Include Core Competencies section with bullet lists
- Provide real-world, runnable code examples
- Show DO/DON'T patterns with explanations
- End with deliverables statement
- Keep agent description concise but specific

### DON'T ❌

**Agent Design:**
- Don't use markdown table frontmatter (use YAML with `---` delimiters)
- Don't include `tools:` field (removed in v4.0.0)
- Don't use full model IDs (use `sonnet` or `opus`)
- Don't use `opus` for specialized agents (only for orchestrators)
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

- [ ] Frontmatter uses YAML format with triple dashes (NOT markdown tables)
- [ ] Frontmatter has name, description, model (NO tools field)
- [ ] Name is kebab-case and matches filename
- [ ] Description follows "Expert [role]... Use for..." pattern
- [ ] Model is `opus` (orchestrators), `sonnet` (default), or `haiku` (simple/fast tasks)
- [ ] File placed in correct plugin directory
- [ ] Core Competencies section present
- [ ] 5+ code examples (for technical specialists)
- [ ] Best practices (DO/DON'T) included
- [ ] Closing deliverables statement present
- [ ] Documentation length appropriate (300-500 lines for specialists)

## Common Pitfalls

1. **Using markdown table frontmatter** - Must use YAML format with triple dashes in v4.0.0+
2. **Including tools field** - Tools field is removed in v4.0.0 (auto-discovered)
3. **Using full model IDs** - Use `sonnet` or `opus`, not full IDs like `claude-sonnet-4-5-20250929`
4. **Using Opus for Specialists** - Opus is only for meta-orchestrators
5. **Thin Documentation** - Technical agents need 5+ detailed examples
6. **Wrong Category** - Research similar agents to find correct placement
7. **Generic Descriptions** - Be specific about capabilities and use cases
8. **Missing DO/DON'T** - Best practices are critical for quality
9. **Underscore Names** - Always use kebab-case, never underscores

## Remember

1. **Frontmatter Format**: YAML with triple dashes (NOT markdown tables), NO tools field
2. **Model Selection**: `opus` for orchestrators, `sonnet` for specialists (default), `haiku` for simple tasks
3. **Model Names**: Use simplified names (`opus`/`sonnet`/`haiku`), not full IDs
4. **Documentation**: 300-500 lines for specialists, 400+ for orchestrators
5. **Examples**: 5-10 detailed examples for technical agents
6. **Naming**: kebab-case for files and frontmatter names
7. **Structure**: Follow established patterns from similar agents
8. **Quality**: DO/DON'T sections are not optional

Well-designed agents follow consistent patterns, use YAML frontmatter format (v4.0.0+), have comprehensive documentation with real-world examples, and integrate seamlessly with the orchestr8 plugin system for proper Claude Code discovery.
