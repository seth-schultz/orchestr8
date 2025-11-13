---
description: Get expert guidance on Orchestr8 optimization strategies and resource
  creation
argument-hint: '[topic] - What do you need help with? (e.g., ''create agent'', ''optimize
  workflow'', ''jit loading'')'
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- WebSearch
- Write
---

# Orchestr8 Expert Assistance: $ARGUMENTS

I'll provide expert guidance on Orchestr8optimization and resource creation based on your request.


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Token Efficiency Note

**Traditional Approach (WASTEFUL):**
- Load all documentation upfront: ~15,000 tokens
- Load all examples and patterns: ~8,000 tokens
- **Total: ~23,000 tokens - most unused!**

**JIT Approach (OPTIMAL):**
- Load expert agent: ~1,850 tokens
- Load specific patterns as needed: ~900-1,500 tokens
- **Total: ~2,750-3,350 tokens - 85% reduction!**

---

## Phase 1: Understanding Your Request (0-20%)

**→ Load:** orchestr8://agents/orchestr8-expert

Let me understand what you need help with:

**Analyzing request:** "$ARGUMENTS"

**Common topics I can help with:**
- **Agent Creation**: Building optimally-sized expert agents
- **Skill Development**: Creating focused skill fragments
- **Workflow Optimization**: Implementing JIT loading patterns
- **Command Design**: Progressive resource loading
- **Pattern Application**: Token reduction strategies
- **Fragment Sizing**: Optimal token counts and splits
- **Metadata Optimization**: useWhen scenarios and keywords
- **Index Performance**: Improving match relevance
- **Budget Management**: Token allocation across phases

**→ Checkpoint:** Request understood, expert loaded

---

## Phase 2: Loading Specific Guidance (20-60%)

Based on your topic, I'll load targeted expertise:

### If creating new resources (agents, skills, patterns, examples, workflows):

**→ Load:** orchestr8://skills/orchestr8-optimization-patterns

**Guidance areas:**
- Fragment size optimization (500-1000 tokens)
- Metadata structure and useWhen scenarios
- Cross-reference patterns
- Content organization
- Validation checklist

### If optimizing workflows or commands:

**→ Load:** orchestr8://skills/jit-loading-progressive-strategies

**Guidance areas:**
- JIT loading implementation
- Progressive phased loading
- Token budget management
- Match query optimization
- Phase checkpoint patterns

### If working with fragments:

**→ Load:** orchestr8://skills/fragment-creation-workflow

**Guidance areas:**
- Fragment sizing decisions
- Core + Advanced splitting
- Family organization
- Fragment composition

### If improving metadata and matching:

**→ Load:** orchestr8://skills/fragment-metadata-optimization

**Guidance areas:**
- useWhen scenario writing
- Keyword extraction
- Tag optimization
- Index performance

**→ Checkpoint:** Specific expertise loaded

---

## Phase 3: Providing Examples (60-80%, conditional)

If examples would help, I'll load relevant ones:

**→ Load (if applicable):** orchestr8://match?query=$ARGUMENTS+example&mode=index&maxResults=5

This will show you:
- Related example code and patterns
- Real-world implementations
- Best practices in action
- Common pitfall avoidance

**→ Checkpoint:** Examples provided (if needed)

---

## Phase 4: Applying Best Practices (80-100%)

Now I'll help you apply the optimization strategies:

### Six Token Reduction Strategies:

**1. JIT Loading (91-97% reduction)**
- Load catalog upfront, fetch resources on-demand
- Use `orchestr8://match` queries with `maxTokens`
- Example: `orchestr8://match?query=typescript+async&mode=index&maxResults=5`

**2. Fragment-Based Organization (25-40% additional)**
- Target size: 500-1000 tokens (sweet spot: 650-850)
- Split if >1500 tokens: core + advanced modules
- Merge if <300 tokens

**3. Index-Based Lookup (85-95% reduction)**
- Write 5-20 keyword-rich useWhen scenarios
- Specific, technical terms enable O(1) index lookup
- Avoid generic phrases that trigger fuzzy fallback

**4. Progressive Loading (50-78% savings)**
- Core module: Essential functionality (500-700 tokens)
- Advanced module: Specialized features (600-800 tokens)
- Load advanced only when needed

**5. Catalog-First Mode (54% savings)**
- Use `mode=catalog` to explore metadata
- User selects specific resources to load
- Avoid `mode=full` unless specifically needed

**6. Hierarchical Families (56% savings)**
- Organize related fragments into families
- Parent covers overview, children handle specifics
- Prevents loading unnecessary siblings

### Quick Validation Checklist:

**For new resources:**
```
□ Size: 500-1000 tokens (or <1500 max)
□ useWhen: 5-20 keyword-rich scenarios
□ Tags: 5-15 specific, searchable
□ Capabilities: 3-8 action-oriented
□ Cross-refs: 3-10 related resources
□ Content: Practical, copy-paste examples
□ Structure: Clear headings, best practices
```

**For workflows/commands:**
```
□ Uses orchestr8://match for JIT loading
□ maxTokens specified for each query
□ Phases clearly defined (0-X%, X-Y%, etc.)
□ Token budget tracked per phase
□ Checkpoints after each phase
□ Conditional loading for optional expertise
□ Total budget: 3,000-6,000 tokens target
```

**For fragments:**
```
□ Focused on single concern
□ Related concepts split into family
□ Core vs Advanced split if >1500 tokens
□ Cross-references for JIT navigation
□ Index rebuilt after changes
```

**→ Checkpoint:** Complete - Ready to implement!

---

## Token Budget Summary

**This command's token usage:**
- Phase 1 (Expert agent): 1,850 tokens
- Phase 2 (Specific skill): 900-1,500 tokens
- Phase 3 (Examples, conditional): 0-1,000 tokens
- Phase 4 (Application): 0 tokens (already loaded)
- **Total: 2,750-4,350 tokens**

**vs Traditional approach: ~23,000 tokens**
**Savings: 81-88% reduction** 🎯

---

## Next Steps

Based on your topic "$ARGUMENTS", here's what to do next:

### If creating a new resource:

1. **Choose resource type:** agent, skill, pattern, example, or workflow
2. **Define scope:** Single focused concern (500-1000 tokens)
3. **Write metadata:** Rich useWhen scenarios with keywords
4. **Create content:** Practical examples, best practices
5. **Add cross-refs:** Link 3-10 related resources
6. **Validate:** Check size, metadata, structure
7. **Rebuild index:** `npm run build-index`
8. **Test matching:** Query to verify discoverability

### If optimizing existing resource:

1. **Check token count:** Target 500-1000 (max 1500)
2. **If too large:** Split into core + advanced
3. **Review useWhen:** Add keyword-rich scenarios
4. **Add cross-refs:** Enable JIT navigation
5. **Update structure:** Clear sections, examples
6. **Rebuild index:** `npm run build-index`
7. **Test before/after:** Compare match relevance

### If creating workflow/command:

1. **Define phases:** 3-5 phases with clear goals
2. **Add JIT loading:** `orchestr8://match` queries
3. **Set budgets:** 1,000-2,000 tokens per phase
4. **Add checkpoints:** After each phase
5. **Document savings:** Show traditional vs JIT
6. **Test token usage:** Validate actual costs
7. **Iterate:** Adjust budgets based on reality

---

## Need More Help?

**For detailed guidance on specific topics:**

```bash
# Agent creation
/orchestr8:orchestr8-expert "How do I create an optimized agent?"

# Workflow optimization
/orchestr8:orchestr8-expert "Optimize my workflow with JIT loading"

# Fragment sizing
/orchestr8:orchestr8-expert "Should I split this 1800 token resource?"

# Metadata optimization
/orchestr8:orchestr8-expert "Writing better useWhen scenarios"

# Index performance
/orchestr8:orchestr8-expert "Why isn't my resource matching?"
```

**For browsing resources directly:**

```typescript
// Explore the expert agent
orchestr8://agents/orchestr8-expert

// Quick reference patterns
orchestr8://skills/orchestr8-optimization-patterns

// Fragment creation workflow
orchestr8://skills/fragment-creation-workflow

// JIT loading strategies
orchestr8://skills/jit-loading-progressive-strategies
```

---

## Key Takeaways

**Remember these principles:**

1. ✅ **Load Just-In-Time:** Never load everything upfront
2. ✅ **Fragment Everything:** 500-1000 tokens, focused, composable
3. ✅ **Rich Metadata:** Powers indexing and discovery
4. ✅ **Progressive Complexity:** Core first, advanced on-demand
5. ✅ **Catalog Before Content:** Explore, then load selectively
6. ✅ **Organize Hierarchically:** Families prevent sibling bloat
7. ✅ **Budget Every Phase:** Track and optimize token usage
8. ✅ **Validate Before Publishing:** Use the checklists
9. ✅ **Cross-Reference Everything:** Enable JIT navigation
10. ✅ **Rebuild Index:** After any resource changes

**You're now ready to create world-class token-efficient resources for Orchestr8!** 🚀

---

## Actual Resources Loaded

The following resources were dynamically loaded during this command execution:

**Phase 1:**
- orchestr8://agents/orchestr8-expert (1,850 tokens)

**Phase 2 (based on your topic):**
- orchestr8://skills/orchestr8-optimization-patterns (~900 tokens)
- OR orchestr8://skills/jit-loading-progressive-strategies (~800 tokens)
- OR orchestr8://skills/fragment-creation-workflow (~750 tokens)
- OR orchestr8://skills/fragment-metadata-optimization (~700 tokens)

**Phase 3 (conditional):**
- orchestr8://match?query=$ARGUMENTS+example&mode=index&maxResults=5 (0-1,000 tokens)

**Total tokens loaded:** 2,750-4,350 tokens (vs 23,000 traditional)
**Efficiency achieved:** 81-88% reduction through JIT loading
