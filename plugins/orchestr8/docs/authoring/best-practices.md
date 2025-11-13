# Content Authoring Best Practices

Comprehensive best practices and quality guidelines for creating Orchestr8 content.

## Table of Contents

1. [Quality Checklist](#quality-checklist)
2. [Metadata Optimization](#metadata-optimization)
3. [Token Efficiency](#token-efficiency)
4. [Discoverability Optimization](#discoverability-optimization)
5. [Maintenance Guidelines](#maintenance-guidelines)
6. [Testing Before Commit](#testing-before-commit)
7. [Common Anti-Patterns](#common-anti-patterns)

## Quality Checklist

Use this checklist before committing any content:

### Metadata Quality

- [ ] **ID naming:** Follows `${category}-${tech}-${specialization}` convention
- [ ] **Category:** Correct (agent, skill, pattern, example, guide, workflow)
- [ ] **Tags:** 5-8 specific tags (not generic like "development", "programming")
- [ ] **Capabilities:** 3-6 concrete capabilities with details and context
- [ ] **UseWhen:** 3-6 specific scenarios with action + context + requirement
- [ ] **Token count:** Accurate (use `wc -w` × 0.75), within guidelines

### Content Quality

- [ ] **Focused:** Single clear purpose, not multiple unrelated topics
- [ ] **Sized appropriately:** Core 600-750, specialized 450-650, max 1000 tokens
- [ ] **Code examples:** 2-3 concise, working examples included
- [ ] **Best practices:** Clear dos and don'ts
- [ ] **Pitfalls:** Common mistakes documented
- [ ] **Cross-references:** Links to related fragments
- [ ] **No duplication:** Checked for existing similar content

### Discoverability

- [ ] **Test queries:** Created 4-6 test queries for fragment
- [ ] **Top-3 ranking:** Appears in top 3 for core queries
- [ ] **Appropriate matches:** Loads with right complementary fragments
- [ ] **No false positives:** Doesn't appear for unrelated queries
- [ ] **Unique value:** Provides distinct expertise

### Technical Validation

- [ ] **Code works:** All examples tested and verified
- [ ] **Syntax correct:** No errors in code blocks
- [ ] **Links valid:** All cross-references work
- [ ] **Versions noted:** Framework/language versions mentioned if relevant

## Metadata Optimization

### Tag Selection SEO

**Think like a user searching:**

```markdown
Scenario: TypeScript API Development Fragment

User mental model:
- "I need to build a typescript api"
- "express typescript rest"
- "node backend typescript"
- "typescript middleware"

Optimal tags:
tags: [typescript, express, api, rest, backend, middleware, node]

Why these work:
✅ Direct match for "typescript api"
✅ Covers "express" and "rest" variations
✅ Includes domain terms (backend, middleware)
✅ Technology context (node)
```

**Bad tag examples:**
```yaml
❌ tags: [programming, development, backend, api, server]
# Too generic, no technology specificity

❌ tags: [typescript, ts, javascript, js, node, nodejs, backend, api, rest, express, middleware]
# Too many, dilutes matching

✅ tags: [typescript, express, api, rest, backend, middleware, node]
# Just right: specific, technology-focused, covers variations
```

### Capability Formulas

**Formula:** `${Action} + ${Technology/Context} + ${Specific Details}`

```markdown
❌ Bad (vague):
- TypeScript development
- API creation
- Error handling

✅ Good (specific):
- TypeScript Express.js REST API development with middleware patterns and type-safe routes
- Type-safe API route handlers with request/response validation using Zod schemas
- Centralized error handling middleware with custom error classes and HTTP status codes
```

### UseWhen Scenarios

**Formula:** `${Action} + ${Context} + ${Specific Requirement}`

```markdown
❌ Bad (generic):
- Building APIs
- Need error handling
- TypeScript development

✅ Good (specific):
- Building Node.js REST APIs with Express.js and TypeScript requiring type-safe routes
- Implementing Express middleware pipeline for request authentication and validation
- Creating centralized error handling for API with custom error classes and status codes
- Designing type-safe API contracts with Zod schema validation and inference
```

## Token Efficiency

### Target Token Ranges

| Fragment Type | Target | Maximum | Split If Exceeds |
|---------------|--------|---------|------------------|
| Core agent | 600-750 | 750 | 800 |
| Specialized agent | 450-650 | 650 | 700 |
| Skill | 500-700 | 700 | 750 |
| Pattern | 600-800 | 800 | 850 |
| Example | 300-500 | 500 | 550 |
| Workflow | 800-1200 | 1500 | 1600 |
| Any fragment | 500-1000 | 1000 | 1100 |

### Token Efficiency Optimization Patterns

#### Phase 1: Example Extraction

**Pattern:** Move detailed code examples to separate example files

**When to apply:**
- Fragment >100 lines with multiple examples
- Examples are >30% of token count
- Complex implementations >50 lines

**Implementation:**
```yaml
# Main fragment (optimized)
---
id: error-handling-resilience
estimatedTokens: 680  # Down from 1200
examples:
  - orchestr8://examples/typescript-retry-patterns
  - orchestr8://examples/python-retry-patterns
---

Content with brief inline examples and references to detailed implementations.

# Example file
---
id: typescript-retry-patterns
category: example
estimatedTokens: 450
relatedTo: [error-handling-resilience]
---

Complete implementation with all variations.
```

**ROI:**
- Cost: ~50 tokens for references + time to extract
- Benefit: 25-40% token reduction on main fragment
- Savings: 300-500 tokens for users not needing detailed examples
- Worthwhile when: Fragment has >3 code examples or >100 lines

#### Phase 2: Structural Organization with Cross-References

**Pattern:** Create skill families with parent-child relationships and cross-references

**When to apply:**
- Related skills frequently used together (>60% co-occurrence)
- Logical learning path exists
- Users benefit from discovering related content

**Implementation:**
```yaml
# Parent skill
---
id: testing-strategies
category: skill
estimatedTokens: 600
relatedTo:
  - testing-unit
  - testing-integration-patterns
  - testing-e2e-best-practices
---

## Related Testing Skills
- [Unit Testing](orchestr8://skills/testing-unit)
- [Integration Testing](orchestr8://skills/testing-integration-patterns)
- [E2E Testing](orchestr8://skills/testing-e2e-best-practices)

# Child skill
---
id: testing-integration-patterns
prerequisite: [testing-strategies, testing-unit]
relatedTo: [testing-unit, testing-e2e-best-practices]
---

## Prerequisites
- [Testing Strategies](orchestr8://skills/testing-strategies)
- [Unit Testing](orchestr8://skills/testing-unit)

## Related
- [E2E Testing](orchestr8://skills/testing-e2e-best-practices)
```

**ROI Analysis:**
- Cost: 50-100 tokens per fragment for cross-references
- Benefit: 15-20% improved discoverability
- Return: 3-5x better related content discovery
- Saves: 2-3 additional queries for users
- Worthwhile when: Co-occurrence >60% or logical progression exists

#### Phase 3: Progressive Loading

**Pattern:** Split fragments into core + advanced modules with prerequisites

**When to apply:**
- Clear always-needed vs sometimes-needed split
- Advanced content >40% of tokens
- Most queries only need core

**Implementation:**
```yaml
# Core module
---
id: python-async-fundamentals
category: agent
estimatedTokens: 700  # Down from 1400
advancedTopics:
  - orchestr8://agents/python-async-concurrency
  - orchestr8://agents/python-async-context-managers
---

Core concepts with references to advanced topics.

## Advanced Topics
- [Concurrency Patterns](orchestr8://agents/python-async-concurrency)
- [Context Managers](orchestr8://agents/python-async-context-managers)

# Advanced module
---
id: python-async-concurrency
category: agent
prerequisite: [python-async-fundamentals]
estimatedTokens: 400
---

Advanced content loaded only when needed.
```

**ROI:**
- Cost: ~30 tokens for references in core
- Benefit: 40-60% savings for generic queries
- Savings: 400-700 tokens when advanced not needed
- Worthwhile when: <50% of queries need advanced content

### Token Efficiency Metrics

**Measuring optimization success:**

```markdown
Metric 1: Average tokens per query
Before optimization: 1500 tokens average
After optimization: 900 tokens average
Improvement: 40% reduction

Metric 2: Token waste (loaded but not needed)
Before: 60% waste (e.g., loading examples not used)
After: 15% waste (only relevant content loaded)
Improvement: 75% reduction in waste

Metric 3: Query satisfaction
Before: 70% (users needed multiple queries)
After: 85% (better targeting with cross-refs)
Improvement: 21% increase

Metric 4: Discoverability
Before: 3.2 queries average to find all needed content
After: 1.8 queries average (cross-refs help discovery)
Improvement: 44% reduction in queries needed
```

### Token Reduction Techniques

**1. Remove redundancy:**
```markdown
❌ Before (wordy):
TypeScript is a programming language that adds static typing to JavaScript. It was developed by Microsoft and provides compile-time type checking.

✅ After (concise):
TypeScript adds static typing to JavaScript with compile-time type checking.
```

**2. Use bullets instead of prose:**
```markdown
❌ Before (paragraph):
When implementing error handling, you should use try-catch blocks for synchronous code, handle promise rejections with .catch() or try-catch with async/await, and implement centralized error handlers.

✅ After (bullets):
Error handling approaches:
- Try-catch for synchronous code
- Promise rejections: .catch() or async/await try-catch
- Centralized error handlers for consistency
```

**3. Condense examples:**
```markdown
❌ Before (verbose):
// This is a function that validates user input
// It checks if the email is valid
// Returns true if valid, false otherwise
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && regex.test(email)) {
    return true;
  } else {
    return false;
  }
}

✅ After (concise):
// Email validation with regex
const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

**4. Split oversized fragments:**
```markdown
❌ Before: python-expert.md (2500 tokens)

✅ After: Split into focused fragments
- python-core.md (650 tokens)
- python-fastapi-dependencies.md (500 tokens)
- python-async-fundamentals.md (450 tokens)
```

### Calculating Tokens

**Accuracy requirement: ±10%**

All fragments must have `estimatedTokens` accurate within ±10% of actual token count.

```bash
# Method 1: Word count approximation (recommended)
wc -w fragment.md
# Multiply by 0.75 for token estimate

# Example:
# 800 words × 0.75 = 600 tokens
# Acceptable range: 540-660 tokens (±10%)

# Method 2: Check actual tokens (if available)
# Use Claude or GPT tokenizer for precise count

# Method 3: Conservative estimate
# 1 token ≈ 0.75 words (English text)
# Round up to nearest 10 or 50
```

**Validation:**
```markdown
✅ Valid: estimatedTokens: 650, actual: 620 (4.6% error)
✅ Valid: estimatedTokens: 700, actual: 750 (7.1% error)
❌ Invalid: estimatedTokens: 650, actual: 800 (23% error - exceeds ±10%)
❌ Invalid: estimatedTokens: 500, actual: 350 (30% error - exceeds ±10%)
```

**Why accuracy matters:**
- Token budgets in workflows depend on accurate estimates
- Over-estimation wastes quota
- Under-estimation causes budget overruns
- ±10% provides reasonable tolerance for variation

**Updating token counts:**
When editing fragments significantly:
1. Recalculate word count
2. Update estimatedTokens
3. Ensure still within ±10% of actual
4. Update if error exceeds 10%

## Discoverability Optimization

### Fuzzy Matching Principles

**The system matches fragments based on:**
1. **Tag overlap:** Do query terms match tags?
2. **Capability relevance:** Do capabilities match intent?
3. **UseWhen scenarios:** Do scenarios match user context?

**Optimization strategy:**

```markdown
Query: "typescript api error handling"

Fragment metadata:
tags: [typescript, express, api, rest, error-handling, middleware]
capabilities:
  - Express.js error handling middleware with custom error classes
  - Type-safe error handling with TypeScript discriminated unions
useWhen:
  - Building Express.js APIs with centralized error handling
  - Implementing type-safe error handling in TypeScript applications

Match score: HIGH
- "typescript" matches tag
- "api" matches tag
- "error handling" matches tag and capability
- "error handling" matches useWhen scenario
```

### Testing Discoverability

**Create comprehensive test queries:**

```markdown
Fragment: typescript-api-development

Core queries (must match):
✅ "typescript api"
✅ "express typescript"
✅ "node api typescript"
✅ "typescript rest"

Specialized queries (should match):
✅ "typescript middleware"
✅ "express rest api"
✅ "node backend typescript"

Should NOT match:
❌ "python api"
❌ "graphql typescript"
❌ "typescript frontend"
```

### Metadata Tuning

**If fragment doesn't appear in results:**

1. **Check tags:**
   - Are they specific enough?
   - Do they match query terms?
   - Add missing technology terms

2. **Check capabilities:**
   - Are they concrete?
   - Do they include query terms?
   - Add more context and details

3. **Check useWhen:**
   - Are scenarios specific?
   - Do they match user intent?
   - Add more realistic scenarios

4. **Retest:**
   - Run queries again
   - Verify improved ranking
   - Iterate until discoverable

## Maintenance Guidelines

### Versioning and Updates

**When to update fragments:**

1. **Framework version changes:**
   ```markdown
   # Note version in fragment
   FastAPI 0.100+ dependency injection patterns
   TypeScript 5.0+ decorators
   ```

2. **Best practices evolve:**
   ```markdown
   # Update when community consensus shifts
   Old: Class-based components
   New: Function components with hooks
   ```

3. **Deprecated features:**
   ```markdown
   # Mark deprecated, suggest alternatives
   ⚠️ DEPRECATED: Use X instead of Y (as of version Z)
   ```

### Fragment Lifecycle

```markdown
Create → Test → Deploy → Monitor → Update → Archive

Create: Write fragment with metadata
Test: Verify discoverability
Deploy: Commit to repository
Monitor: Check usage and feedback
Update: Maintain accuracy
Archive: Remove if obsolete
```

### Version Control Practices

**Commit messages:**
```bash
# Good commit messages
✅ "Add typescript-api-development agent fragment"
✅ "Update error-handling-resilience with circuit breaker pattern"
✅ "Fix tags in python-fastapi-validation for better discoverability"

# Bad commit messages
❌ "Update file"
❌ "Changes"
❌ "Fix"
```

**Branching strategy:**
```markdown
main - Stable, production-ready fragments
feature/fragment-name - New fragment development
fix/fragment-name - Bug fixes or updates
```

## Testing Before Commit

### Discovery Testing Process

```markdown
1. Launch MCP UI
   /orchestr8:mcp-ui

2. Test core queries (4-6 per fragment)
   orchestr8://match?query=core+terms
   orchestr8://match?query=specialized+terms

3. Verify ranking
   ✅ Top 3 for core queries
   ✅ Top 10 for specialized queries

4. Test complementary loading
   ✅ Loads with right other fragments
   ✅ Doesn't load with unrelated fragments

5. Optimize if needed
   - Add/adjust tags
   - Enhance capabilities
   - Refine useWhen
   - Retest

6. Final validation
   ✅ All test queries pass
   ✅ Unique value confirmed
   ✅ Ready to commit
```

### Code Testing

**Test all code examples:**

```markdown
1. Extract code from fragment
2. Create test file
3. Run code
4. Verify it works
5. Fix if broken
6. Update fragment
```

### Integration Testing

**Test with related fragments:**

```markdown
1. Load fragment in context
2. Verify compatibility with related fragments
3. Check for conflicts or overlap
4. Ensure unique contribution
5. Update cross-references
```

## Common Anti-Patterns

### Anti-Pattern 1: Generic Metadata

```yaml
❌ Problem:
id: backend-development
tags: [programming, development, backend, coding]
capabilities:
  - Backend development skills
  - Building APIs

🔧 Fix:
id: typescript-api-development
tags: [typescript, express, api, rest, backend, middleware]
capabilities:
  - TypeScript Express.js REST API development with middleware patterns
  - Type-safe route handlers with request/response validation
```

### Anti-Pattern 2: Monolithic Fragments

```markdown
❌ Problem:
python-expert.md (2500 tokens)
- Everything about Python in one file
- Always loads all 2500 tokens
- 70%+ waste for specific queries

🔧 Fix:
Split into focused fragments:
- python-core.md (650 tokens)
- python-fastapi-dependencies.md (500 tokens)
- python-async-fundamentals.md (450 tokens)
Query loads only needed expertise
```

### Anti-Pattern 3: Wrong Category

```yaml
❌ Problem:
id: error-handling
category: agent  # Wrong - this is a technique, not domain expertise

🔧 Fix:
id: error-handling-resilience
category: skill  # Correct - this is a HOW (technique)
```

### Anti-Pattern 4: Duplicate Content

```markdown
❌ Problem:
Create typescript-error-handling when error-handling-resilience exists with TS examples

🔧 Fix:
Option 1: Use existing error-handling-resilience
Option 2: Add TS-specific details to existing fragment
Option 3: Create truly differentiated fragment (e.g., typescript-api-error-middleware)
```

### Anti-Pattern 5: Poor Code Examples

```typescript
❌ Problem:
// 100 lines of code
// No comments
// Doesn't work
// Irrelevant details

🔧 Fix:
// Concise example (10-15 lines)
// Clear comments
// Tested and working
// Focused on pattern
```

### Anti-Pattern 6: No Testing

```markdown
❌ Problem:
Create fragment → Commit immediately → Not discoverable

🔧 Fix:
Create fragment → Test with 4-6 queries → Optimize metadata → Retest → Then commit
```

### Anti-Pattern 7: Vague UseWhen

```yaml
❌ Problem:
useWhen:
  - Building applications
  - Need TypeScript
  - Working with APIs

🔧 Fix:
useWhen:
  - Building Node.js REST APIs with Express.js and TypeScript
  - Implementing type-safe API routes with Zod schema validation
  - Creating Express middleware pipeline for authentication
```

## Quality Standards Summary

### Excellent Fragment Characteristics

✅ **Discoverable**
- Appears in top 3 for core queries
- Rich, specific metadata
- Unique value proposition

✅ **Efficient**
- 500-1000 tokens (appropriate for type)
- Focused single purpose
- No redundancy

✅ **Clear**
- Well-organized structure
- Actionable content
- 2-3 tested code examples

✅ **Accurate**
- Technically correct
- Current best practices
- Versions noted

✅ **Reusable**
- Composable with other fragments
- Context-independent
- Multi-language when applicable

✅ **Maintainable**
- Clear naming convention
- Easy to update
- Well-documented

### Final Pre-Commit Checklist

Before committing any content:

- [ ] Metadata complete and specific (ID, category, 5-8 tags, 3-6 capabilities/useWhen, accurate tokens)
- [ ] Content focused (single purpose, appropriate size, no duplication)
- [ ] Code examples tested (2-3 working examples)
- [ ] Discovery tested (4-6 test queries, top-3 ranking for core)
- [ ] Cross-references added (related fragments linked)
- [ ] No duplication (checked existing content)
- [ ] File saved to correct location (resources/*/\)
- [ ] Commit message descriptive

## Next Steps

- Use the comprehensive [Fragment Template](./templates/fragment-template.md)
- Review specific guides: [Agents](./agents.md), [Skills](./skills.md), [Workflows](./workflows.md), [Commands](./commands.md)
- Test fragments using `/orchestr8:mcp-ui`
- Iterate on metadata based on discovery testing
- Commit only when all quality checks pass
