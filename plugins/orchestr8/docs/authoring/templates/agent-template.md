---
# Agent ID: Pattern ${technology}-${specialization}
# Examples: typescript-core, typescript-api-development, python-fastapi-dependencies
# Core agents: ${tech}-core
# Specialized agents: ${tech}-${specialization}
id: ${technology}-${specialization}

# Category: Always "agent" for domain expertise
category: agent

# Tags: 6-8 specific tags including technology, domain, and capabilities
# Include: primary technology, frameworks, domain area, use-cases
# Examples:
#   - Core: [typescript, javascript, types, generics, node, programming]
#   - API Specialized: [typescript, express, api, rest, backend, middleware, node]
#   - Async Specialized: [typescript, async, promises, async-await, concurrency]
tags: [primary-tech, framework, domain, use-case, capability1, capability2]

# Capabilities: 4-6 specific capabilities this agent provides
# Focus on domain expertise and what the agent enables
# Include technology stack and specific techniques
capabilities:
  - ${Technology} ${domain-area} development with ${specific-features}
  - ${Framework-or-tool} ${expertise-area} including ${techniques-or-patterns}
  - ${Advanced-topic} for ${use-case} using ${specific-approach}
  - ${Implementation} of ${pattern} with ${context-and-tools}

# UseWhen: 4-6 scenarios requiring this domain expertise
# Describe specific development contexts
# Think about when a user would need THIS specific expertise
useWhen:
  - Building ${project-type} with ${technology-stack} requiring ${specific-features}
  - Implementing ${feature-or-component} using ${framework-or-tool} with ${constraints}
  - Developing ${application-type} with ${specific-requirements} in ${technology}
  - Creating ${system-or-component} requiring ${domain-expertise} and ${techniques}

# Estimated Tokens:
#   - Core agent: 600-750 tokens
#   - Specialized agent: 450-650 tokens
#   - MUST be accurate within ±10%
estimatedTokens: ${calculated-count}

# Optional: Optimization fields (Phases 2-3)
# prerequisite: [core-agent-id]  # For specialized agents (Phase 3)
# relatedTo: [related-agent-1, related-skill-1]  # Cross-references (Phase 2)
# examples: [orchestr8://examples/example-id]  # Example extraction (Phase 1)
# advancedTopics: [orchestr8://agents/advanced-module]  # Progressive loading (Phase 3)
---

# ${Technology} ${Specialization} Expertise

${Brief-description-of-expertise} (1-2 sentences covering what domain knowledge this agent provides).

## Domain Expertise

**Specialization:** ${Specific-area-of-expertise}

**Core Knowledge:**
- ${Fundamental-concept-1}
- ${Fundamental-concept-2}
- ${Fundamental-concept-3}

## Technology Stack / Key Technologies

**Primary:**
- ${Main-technology} - ${Purpose-or-use}
- ${Framework-or-tool} - ${Purpose-or-use}

**Related:**
- ${Supporting-technology} - ${Purpose-or-use}
- ${Tool-or-library} - ${Purpose-or-use}

## Core Patterns & Practices

### Pattern 1: [Common Pattern Name]

\`\`\`${language}
// Implementation example showing key pattern
// Keep focused and concise (5-15 lines)
// Include comments for clarity

${code-example}
\`\`\`

**When to use:**
- ${Specific-scenario-1}
- ${Specific-scenario-2}

### Pattern 2: [Another Essential Pattern]

\`\`\`${language}
// Another key pattern for this domain
// Show practical implementation

${code-example}
\`\`\`

## Best Practices

✅ **${Practice-1}:** ${Explanation-and-rationale}
✅ **${Practice-2}:** ${Explanation-and-rationale}
✅ **${Practice-3}:** ${Explanation-and-rationale}

## Common Challenges / Pitfalls

❌ **${Pitfall-1}:** ${Description-of-problem}
- **Why it's problematic:** ${Impact}
- **Solution:** ${How-to-avoid-or-fix}

❌ **${Pitfall-2}:** ${Description-of-problem}
- **Why it's problematic:** ${Impact}
- **Solution:** ${How-to-avoid-or-fix}

## Advanced Techniques (Optional for Specialized Agents)

**${Advanced-topic}:**
\`\`\`${language}
// Advanced pattern or technique
// Show sophisticated usage

${code-example}
\`\`\`

## Related Expertise

**Prerequisites (Phase 3 - if specialized agent):**
- [${Technology} Core](orchestr8://agents/${technology}-core) - Required foundation

**Core Agent (if you're a specialized agent):**
- [${Technology} Core](orchestr8://agents/${technology}-core)

**Specialized Agents (Phase 2 - Cross-references):**
- [${Technology} ${Other-Specialization}](orchestr8://agents/${technology}-${other-specialization})
- [${Technology} ${Another-Specialization}](orchestr8://agents/${technology}-${another-specialization})

**Complementary Skills (Phase 2 - Cross-references):**
- [${Related-Skill}](orchestr8://skills/${skill-id})
- [${Another-Skill}](orchestr8://skills/${skill-id})

**Detailed Examples (Phase 1 - if extracted):**
- [${Example-Name}](orchestr8://examples/${example-id})

**Advanced Topics (Phase 3 - if split for progressive loading):**
- [${Advanced-Topic}](orchestr8://agents/${advanced-module-id})

---

## Agent Template Guidelines

### Core Agent Template

**Purpose:** Always-relevant foundational knowledge
**Size:** 600-750 tokens
**Scope:** Language/framework fundamentals applicable to all use cases

**Sections:**
1. **Language/Framework Fundamentals:** Core concepts everyone needs
2. **Type System / Core Features:** Essential language features
3. **Common Patterns:** Universal patterns
4. **Best Practices:** Fundamental guidelines
5. **Links:** To specialized agents

**Example Content (TypeScript Core):**
- Type system basics
- Interfaces and types
- Generics
- Module system
- Common patterns (type guards, discriminated unions)

### Specialized Agent Template

**Purpose:** Use-case specific deep expertise
**Size:** 450-650 tokens
**Scope:** Focused domain or application area

**Sections:**
1. **Specialization Overview:** What specific area this covers
2. **Technology Stack:** Specific tools/frameworks for this specialization
3. **Implementation Patterns:** Specialized techniques
4. **Best Practices:** Specialization-specific guidelines
5. **Links:** Back to core and to complementary specialized agents

**Example Content (TypeScript API Development):**
- Express.js with TypeScript
- Type-safe routes
- Middleware patterns
- Request/response validation
- Error handling middleware

### Metadata Best Practices for Agents

**Tags:**
- Start with primary technology
- Add frameworks/libraries
- Include domain (api, web, cli, etc.)
- Add key capabilities

**Capabilities:**
- Focus on what developer can build
- Include specific techniques
- Mention tools and frameworks
- Be concrete about features

**UseWhen:**
- Describe development scenarios
- Include technology stack
- Specify requirements or constraints
- Think about project types

### Code Examples for Agents

**Guidelines:**
- 2-3 examples per agent
- Show practical, real-world patterns
- Keep examples concise (5-20 lines)
- Include comments for clarity
- Test all code before committing

**For Core Agents:**
- Show fundamental patterns
- Language/framework basics
- Universal techniques

**For Specialized Agents:**
- Show specialized techniques
- Framework-specific patterns
- Advanced usage for the domain

### Agent Fragmentation Strategy

**When to create separate specialized agents:**

1. **Expertise area is distinct** (API development vs Testing vs Async)
2. **Size would exceed 750 tokens** if combined
3. **User only needs subset** of knowledge for most queries
4. **Clear specialization boundary** exists

**Example: TypeScript Agent Family**

```
typescript-core (650 tokens)
├─ Language fundamentals
├─ Type system
└─ Common patterns

typescript-api-development (520 tokens)
├─ Express.js patterns
├─ Type-safe routes
└─ Middleware

typescript-async-patterns (480 tokens)
├─ Promises and async/await
├─ Error handling
└─ Concurrency

typescript-testing (450 tokens)
├─ Jest setup
├─ Type-safe tests
└─ Mocking patterns
```

### Quality Checklist for Agents

Before committing agent fragments:

- [ ] ID follows naming convention (${tech}-core or ${tech}-${specialization})
- [ ] Category is "agent"
- [ ] 6-8 specific tags (includes technology, domain, capabilities)
- [ ] 4-6 concrete capabilities (domain expertise focus)
- [ ] 4-6 specific useWhen scenarios (development contexts)
- [ ] Token count appropriate (600-750 core, 450-650 specialized)
- [ ] Token estimate accurate within ±10%
- [ ] 2-3 tested code examples
- [ ] Best practices included
- [ ] Common pitfalls documented
- [ ] Links to related agents/skills
- [ ] Discoverable via test queries (6-8 queries)
- [ ] Unique value compared to existing agents

### Optimization Patterns Checklist

Apply these optimization patterns when appropriate:

**Phase 1: Example Extraction**
- [ ] Fragment >100 lines? Consider extracting detailed examples
- [ ] Examples >30% of content? Extract to separate example files
- [ ] Added `examples: [orchestr8://examples/...]` field?
- [ ] Brief inline examples remain in main content?

**Phase 2: Cross-Referencing**
- [ ] Identified related agents/skills used together >60% of time?
- [ ] Added `relatedTo: [...]` field for high co-occurrence fragments?
- [ ] Added cross-reference links in content (50-100 token cost)?
- [ ] ROI justified (3-5x improved discoverability)?

**Phase 3: Progressive Loading**
- [ ] Is this a specialized agent? Added `prerequisite: [core-agent]`?
- [ ] Core agent? Added `advancedTopics: [...]` for optional advanced content?
- [ ] Clear always-needed vs sometimes-needed split?
- [ ] Advanced content >40% of tokens? Consider splitting.

**Token Efficiency:**
- [ ] Calculated savings from optimizations?
- [ ] Example extraction: 25-40% reduction achieved?
- [ ] Progressive loading: 40-60% savings for generic queries?
- [ ] Cross-refs: Token cost (50-100) justified by benefit?
