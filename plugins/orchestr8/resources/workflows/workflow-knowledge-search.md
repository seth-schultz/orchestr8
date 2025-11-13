---
id: workflow-knowledge-search
category: pattern
tags: [workflow, search, research, information-retrieval, knowledge-management, discovery]
capabilities:
  - Systematic search across organizational knowledge
  - Multi-source information discovery
  - Search result synthesis and ranking
useWhen:
  - Knowledge base search requiring fuzzy matching, relevance ranking, result filtering, and context-aware retrieval
  - Information discovery workflows needing semantic search, tag filtering, and result presentation with usage examples
estimatedTokens: 460
---

# Knowledge Search Workflow Pattern

**Phases:** Query Formation (0-15%) → Multi-Source Search (15-70%) → Synthesis (70-100%)

Systematic approach to discovering relevant knowledge across organizational sources.

## Phase 1: Query Formation (0-15%)

**Understand information need:**
```markdown
□ What specific question needs answering?
□ What type of information is needed?
  - How-to / Tutorial
  - Example code
  - Decision rationale
  - Troubleshooting guidance
□ What context or constraints matter?
□ What have I already tried?
```

**Formulate search strategy:**
- Primary keywords (core concepts)
- Secondary keywords (synonyms, related terms)
- Filters (date range, source type, author)
- Boolean operators (AND, OR, NOT)

**Example:**
```
Need: "How to implement JWT authentication in TypeScript API"
Primary: JWT, authentication, TypeScript
Secondary: token, auth, API, Express
Filters: Last 2 years, code examples preferred
```

## Phase 2: Multi-Source Search (15-70%)

**Parallel search across sources:**

**Internal Knowledge Base (15-35%)**
- Team wiki/documentation
- Past project documentation
- Architecture decision records
- Internal code examples
- Slack/chat history (if searchable)

**Code Repositories (20-45%)**
- Search existing codebases (Grep/Glob)
- Review past implementations
- Check code comments
- Review PR descriptions

**External Sources (25-60%)**
- WebSearch for current best practices
- Official documentation
- Stack Overflow / GitHub Issues
- Technical blogs and articles
- Video tutorials (if needed)

**Orchestr8 Resources (30-70%)**
- Search MCP resources via dynamic URIs
- Match against agent/skill/pattern fragments
- Review example implementations

**Search techniques:**
```markdown
# Keyword search
"jwt authentication typescript"

# Fuzzy matching (for Orchestr8)
orchestr8://match?query=jwt+auth+typescript

# Code search (for repositories)
pattern: "jwt.*verify" with glob: "**/*.ts"

# Boolean queries
"authentication" AND ("jwt" OR "oauth")
```

## Phase 3: Results Synthesis (70-100%)

**Evaluate and rank results:**
```markdown
For each result, assess:
□ Relevance (does it address my question?)
□ Recency (is information current?)
□ Authority (is source trustworthy?)
□ Completeness (does it provide full solution?)
□ Applicability (does it fit my constraints?)
```

**Scoring system:**
```
High relevance + Recent + Authoritative = Priority 1
High relevance + Older but proven = Priority 2
Partial relevance + Recent = Priority 3
Low relevance = Discard
```

**Synthesize findings:**
- Combine information from multiple sources
- Identify common patterns/recommendations
- Note contradictions or alternatives
- Extract actionable guidance

**Document search results:**
```markdown
# Search: [Query]
Date: [YYYY-MM-DD]

## Top Findings

### Result 1: [Title/Source]
- **Relevance:** High/Medium/Low
- **Key Insights:** [What it provides]
- **Link/Location:** [How to access]

### Result 2: [Title/Source]
[Same format...]

## Synthesis
[Combined understanding from all sources]

## Recommended Approach
[What to do based on findings]

## Gaps
[What wasn't found, needs further research]
```

## Search Patterns by Use Case

**Finding existing solution:**
```markdown
1. Search internal code repos first
2. Check team documentation
3. Review Orchestr8 resources
4. External search if nothing found
```

**Learning new technology:**
```markdown
1. Official documentation
2. Orchestr8 agent/skill fragments
3. WebSearch for tutorials (current year)
4. Code examples (internal then external)
```

**Troubleshooting error:**
```markdown
1. Search error message exactly (in quotes)
2. Check internal incident logs
3. Stack Overflow / GitHub Issues
4. Official bug trackers
```

**Architecture decision:**
```markdown
1. Review architecture decision records
2. Orchestr8 pattern fragments
3. Past similar projects
4. External case studies and best practices
```

## Search Optimization

**Make queries more effective:**
```markdown
❌ Too vague: "authentication"
✅ Specific: "jwt authentication express typescript"

❌ Too broad: "database"
✅ Focused: "postgresql connection pooling node"

❌ No context: "error handling"
✅ With context: "async error handling typescript api"
```

**Use advanced operators:**
```markdown
# Exact phrase
"error: connection refused"

# Exclude terms
authentication -oauth -saml

# Multiple alternatives
(jwt OR oauth OR saml) authentication

# Wildcards
auth* (finds authentication, authorize, etc.)
```

## Best Practices

✅ **Search internal first** - Avoid reinventing wheel
✅ **Use multiple sources** - Triangulate information
✅ **Verify recency** - Tech changes fast
✅ **Document searches** - Help others find same info
✅ **Refine iteratively** - Adjust query if poor results
✅ **Note dead ends** - Save others time

❌ **Don't trust first result** - Verify from multiple sources
❌ **Don't skip internal** - Internal knowledge often best fit
❌ **Don't ignore dates** - Old solutions may be outdated
❌ **Don't search in isolation** - Combine with asking experts

## Success Criteria

✅ Question answered with actionable information
✅ Multiple sources corroborate findings
✅ Recent, authoritative sources found
✅ Alternatives considered
✅ Search documented for future reference
✅ Gaps identified if answer incomplete
