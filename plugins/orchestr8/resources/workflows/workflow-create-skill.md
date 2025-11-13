---
id: workflow-create-skill
category: pattern
tags: [workflow, skill-creation, fragment-design, meta, orchestr8, metadata-optimization, knowledge-capture]
capabilities:
  - Create reusable skill fragments with optimal metadata
  - Design skill structure for discoverability
  - Optimize for fuzzy matching and token efficiency
useWhen:
  - Reusable skill fragment creation capturing techniques with step-by-step guidance, code examples, and best practices
  - Skill pattern documentation requiring 500-700 token guidelines with multi-language examples and pitfall warnings
estimatedTokens: 480
---

# Create Skill Fragment Pattern

**Phases:** Identify (0-25%) → Design (25-50%) → Implement (50-75%) → Validate (75-100%)

## Phase 1: Technique Identification (0-25%)
- Extract reusable technique from implementation or knowledge
- Define scope (single focused skill, not multiple)
- Identify target audience (what expertise level needed)
- Determine languages/contexts (language-agnostic or specific)
- **Checkpoint:** Technique clearly defined, scope appropriate (500-700 tokens)

## Phase 2: Structure Design (25-50%)
**Content structure:**
- **Overview:** What technique solves (1-2 sentences)
- **When to Use:** 3-5 specific scenarios
- **Implementation:** Step-by-step approach with code examples (2-3 languages if applicable)
- **Pitfalls:** Common mistakes and how to avoid
- **Best Practices:** Key principles (3-5 bullets)

**Metadata design:**
- **ID:** `${technique}-${context}` (e.g., `async-error-handling`, `api-rate-limiting`)
- **Tags:** 5-7 tags (technique, languages, domain, use-case)
- **Capabilities:** 3-5 specific capabilities with details
- **useWhen:** 3-5 concrete scenarios
- **Checkpoint:** Structure planned, metadata drafted

## Phase 3: Implementation (50-75%)
**Write fragment:**
- YAML frontmatter with optimized metadata
- Concise content (target 500-700 tokens)
- Code examples (practical, tested patterns)
- Language-specific variations if applicable
- Cross-references to related skills/patterns

**Quality checks:**
- Token count accurate (use `wc -w | multiply by 0.75`)
- No duplication with existing skills
- Focused on single technique
- **Checkpoint:** Fragment written, under token budget

## Phase 4: Validation & Integration (75-100%)
**Parallel tracks:**
- **Discovery testing:** Test fuzzy matching with 4-5 relevant queries, verify fragment appears in top results
- **Metadata optimization:** Enhance tags/capabilities if discovery fails, retest until discoverable
- **Integration:** Save to `resources/skills/`, verify structure, update index
- **Documentation:** Document in session notes (location, captures, sample queries)
- **Checkpoint:** Fragment discoverable, integrated, documented

## Success Criteria
✅ Single focused technique (not multiple skills)
✅ 500-700 tokens (concise but complete)
✅ Rich metadata (5-7 tags, 3-5 capabilities, 3-5 useWhen)
✅ Discoverable via relevant queries (test with 4-5 queries)
✅ Code examples included (2-3 languages if applicable)
✅ Saved to `resources/skills/`

## Example Queries for Testing
```markdown
Skill: async-error-handling
□ orchestr8://skills/match?query=error+handling
□ orchestr8://skills/match?query=async+errors+typescript
□ orchestr8://skills/match?query=try+catch+promises
□ orchestr8://skills/match?query=exception+management+async
```
