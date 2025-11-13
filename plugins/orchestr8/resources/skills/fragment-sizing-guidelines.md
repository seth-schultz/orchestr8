---
id: fragment-sizing-guidelines
category: skill
tags: [fragments, optimization, token-efficiency, sizing, structure, meta]
capabilities:
  - Fragment token sizing guidelines and ranges
  - Token counting and estimation methods
  - Fragment content structure optimization
  - When to split large fragments
useWhen:
  - Designing skill fragments for JIT loading balancing token budget constraints with comprehensive technical coverage
  - Breaking down large expertise domains into focused fragments under 1000 tokens for efficient dynamic loading
  - Creating fragment size strategy for Orchestr8 workflow assembly optimizing context window usage and relevance
  - Refactoring monolithic skill documentation into modular fragments with clear scope boundaries and reusable patterns
  - Establishing fragment granularity guidelines for agent expertise ensuring single-responsibility principle and discoverability
estimatedTokens: 620
---

# Fragment Sizing Guidelines

Systematic approach to sizing resource fragments for optimal token efficiency and relevance in fuzzy matching.

## Optimal Token Ranges

### Micro-fragments (300-500 tokens)

```markdown
Use for:
- Single specific pattern or technique
- Focused code example
- Specific configuration approach

Example topics:
- JWT token validation middleware
- PostgreSQL connection pooling setup
- React useEffect cleanup pattern
```

### Standard fragments (500-800 tokens)

```markdown
Use for:
- Comprehensive topic coverage
- Multiple related patterns
- Technology specialization

Example topics:
- TypeScript async error handling
- API rate limiting strategies
- Database indexing best practices

→ Target this range for most fragments
```

### Large fragments (800-1200 tokens)

```markdown
Use sparingly for:
- Complex architectural patterns
- Multi-faceted expertise areas
- Comprehensive guides

Example topics:
- Microservices communication patterns
- Full authentication flow implementation
- Complete CI/CD pipeline design

→ Consider splitting if > 1000 tokens
```

## Measuring Fragment Size

```bash
# Count words (approximate)
wc -w fragment.md

# Estimate tokens (words × 0.75)
echo "scale=0; $(wc -w < fragment.md) * 0.75 / 1" | bc

# More accurate (4 chars ≈ 1 token)
echo "scale=0; $(wc -c < fragment.md) / 4" | bc
```

## Content Structure

### Standard Fragment Structure

```markdown
---
[Optimized metadata]
---

# ${Clear Title}

Brief 1-2 sentence description of what this fragment provides.

## ${Primary Capability Section}

Main content area with:
- Clear explanations
- Code examples
- Concrete patterns

**Code examples:**
```language
// Well-commented, runnable code
// Show realistic use cases
```

## ${Secondary Capability Section}

Supporting content:
- Related patterns
- Variations
- Integration points

## Common Pitfalls

❌ Common mistake 1
✅ Correct approach

❌ Common mistake 2
✅ Correct approach

## Best Practices

✅ Practice 1 with rationale
✅ Practice 2 with rationale
✅ Practice 3 with rationale

[Optional: Performance/Security Considerations if relevant]

Total: ~${target-tokens} tokens
```

### Code Example Guidelines

**Quality code examples:**
```markdown
✅ DO:
- Show realistic, runnable code
- Include comments explaining key parts
- Demonstrate best practices
- Show 2-3 language variations if cross-language skill
- Keep examples focused (10-20 lines)

❌ DON'T:
- Pseudocode unless absolutely necessary
- Trivial "hello world" examples
- Overly complex examples (>30 lines)
- Examples without context
- Code with obvious bugs
```

## When to Split Fragments

**Split if:**
```markdown
✅ Fragment exceeds 1200 tokens
✅ Multiple distinct capabilities that could be separate
✅ Parts are relevant for different use cases
✅ Users would rarely need all content together
```

**Example: Monolithic TypeScript Agent**
```markdown
Original: typescript-expert.md (2500 tokens)
- Core types: 600 tokens
- API development: 500 tokens
- Async patterns: 450 tokens
- Testing: 400 tokens
- Performance: 550 tokens

Split into:
1. typescript-core.md (600 tokens) - Always relevant
2. typescript-api-development.md (500 tokens) - API projects
3. typescript-async-patterns.md (450 tokens) - Async work
4. typescript-testing.md (400 tokens) - Testing focus
5. typescript-performance.md (550 tokens) - Optimization

Result: Load 1-2 relevant fragments instead of all 2500 tokens
```

## Fragment Combination Design

**Design fragments to combine well:**
```markdown
Core fragment:
- Foundational knowledge
- Always relevant for domain
- 600-700 tokens

Complementary specializations:
- Build on core knowledge
- Independent from each other
- 450-600 tokens each

Example combination:
orchestr8://agents/match?query=typescript+api+testing
→ Loads: typescript-core + typescript-api + typescript-testing
→ Total: ~1550 tokens of highly relevant content
```

## Best Practices

✅ **Target 500-800 tokens** - Optimal for most fragments
✅ **Accurate estimation** - Calculate tokens, don't guess
✅ **Split large fragments** - Break >1200 tokens into focused pieces
✅ **Design for combination** - Core + specialization pattern
✅ **Quality over quantity** - Focused content beats comprehensive coverage

❌ **Don't create monoliths** - Split large fragments
❌ **Don't micro-optimize** - 300-token fragments rarely useful
❌ **Don't forget structure** - Follow standard template
