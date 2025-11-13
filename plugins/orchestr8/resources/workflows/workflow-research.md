---
id: workflow-research
category: pattern
tags: [workflow, research, investigation, analysis, learning, web-search, synthesis]
capabilities:
  - General-purpose research methodology
  - Multi-source information gathering
  - Critical analysis and synthesis
useWhen:
  - Comprehensive research workflows requiring information gathering, synthesis, validation, and documented findings
  - Domain investigation needing web search, documentation analysis, expert consultation, and knowledge extraction
estimatedTokens: 500
---

# General Research Workflow Pattern

**Phases:** Scoping (0-20%) → Investigation (20-70%) → Synthesis (70-100%)

Universal research methodology applicable to any topic or domain.

## Phase 1: Research Scoping (0-20%)

**Define research objectives:**
```markdown
□ What question am I trying to answer?
□ What decisions will this research inform?
□ What level of depth is needed?
□ What are the time constraints?
□ Who is the audience for findings?
```

**Identify knowledge gaps:**
- What do I already know?
- What do I need to learn?
- What assumptions need validation?
- What risks need investigation?

**Plan research approach:**
```markdown
Research type:
□ Exploratory (broad understanding)
□ Focused (specific question)
□ Comparative (evaluate options)
□ Deep-dive (comprehensive expertise)

Sources to use:
□ Documentation (official, technical)
□ Web search (articles, tutorials)
□ Code examples (GitHub, repos)
□ Expert consultation (team, community)
□ MCP resources (agents, skills, patterns)
```

**Create research outline:**
```markdown
1. Core concepts and fundamentals
2. Current best practices
3. Common pitfalls and challenges
4. Alternatives and trade-offs
5. Implementation considerations
```

## Phase 2: Investigation (20-70%)

**Parallel research tracks:**

**Track A: Foundational Knowledge (20-45%)**
- Official documentation
- Core concepts and terminology
- Fundamental principles
- Basic examples and tutorials

**Track B: Practical Application (30-55%)**
- Real-world implementations
- Code examples and patterns
- Best practices and guidelines
- Common use cases

**Track C: Ecosystem & Context (35-60%)**
- Related technologies
- Integration patterns
- Community and support
- Maturity and adoption

**Track D: Critical Analysis (40-70%)**
- Limitations and trade-offs
- Known issues and workarounds
- Performance considerations
- Security implications
- Alternatives comparison

**Research methods:**

**WebSearch strategy:**
```markdown
# Current information (last 1-2 years)
"topic best practices 2024"
"topic tutorial recent"

# Official sources
site:docs.example.com topic

# Community insights
site:stackoverflow.com topic
site:github.com topic issues

# Comparison research
"topic vs alternative"
"topic advantages disadvantages"
```

**MCP resource queries:**
```markdown
# Relevant expertise
orchestr8://match?query=${topic}&categories=agent,skill&mode=index&maxResults=8

# Implementation patterns
orchestr8://patterns/match?query=${topic}+implementation

# Code examples
orchestr8://examples/match?query=${topic}+${technology}
```

**Code repository analysis:**
```markdown
# Find implementations
Grep pattern: topic-related-patterns
Glob pattern: relevant file types

# Review approaches
- Check README files
- Review code structure
- Examine test patterns
- Note design decisions
```

## Phase 3: Synthesis & Reporting (70-100%)

**Organize findings:**
```markdown
By theme:
- Group related information
- Identify patterns across sources
- Note contradictions
- Highlight consensus views

By priority:
- Critical must-know information
- Important context
- Nice-to-have details
- Out-of-scope tangents
```

**Critical analysis:**
```markdown
Evaluate sources:
□ Authoritative and current?
□ Consistent with other sources?
□ Relevant to our context?
□ Practical and actionable?

Assess information:
□ What are the key insights?
□ What patterns emerge?
□ What's missing or unclear?
□ What needs further investigation?
```

**Create research deliverable:**

**Option A: Research Report (comprehensive)**
```markdown
# Research: [Topic]

## Executive Summary
[Key findings in 2-3 paragraphs]

## Background & Context
[What and why]

## Findings
### [Theme 1]
[Detailed findings...]

### [Theme 2]
[Detailed findings...]

## Recommendations
[Actionable next steps]

## References
[Sources consulted]
```

**Option B: Decision Brief (focused)**
```markdown
# Decision Brief: [Topic]

## Question
[What decision needs to be made]

## Options
1. [Option A]: Pros/Cons
2. [Option B]: Pros/Cons

## Recommendation
[Recommended approach with rationale]

## Implementation Notes
[Key considerations]
```

**Option C: Knowledge Summary (quick)**
```markdown
# [Topic] Summary

## Key Points
- Point 1
- Point 2
- Point 3

## Best Practices
- Practice 1
- Practice 2

## Gotchas
- Warning 1
- Warning 2

## Resources
- Link 1
- Link 2
```

## Research Quality Checks

**Completeness:**
```markdown
□ All research questions answered?
□ Sufficient depth for decision-making?
□ Multiple sources consulted?
□ Alternatives considered?
```

**Accuracy:**
```markdown
□ Information current and relevant?
□ Sources authoritative?
□ Contradictions resolved or noted?
□ Assumptions validated?
```

**Actionability:**
```markdown
□ Clear next steps identified?
□ Practical implementation guidance?
□ Risks and trade-offs understood?
□ Recommendations justified?
```

## Best Practices

✅ **Start broad, then narrow** - Overview before deep-dive
✅ **Use multiple sources** - Corroborate information
✅ **Prioritize recent** - Especially for technology topics
✅ **Document as you go** - Don't rely on memory
✅ **Note sources** - Enable verification and follow-up
✅ **Stay focused** - Avoid research rabbit holes
✅ **Time-box research** - Diminishing returns after point

❌ **Don't cherry-pick** - Consider contradicting evidence
❌ **Don't skip fundamentals** - Build proper foundation
❌ **Don't trust single source** - Always verify
❌ **Don't research forever** - Good enough > perfect
❌ **Don't ignore dates** - Old information can mislead

## Success Criteria

✅ Research questions answered comprehensively
✅ Multiple authoritative sources consulted
✅ Findings synthesized and organized
✅ Clear recommendations provided
✅ Actionable next steps identified
✅ Sources documented for reference
