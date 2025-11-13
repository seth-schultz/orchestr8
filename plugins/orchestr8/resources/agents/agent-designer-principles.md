---
id: agent-designer-principles
category: agent
tags: [agent-design, meta, expertise, fragmentation, design-principles]
capabilities:
  - Agent vs skill vs pattern distinction
  - Agent fragmentation strategy and sizing
  - Determining when to create agents vs other resource types
  - Multi-level agent design approach
useWhen:
  - Deciding whether to create agent (domain expertise/WHO), skill (technique/HOW), or pattern (architectural approach/WHY) resource types
  - Planning agent fragmentation strategy to avoid monolithic 2000+ token agents by splitting into core (600-750 tokens) and specialized fragments (450-650 tokens)
  - Designing multi-level agent families with core fragments containing always-relevant fundamentals and specialized fragments for use-case specific knowledge
  - Optimizing token efficiency through orchestr8://agents/match?query= dynamic loading based on specific user requests versus loading all expertise upfront
  - Understanding when to create agents (TypeScript Developer, Cloud Architect) versus skills (Error Handling, Testing Strategies) versus patterns (Microservices, CQRS)
  - Structuring agent sets for composability where generic queries load core only (600 tokens) and specific queries load core + specializations (1100 tokens)
estimatedTokens: 620
---

# Agent Designer - Design Principles

Core principles for designing domain expert agents, including fragmentation strategies and resource type distinctions.

## Agent vs Skill vs Pattern

**Agent: Domain expertise (WHO/WHAT)**
- TypeScript Developer
- Cloud Architect (AWS/GCP/Azure)
- Security Engineer
- Data Engineer
- DevOps Specialist
- Frontend Expert (React/Vue/Svelte)
- Mobile Developer (iOS/Android/Flutter)
- Database Administrator (PostgreSQL/MySQL/MongoDB)

**Skill: Practical technique (HOW)**
- Error Handling → Skill
- Testing Strategies → Skill
- Deployment Procedures → Skill
- Code Organization → Skill

**Pattern: Architectural approach (WHY/WHEN)**
- Microservices Architecture → Pattern
- Event-Driven Design → Pattern
- REST API Design → Pattern
- CQRS → Pattern

## Agent Fragmentation Strategy

### Monolithic Agent Problem

```markdown
BAD: python-expert.md (3000 tokens)
- Core Python knowledge
- FastAPI development
- Data science libraries
- Async patterns
- Testing
- Deployment

Issues:
- Always loads all 3000 tokens
- User may only need FastAPI knowledge
- 70%+ token waste
```

### Fragmented Approach

```markdown
GOOD: Split into focused fragments

Core (always relevant):
- python-core.md (600 tokens)
  - Language fundamentals
  - Type hints
  - Common patterns

Specialized (load as needed):
- python-api-development.md (500 tokens)
- python-async-patterns.md (450 tokens)
- python-data-science.md (550 tokens)
- python-testing.md (400 tokens)

Usage:
orchestr8://agents/match?query=python+api+rest
→ Loads: python-core + python-api-development (1100 tokens, 63% savings)
```

## Fragment Sizing Guidelines

**Optimal Token Ranges:**
```markdown
Core fragments: 600-750 tokens
- Always-relevant fundamentals
- Language/framework essentials
- Common patterns

Specialized fragments: 450-650 tokens
- Use-case specific knowledge
- Specialized patterns
- Focused expertise areas

Maximum: 1000 tokens per fragment
- Beyond 1000 tokens, consider splitting further
```

## When to Create Agents

**Create an agent when:**
- Representing domain expertise or role
- Knowledge is technology-specific
- Expertise combines theory + practice
- Multiple related specializations exist

**Don't create an agent for:**
- Generic techniques (→ skill)
- Architecture patterns (→ pattern)
- Process workflows (→ workflow)
- Single isolated patterns (→ skill)

## Multi-Level Agent Strategy

**Two-tier approach:**
```markdown
Level 1: Core Fragment
- Essential knowledge for any use of technology
- Size: 600-700 tokens
- Example: typescript-core.md

Level 2: Specialized Fragments
- Focused on specific use cases
- Size: 450-600 tokens each
- Examples:
  - typescript-api-development.md
  - typescript-async-patterns.md
  - typescript-testing.md
```

**Query matching benefits:**
```markdown
Generic query: "typescript development"
→ Loads: typescript-core.md (600 tokens)

Specific query: "typescript REST api express"
→ Loads: typescript-core + typescript-api-development (1150 tokens)

Focused query: "typescript testing jest"
→ Loads: typescript-core + typescript-testing (1050 tokens)
```

## Best Practices

✅ Fragment by specialization, not arbitrarily
✅ Core fragment contains always-relevant knowledge
✅ Specialized fragments cover distinct use cases
✅ Keep fragments independently useful
✅ Design for composability

❌ Don't create monolithic 2000+ token agents
❌ Don't split too granularly (<400 tokens)
❌ Don't mix agent and skill concepts
❌ Don't create overlapping specializations
