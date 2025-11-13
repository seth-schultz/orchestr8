---
# Skill ID: Pattern ${technique}-${context}
# Examples: error-handling-resilience, testing-integration-patterns, security-authentication-jwt
# Focus on the HOW (technique/methodology), not the WHO (technology expertise)
id: ${technique}-${context}

# Category: Always "skill" for techniques and methodologies
category: skill

# Tags: 5-7 specific tags including technique, domain, and use-cases
# Include: technique name, application areas, related technologies (if applicable)
# Think about how users will search for this technique
# Examples:
#   - [error-handling, resilience, retry, circuit-breaker, fault-tolerance]
#   - [testing, integration, api, mocking, fixtures, assertions]
#   - [security, authentication, jwt, oauth, authorization]
tags: [technique, domain, use-case, method, tool, keyword6, keyword7]

# Capabilities: 3-5 concrete capabilities this skill provides
# Focus on techniques and methodologies
# Include specific approaches and their applications
capabilities:
  - ${Technique} implementation with ${specific-approach} for ${use-case}
  - ${Method-or-pattern} for ${problem-domain} using ${tools-or-strategies}
  - ${Application} of ${technique} in ${context} with ${specific-details}

# UseWhen: 3-5 specific scenarios requiring this technique
# Describe concrete situations where this skill applies
# Think cross-technology (unless skill is framework-specific)
useWhen:
  - ${Action-or-task} requiring ${technique} with ${specific-context}
  - ${Problem-scenario} needing ${approach} for ${outcome}
  - ${Implementation-context} using ${method} to ${achieve-goal}

# Estimated Tokens: 500-700 tokens (max 1000)
# Calculate: wc -w content | multiply by 0.75
# MUST be accurate within ±10%
estimatedTokens: ${calculated-count}

# Optional: Optimization fields (Phases 2-3)
# prerequisite: [parent-skill-id]  # For child skills in hierarchy (Phase 2)
# relatedTo: [related-skill-1, related-skill-2]  # Cross-references (Phase 2)
# examples: [orchestr8://examples/example-id]  # Example extraction (Phase 1)
---

# ${Technique-Name}: ${Context-or-Specialization}

${Brief-overview} (1-2 sentences describing what technique this covers and when it's useful).

## Technique Overview

**What:** ${Clear-explanation-of-technique}

**Why:** ${Benefits-and-rationale}

**When to Use:**
- ${Scenario-1}
- ${Scenario-2}
- ${Scenario-3}

## Core Concepts

**Key Principles:**
- ${Principle-1}: ${Explanation}
- ${Principle-2}: ${Explanation}
- ${Principle-3}: ${Explanation}

## Implementation

### Approach 1: ${Primary-Method}

\`\`\`${language}
// Primary implementation approach
// Show clear, working example
// Include comments explaining key parts

${code-example}
\`\`\`

**Use when:**
- ${Specific-context-1}
- ${Specific-context-2}

### Approach 2: ${Alternative-Method}

\`\`\`${language}
// Alternative approach or variation
// Show different perspective or language

${code-example}
\`\`\`

**Use when:**
- ${Different-context-1}
- ${Different-context-2}

## Multi-Language Examples (if applicable)

### TypeScript/JavaScript
\`\`\`typescript
// TypeScript implementation
${code-example}
\`\`\`

### Python
\`\`\`python
# Python implementation
${code-example}
\`\`\`

### Other Language (Go, Rust, etc.)
\`\`\`${language}
// Implementation in other language
${code-example}
\`\`\`

## Best Practices

✅ **${Practice-1}:** ${Explanation-and-benefits}
✅ **${Practice-2}:** ${Explanation-and-benefits}
✅ **${Practice-3}:** ${Explanation-and-benefits}
✅ **${Practice-4}:** ${Explanation-and-benefits}

## Common Pitfalls

❌ **${Pitfall-1}:** ${Description}
- **Why it's problematic:** ${Impact-or-consequences}
- **Solution:** ${How-to-avoid-or-fix}

❌ **${Pitfall-2}:** ${Description}
- **Why it's problematic:** ${Impact}
- **Solution:** ${Prevention-strategy}

## Advanced Techniques (Optional)

**${Advanced-topic}:**

\`\`\`${language}
// Advanced usage or optimization
${code-example}
\`\`\`

**When to use:** ${Specific-advanced-scenario}

## Real-World Scenarios

**Scenario 1: ${Use-case-name}**
- **Context:** ${Situation-description}
- **Challenge:** ${Problem-to-solve}
- **Solution:** ${How-technique-applies}
- **Outcome:** ${Result-or-benefit}

**Scenario 2: ${Another-use-case}**
- **Context:** ${Situation}
- **Challenge:** ${Problem}
- **Solution:** ${Application}
- **Outcome:** ${Result}

## Related Skills

**Prerequisites (Phase 2 - if child skill):**
- [${Parent-Skill}](orchestr8://skills/${parent-skill-id}) - Required foundation

**Parent Skill (if this is a child):**
- [${Parent-Skill}](orchestr8://skills/${parent-skill-id})

**Complementary Skills (Phase 2 - Cross-references):**
- [${Related-Skill-1}](orchestr8://skills/${skill-id})
- [${Related-Skill-2}](orchestr8://skills/${skill-id})

**Related Patterns:**
- [${Related-Pattern}](orchestr8://patterns/${pattern-id})

**Detailed Examples (Phase 1 - if extracted):**
- [${Related-Example}](orchestr8://examples/${example-id})

---

## Skill Template Guidelines

### When to Create a Skill

**Create a skill when:**
- Describing HOW to do something (technique/methodology)
- Technique is reusable across contexts
- Focus is on implementation approach, not domain expertise
- Content is practical and actionable

**Don't create a skill for:**
- Domain expertise (→ Agent)
- Architectural approach (→ Pattern)
- Specific code without methodology (→ Example)

### Skill Scope

**Single technique focus:**
- Error handling with resilience patterns
- Integration testing with fixtures
- API design following REST principles

**Not multiple unrelated techniques:**
- ❌ "Backend development" (too broad)
- ❌ "API development" (too general)
- ✅ "API rate limiting strategies" (focused technique)

### Language Coverage

**Multi-language skills:**
- Show technique in 2-3 languages
- Highlight language-agnostic principles
- Include language-specific considerations

**Framework-specific skills:**
- Clearly indicate framework in ID
- Example: `testing-jest-patterns` not just `testing-patterns`
- Still focus on technique, not domain expertise

### Code Examples for Skills

**Guidelines:**
- 2-3 approaches or variations
- 2-3 languages if technique is universal
- Concise (10-20 lines per example)
- Working, tested code
- Clear comments
- Real-world applicability

**Structure:**
```
Approach 1: Primary method (with code)
Approach 2: Alternative method (with code)
Multi-language: Same technique, different languages
```

### Metadata Best Practices

**Tags:**
- Technique name (error-handling, testing, security)
- Domain/area (api, async, distributed)
- Methods/patterns (retry, circuit-breaker, mocking)
- Related technologies (if applicable but not required)

**Capabilities:**
- Focus on what technique enables
- Include specific approaches
- Mention application contexts
- Be concrete about methods

**UseWhen:**
- Describe problem scenarios
- Include technical context
- Specify when technique applies
- Think cross-technology

### Quality Checklist for Skills

Before committing skill fragments:

- [ ] ID follows naming convention (${technique}-${context})
- [ ] Category is "skill"
- [ ] 5-7 specific tags (technique-focused)
- [ ] 3-5 concrete capabilities (technique and approach)
- [ ] 3-5 specific useWhen scenarios (problem contexts)
- [ ] 500-700 tokens (max 1000)
- [ ] Token estimate accurate within ±10%
- [ ] 2-3 code examples (tested and working)
- [ ] Multi-language examples if applicable
- [ ] Best practices included
- [ ] Common pitfalls documented
- [ ] Links to related skills/patterns
- [ ] Discoverable via test queries (5-6 queries)
- [ ] Unique technique (not duplicate of existing)
- [ ] Reusable across contexts

### Optimization Patterns Checklist

Apply these optimization patterns when appropriate:

**Phase 1: Example Extraction**
- [ ] Fragment >100 lines with multiple language examples?
- [ ] Code examples >30% of content? Extract to example files
- [ ] Added `examples: [orchestr8://examples/...]` field?
- [ ] Brief inline examples (10-15 lines) remain?

**Phase 2: Skill Families**
- [ ] Part of a skill family? (e.g., testing-*, security-*, error-handling-*)
- [ ] Is this a parent skill (overview)? Added `relatedTo: [child-skills]`?
- [ ] Is this a child skill? Added `prerequisite: [parent-skill]`?
- [ ] Related skills used together >60% of time? Add cross-refs
- [ ] ROI justified (50-100 token cost vs 3-5x discoverability)?

**Token Efficiency:**
- [ ] Calculated token savings from optimizations?
- [ ] Example extraction: 25-40% reduction achieved?
- [ ] Hierarchical organization: Better targeted loading?
- [ ] Multi-language examples: Consider splitting by language?

### Testing Skills

**Test queries:**
Create 5-6 test queries focused on:
- Technique name
- Problem it solves
- Use cases
- Methods used

**Example (error-handling-resilience):**
- "error handling"
- "resilience patterns"
- "retry logic"
- "circuit breaker"
- "fault tolerance"
- "graceful degradation"

### Skill vs Agent Distinction

**Example 1: Error Handling**

```
Skill: error-handling-resilience
- HOW to handle errors with retry, circuit breaker, fallback
- Cross-language patterns
- Methodology focus

Agent: typescript-api-error-handling
- TypeScript/Express specific implementation
- Domain expertise in TypeScript error handling
- Technology-specific patterns
```

**Example 2: Testing**

```
Skill: testing-integration-patterns
- HOW to write integration tests
- Fixtures, mocking, isolation
- Framework-agnostic principles

Agent: typescript-testing
- TypeScript/Jest specific expertise
- Type-safe testing patterns
- TypeScript testing ecosystem
```

### Common Skill Categories

**Cross-cutting concerns:**
- Error handling
- Logging and observability
- Security (authentication, authorization)
- Performance optimization

**Implementation methodologies:**
- Testing strategies
- API design
- Deployment approaches
- Git workflow

**Technical techniques:**
- Async patterns
- Caching strategies
- Data validation
- Resource management
