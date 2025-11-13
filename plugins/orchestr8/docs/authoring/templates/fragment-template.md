---
# Fragment ID: Use pattern ${category}-${technology}-${specialization}
# Examples: typescript-api-development, error-handling-resilience, architecture-microservices
id: ${category}-${technology}-${specialization}

# Category: Choose one based on content type
# - agent: Domain expertise (TypeScript Developer, DevOps Expert)
# - skill: Reusable technique (Error Handling, Testing Strategies)
# - pattern: Architectural approach (Microservices, Event-Driven)
# - example: Concrete code example (Express JWT Auth, Docker Config)
# - guide: Step-by-step how-to (AWS Setup, CI/CD Pipeline)
# - workflow: Multi-phase execution strategy (Bug Fix, Feature Development)
category: agent | skill | pattern | example | guide | workflow

# Tags: 5-8 specific tags for discoverability
# Include: primary technology, secondary technologies, domain, patterns, use-cases
# Avoid: Generic tags like "programming", "development", "software"
# Examples:
#   - Agent: [typescript, express, api, rest, backend, middleware, node]
#   - Skill: [error-handling, resilience, retry, circuit-breaker, fault-tolerance]
#   - Pattern: [architecture, microservices, distributed, scalability, service-mesh]
tags: [primary-tech, secondary-tech, domain, pattern, use-case, keyword6, keyword7]

# Capabilities: 3-6 concrete capabilities this fragment provides
# Formula: ${Action} + ${Technology/Context} + ${Specific Details}
# Be specific, not vague. Include details and context.
# Examples:
#   - Good: "TypeScript Express.js REST API development with middleware patterns and type-safe routes"
#   - Bad: "API development" or "TypeScript knowledge"
capabilities:
  - ${Action} with ${Technology/Context} including ${Specific-Details}
  - ${Specific-capability} for ${Use-case} using ${Approach-or-tool}
  - ${Implementation} of ${Pattern-or-technique} with ${Context-and-benefits}

# UseWhen: 3-6 specific scenarios where this fragment should be loaded
# Formula: ${Action} + ${Context} + ${Specific Requirement}
# Describe concrete situations, not generic statements
# Examples:
#   - Good: "Building Node.js REST APIs with Express.js and TypeScript requiring type-safe routes"
#   - Bad: "Building APIs" or "Using TypeScript"
useWhen:
  - ${Action} requiring ${Technique-or-approach} with ${Specific-context-or-constraint}
  - ${Scenario} needing ${Capability} for ${Outcome-or-purpose}
  - ${Problem-or-task} using ${Technology-or-method} with ${Specific-requirements}

# Estimated Tokens: Count content only (exclude frontmatter)
# Calculate: wc -w content | multiply by 0.75
# MUST be accurate within ±10% of actual token count
# Target ranges:
#   - Core agent: 600-750
#   - Specialized agent: 450-650
#   - Skill: 500-700
#   - Pattern: 600-800
#   - Example: 300-500
#   - Maximum: 1000 for any fragment
estimatedTokens: ${calculated-token-count}

# Optional: For optimization patterns (Phase 1-3)
# prerequisite: [fragment-id-that-must-load-first]  # Phase 3: Progressive loading
# relatedTo: [related-fragment-id-1, related-fragment-id-2]  # Phase 2: Cross-referencing
# examples: [orchestr8://examples/example-id]  # Phase 1: Example extraction
# advancedTopics: [orchestr8://category/advanced-module-id]  # Phase 3: Progressive loading
---

# Fragment Title

Brief overview describing what this fragment covers (1-2 sentences). Be clear about the specific expertise, technique, or knowledge this provides.

## Core Concepts / Overview

Key principles and foundational knowledge. What are the fundamental concepts users need to understand?

**Key Points:**
- Concept or principle 1
- Concept or principle 2
- Concept or principle 3

**When This Applies:**
- Scenario 1
- Scenario 2

## Practical Application / Implementation

Concrete examples and implementation guidance. Show HOW to apply this knowledge.

### Example 1: [Specific Use Case]

\`\`\`typescript
// Clear, concise code example (5-20 lines)
// Include comments explaining key parts
// Ensure code is tested and works

interface Example {
  property: string;
}

function demonstratePattern(input: Example): void {
  // Implementation
  console.log(input.property);
}
\`\`\`

### Example 2: [Alternative Approach or Language]

\`\`\`python
# Python example if applicable
# Show the same pattern in different language
# Keep it concise and focused

def demonstrate_pattern(input_data):
    # Implementation
    print(input_data['property'])
\`\`\`

## Best Practices

Guidelines and recommendations for effective use.

✅ **Do this:** Clear recommendation with rationale
✅ **Do that:** Another best practice with explanation
✅ **Remember:** Important consideration

❌ **Don't do this:** Anti-pattern to avoid with reason
❌ **Avoid:** Common mistake with explanation

## Common Pitfalls / What to Avoid

Mistakes to watch out for and how to prevent them.

**Pitfall 1: [Common Mistake]**
- What: Description of the problem
- Why it's bad: Consequences
- Solution: How to avoid or fix

**Pitfall 2: [Another Issue]**
- What: Description
- Why it's bad: Impact
- Solution: Prevention strategy

## Related Content

Links to related fragments that complement this knowledge.

**Related [Category]:**
- [Related Fragment 1](orchestr8://category/fragment-id)
- [Related Fragment 2](orchestr8://category/fragment-id)

**See Also:**
- [Complementary Topic 1](orchestr8://category/fragment-id)
- [Complementary Topic 2](orchestr8://category/fragment-id)

---

## Template Usage Notes

**Before using this template:**

1. **Choose appropriate category** (agent, skill, pattern, etc.)
2. **Research existing fragments** to avoid duplication
3. **Plan your content** - outline before writing
4. **Set target token count** based on fragment type

**When filling out metadata:**

1. **ID:** Follow naming convention strictly
2. **Tags:** Be specific, think about search terms
3. **Capabilities:** Use the formula, be concrete
4. **UseWhen:** Describe real scenarios
5. **Tokens:** Calculate accurately

**When writing content:**

1. **Focus:** Single clear purpose
2. **Examples:** 2-3 tested, working examples
3. **Structure:** Clear sections with headers
4. **Length:** Stay within token budget
5. **Links:** Reference related content

**After writing:**

1. **Test discoverability** with 4-6 queries
2. **Verify code examples** work
3. **Check token count** is accurate
4. **Review metadata** for specificity
5. **Get feedback** if possible

**Common Template Sections (optional additions):**

- **Advanced Topics:** For complex concepts
- **Performance Considerations:** When relevant
- **Security Implications:** For security-related content
- **Testing Strategies:** For implementation patterns
- **Debugging Tips:** For complex techniques
- **Migration Guide:** When updating from old practices
