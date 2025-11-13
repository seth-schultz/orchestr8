---
id: architecture-decision-records
category: pattern
tags: [adr, architecture, documentation, decision-making, trade-offs, governance, knowledge-capture, rationale]
capabilities:
  - Document architecture decisions with rationale
  - Capture context and alternatives considered
  - Track decision outcomes and reversibility
  - Enable decision review and learning
useWhen:
  - Significant architectural decisions requiring documented rationale, alternatives considered, and trade-off analysis for future reference
  - Technology selection scenarios needing justification of database, language, framework, or cloud provider choices with reversibility assessment
  - One-way door decisions with high switching costs requiring extensive documentation before implementation commitment
  - Team-based development requiring decision transparency with context, consequences, and review triggers for stakeholder alignment
  - Long-term maintainable systems needing historical decision context for future developers understanding why choices were made
  - Compliance or governance requirements mandating documented decision-making process with rationale and approval tracking
estimatedTokens: 650
---

# Architecture Decision Records (ADR)

Lightweight format for documenting significant architectural decisions with context, rationale, and consequences.

## ADR Template

```markdown
# ADR-{number}: {Decision Title}

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXX
**Date:** YYYY-MM-DD
**Deciders:** {who was involved}
**Context Priority:** Critical | High | Medium | Low

## Context

{Describe the forces at play: technical, business, team, timeline constraints}
{What problem are we solving? What requirements matter?}

## Decision

{The choice we made, stated clearly and concisely}

## Alternatives Considered

### Option 1: {Name}
- **Pros:** {benefits}
- **Cons:** {drawbacks}
- **Risk:** {key risks}

### Option 2: {Name}
- **Pros:** {benefits}
- **Cons:** {drawbacks}
- **Risk:** {key risks}

## Rationale

{Why this decision? What factors weighed most heavily?}
{What trade-offs did we accept?}

## Consequences

**Positive:**
- {benefit 1}
- {benefit 2}

**Negative:**
- {cost 1}
- {cost 2}

**Neutral:**
- {side effect 1}

**Reversibility:** Easy | Moderate | Difficult | One-way door
**Review Date:** {when to reassess}

## Implementation Notes

{Key steps, migration paths, gotchas}
```

## Decision Categories

**One-Way Doors** (Hard to reverse)
- Database choice, programming language, cloud provider
- Require extensive rationale, multiple reviewer approval
- Document rollback/migration costs explicitly

**Two-Way Doors** (Reversible)
- Library choices, API design patterns, deployment tools
- Can be lighter documentation
- Focus on learning outcomes

## Best Practices

✅ **Write ADRs early** - Before implementation, while options are open
✅ **Keep them short** - 1-2 pages maximum
✅ **Use consistent numbering** - Sequential, never reuse numbers
✅ **Link related ADRs** - Reference dependencies and superseded decisions
✅ **Update status** - Mark deprecated when changed
✅ **Include timeline** - When decision was made, when to review

❌ **Don't wait** - ADRs written after implementation lose context
❌ **Don't edit history** - Never change old ADRs (append or supersede)
❌ **Don't skip alternatives** - Always show you considered options
❌ **Don't hide trade-offs** - Acknowledge costs honestly

## Lightweight Variant (Quick Decision Log)

For smaller decisions:

```markdown
**Decision:** {What we chose}
**Context:** {One sentence why}
**Trade-off:** {What we gave up}
**Reversible:** Yes/No
```

## Storage Location

```
docs/decisions/
├── 0001-use-typescript.md
├── 0002-postgres-over-mongodb.md
├── 0003-microservices-architecture.md
└── README.md (index with status)
```

## Review Triggers

Reassess decisions when:
- Technology reaches end-of-life
- Team composition changes significantly
- Performance/scale requirements shift
- Ecosystem landscape changes (new major alternatives)
- 12-18 months have passed (calendar review)

## Related Architecture Patterns

- **orchestr8://patterns/architecture-layered** - Document layering decisions with ADRs
- **orchestr8://patterns/architecture-microservices** - ADRs essential for microservices design choices
- **orchestr8://patterns/technology-selection-criteria** - Systematic technology evaluation
- **orchestr8://patterns/trade-off-analysis-framework** - Structured decision-making for ADRs
